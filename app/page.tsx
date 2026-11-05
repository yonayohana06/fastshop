"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Product } from "@/types";
import { getProducts } from "@/lib/api/products";
import { ProductCard } from "@/components/products/product-card";
import { ProductSkeleton } from "@/components/products/product-skeleton";
import { TrustBadges } from "@/components/layout/trust-badges";
import { PromoCarousel } from "@/components/home/promo-carousel";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let isMounted = true;

    getProducts({ limit: 8 })
      .then((productsRes) => {
        if (!isMounted) return;
        setFeaturedProducts(productsRes.data || []);
        setError(null);
        setIsLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || "Gagal memuat produk beranda");
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [reloadToken]);

  return (
    <div className="flex flex-col">
      <h1 className="sr-only">
        FastShop - Toko Busana, Kemeja, Jeans, dan Sepatu Original Terpercaya
      </h1>

      {/* 1. Hero Promo Carousel (Tokopedia Style - Solid Colors Only) */}
      <section className="pt-3 sm:pt-6 pb-6 sm:pb-8 bg-zinc-50/50 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-0 sm:px-6 lg:px-8">
          <PromoCarousel />
        </div>
      </section>

      {/* 2. Featured Products Grid (Live from API) */}
      <section className="py-10 sm:py-14 bg-zinc-50/50 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-md bg-secondary/10 px-2.5 py-0.5 text-[11px] font-bold text-secondary">
                <span>Rekomendasi Terbaik</span>
              </div>
              <h2 className="mt-2 text-2xl font-extrabold text-zinc-950 dark:text-white sm:text-3xl">
                Produk Terbaru &amp; Terpopuler
              </h2>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Pilihan busana dan sepatu terbaik yang siap dikirim langsung ke alamat Anda
              </p>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-hover self-start sm:self-auto"
            >
              <span>Lihat Semua Produk</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Product Cards */}
          {isLoading ? (
            <ProductSkeleton count={8} />
          ) : error ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs text-zinc-500">{error}</p>
              <button
                type="button"
                onClick={() => {
                  setIsLoading(true);
                  setError(null);
                  setReloadToken((t) => t + 1);
                }}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-white hover:bg-primary-hover transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Coba Muat Ulang</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. Trust Badges Guarantee Banner */}
      <TrustBadges />
    </div>
  );
}
