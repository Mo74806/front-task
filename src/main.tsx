import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { InventoryProvider } from "./context/InventoryContenxt";
// import { InventoryProvider } from "./context/InventoryContext";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <InventoryProvider>
        <App />
      </InventoryProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
