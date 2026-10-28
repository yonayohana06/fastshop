"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Check, ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { useCart } from "@/context/cart-context";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    addItem({
      cart_item_id: `temp_${product.id}_${Date.now()}`,
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity: 1,
    });

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1200);
  };

  return (
    <div className="group flex flex-col justify-between rounded-2xl border border-zinc-200/80 bg-white p-3.5 transition-all hover:border-primary/50 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        {/* Image Container */}
        <Link
          href={`/products/${product.id}`}
          className="relative block aspect-square w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800"
        >
          {product.image_url && !imageError ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-zinc-400">
              <ShoppingCart className="h-10 w-10 opacity-40" />
            </div>
          )}

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs">
              <span className="rounded-md bg-zinc-900/90 px-2.5 py-1 text-xs font-semibold text-white">
                Stok Habis
              </span>
            </div>
          )}
        </Link>

        {/* Category & Stock Information */}
        <div className="mt-3 flex items-center justify-between gap-2">
          {product.category_name && (
            <span className="inline-block rounded-md bg-primary-light px-2 py-0.5 text-[11px] font-semibold text-primary dark:bg-primary-light dark:text-primary">
              {product.category_name}
            </span>
          )}
          <span
            className={`text-[11px] font-medium ${
              isOutOfStock
                ? "text-red-500"
                : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            {isOutOfStock ? "Habis" : `Stok: ${product.stock}`}
          </span>
        </div>

        {/* Product Title */}
        <Link href={`/products/${product.id}`} className="mt-2 block">
          <h3 className="line-clamp-2 text-sm font-semibold text-zinc-900 transition-colors group-hover:text-primary dark:text-zinc-100">
            {product.name}
          </h3>
        </Link>
      </div>

      {/* Footer: Price & Add To Cart Button */}
      <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800/80">
        <div>
          <span className="text-[11px] text-zinc-400 block">Harga</span>
          <span className="text-base font-extrabold text-zinc-950 dark:text-white">
            {formatRupiah(product.price)}
          </span>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          aria-label={
            isAdded
              ? "Berhasil ditambahkan"
              : isOutOfStock
              ? "Stok produk habis"
              : `Tambah ${product.name} ke keranjang`
          }
          className={`relative flex h-9 items-center justify-center gap-1.5 rounded-xl px-3 text-xs font-semibold transition-all ${
            isAdded
              ? "bg-secondary text-white shadow-xs"
              : isOutOfStock
              ? "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800"
              : "bg-primary text-white hover:bg-primary-hover shadow-xs"
          }`}
        >
          {isAdded ? (
            <>
              <Check className="h-4 w-4" />
              <span>Masuk!</span>
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              <span>Beli</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
