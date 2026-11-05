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
  CreditCard,
  PackageCheck,
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
  const [reloadToken, setReloadToken] = useState(0);
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
  }, [reloadToken]);

  // Prioritize categories with available products, limit to 6
  const activeCategories = categories.filter(
    (cat) => typeof cat.product_count !== "number" || cat.product_count > 0
  );
  const displayCategories = (activeCategories.length > 0 ? activeCategories : categories).slice(0, 6);

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
              href="/categories"
              className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1 group"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* List ke samping (Horizontal scrollable di mobile, 6 kolom rapi di desktop) */}
          {isLoading ? (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none sm:grid sm:grid-cols-6 sm:overflow-visible">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center shrink-0 w-28 sm:w-auto rounded-2xl border border-zinc-200/60 bg-zinc-50/50 p-3 sm:p-3.5 animate-pulse dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
                  <div className="mt-2.5 h-3.5 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="mt-1.5 h-2.5 w-10 rounded bg-zinc-100 dark:bg-zinc-800/60" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory sm:grid sm:grid-cols-6 sm:overflow-visible">
              {displayCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category_id=${cat.id}`}
                  className="group flex flex-col items-center justify-center shrink-0 w-28 sm:w-auto snap-start rounded-2xl border border-zinc-200/90 bg-zinc-50/80 p-3 sm:p-3.5 text-center transition-all hover:border-primary/60 hover:bg-white hover:shadow-xs dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
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
                    <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {cat.product_count} produk
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
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

      {/* 4. Solid Promotional Banner (No Gradients) */}
      {/* 4. Educational 3-Step Guide (Zero Gradients) */}
      <section className="py-14 bg-white dark:bg-zinc-900 border-t border-zinc-200/90 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary dark:bg-primary/20 dark:text-emerald-400">
              <span>Alur Belanja Transparan</span>
            </div>
            <h2 className="mt-2 text-2xl font-extrabold text-zinc-950 dark:text-white sm:text-3xl">
              3 Langkah Belanja Cepat di FastShop
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Proses mudah dan aman dari memilih busana hingga paket tiba di alamat Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-6 dark:border-zinc-800 dark:bg-zinc-950/60 transition-all hover:border-primary/50">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-xs">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <span className="text-2xl font-black text-zinc-300 dark:text-zinc-700">01</span>
              </div>
              <h3 className="mt-4 text-base font-bold text-zinc-900 dark:text-zinc-100">
                Pilih Produk &amp; Ukuran
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Temukan busana, kemeja, celana, atau sepatu favorit Anda. Cek detail bahan dan ukuran, lalu masukkan ke keranjang belanja.
              </p>
            </div>

            <div className="relative rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-6 dark:border-zinc-800 dark:bg-zinc-950/60 transition-all hover:border-secondary/50">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-white shadow-xs">
                  <CreditCard className="h-6 w-6" />
                </div>
                <span className="text-2xl font-black text-zinc-300 dark:text-zinc-700">02</span>
              </div>
              <h3 className="mt-4 text-base font-bold text-zinc-900 dark:text-zinc-100">
                Transfer Bank Resmi
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Lakukan transfer ke rekening resmi FastShop sesuai total nominal tanpa biaya transaksi tambahan yang tersembunyi.
              </p>
            </div>

            <div className="relative rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-6 dark:border-zinc-800 dark:bg-zinc-950/60 transition-all hover:border-primary/50">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-xs">
                  <PackageCheck className="h-6 w-6" />
                </div>
                <span className="text-2xl font-black text-zinc-300 dark:text-zinc-700">03</span>
              </div>
              <h3 className="mt-4 text-base font-bold text-zinc-900 dark:text-zinc-100">
                Upload Bukti &amp; Kirim
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Unggah foto struk transfer di halaman pesanan. Tim kami segera memverifikasi dan mengirim paket Anda dengan resi aktif.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* 5. Trust Badges Guarantee Banner */}
      <TrustBadges />
    </div>
  );
}
