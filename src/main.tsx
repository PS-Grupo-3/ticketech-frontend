import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./core/queryClient";
import AppRoutes from "./core/routes";
import "@/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <AppRoutes />
        </QueryClientProvider>
    </React.StrictMode>
);
