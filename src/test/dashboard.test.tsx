import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { InventoryProvider } from "../context/InventoryContenxt";
import { describe, expect, it, vi } from "vitest";
import Dashboard from "../pages/Dashbord";

vi.mock("../services/categoryServices", () => ({
  fetchCategories: vi.fn(() => Promise.resolve(["electronics", "jewelery"])),
}));
vi.mock("../services/productServices", () => ({
  fetchProducts: vi.fn((pageParamOrObj) => {
    const pageParam =
      typeof pageParamOrObj === "object" && pageParamOrObj.pageParam
        ? pageParamOrObj.pageParam
        : pageParamOrObj || 1;
    const allProducts = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      title: `Product ${i + 1}`,
      price: 10 + i,
      image: "",
      description: `Description ${i + 1}`,
      stock: i === 0 ? 8 : i === 1 ? 6 : 10,
      category: i % 2 === 0 ? "electronics" : "jewelery",
    }));
    const pageSize = 5;
    const start = (pageParam - 1) * pageSize;
    const end = start + pageSize;
    return Promise.resolve(allProducts.slice(start, end));
  }),
}));

vi.mock("react-virtuoso", () => ({
  Virtuoso: ({ data, itemContent, endReached }: any) => {
    if (endReached) setTimeout(() => endReached(), 0);
    return (
      <div data-testid="mock-virtuoso">
        {data.map((item: any, index: number) => (
          <div key={index}>{itemContent(index, item)}</div>
        ))}
      </div>
    );
  },
}));

function renderWithProviders(element: React.ReactNode) {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <InventoryProvider>{element}</InventoryProvider>
    </QueryClientProvider>
  );
}

describe("Dashboard", () => {
  it("fetches and displays categories and products", async () => {
    renderWithProviders(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText("electronics")).toBeInTheDocument();
      expect(screen.getByText("Product 1")).toBeInTheDocument();
    });
    screen.debug();
  });

  it("shows low stock warning when stock is low", async () => {
    renderWithProviders(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText("Product 1")).toBeInTheDocument();
    });
    const decreaseButtons = screen.getAllByRole("button", {
      name: /decrease stock/i,
    });
    fireEvent.click(decreaseButtons[0]);
    fireEvent.click(decreaseButtons[0]);
    fireEvent.click(decreaseButtons[0]);
    screen.debug();
    await waitFor(() => {
      expect(screen.getByText(/Stock: 5/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /stock alerts/i })
      ).toBeInTheDocument();
    });
  });

  it("loads more products on infinite scroll", async () => {
    renderWithProviders(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText("Product 1")).toBeInTheDocument();
      expect(screen.getByText("Product 5")).toBeInTheDocument();
    });
    screen.debug();
    await waitFor(() => {
      expect(screen.getByText("Product 6")).toBeInTheDocument();
      expect(screen.getByText("Product 10")).toBeInTheDocument();
    });
    screen.debug();
  });
});
