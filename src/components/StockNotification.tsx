import { useState, useContext, memo } from "react";
import { createPortal } from "react-dom";
import { InventoryContext } from "../context/InventoryContenxt";
import type { Product } from "../types/product";

function StockNotification() {
  const [showPopup, setShowPopup] = useState(false);
  const [activeTab, setActiveTab] = useState<"low" | "out">("low");

  const ctx = useContext(InventoryContext);
  if (!ctx) return null;

  const {
    lowStockItems,
    outOfStockItems,
    hasLowStockAlert,
    acknowledgeLowStock,
  } = ctx;

  const hasAlerts = lowStockItems.length > 0 || outOfStockItems.length > 0;
  if (!hasAlerts) return null;

  const activeItems = activeTab === "low" ? lowStockItems : outOfStockItems;

  return (
    <>
      <button
        className="p-2 cursor-pointer w-full text-start bg-yellow-100 border border-yellow-300 rounded-lg relative hover:bg-yellow-200 transition-colors"
        onClick={() => setShowPopup(true)}
      >
        Stock Alerts
        {(hasLowStockAlert || outOfStockItems.length > 0) && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              acknowledgeLowStock();
            }}
            className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full"
          ></span>
        )}
      </button>

      {showPopup &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md p-4">
              <div className="flex mb-4 border-b">
                <button
                  className={`cursor-pointer flex-1 py-2 text-sm font-medium border-b-2 ${
                    activeTab === "low"
                      ? "border-yellow-500 text-yellow-600"
                      : "border-transparent text-gray-500"
                  }`}
                  onClick={() => setActiveTab("low")}
                >
                  Low Stock
                </button>
                <button
                  className={`cursor-pointer flex-1 py-2 text-sm font-medium border-b-2 ${
                    activeTab === "out"
                      ? "border-red-500 text-red-600"
                      : "border-transparent text-gray-500"
                  }`}
                  onClick={() => setActiveTab("out")}
                >
                  Out of Stock
                </button>
              </div>

              {activeItems.length > 0 ? (
                <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                  {activeItems.map((item: Product) => (
                    <li
                      key={item.id}
                      className="flex justify-between items-center py-2 text-sm"
                    >
                      <span className="text-gray-700">{item.title}</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          activeTab === "low"
                            ? "bg-yellow-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {item.stock}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-sm text-gray-500">
                  No {activeTab === "low" ? "low stock" : "out of stock"} items.
                </p>
              )}

              <button
                className="cursor-pointer mt-4 w-full text-sm text-red-500 border border-red-500 px-3 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                onClick={() => setShowPopup(false)}
              >
                Close
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
export default memo(StockNotification);
