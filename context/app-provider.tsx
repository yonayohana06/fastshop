"use client";

import React from "react";
import { ThemeProvider } from "./theme-context";
import { AuthProvider } from "./auth-context";
import { CartProvider } from "./cart-context";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
