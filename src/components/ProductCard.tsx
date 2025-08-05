import { useContext } from "react";
import React from "react";
import { InventoryContext } from "../context/InventoryContenxt";
import type { Product } from "../types/product";

function ProductCard({ product }: { product: Product }) {
  const inventory = useContext(InventoryContext);
  if (!inventory) return null;

  const { updateStock, stockLevels } = inventory;
  const currentStock = stockLevels[product.id] ?? product.stock;

  return (
    <div className="p-4 border border-gray-200 rounded-2xl mb-4 flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
      <img
        src={product.image}
        alt={product.title}
        loading="lazy"
        decoding="async"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "https://demofree.sirv.com/nope-not-here.jpg";
        }}
        className="object-contain w-full sm:w-[200px] h-[200px] rounded-lg bg-gray-50"
      />

      <div className="flex flex-col flex-1 text-center sm:text-left">
        <h3 className="font-semibold text-lg text-gray-800">{product.title}</h3>
        <p className="text-indigo-600 font-medium">${product.price}</p>
        <p
          className={`mt-1 ${
            currentStock <= 5 ? "text-red-500 font-bold" : "text-gray-600"
          }`}
        >
          Stock: {currentStock}
        </p>
        <button
          onClick={() => updateStock(product)}
          disabled={currentStock <= 0}
          className="mt-3 w-full sm:w-fit py-2 px-4 rounded-lg font-medium text-white bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-400 transition-colors"
        >
          Decrease Stock
        </button>
      </div>
    </div>
  );
}

export default React.memo(ProductCard);
