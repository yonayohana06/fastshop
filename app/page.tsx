"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Tag,
  RotateCcw,
  Shirt,
  Footprints,
} from "lucide-react";
import { Product, Category } from "@/types";
import { getProducts } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";
import { ProductCard } from "@/components/products/product-card";
import { ProductSkeleton } from "@/components/products/product-skeleton";
import { TrustBadges } from "@/components/layout/trust-badges";
import { PromoCarousel } from "@/components/home/promo-carousel";

function getFallbackCategoryIcon(nameOrSlug: string) {
  const normalized = (nameOrSlug || "").toLowerCase();
  if (normalized.includes("pria") || normalized.includes("men")) {
    return <Shirt className="h-6 w-6 text-primary" />;
  }
  if (normalized.includes("wanita") || normalized.includes("women")) {
    return <Sparkles className="h-6 w-6 text-secondary" />;
  }
  if (
    normalized.includes("sepatu") ||
    normalized.includes("shoes") ||
    normalized.includes("running")
  ) {
    return <Footprints className="h-6 w-6 text-primary" />;
  }
  if (normalized.includes("jeans") || normalized.includes("celana")) {
    return <Tag className="h-6 w-6 text-secondary" />;
  }
  return <ShoppingBag className="h-6 w-6 text-primary" />;
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      getProducts({ limit: 8 }),
      getCategories(),
    ])
      .then(([productsRes, categoriesRes]) => {
        if (!isMounted) return;
        setFeaturedProducts(productsRes.data || []);
        setCategories(categoriesRes.data || []);
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
  }, []);

  // Limit to maximum 6 categories as requested
  const displayCategories = categories.slice(0, 6);

  return (
    <div className="flex flex-col">
      {/* 1. Hero Promo Carousel (Tokopedia Style - Solid Colors Only) */}
      <section className="pt-6 pb-8 bg-zinc-50/50 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PromoCarousel />
        </div>
      </section>

      {/* 2. Featured Categories Row (List Ke Samping, Maksimal 6, Icon dari Response API) */}
      <section className="py-8 bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-950 dark:text-white">
                Kategori Pilihan
              </h2>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                Temukan koleksi pilihan berdasarkan kategori yang Anda cari
              </p>
            </div>
            <Link
              href="/products"
              className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1 group"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* List ke samping (Horizontal scrollable di mobile, 6 kolom rapi di desktop) */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none sm:grid sm:grid-cols-6 sm:overflow-visible">
            {displayCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category_id=${cat.id}`}
                className="group flex flex-col items-center justify-center shrink-0 w-32 sm:w-auto rounded-2xl border border-zinc-200/90 bg-zinc-50/80 p-3.5 text-center transition-all hover:border-primary/60 hover:bg-white hover:shadow-xs dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary group-hover:scale-110 transition-transform">
                  {cat.icon_url ? (
                    <Image
                      src={cat.icon_url}
                      alt={cat.name}
                      width={28}
                      height={28}
                      className="h-7 w-7 object-contain"
                      unoptimized
                    />
                  ) : (
                    getFallbackCategoryIcon(cat.slug || cat.name)
                  )}
                </div>
                <span className="mt-2 text-xs font-bold text-zinc-900 group-hover:text-primary dark:text-zinc-100 truncate w-full">
                  {cat.name}
                </span>
                {typeof cat.product_count === "number" && (
                  <span className="text-[10px] text-zinc-400 mt-0.5">
                    {cat.product_count} produk
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Products Grid (Live from API) */}
      <section className="py-14 bg-zinc-50/50 dark:bg-zinc-950">
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
                onClick={() => window.location.reload()}
                className="mt-3 inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Muat Ulang
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Solid Promotional Banner (No Gradients) */}
      <section className="bg-primary text-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl text-center md:text-left">
              <span className="inline-block rounded-md bg-white/15 px-3 py-1 text-xs font-bold tracking-wide text-white uppercase">
                Penawaran Spesial
              </span>
              <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">
                Dapatkan Promo Diskon &amp; Bebas Ongkir Hari Ini
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-white/80 leading-relaxed">
                Belanja kebutuhan fashion Anda tanpa khawatir ongkos kirim.
                Garansi produk 100% original atau uang kembali penuh.
              </p>
            </div>
            <div className="shrink-0">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-6 py-3.5 text-sm font-bold text-white shadow-xs hover:bg-secondary-hover transition-colors"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Mulai Belanja</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Trust Badges Guarantee Banner */}
      <TrustBadges />
    </div>
  );
}
