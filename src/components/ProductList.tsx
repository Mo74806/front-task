import { Virtuoso } from "react-virtuoso";
import ProductCard from "./ProductCard";
import type { Product } from "../types/Product";
import { useRef, useEffect, memo } from "react";

function ProductList({
  products,
  loadMore,
  hasMore,
  resetTrigger,
}: {
  products: Product[];
  loadMore: () => void;
  hasMore: boolean;
  resetTrigger?: any;
}) {
  const virtuosoRef = useRef<any>(null);
  useEffect(() => {
    if (virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({ index: 0, behavior: "smooth" });
    }
  }, [resetTrigger]);

  if (!products || products.length === 0) {
    return (
      <div className="flex items-center justify-center h-[90vh] text-gray-500 text-lg">
        Loading products...
      </div>
    );
  }
  return (
    <Virtuoso
      ref={virtuosoRef}
      style={{ height: "90vh" }}
      data={products}
      itemContent={(index, product) => (
        <ProductCard key={index} product={product} />
      )}
      endReached={() => {
        if (hasMore) loadMore();
      }}
    />
  );
}
export default memo(ProductList);
