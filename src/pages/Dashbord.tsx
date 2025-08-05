import { useState, useRef, useEffect } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import ProductList from "../components/ProductList";
import { fetchCategories } from "../services/categoryServices";
import { fetchProducts } from "../services/productServices";
import Sidebar from "../components/SidedBar";

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "default">(
    "default"
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    refetchOnWindowFocus: false,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useInfiniteQuery({
      queryKey: ["products", selectedCategory, sortOrder],
      queryFn: ({ pageParam = 1 }) =>
        fetchProducts(
          pageParam,
          5,
          selectedCategory,
          sortOrder === "default" ? undefined : sortOrder
        ),
      getNextPageParam: (lastPage, allPages) =>
        lastPage.length < 5 ? undefined : allPages.length + 1,
      initialPageParam: 1,
      refetchOnWindowFocus: false,
    });
  // console.log(data);
  const products = data?.pages.flat() || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
    refetch();
  }, [selectedCategory, sortOrder, refetch]);

  return (
    <div className="flex justify-center overflow-hidden h-screen">
      <Sidebar
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <main
        ref={scrollRef}
        className="flex-1 md:h-[100vh] h-[90vh] overflow-hidden rounded-xl md:mt-0 mt-auto bg-gradient-to-br from-gray-50 via-white to-gray-100 shadow-inner p-4"
      >
        <div className="mb-4 flex justify-end">
          <select
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(e.target.value as "asc" | "desc" | "default")
            }
          >
            <option value="default">Sort by stock (default)</option>
            <option value="asc">Stock: Low to High</option>
            <option value="desc">Stock: High to Low</option>
          </select>
        </div>

        <ProductList
          products={products}
          loadMore={fetchNextPage}
          hasMore={!!hasNextPage}
          resetTrigger={selectedCategory + sortOrder}
        />

        {isFetchingNextPage && (
          <p className="p-4 text-center text-gray-500 text-sm">
            Loading more...
          </p>
        )}
      </main>
    </div>
  );
}
