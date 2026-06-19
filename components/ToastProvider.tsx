"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 4000,
                style: {
                    background: "#ffffff",
                    color: "#0f172a",
                    border: "1px solid #f1f5f9",
                    borderRadius: "0.75rem",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)",
                    fontFamily: "var(--font-geist-sans), sans-serif",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                },
                success: {
                    iconTheme: {
                        primary: "#10b981",
                        secondary: "#ffffff",
                    },
                },
                error: {
                    iconTheme: {
                        primary: "#ef4444",
                        secondary: "#ffffff",
                    },
                },
            }}
        />
    );
}
