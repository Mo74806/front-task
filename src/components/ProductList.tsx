import { Virtuoso } from "react-virtuoso";
import ProductCard from "./ProductCard";
import type { Product } from "../types/product";
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
