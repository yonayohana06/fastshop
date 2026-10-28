"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
  useEffect,
} from "react";
import { CartItem } from "@/types";
import { STORAGE_KEYS } from "@/lib/constants";
import {
  getCartApi,
  addToCartApi,
  deleteCartItemApi,
  clearCartApi,
} from "@/lib/api/cart";

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  grandTotal: number;
  addItem: (item: Omit<CartItem, "subtotal">) => void;
  updateQuantity: (productId: number | string, quantity: number) => void;
  removeItem: (productId: number | string) => void;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function subscribeCart(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("fastshop-cart-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("fastshop-cart-change", callback);
  };
}

function getCartSnapshot(): string {
  return localStorage.getItem(STORAGE_KEYS.CART) || "[]";
}

function getServerCartSnapshot(): string {
  return "[]";
}

function saveCartLocally(newItems: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(newItems));
    window.dispatchEvent(new Event("fastshop-cart-change"));
  } catch {
    console.warn("Gagal menyimpan keranjang belanja");
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const cartJson = useSyncExternalStore(
    subscribeCart,
    getCartSnapshot,
    getServerCartSnapshot
  );

  let items: CartItem[] = [];
  try {
    items = JSON.parse(cartJson);
  } catch {
    items = [];
  }

  const refreshCart = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEYS.TOKEN) : null;
    if (!token) return;

    try {
      const res = await getCartApi(token);
      if (res.data?.items) {
        saveCartLocally(res.data.items);
      }
    } catch {
      // Keep local cart if server fails
    }
  }, []);

  // Sync with server if logged in
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const grandTotal = items.reduce((acc, item) => {
    const priceNum =
      typeof item.price === "string" ? parseFloat(item.price) : item.price;
    return acc + priceNum * item.quantity;
  }, 0);

  const addItem = useCallback(
    (newItem: Omit<CartItem, "subtotal">) => {
      let currentItems: CartItem[] = [];
      try {
        currentItems = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || "[]");
      } catch {
        currentItems = [];
      }

      const existingIndex = currentItems.findIndex(
        (it) => String(it.product_id) === String(newItem.product_id)
      );

      const priceNum =
        typeof newItem.price === "string"
          ? parseFloat(newItem.price)
          : newItem.price;

      if (existingIndex > -1) {
        const updated = [...currentItems];
        const current = updated[existingIndex];
        const updatedQty = current.quantity + newItem.quantity;
        updated[existingIndex] = {
          ...current,
          quantity: updatedQty,
          subtotal: priceNum * updatedQty,
        };
        saveCartLocally(updated);
      } else {
        saveCartLocally([
          ...currentItems,
          {
            ...newItem,
            subtotal: priceNum * newItem.quantity,
          },
        ]);
      }

      // Background server sync if token available
      const token = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEYS.TOKEN) : null;
      if (token) {
        addToCartApi(
          { product_id: newItem.product_id, quantity: newItem.quantity },
          token
        ).catch(() => {});
      }
    },
    []
  );

  const updateQuantity = useCallback(
    (productId: number | string, quantity: number) => {
      let currentItems: CartItem[] = [];
      try {
        currentItems = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || "[]");
      } catch {
        currentItems = [];
      }

      if (quantity <= 0) {
        const filtered = currentItems.filter(
          (item) => String(item.product_id) !== String(productId)
        );
        saveCartLocally(filtered);
        return;
      }

      const updated = currentItems.map((item) => {
        if (String(item.product_id) === String(productId)) {
          const priceNum =
            typeof item.price === "string"
              ? parseFloat(item.price)
              : item.price;
          return {
            ...item,
            quantity,
            subtotal: priceNum * quantity,
          };
        }
        return item;
      });
      saveCartLocally(updated);
    },
    []
  );

  const removeItem = useCallback((productId: number | string) => {
    let currentItems: CartItem[] = [];
    try {
      currentItems = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || "[]");
    } catch {
      currentItems = [];
    }

    const itemToRemove = currentItems.find(
      (item) => String(item.product_id) === String(productId)
    );

    const filtered = currentItems.filter(
      (item) => String(item.product_id) !== String(productId)
    );
    saveCartLocally(filtered);

    const token = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEYS.TOKEN) : null;
    if (token && itemToRemove?.cart_item_id) {
      deleteCartItemApi(itemToRemove.cart_item_id, token).catch(() => {});
    }
  }, []);

  const clearCart = useCallback(() => {
    saveCartLocally([]);

    const token = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEYS.TOKEN) : null;
    if (token) {
      clearCartApi(token).catch(() => {});
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        grandTotal,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
