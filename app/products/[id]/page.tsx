"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ArrowLeft,
  AlertCircle,
  Package,
} from "lucide-react";
import { Product } from "@/types";
import { getProductById, getProducts } from "@/lib/api/products";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ProductPurchaseBox } from "@/components/products/product-purchase-box";
import { ProductCard } from "@/components/products/product-card";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [activeTab, setActiveTab] = useState<"desc" | "spec">("desc");

  useEffect(() => {
    let isMounted = true;

    getProductById(productId)
      .then((res) => {
        if (!isMounted) return;
        const currentProduct = res.data;
        setProduct(currentProduct);
        setError(null);
        setIsLoading(false);

        // Fetch related products in the same category
        if (currentProduct.category_id) {
          getProducts({
            category_id: currentProduct.category_id,
            limit: 5,
          })
            .then((relatedRes) => {
              if (!isMounted) return;
              const filtered = (relatedRes.data || []).filter(
                (p) => String(p.id) !== String(currentProduct.id)
              );
              setRelatedProducts(filtered.slice(0, 4));
            })
            .catch(() => {});
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || "Gagal memuat detail produk");
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [productId]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 animate-pulse">
        {/* Breadcrumb Skeleton */}
        <div className="h-4 w-48 rounded bg-zinc-200 dark:bg-zinc-800" />

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Image Box Skeleton */}
          <div className="lg:col-span-5">
            <div className="aspect-square w-full rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
          </div>

          {/* Details Skeleton */}
          <div className="space-y-4 lg:col-span-7">
            <div className="h-5 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-8 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-6 w-1/3 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-32 w-full rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-zinc-950 dark:text-white">
          Produk Tidak Ditemukan
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
          {error ||
            "Produk yang Anda cari mungkin telah dihapus, stok kosong, atau alamat tautan tidak sesuai."}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-white hover:bg-primary-hover shadow-xs transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Katalog</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          >
            Beranda
          </Link>
        </div>
      </div>
    );
  }

  const breadcrumbs = [
    { label: "Semua Produk", href: "/products" },
    ...(product.category_name
      ? [
          {
            label: product.category_name,
            href: `/products?category_id=${product.category_id}`,
          },
        ]
      : []),
    { label: product.name },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={breadcrumbs} />

      {/* Main Product Layout */}
      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
        {/* Left Column: Image Gallery & Highlights */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div key={productId} className="relative aspect-square w-full overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-50 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            {product.image_url && !imageError ? (
              <Image
                src={product.image_url}
                alt={product.name}
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

        {/* Right Column: Information & Purchase Controls */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div>
            {/* Category Tag */}
            {product.category_name && (
              <Link
                href={`/products?category_id=${product.category_id}`}
                className="inline-block rounded-md bg-primary-light px-2.5 py-0.5 text-xs font-semibold text-primary hover:bg-primary/20 dark:bg-primary-light dark:text-primary transition-colors"
              >
                {product.category_name}
              </Link>
            )}

            {/* Product Title */}
            <h1 className="mt-2.5 text-2xl font-black tracking-tight text-zinc-950 sm:text-3xl dark:text-white">
              {product.name}
            </h1>

            {/* Social Proof */}
            <div className="mt-3 flex items-center gap-3 text-xs text-zinc-500">
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span>4.9</span>
              </div>
              <span className="text-zinc-300 dark:text-zinc-700">&bull;</span>
              <span>Terjual 150+ produk</span>
              <span className="text-zinc-300 dark:text-zinc-700">&bull;</span>
              <span className="text-primary font-medium">Original FastShop</span>
            </div>
          </div>

          {/* Interactive Purchase Box Component */}
          <ProductPurchaseBox product={product} />
        </div>
      </div>

      {/* Description & Specification Tabs */}
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
            <div className="prose max-w-none text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
              {product.description ||
                "Tidak ada deskripsi rinci untuk produk ini."}
            </div>
          ) : (
            <div className="max-w-xl">
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

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t border-zinc-200 pt-10 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-zinc-950 dark:text-white">
                Produk Terkait Lainnya
              </h2>
            </div>
            {product.category_id && (
              <Link
                href={`/products?category_id=${product.category_id}`}
                className="text-xs font-semibold text-primary hover:text-primary-hover"
              >
                Lihat Kategori Ini &rarr;
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
