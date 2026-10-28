"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Tag,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";
import { Product, Category } from "@/types";
import { getProducts } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";
import { ProductCard } from "@/components/products/product-card";
import { ProductSkeleton } from "@/components/products/product-skeleton";
import { TrustBadges } from "@/components/layout/trust-badges";

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

  return (
    <div className="flex flex-col">
      {/* 1. Hero Section (Clean Solid Styling - No Gradients) */}
      <section className="relative border-b border-zinc-200 bg-zinc-50 py-16 sm:py-24 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-light px-3.5 py-1 text-xs font-semibold text-primary dark:border-primary/40 dark:bg-primary-light">
              <Sparkles className="h-3.5 w-3.5 text-secondary" />
              <span>Koleksi Original &amp; Tren Busana 2026</span>
            </div>

            {/* Headline */}
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl dark:text-white">
              Belanja Cepat, Tampil{" "}
              <span className="text-primary">Lebih Percaya Diri</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
              Koleksi kemeja formal, celana jeans premium, polo shirt kasual,
              hingga sepatu running original dengan jaminan kualitas terbaik dan pengiriman cepat.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Link
                href="/products"
                className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white hover:bg-primary-hover shadow-xs transition-colors"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Jelajahi Katalog Lengkap</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/products"
                className="flex items-center justify-center w-full sm:w-auto rounded-xl border border-zinc-300 bg-white px-6 py-3.5 text-sm font-semibold text-zinc-800 hover:border-primary hover:text-primary dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 transition-colors"
              >
                Lihat Kategori
              </Link>
            </div>

            {/* Quick Micro Badges */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <div className="flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-primary" />
                <span>Pengiriman ke Seluruh Indonesia</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>100% Barang Original</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Tag className="h-4 w-4 text-secondary" />
                <span>Harga Terbaik Langsung Distributor</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Categories Row */}
      <section className="py-12 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-zinc-950 dark:text-white">
                Kategori Pilihan
              </h2>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                Temukan produk berdasarkan kategori yang Anda cari
              </p>
            </div>
            <Link
              href="/products"
              className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1"
            >
              Lihat Semua <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category_id=${cat.id}`}
                className="group flex flex-col items-center justify-center rounded-2xl border border-zinc-200/80 bg-zinc-50 p-4 text-center transition-all hover:border-primary/50 hover:bg-white hover:shadow-xs dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary group-hover:bg-primary group-hover:text-white transition-colors dark:bg-primary-light">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <span className="mt-2.5 text-xs font-semibold text-zinc-900 group-hover:text-primary dark:text-zinc-100 truncate w-full">
                  {cat.name}
                </span>
                {typeof cat.product_count === "number" && (
                  <span className="text-[11px] text-zinc-400">
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
