"use client";

import React from "react";
import { ThemeProvider } from "./theme-context";
import { AuthProvider } from "./auth-context";
import { CartProvider } from "./cart-context";
import { CartSyncToast } from "@/components/cart/cart-sync-toast";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          {children}
          <CartSyncToast />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
