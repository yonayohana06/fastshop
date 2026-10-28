"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Tag, CreditCard } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { formatRupiah } from "@/lib/utils";

export function CartSummary() {
  const { totalItems, grandTotal, items } = useCart();
  const { isAuthenticated } = useAuth();

  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState<string | null>(null);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    setPromoError("Kode promo tidak berlaku atau kuota telah habis.");
  };

  const checkoutUrl = isAuthenticated
    ? "/checkout"
    : "/login?redirect=/checkout";

  const isCartEmpty = items.length === 0;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 sticky top-24">
      <h2 className="text-base font-bold text-zinc-950 dark:text-white border-b border-zinc-100 pb-3 dark:border-zinc-800">
        Ringkasan Belanja
      </h2>

      {/* Pricing Breakdown */}
      <div className="mt-4 space-y-2.5 text-xs">
        <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
          <span>Total Harga ({totalItems} barang)</span>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            {formatRupiah(grandTotal)}
          </span>
        </div>

        <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
          <span>Biaya Pengiriman</span>
          <span className="font-bold text-primary">
            Gratis
          </span>
        </div>

        <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
          <span>Diskon Promo</span>
          <span className="text-zinc-400">-</span>
        </div>

        <div className="border-t border-zinc-100 pt-3 dark:border-zinc-800 flex items-baseline justify-between">
          <span className="text-sm font-bold text-zinc-950 dark:text-white">
            Total Tagihan
          </span>
          <span className="text-xl font-black text-primary">
            {formatRupiah(grandTotal)}
          </span>
        </div>
      </div>

      {/* Promo Code Input */}
      <form onSubmit={handleApplyPromo} className="mt-5">
        <div className="flex items-center gap-1.5">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={promoCode}
              onChange={(e) => {
                setPromoCode(e.target.value);
                setPromoError(null);
              }}
              placeholder="Punya kode promo?"
              disabled={isCartEmpty}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2 pl-9 pr-3 text-xs text-zinc-900 placeholder-zinc-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-100"
            />
          </div>
          <button
            type="submit"
            disabled={isCartEmpty || !promoCode.trim()}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 transition-colors"
          >
            Terapkan
          </button>
        </div>
        {promoError && (
          <p className="mt-1.5 text-[11px] text-red-500 font-medium">
            {promoError}
          </p>
        )}
      </form>

      {/* Checkout CTA Button */}
      <div className="mt-5">
        {isCartEmpty ? (
          <button
            type="button"
            disabled
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-100 py-3.5 px-4 text-xs font-bold text-zinc-400 cursor-not-allowed dark:bg-zinc-800"
          >
            <span>Keranjang Masih Kosong</span>
          </button>
        ) : (
          <Link
            href={checkoutUrl}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 px-4 text-xs font-bold text-white hover:bg-primary-hover shadow-xs transition-colors"
          >
            <span>Lanjut ke Pembayaran</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {/* Payment Badges & Guarantees */}
      <div className="mt-5 border-t border-zinc-100 pt-4 dark:border-zinc-800 space-y-2.5 text-[11px] text-zinc-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
          <span>Transaksi Terenkripsi &amp; Aman</span>
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-primary shrink-0" />
          <span>Mendukung Transfer Bank &amp; QRIS</span>
        </div>
      </div>
    </div>
  );
}
