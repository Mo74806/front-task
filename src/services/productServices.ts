import type { Product } from "../types/Product";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const fetchProducts = async (
  page: number,
  limit: number,
  category?: string,
  sortOrder?: "asc" | "desc"
): Promise<Product[]> => {
  const url = category
    ? `https://fakestoreapi.com/products/category/${category}`
    : `https://fakestoreapi.com/products`;

  const res = await fetch(url);

  const allProducts = await res.json();

  if (!res.ok) throw new Error("Failed to fetch products");

  const stockCache: Record<number, number> =
    queryClient.getQueryData(["stockLevels"]) || {};

  const productsWithStock = allProducts.map((p: Product) => {
    const stock = stockCache[p.id] ?? Math.floor(Math.random() * 41) + 10;
    return { ...p, stock };
  });

  const updatedStock = {
    ...stockCache,
    ...Object.fromEntries(
      productsWithStock.map((p: Product) => [p.id, p.stock])
    ),
  };
  queryClient.setQueryData(["stockLevels"], updatedStock);

  let sortedProducts = [...productsWithStock];
  if (sortOrder === "asc") {
    sortedProducts.sort((a, b) => a.stock - b.stock);
  } else if (sortOrder === "desc") {
    sortedProducts.sort((a, b) => b.stock - a.stock);
  }

  const paginatedProducts = sortedProducts.slice(
    (page - 1) * limit,
    page * limit
  );

  return paginatedProducts;
};
