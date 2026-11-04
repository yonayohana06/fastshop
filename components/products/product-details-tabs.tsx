"use client";

import React, { useState } from "react";
import { Product } from "@/types";

interface ProductDetailsTabsProps {
  product: Product;
}

export function ProductDetailsTabs({ product }: ProductDetailsTabsProps) {
  const [activeTab, setActiveTab] = useState<"desc" | "spec">("desc");

  return (
    <section className="mt-14 border-t border-zinc-200 pt-10 dark:border-zinc-800">
      <div className="flex items-center gap-4 border-b border-zinc-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => setActiveTab("desc")}
          className={`pb-3 text-sm font-bold transition-all border-b-2 ${
            activeTab === "desc"
              ? "border-primary text-primary"
              : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          Deskripsi Produk
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("spec")}
          className={`pb-3 text-sm font-bold transition-all border-b-2 ${
            activeTab === "spec"
              ? "border-primary text-primary"
              : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          Spesifikasi Detail
        </button>
      </div>

      <div className="mt-6">
        {activeTab === "desc" ? (
          <div>
            <h2 className="sr-only">Deskripsi {product.name}</h2>
            <div className="prose max-w-none text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
              {product.description ||
                "Tidak ada deskripsi rinci untuk produk ini."}
            </div>
          </div>
        ) : (
          <div className="max-w-xl">
            <h2 className="sr-only">Spesifikasi Detail {product.name}</h2>
            <dl className="divide-y divide-zinc-200 border border-zinc-200 rounded-xl bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 text-xs">
              <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="font-semibold text-zinc-500">ID Produk</dt>
                <dd className="mt-1 font-mono text-zinc-900 dark:text-zinc-100 sm:col-span-2 sm:mt-0">
                  #{product.id}
                </dd>
              </div>
              <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="font-semibold text-zinc-500">Kategori</dt>
                <dd className="mt-1 text-zinc-900 dark:text-zinc-100 sm:col-span-2 sm:mt-0">
                  {product.category_name || "-"}
                </dd>
              </div>
              <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="font-semibold text-zinc-500">Kondisi Barang</dt>
                <dd className="mt-1 text-zinc-900 dark:text-zinc-100 sm:col-span-2 sm:mt-0">
                  Baru &bull; 100% Original
                </dd>
              </div>
              <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="font-semibold text-zinc-500">Ketersediaan Stok</dt>
                <dd className="mt-1 font-semibold text-primary sm:col-span-2 sm:mt-0">
                  {product.stock} unit tersedia
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </section>
  );
}
