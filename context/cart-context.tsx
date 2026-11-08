"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { CartItem } from "@/types";
import { STORAGE_KEYS } from "@/lib/constants";
import {
  getCartApi,
  addToCartApi,
  updateCartItemApi,
  deleteCartItemApi,
  clearCartApi,
} from "@/lib/api/cart";
import { useAuth } from "./auth-context";

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  grandTotal: number;
  syncError: string | null;
  addItem: (item: Omit<CartItem, "subtotal">) => void;
  updateQuantity: (productId: number | string, quantity: number) => void;
  removeItem: (productId: number | string) => void;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
  dismissSyncError: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_CHANGE_EVENT = "fastshop-cart-change";

function subscribeCart(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CART_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CART_CHANGE_EVENT, callback);
  };
}

function getCartSnapshot(): string {
  return localStorage.getItem(STORAGE_KEYS.CART) || "[]";
}

function getServerCartSnapshot(): string {
  return "[]";
}

function readStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || "[]");
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
}

function persistStoredCart(newItems: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(newItems));
    window.dispatchEvent(new Event(CART_CHANGE_EVENT));
  } catch {
    console.warn("Gagal menyimpan keranjang belanja");
  }
}

function readCartOwner(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.CART_OWNER);
  } catch {
    return null;
  }
}

function writeCartOwner(owner: string) {
  try {
    localStorage.setItem(STORAGE_KEYS.CART_OWNER, owner);
  } catch {
    // Ignore storage failures; ownership is a best-effort safeguard.
  }
}

function removeCartOwner() {
  try {
    localStorage.removeItem(STORAGE_KEYS.CART_OWNER);
  } catch {
    // Ignore storage failures.
  }
}

function readToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  } catch {
    return null;
  }
}

function isTempCartItemId(cartItemId: number | string | undefined): boolean {
  return cartItemId !== undefined && String(cartItemId).startsWith("temp_");
}

function priceToNumber(price: string | number): number {
  const value = typeof price === "string" ? parseFloat(price) : price;
  return Number.isFinite(value) ? value : 0;
}

function withSubtotal(item: Omit<CartItem, "subtotal">): CartItem {
  return {
    ...item,
    subtotal: priceToNumber(item.price) * item.quantity,
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { token, user } = useAuth();
  const userId = user?.id !== undefined && user?.id !== null ? String(user.id) : null;

  const cartJson = useSyncExternalStore(
    subscribeCart,
    getCartSnapshot,
    getServerCartSnapshot
  );

  const [syncError, setSyncError] = useState<string | null>(null);

  let items: CartItem[] = [];
  try {
    const parsed = JSON.parse(cartJson);
    items = Array.isArray(parsed) ? parsed : [];
  } catch {
    items = [];
  }

  const queueRef = useRef<Promise<void>>(Promise.resolve());
  const revisionRef = useRef(0);
  const cartItemIdsRef = useRef<Map<string, number | string>>(new Map());
  const handledAuthRef = useRef<string | null>(null);
  const authInitializedRef = useRef(false);

  const persistItems = useCallback((nextItems: CartItem[]) => {
    revisionRef.current += 1;
    persistStoredCart(nextItems);
  }, []);

  const enqueue = useCallback((task: () => Promise<void>) => {
    const next = queueRef.current.then(task, task);
    queueRef.current = next.catch(() => {});
    return next;
  }, []);

  const applyServerCart = useCallback(
    (serverItems: CartItem[], owner: string) => {
      persistItems(serverItems.map(withSubtotal));
      writeCartOwner(owner);
      cartItemIdsRef.current.clear();
      serverItems.forEach((item) => {
        cartItemIdsRef.current.set(String(item.product_id), item.cart_item_id);
      });
    },
    [persistItems]
  );

  const loadAndStoreCart = useCallback(
    async (authToken: string, owner: string) => {
      const revisionAtStart = revisionRef.current;
      const res = await getCartApi(authToken);
      if (revisionRef.current !== revisionAtStart) {
        // A local change happened while loading; it must win over this snapshot.
        return;
      }
      const serverItems = Array.isArray(res.data?.items) ? res.data.items : [];
      applyServerCart(serverItems, owner);
    },
    [applyServerCart]
  );

  const resolveCartItemId = useCallback(
    (productId: number | string, localId: number | string) => {
      const knownId = cartItemIdsRef.current.get(String(productId));
      if (knownId !== undefined) return knownId;
      if (!isTempCartItemId(localId)) return localId;
      return null;
    },
    []
  );

  const markAuthenticatedOwner = useCallback(() => {
    if (!token) return;
    writeCartOwner(userId ? `user:${userId}` : "guest");
  }, [token, userId]);

  const refreshCart = useCallback(async () => {
    const authToken = readToken();
    if (!authToken) return;

    const owner = userId ? `user:${userId}` : "guest";
    await enqueue(async () => {
      try {
        await loadAndStoreCart(authToken, owner);
      } catch {
        setSyncError("Gagal memuat keranjang dari server. Silakan coba lagi.");
      }
    });
  }, [enqueue, loadAndStoreCart, userId]);

  // React to login, logout, and account switches. Guest carts are merged into
  // the authenticated cart, and another account's cart is never reused.
  useEffect(() => {
    const authKey = token ? `${token}:${userId ?? ""}` : null;
    if (authInitializedRef.current && handledAuthRef.current === authKey) {
      return;
    }

    const previousAuthKey = handledAuthRef.current;
    handledAuthRef.current = authKey;
    authInitializedRef.current = true;

    if (!token) {
      if (previousAuthKey) {
        persistItems([]);
        removeCartOwner();
        cartItemIdsRef.current.clear();
      }
      return;
    }

    const owner = readCartOwner();
    const expectedOwner = userId ? `user:${userId}` : "guest";
    const localItems = readStoredCart();
    const unsyncedGuestItems = localItems.filter((item) =>
      isTempCartItemId(item.cart_item_id)
    );

    if (
      expectedOwner !== "guest" &&
      owner &&
      owner !== "guest" &&
      owner !== expectedOwner
    ) {
      // A different account was active in this tab: drop its cart first.
      persistItems([]);
      cartItemIdsRef.current.clear();
      writeCartOwner(expectedOwner);
      void enqueue(async () => {
        try {
          await loadAndStoreCart(token, expectedOwner);
        } catch {
          setSyncError("Gagal memuat keranjang dari server. Silakan coba lagi.");
        }
      });
      return;
    }

    if ((!owner || owner === "guest") && unsyncedGuestItems.length > 0) {
      void enqueue(async () => {
        try {
          for (const item of unsyncedGuestItems) {
            const res = await addToCartApi(
              { product_id: item.product_id, quantity: item.quantity },
              token
            );
            const realId = res?.data?.id ?? res?.data?.cart_item_id;
            if (realId !== undefined && realId !== null) {
              cartItemIdsRef.current.set(String(item.product_id), realId);
              const latest = readStoredCart();
              const index = latest.findIndex(
                (it) => String(it.product_id) === String(item.product_id)
              );
              if (index > -1) {
                const updated = [...latest];
                updated[index] = withSubtotal({
                  ...updated[index],
                  cart_item_id: realId,
                });
                persistItems(updated);
              }
            }
          }
          writeCartOwner(expectedOwner);
          await loadAndStoreCart(token, expectedOwner);
        } catch {
          setSyncError(
            "Sebagian produk gagal disinkronkan ke akun Anda. Muat ulang halaman untuk mencoba lagi."
          );
        }
      });
      return;
    }

    void enqueue(async () => {
      try {
        await loadAndStoreCart(token, expectedOwner);
      } catch {
        setSyncError("Gagal memuat keranjang dari server. Silakan coba lagi.");
      }
    });
  }, [token, userId, enqueue, loadAndStoreCart, persistItems]);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const grandTotal = items.reduce(
    (acc, item) => acc + priceToNumber(item.price) * item.quantity,
    0
  );

  const addItem = useCallback(
    (newItem: Omit<CartItem, "subtotal">) => {
      const productKey = String(newItem.product_id);
      const currentItems = readStoredCart();
      const existingIndex = currentItems.findIndex(
        (item) => String(item.product_id) === productKey
      );

      let nextItems: CartItem[];
      if (existingIndex > -1) {
        nextItems = currentItems.map((item, index) => {
          if (index !== existingIndex) return item;
          const quantity = item.quantity + newItem.quantity;
          return withSubtotal({ ...item, quantity });
        });
      } else {
        nextItems = [...currentItems, withSubtotal(newItem)];
      }

      persistItems(nextItems);
      if (token) {
        markAuthenticatedOwner();
      } else {
        writeCartOwner("guest");
      }

      if (!token) return;

      const previousItems = currentItems;
      void enqueue(async () => {
        try {
          const res = await addToCartApi(
            { product_id: newItem.product_id, quantity: newItem.quantity },
            token
          );
          const mutation = res?.data;
          const realId = mutation?.id ?? mutation?.cart_item_id;

          if (realId !== undefined && realId !== null) {
            cartItemIdsRef.current.set(productKey, realId);
            const latest = readStoredCart();
            const index = latest.findIndex(
              (item) => String(item.product_id) === productKey
            );
            if (index > -1) {
              const updated = [...latest];
              const quantity =
                typeof mutation?.quantity === "number"
                  ? mutation.quantity
                  : updated[index].quantity;
              updated[index] = withSubtotal({
                ...updated[index],
                cart_item_id: realId,
                quantity,
              });
              persistItems(updated);
            }
          } else {
            // Some backends omit the created row; re-read it to obtain its id.
            await loadAndStoreCart(
              token,
              userId ? `user:${userId}` : "guest"
            );
          }
        } catch {
          persistItems(previousItems);
          setSyncError(
            "Gagal menambahkan produk ke keranjang. Silakan coba lagi."
          );
        }
      });
    },
    [token, userId, enqueue, persistItems, markAuthenticatedOwner, loadAndStoreCart]
  );

  const updateQuantity = useCallback(
    (productId: number | string, quantity: number) => {
      const productKey = String(productId);
      const currentItems = readStoredCart();
      const existing = currentItems.find(
        (item) => String(item.product_id) === productKey
      );
      if (!existing) return;

      if (quantity <= 0) {
        persistItems(
          currentItems.filter(
            (item) => String(item.product_id) !== productKey
          )
        );
        markAuthenticatedOwner();

        if (!token) return;
        void enqueue(async () => {
          const cartItemId = resolveCartItemId(
            productId,
            existing.cart_item_id
          );
          if (cartItemId === null) return;

          try {
            await deleteCartItemApi(cartItemId, token);
            cartItemIdsRef.current.delete(productKey);
          } catch {
            persistItems(currentItems);
            setSyncError(
              "Gagal menghapus produk dari keranjang. Silakan coba lagi."
            );
          }
        });
        return;
      }

      const previousItems = currentItems;
      persistItems(
        currentItems.map((item) =>
          String(item.product_id) === productKey
            ? withSubtotal({ ...item, quantity })
            : item
        )
      );
      markAuthenticatedOwner();

      if (!token) return;
      void enqueue(async () => {
        const cartItemId = resolveCartItemId(productId, existing.cart_item_id);
        if (cartItemId === null) return;

        try {
          const res = await updateCartItemApi(
            cartItemId,
            { quantity },
            token
          );
          const serverQuantity =
            typeof res?.data?.quantity === "number"
              ? res.data.quantity
              : quantity;
          const latest = readStoredCart();
          const index = latest.findIndex(
            (item) => String(item.product_id) === productKey
          );
          if (index > -1) {
            const updated = [...latest];
            updated[index] = withSubtotal({
              ...updated[index],
              quantity: serverQuantity,
            });
            persistItems(updated);
          }
        } catch {
          persistItems(previousItems);
          setSyncError(
            "Gagal memperbarui jumlah produk di keranjang. Silakan coba lagi."
          );
        }
      });
    },
    [token, enqueue, persistItems, resolveCartItemId, markAuthenticatedOwner]
  );

  const removeItem = useCallback(
    (productId: number | string) => {
      const productKey = String(productId);
      const currentItems = readStoredCart();
      const existing = currentItems.find(
        (item) => String(item.product_id) === productKey
      );

      persistItems(
        currentItems.filter((item) => String(item.product_id) !== productKey)
      );
      markAuthenticatedOwner();

      if (!token || !existing) return;
      void enqueue(async () => {
        const cartItemId = resolveCartItemId(productId, existing.cart_item_id);
        if (cartItemId === null) return;

        try {
          await deleteCartItemApi(cartItemId, token);
          cartItemIdsRef.current.delete(productKey);
        } catch {
          persistItems(currentItems);
          setSyncError(
            "Gagal menghapus produk dari keranjang. Silakan coba lagi."
          );
        }
      });
    },
    [token, enqueue, persistItems, resolveCartItemId, markAuthenticatedOwner]
  );

  const clearCart = useCallback(() => {
    persistItems([]);
    cartItemIdsRef.current.clear();
    markAuthenticatedOwner();

    if (!token) return;
    void enqueue(async () => {
      try {
        await clearCartApi(token);
      } catch {
        setSyncError(
          "Gagal mengosongkan keranjang di server. Silakan coba lagi."
        );
      }
    });
  }, [token, enqueue, persistItems, markAuthenticatedOwner]);

  const dismissSyncError = useCallback(() => {
    setSyncError(null);
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        grandTotal,
        syncError,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
        dismissSyncError,
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
