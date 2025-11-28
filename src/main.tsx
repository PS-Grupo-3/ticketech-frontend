import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./core/queryClient";
import AppRoutes from "./core/routes";
import "./index.css"; 
import "./shared/styles/global.css";
import { NotificationProvider } from "./shared/components/NotificationContext";

import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <NotificationProvider>
                <AuthProvider>
                    <AppRoutes />
                </AuthProvider>
            </NotificationProvider>
        </QueryClientProvider>
    </React.StrictMode>
);