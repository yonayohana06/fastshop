import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "@/context/auth-context";
import { CartProvider } from "@/context/cart-context";
import CheckoutPage from "@/app/checkout/page";
import OrdersPage from "@/app/orders/page";
import OrderDetailPage from "@/app/orders/[id]/page";
import ProfilePage from "@/app/profile/page";
import { STORAGE_KEYS } from "@/lib/constants";
import type { ApiResponse, Order, User } from "@/types";

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  params: { id: "123" },
  searchParams: new URLSearchParams(),
  getOrdersApi: vi.fn(),
  getOrderByIdApi: vi.fn(),
  getMeApi: vi.fn(),
  checkoutOrderApi: vi.fn(),
  getCartApi: vi.fn(),
  addToCartApi: vi.fn(),
  updateCartItemApi: vi.fn(),
  deleteCartItemApi: vi.fn(),
  clearCartApi: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mocks.push, replace: mocks.replace }),
  useParams: () => mocks.params,
  useSearchParams: () => mocks.searchParams,
}));

vi.mock("@/lib/api/orders", () => ({
  getOrdersApi: mocks.getOrdersApi,
  getOrderByIdApi: mocks.getOrderByIdApi,
  checkoutOrderApi: mocks.checkoutOrderApi,
  uploadPaymentProofApi: vi.fn(),
}));

vi.mock("@/lib/api/auth", () => ({
  getMeApi: mocks.getMeApi,
}));

vi.mock("@/lib/api/cart", () => ({
  getCartApi: mocks.getCartApi,
  addToCartApi: mocks.addToCartApi,
  updateCartItemApi: mocks.updateCartItemApi,
  deleteCartItemApi: mocks.deleteCartItemApi,
  clearCartApi: mocks.clearCartApi,
}));

const user: User = {
  id: 7,
  name: "Budi",
  email: "budi@example.com",
  role: "user",
  created_at: "2026-09-01T00:00:00.000Z",
};

const order: Order = {
  id: "123",
  order_id: "123",
  user_id: "7",
  total_amount: 150000,
  status: "PENDING",
  shipping_address: "Jl. Kaliurang KM 5, Yogyakarta",
  payment_proof_url: null,
  payment_submitted_at: null,
  created_at: "2026-11-01T10:00:00.000Z",
  updated_at: "2026-11-01T10:00:00.000Z",
  total_items: 1,
  items: [],
};

function ok<T>(data: T): ApiResponse<T> {
  return { message: "ok", data };
}

function seedSession() {
  localStorage.setItem(STORAGE_KEYS.TOKEN, "token-a");
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

function CheckoutApp() {
  return (
    <AuthProvider>
      <CartProvider>
        <CheckoutPage />
      </CartProvider>
    </AuthProvider>
  );
}

function OrdersApp() {
  return (
    <AuthProvider>
      <OrdersPage />
    </AuthProvider>
  );
}

function OrderDetailApp() {
  return (
    <AuthProvider>
      <OrderDetailPage />
    </AuthProvider>
  );
}

function ProfileApp() {
  return (
    <AuthProvider>
      <ProfilePage />
    </AuthProvider>
  );
}

const roots: Root[] = [];

async function hydratePage(element: React.ReactElement) {
  const html = renderToString(element);
  const container = document.createElement("div");
  container.innerHTML = html;
  document.body.appendChild(container);

  let root!: Root;
  await act(async () => {
    root = hydrateRoot(container, element);
    await Promise.resolve();
  });
  roots.push(root);

  return { container, html };
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.params.id = "123";
  mocks.searchParams = new URLSearchParams();
  mocks.getOrdersApi.mockResolvedValue(ok([order]));
  mocks.getOrderByIdApi.mockResolvedValue(ok(order));
  mocks.getMeApi.mockResolvedValue(ok(user));
  mocks.checkoutOrderApi.mockResolvedValue(ok(order));
  mocks.getCartApi.mockResolvedValue(ok({ items: [], grand_total: 0 }));
  mocks.addToCartApi.mockResolvedValue(ok({}));
  mocks.updateCartItemApi.mockResolvedValue(ok({}));
  mocks.deleteCartItemApi.mockResolvedValue(ok({}));
  mocks.clearCartApi.mockResolvedValue(ok({}));
});

afterEach(async () => {
  await act(async () => {
    roots.forEach((root) => root.unmount());
    roots.length = 0;
  });
  document.body.innerHTML = "";
});

describe("protected pages during hard refresh", () => {
  it("does not redirect /checkout when a valid session is restored", async () => {
    seedSession();

    const { html } = await hydratePage(<CheckoutApp />);

    expect(html).not.toContain("Keranjang Belanja Anda Kosong");
    expect(html).toContain('role="status"');

    await waitFor(() => {
      expect(
        screen.getByText("Keranjang Belanja Anda Kosong")
      ).toBeInTheDocument();
    });
    expect(mocks.replace).not.toHaveBeenCalled();
    expect(mocks.push).not.toHaveBeenCalled();
  });

  it("loads /orders for a valid session without redirecting", async () => {
    seedSession();

    const { html } = await hydratePage(<OrdersApp />);

    expect(html).not.toContain("Riwayat Pesanan");

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Riwayat Pesanan" })
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(mocks.getOrdersApi).toHaveBeenCalledWith(undefined, "token-a");
    });
    expect(screen.getByText("#123")).toBeInTheDocument();
    expect(mocks.replace).not.toHaveBeenCalled();
    expect(mocks.push).not.toHaveBeenCalled();
  });

  it("shows /profile for a valid session without redirecting", async () => {
    seedSession();

    await hydratePage(<ProfileApp />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Budi" })).toBeInTheDocument();
    });
    expect(mocks.getMeApi).toHaveBeenCalledWith("token-a");
    expect(mocks.replace).not.toHaveBeenCalled();
    expect(mocks.push).not.toHaveBeenCalled();
  });

  it("loads /orders/:id for a valid session without redirecting", async () => {
    seedSession();

    await hydratePage(<OrderDetailApp />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Pesanan #123" })
      ).toBeInTheDocument();
    });
    expect(mocks.getOrderByIdApi).toHaveBeenCalledWith("123", "token-a");
    expect(mocks.replace).not.toHaveBeenCalled();
    expect(mocks.push).not.toHaveBeenCalled();
  });
});

describe("protected pages without a session", () => {
  it.each([
    {
      name: "checkout",
      element: <CheckoutApp />,
      redirect: "/login?redirect=%2Fcheckout",
      protectedText: "Keranjang Belanja Anda Kosong",
    },
    {
      name: "orders",
      element: <OrdersApp />,
      redirect: "/login?redirect=%2Forders",
      protectedText: "Riwayat Pesanan",
    },
    {
      name: "order detail",
      element: <OrderDetailApp />,
      redirect: "/login?redirect=%2Forders%2F123",
      protectedText: "Pesanan #123",
    },
    {
      name: "profile",
      element: <ProfileApp />,
      redirect: "/login?redirect=%2Fprofile",
      protectedText: "Akun Pelanggan Aktif",
    },
  ])(
    "redirects $name to login without flashing protected content",
    async ({ element, redirect, protectedText }) => {
      render(element);

      expect(screen.getByRole("status")).toBeInTheDocument();
      expect(screen.queryByText(protectedText)).not.toBeInTheDocument();

      await waitFor(() => {
        expect(mocks.replace).toHaveBeenCalledWith(redirect);
      });
      expect(mocks.replace).toHaveBeenCalledTimes(1);
      expect(mocks.push).not.toHaveBeenCalled();
    }
  );
});
