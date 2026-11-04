"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShoppingBag, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { Product } from "@/types";

interface ProductImageGalleryProps {
  product: Product;
}

export function ProductImageGallery({ product }: ProductImageGalleryProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-50 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        {product.image_url && !imageError ? (
          <Image
            src={product.image_url}
            alt={`Jual ${product.name} original berkualitas - FastShop`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-400">
            <ShoppingBag className="h-16 w-16 opacity-30" />
          </div>
        )}

        {/* In-Stock / Out-of-Stock Badge */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs">
            <span className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white shadow-sm">
              Stok Habis
            </span>
          </div>
        )}
      </div>

      {/* Trust Guarantees */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl border border-zinc-200/60 bg-zinc-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-900">
          <ShieldCheck className="mx-auto h-4 w-4 text-primary" />
          <span className="mt-1 block text-[10px] font-semibold text-zinc-700 dark:text-zinc-300">
            100% Asli
          </span>
        </div>
        <div className="rounded-xl border border-zinc-200/60 bg-zinc-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-900">
          <Truck className="mx-auto h-4 w-4 text-primary" />
          <span className="mt-1 block text-[10px] font-semibold text-zinc-700 dark:text-zinc-300">
            Kirim Cepat
          </span>
        </div>
        <div className="rounded-xl border border-zinc-200/60 bg-zinc-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-900">
          <RotateCcw className="mx-auto h-4 w-4 text-secondary" />
          <span className="mt-1 block text-[10px] font-semibold text-zinc-700 dark:text-zinc-300">
            Bisa Retur
          </span>
        </div>
      </div>
    </div>
  );
}
