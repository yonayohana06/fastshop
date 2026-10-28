"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Check, X, ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { formatRupiah } from "@/lib/utils";

interface AddToCartToastProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  quantity: number;
}

export function AddToCartToast({
  isOpen,
  onClose,
  product,
  quantity,
}: AddToCartToastProps) {
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 animate-in slide-in-from-bottom-5 duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-primary font-bold text-xs">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
            <Check className="h-3 w-3" />
          </div>
          <span>Berhasil Ditambahkan ke Keranjang</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          aria-label="Tutup notifikasi"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
            {product.name}
          </p>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            {quantity} barang &bull;{" "}
            <span className="font-bold text-zinc-800 dark:text-zinc-200">
              {formatRupiah(Number(product.price) * quantity)}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-3.5 flex items-center gap-2">
        <Link
          href="/cart"
          onClick={onClose}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-primary py-2 px-3 text-xs font-semibold text-white hover:bg-primary-hover shadow-2xs transition-colors"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          <span>Lihat Keranjang</span>
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-zinc-200 bg-white py-2 px-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 transition-colors"
        >
          Lanjut Belanja
        </button>
      </div>
    </div>
  );
}
