import React, { createContext, useState, useCallback } from "react";

import { useQueryClient } from "@tanstack/react-query";
import type { Product } from "../types/Product";
// import type { Product } from "../types/Product";

interface InventoryContextValue {
  lowStockItems: Product[];
  outOfStockItems: Product[];
  stockLevels: Record<number, number>;
  hasLowStockAlert: boolean;
  acknowledgeLowStock: () => void;
  updateStock: (product: Product) => void;
}

export const InventoryContext = createContext<InventoryContextValue | null>(
  null
);

export const InventoryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [lowStockItems, setLowStockItems] = useState<Product[]>([]);
  const [outOfStockItems, setOutOfStockItems] = useState<Product[]>([]);
  const [stockLevels, setStockLevels] = useState<Record<number, number>>({});
  const [hasLowStockAlert, setHasLowStockAlert] = useState(false);
  const queryClient = useQueryClient();

  const updateStock = useCallback(
    (product: Product) => {
      setStockLevels((prev) => {
        const currentStock = prev[product.id] ?? product.stock;
        const newStock = Math.max(currentStock - 1, 0);

        if (newStock === 0) {
          setLowStockItems((prevLow) =>
            prevLow.filter((item) => item.id !== product.id)
          );

          setOutOfStockItems((prevOut) => {
            const exists = prevOut.some((item) => item.id === product.id);
            if (!exists) {
              return [...prevOut, { ...product, stock: 0 }];
            }
            return prevOut.map((item) =>
              item.id === product.id ? { ...item, stock: 0 } : item
            );
          });
        }

        if (newStock <= 5 && newStock > 0) {
          setHasLowStockAlert(true);
          setLowStockItems((prevLow) => {
            const exists = prevLow.some((item) => item.id === product.id);
            if (!exists) {
              return [...prevLow, { ...product, stock: newStock }];
            }
            return prevLow.map((item) =>
              item.id === product.id ? { ...item, stock: newStock } : item
            );
          });

          setOutOfStockItems((prevOut) =>
            prevOut.filter((item) => item.id !== product.id)
          );
        }

        queryClient.setQueryData(
          ["products", product.category],
          (oldData: any) => {
            if (!oldData) return oldData;

            if (oldData.pages) {
              return {
                ...oldData,
                pages: oldData.pages.map((page: Product[]) =>
                  page.map((p) =>
                    p.id === product.id ? { ...p, stock: newStock } : p
                  )
                ),
              };
            }

            return oldData.map((p: Product) =>
              p.id === product.id ? { ...p, stock: newStock } : p
            );
          }
        );

        return { ...prev, [product.id]: newStock };
      });
    },
    [queryClient]
  );

  const acknowledgeLowStock = useCallback(() => {
    setHasLowStockAlert(false);
  }, []);

  return (
    <InventoryContext.Provider
      value={{
        lowStockItems,
        outOfStockItems,
        stockLevels,
        hasLowStockAlert,
        acknowledgeLowStock,
        updateStock,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};
