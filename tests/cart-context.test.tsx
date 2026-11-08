import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider, useAuth } from "@/context/auth-context";
import { CartProvider, useCart } from "@/context/cart-context";
import { CartSyncToast } from "@/components/cart/cart-sync-toast";
import * as cartApi from "@/lib/api/cart";
import { STORAGE_KEYS } from "@/lib/constants";
import type { ApiResponse, CartItem, User } from "@/types";

vi.mock("@/lib/api/cart", () => ({
  getCartApi: vi.fn(),
  addToCartApi: vi.fn(),
  updateCartItemApi: vi.fn(),
  deleteCartItemApi: vi.fn(),
  clearCartApi: vi.fn(),
}));

const userA: User = {
  id: 7,
  name: "Budi",
  email: "budi@example.com",
  role: "user",
};

const userB: User = {
  id: 8,
  name: "Sari",
  email: "sari@example.com",
  role: "user",
};

const guestItem: CartItem = {
  cart_item_id: "temp_1_1",
  product_id: 1,
  product_name: "Kaos Polos",
  price: "50000",
  image_url: "https://example.com/kaos.jpg",
  quantity: 1,
  subtotal: 50000,
};

const serverItem: CartItem = {
  ...guestItem,
  cart_item_id: 42,
  quantity: 1,
};

function ok<T>(data: T): ApiResponse<T> {
  return { message: "ok", data };
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function seedAuth(user: User = userA, token = "token-a") {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  localStorage.setItem(STORAGE_KEYS.CART_OWNER, `user:${user.id}`);
}

function seedCart(items: CartItem[], owner = "guest") {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
  localStorage.setItem(STORAGE_KEYS.CART_OWNER, owner);
}

function Harness() {
  const cart = useCart();
  const { login, logout } = useAuth();

  return (
    <div>
      <pre data-testid="items">{JSON.stringify(cart.items)}</pre>
      <button
        type="button"
        onClick={() =>
          cart.addItem({ ...guestItem, cart_item_id: `temp_1_${Date.now()}` })
        }
      >
        add
      </button>
      <button type="button" onClick={() => cart.updateQuantity(1, 3)}>
        update-3
      </button>
      <button type="button" onClick={() => cart.updateQuantity(1, 0)}>
        update-0
      </button>
      <button type="button" onClick={() => cart.removeItem(1)}>
        remove
      </button>
      <button type="button" onClick={() => cart.clearCart()}>
        clear
      </button>
      <button type="button" onClick={() => void cart.refreshCart()}>
        refresh
      </button>
      <button type="button" onClick={() => login("token-a", userA)}>
        login-a
      </button>
      <button type="button" onClick={() => login("token-b", userB)}>
        login-b
      </button>
      <button type="button" onClick={() => logout()}>
        logout
      </button>
    </div>
  );
}

function TestProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <CartSyncToast />
      </CartProvider>
    </AuthProvider>
  );
}

function renderApp() {
  return render(
    <TestProviders>
      <Harness />
    </TestProviders>
  );
}

function readItems(): CartItem[] {
  return JSON.parse(screen.getByTestId("items").textContent || "[]") as CartItem[];
}

function storedItems(): CartItem[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || "[]") as CartItem[];
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(cartApi.getCartApi).mockResolvedValue(
    ok({ items: [], grand_total: 0 })
  );
  vi.mocked(cartApi.addToCartApi).mockResolvedValue(ok({}));
  vi.mocked(cartApi.updateCartItemApi).mockResolvedValue(ok({}));
  vi.mocked(cartApi.deleteCartItemApi).mockResolvedValue(ok({}));
  vi.mocked(cartApi.clearCartApi).mockResolvedValue(ok({}));
});

describe("cart sync", () => {
  it("adds items locally for guests without calling the server", async () => {
    renderApp();

    fireEvent.click(screen.getByRole("button", { name: "add" }));

    await waitFor(() => {
      expect(readItems()).toHaveLength(1);
    });
    expect(readItems()[0].quantity).toBe(1);
    expect(cartApi.addToCartApi).not.toHaveBeenCalled();
  });

  it("merges the guest cart into the server cart on login", async () => {
    seedCart([{ ...guestItem, quantity: 2 }]);
    vi.mocked(cartApi.addToCartApi).mockResolvedValue(
      ok({ id: 42, product_id: 1, quantity: 2 })
    );
    vi.mocked(cartApi.getCartApi).mockResolvedValue(
      ok({ items: [{ ...serverItem, quantity: 2, subtotal: 100000 }], grand_total: 100000 })
    );

    renderApp();
    fireEvent.click(screen.getByRole("button", { name: "login-a" }));

    await waitFor(() => {
      expect(cartApi.addToCartApi).toHaveBeenCalledWith(
        { product_id: 1, quantity: 2 },
        "token-a"
      );
    });
    await waitFor(() => {
      expect(cartApi.getCartApi).toHaveBeenCalledWith("token-a");
    });
    await waitFor(() => {
      expect(readItems()[0]?.cart_item_id).toBe(42);
    });
    expect(localStorage.getItem(STORAGE_KEYS.CART_OWNER)).toBe("user:7");
  });

  it("stores the real cart item id returned by the server when logged in", async () => {
    seedAuth();
    vi.mocked(cartApi.addToCartApi).mockResolvedValue(
      ok({ id: 99, product_id: 1, quantity: 1 })
    );

    renderApp();
    await waitFor(() => {
      expect(cartApi.getCartApi).toHaveBeenCalledWith("token-a");
    });

    fireEvent.click(screen.getByRole("button", { name: "add" }));

    await waitFor(() => {
      expect(readItems()[0]?.cart_item_id).toBe(99);
    });
    expect(storedItems()[0]?.cart_item_id).toBe(99);
  });

  it("sends PUT with the real cart item id when the quantity changes", async () => {
    seedAuth();
    vi.mocked(cartApi.getCartApi).mockResolvedValue(
      ok({ items: [serverItem], grand_total: 50000 })
    );
    vi.mocked(cartApi.updateCartItemApi).mockResolvedValue(
      ok({ id: 42, product_id: 1, quantity: 3 })
    );

    renderApp();
    await waitFor(() => {
      expect(cartApi.getCartApi).toHaveBeenCalledWith("token-a");
    });

    fireEvent.click(screen.getByRole("button", { name: "update-3" }));

    await waitFor(() => {
      expect(cartApi.updateCartItemApi).toHaveBeenCalledWith(
        42,
        { quantity: 3 },
        "token-a"
      );
    });
    await waitFor(() => {
      expect(readItems()[0]?.quantity).toBe(3);
    });

    vi.mocked(cartApi.getCartApi).mockResolvedValue(
      ok({
        items: [{ ...serverItem, quantity: 3, subtotal: 150000 }],
        grand_total: 150000,
      })
    );
    fireEvent.click(screen.getByRole("button", { name: "refresh" }));

    await waitFor(() => {
      expect(cartApi.getCartApi).toHaveBeenCalledTimes(2);
    });
    expect(readItems()[0]?.quantity).toBe(3);
  });

  it("sends DELETE when the quantity reaches zero", async () => {
    seedAuth();
    vi.mocked(cartApi.getCartApi).mockResolvedValue(
      ok({ items: [serverItem], grand_total: 50000 })
    );

    renderApp();
    await waitFor(() => {
      expect(cartApi.getCartApi).toHaveBeenCalledWith("token-a");
    });

    fireEvent.click(screen.getByRole("button", { name: "update-0" }));

    await waitFor(() => {
      expect(cartApi.deleteCartItemApi).toHaveBeenCalledWith(42, "token-a");
    });
    expect(readItems()).toHaveLength(0);
    expect(storedItems()).toHaveLength(0);
  });

  it("deletes the real server item when removed in the same session as it was added", async () => {
    seedAuth();
    const addResponse = deferred<
      Awaited<ReturnType<typeof cartApi.addToCartApi>>
    >();
    vi.mocked(cartApi.addToCartApi).mockReturnValue(addResponse.promise);

    renderApp();
    await waitFor(() => {
      expect(cartApi.getCartApi).toHaveBeenCalledWith("token-a");
    });

    fireEvent.click(screen.getByRole("button", { name: "add" }));
    fireEvent.click(screen.getByRole("button", { name: "remove" }));

    addResponse.resolve(ok({ id: 77, product_id: 1, quantity: 1 }));

    await waitFor(() => {
      expect(cartApi.deleteCartItemApi).toHaveBeenCalledWith(77, "token-a");
    });
    expect(readItems()).toHaveLength(0);
  });

  it("clears the local cart on logout without clearing the server cart", async () => {
    seedAuth();
    vi.mocked(cartApi.getCartApi).mockResolvedValue(
      ok({ items: [serverItem], grand_total: 50000 })
    );

    renderApp();
    await waitFor(() => {
      expect(readItems()).toHaveLength(1);
    });

    fireEvent.click(screen.getByRole("button", { name: "logout" }));

    await waitFor(() => {
      expect(readItems()).toHaveLength(0);
    });
    expect(localStorage.getItem(STORAGE_KEYS.CART)).toBe("[]");
    expect(localStorage.getItem(STORAGE_KEYS.CART_OWNER)).toBeNull();
    expect(cartApi.clearCartApi).not.toHaveBeenCalled();
  });

  it("does not leak one account's cart into the next account", async () => {
    seedAuth(userA);
    vi.mocked(cartApi.getCartApi).mockResolvedValue(
      ok({ items: [serverItem], grand_total: 50000 })
    );

    renderApp();
    await waitFor(() => {
      expect(readItems()).toHaveLength(1);
    });

    fireEvent.click(screen.getByRole("button", { name: "logout" }));
    await waitFor(() => {
      expect(readItems()).toHaveLength(0);
    });

    vi.mocked(cartApi.getCartApi).mockResolvedValue(
      ok({ items: [], grand_total: 0 })
    );
    fireEvent.click(screen.getByRole("button", { name: "login-b" }));

    await waitFor(() => {
      expect(cartApi.getCartApi).toHaveBeenCalledWith("token-b");
    });
    expect(readItems()).toHaveLength(0);
  });

  it("shows an error and rolls back when adding to the server fails", async () => {
    seedAuth();
    vi.mocked(cartApi.addToCartApi).mockRejectedValue(new Error("network"));

    renderApp();
    await waitFor(() => {
      expect(cartApi.getCartApi).toHaveBeenCalledWith("token-a");
    });

    fireEvent.click(screen.getByRole("button", { name: "add" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /gagal menambahkan/i
    );
    await waitFor(() => {
      expect(readItems()).toHaveLength(0);
    });
  });

  it("shows an error and rolls back when updating the quantity fails", async () => {
    seedAuth();
    vi.mocked(cartApi.getCartApi).mockResolvedValue(
      ok({ items: [serverItem], grand_total: 50000 })
    );
    vi.mocked(cartApi.updateCartItemApi).mockRejectedValue(new Error("network"));

    renderApp();
    await waitFor(() => {
      expect(cartApi.getCartApi).toHaveBeenCalledWith("token-a");
    });

    fireEvent.click(screen.getByRole("button", { name: "update-3" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /gagal memperbarui/i
    );
    await waitFor(() => {
      expect(readItems()[0]?.quantity).toBe(1);
    });
  });

  it("shows an error and restores the item when removal fails", async () => {
    seedAuth();
    vi.mocked(cartApi.getCartApi).mockResolvedValue(
      ok({ items: [serverItem], grand_total: 50000 })
    );
    vi.mocked(cartApi.deleteCartItemApi).mockRejectedValue(new Error("network"));

    renderApp();
    await waitFor(() => {
      expect(cartApi.getCartApi).toHaveBeenCalledWith("token-a");
    });

    fireEvent.click(screen.getByRole("button", { name: "remove" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /gagal menghapus/i
    );
    await waitFor(() => {
      expect(readItems()).toHaveLength(1);
    });
  });

  it("shows an error when refreshing from the server fails but keeps the local cart", async () => {
    seedAuth();
    seedCart([serverItem], "user:7");
    vi.mocked(cartApi.getCartApi).mockRejectedValue(new Error("network"));

    renderApp();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /gagal memuat/i
    );
    expect(readItems()).toHaveLength(1);
  });
});
