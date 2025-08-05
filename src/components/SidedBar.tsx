import { useState, useRef, useEffect, useContext, memo } from "react";
import { InventoryContext } from "../context/InventoryContenxt";
import StockNotification from "./StockNotification";

function Sidebar({
  categories,
  selectedCategory,
  setSelectedCategory,
}: {
  categories: string[];
  selectedCategory?: string;
  setSelectedCategory: (cat?: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const inventory = useContext(InventoryContext);

  const hasLowStockAlert = inventory?.hasLowStockAlert ?? false;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <button
        className="md:hidden z-10    absolute  top-4   py-4 px-6 bg-indigo-500 font-semibold text-[1rem] text-white rounded-lg shadow hover:bg-indigo-600 transition-colors "
        onClick={() => setIsOpen(!isOpen)}
      >
        Change Category
        {hasLowStockAlert && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        )}
      </button>

      <aside
        ref={sidebarRef}
        className={`fixed md:static top-0 left-0 h-full md:h-auto w-56 bg-white/90 backdrop-blur-md border-r border-gray-200 p-4 
          transform transition-transform duration-300 shadow-lg z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <h2 className="font-bold mb-3 text-gray-800 text-lg">Categories</h2>

        {categories.length ? (
          <button
            onClick={() => {
              setSelectedCategory(undefined);
              setIsOpen(false);
            }}
            className={`block cursor-pointer w-full text-left px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${
              !selectedCategory
                ? "bg-indigo-500 text-white shadow-md"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            All
          </button>
        ) : (
          ""
        )}

        {categories?.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setIsOpen(false);
            }}
            className={`block cursor-pointer w-full text-left px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${
              selectedCategory === cat
                ? "bg-indigo-500 text-white shadow-md"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}

        <div className="mt-6">
          <StockNotification />
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0   md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
export default memo(Sidebar);
