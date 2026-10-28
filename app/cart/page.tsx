"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  ArrowLeft,
  Trash2,
  Package,
} from "lucide-react";
import { useCart } from "@/context/cart-context";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CartItemRow } from "@/components/cart/cart-item-row";
import { CartSummary } from "@/components/cart/cart-summary";

export default function CartPage() {
  const { items, totalItems, clearCart } = useCart();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearAll = () => {
    clearCart();
    setShowClearConfirm(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={[{ label: "Keranjang Belanja" }]} />

      {/* Page Title & Count */}
      <div className="mt-6 flex flex-col gap-2 border-b border-zinc-200 pb-5 dark:border-zinc-800 sm:flex-row sm:items-baseline sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-950 sm:text-3xl dark:text-white">
            Keranjang Belanja
          </h1>
          {items.length > 0 && (
            <span className="rounded-full bg-primary-light px-3 py-0.5 text-xs font-bold text-primary dark:bg-primary-light">
              {totalItems} barang
            </span>
          )}
        </div>

        {items.length > 0 && (
          <div className="relative">
            {showClearConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-600 font-semibold">
                  Hapus semua barang?
                </span>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="rounded-lg bg-red-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-red-700 transition-colors"
                >
                  Ya, Hapus
                </button>
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="rounded-lg border border-zinc-200 px-2.5 py-1 text-xs text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300"
                >
                  Batal
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Kosongkan Keranjang</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Cart Content: Empty State or Items Layout */}
      {items.length === 0 ? (
        <div className="my-16 rounded-2xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900 max-w-lg mx-auto">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-primary dark:bg-primary-light">
            <ShoppingCart className="h-8 w-8" />
          </div>
          <h2 className="mt-5 text-lg font-bold text-zinc-950 dark:text-white">
            Keranjang Belanja Masih Kosong
          </h2>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Sepertinya Anda belum memilih produk apapun. Jelajahi katalog fashion,
            kemeja, sepatu, dan celana berkualitas kami sekarang!
          </p>
          <div className="mt-6">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-bold text-white hover:bg-primary-hover shadow-xs transition-colors"
            >
              <Package className="h-4 w-4" />
              <span>Mulai Belanja Sekarang</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="space-y-3">
              {items.map((item) => (
                <CartItemRow key={item.product_id} item={item} />
              ))}
            </div>

            {/* Back to Catalog Link */}
            <div className="pt-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-hover transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Tambah Barang Lain dari Katalog</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Sticky Summary Box */}
          <div className="lg:col-span-4">
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  );
}
