"use client";

import React from "react";
import { AuthProvider } from "./auth-context";
import { CartProvider } from "./cart-context";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  );
}
