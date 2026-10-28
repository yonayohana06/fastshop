"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { CartItem } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { useCart } from "@/context/cart-context";

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCart();
  const [imageError, setImageError] = useState(false);

  const priceNum =
    typeof item.price === "string" ? parseFloat(item.price) : item.price;
  const subtotal = item.subtotal ? item.subtotal : priceNum * item.quantity;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200/80 bg-white p-4 transition-all hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row sm:items-center sm:justify-between">
      {/* Left: Thumbnail & Name */}
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        <Link
          href={`/products/${item.product_id}`}
          className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800"
        >
          {item.image_url && !imageError ? (
            <Image
              src={item.image_url}
              alt={item.product_name}
              fill
              sizes="80px"
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-zinc-400">
              <ShoppingBag className="h-6 w-6 opacity-30" />
            </div>
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <Link
            href={`/products/${item.product_id}`}
            className="block text-xs sm:text-sm font-bold text-zinc-900 hover:text-primary dark:text-zinc-100 transition-colors line-clamp-2"
          >
            {item.product_name}
          </Link>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {formatRupiah(item.price)}{" "}
            <span className="text-[11px] text-zinc-400">/ pcs</span>
          </p>
        </div>
      </div>

      {/* Right: Quantity, Subtotal, Delete */}
      <div className="flex items-center justify-between sm:justify-end gap-5 border-t border-zinc-100 pt-3 sm:border-0 sm:pt-0">
        {/* Quantity Controls */}
        <div className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-800">
          <button
            type="button"
            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-zinc-700 shadow-2xs hover:bg-zinc-100 dark:bg-zinc-700 dark:text-zinc-200 transition-colors"
            aria-label="Kurangi satu"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="w-8 text-center text-xs font-bold text-zinc-900 dark:text-zinc-100">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-zinc-700 shadow-2xs hover:bg-zinc-100 dark:bg-zinc-700 dark:text-zinc-200 transition-colors"
            aria-label="Tambah satu"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>

        {/* Subtotal */}
        <div className="text-right min-w-[90px]">
          <span className="text-[10px] text-zinc-400 block sm:hidden">Total</span>
          <span className="text-sm font-extrabold text-zinc-950 dark:text-white">
            {formatRupiah(subtotal)}
          </span>
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={() => removeItem(item.product_id)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:text-red-400 transition-colors"
          aria-label={`Hapus ${item.product_name} dari keranjang`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
