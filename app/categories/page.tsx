"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Shirt,
  Sparkles,
  Footprints,
  Tag,
  ShoppingBag,
  Package,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import { Category } from "@/types";
import { getCategories } from "@/lib/api/categories";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

function getCategoryFallbackIcon(nameOrSlug: string) {
  const norm = (nameOrSlug || "").toLowerCase();
  if (norm.includes("pria") || norm.includes("men")) {
    return <Shirt className="h-6 w-6 text-primary" />;
  }
  if (norm.includes("wanita") || norm.includes("women")) {
    return <Sparkles className="h-6 w-6 text-secondary" />;
  }
  if (norm.includes("sepatu") || norm.includes("shoes") || norm.includes("running")) {
    return <Footprints className="h-6 w-6 text-primary" />;
  }
  if (norm.includes("jeans") || norm.includes("celana")) {
    return <Tag className="h-6 w-6 text-secondary" />;
  }
  if (norm.includes("kemeja") || norm.includes("t-shirt") || norm.includes("baju")) {
    return <Shirt className="h-6 w-6 text-primary" />;
  }
  return <ShoppingBag className="h-6 w-6 text-primary" />;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    getCategories()
      .then((res) => {
        if (!isMounted) return;
        setCategories(res.data || []);
        setIsLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || "Gagal memuat daftar kategori produk");
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    getCategories()
      .then((res) => {
        setCategories(res.data || []);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Gagal memuat daftar kategori produk");
        setIsLoading(false);
      });
  };
  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Beranda", href: "/" },
            { label: "Kategori", href: "/categories" },
          ]}
        />

        <div className="mt-6 mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary dark:bg-primary/20 dark:text-emerald-400">
            <span>Koleksi Lengkap</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold text-zinc-900 dark:text-white sm:text-3xl">
            Kategori Busana &amp; Pakaian
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
            Jelajahi seluruh kategori pakaian, sepatu, dan aksesoris fashion terkurasi
            dengan jaminan kualitas asli dan harga terjangkau.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="h-12 w-12 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
                <div className="mt-4 h-4 w-3/4 rounded-md bg-zinc-200 dark:bg-zinc-800" />
                <div className="mt-2 h-3 w-1/2 rounded-md bg-zinc-100 dark:bg-zinc-800/60" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50/50 p-8 text-center dark:border-red-900/40 dark:bg-red-950/20">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-sm font-bold text-red-900 dark:text-red-300">
              Gagal Memuat Kategori
            </h3>
            <p className="mt-1 text-xs text-red-700 dark:text-red-400">{error}</p>
            <button
              type="button"
              onClick={handleRetry}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Coba Lagi</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && categories.length === 0 && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <Package className="mx-auto h-12 w-12 text-zinc-400" />
            <h3 className="mt-3 text-base font-semibold text-zinc-900 dark:text-white">
              Belum Ada Kategori
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Daftar kategori produk sedang diperbarui oleh sistem.
            </p>
            <Link
              href="/products"
              className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover transition-colors"
            >
              <span>Lihat Semua Produk</span>
            </Link>
          </div>
        )}

        {/* Categories Grid */}
        {!isLoading && !error && categories.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category_id=${cat.id}`}
                className="group flex flex-col justify-between rounded-2xl border border-zinc-200/90 bg-white p-5 transition-all hover:border-primary/60 hover:shadow-xs dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-primary/50"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105 dark:bg-primary/20 dark:text-emerald-400">
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
                      getCategoryFallbackIcon(cat.slug || cat.name)
                    )}
                  </div>
                  <h2 className="mt-4 text-sm font-bold text-zinc-900 group-hover:text-primary transition-colors dark:text-zinc-100">
                    {cat.name}
                  </h2>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {typeof cat.product_count === "number"
                      ? `${cat.product_count} produk tersedia`
                      : "Koleksi pilihan"}
                  </p>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-3 text-xs font-semibold text-primary dark:border-zinc-800 dark:text-emerald-400">
                  <span>Buka Katalog</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
