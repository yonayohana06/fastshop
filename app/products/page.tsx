"use client";

import React, { useEffect, useState, useTransition, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, RotateCcw, AlertCircle } from "lucide-react";
import { Product, Category, Pagination as PaginationType } from "@/types";
import { getProducts } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";
import { ProductCard } from "@/components/products/product-card";
import { ProductSkeleton } from "@/components/products/product-skeleton";
import { CategoryFilter } from "@/components/products/category-filter";
import { Pagination } from "@/components/ui/pagination";

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category_id") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const currentSort = searchParams.get("sort") || "latest";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState(currentSearch);
  const [isPending, startTransition] = useTransition();

  // Load Categories once on mount
  useEffect(() => {
    let isMounted = true;
    getCategories()
      .then((res) => {
        if (isMounted && res.data) {
          setCategories(res.data);
        }
      })
      .catch((err) => {
        console.warn("Gagal memuat kategori:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Load Products whenever search parameters change
  useEffect(() => {
    let isMounted = true;

    getProducts({
      search: currentSearch || undefined,
      category_id: currentCategory || undefined,
      page: currentPage,
      limit: 12,
    })
      .then((res) => {
        if (!isMounted) return;
        let items = res.data || [];

        // Client-side sorting for price
        if (currentSort === "price_asc") {
          items = [...items].sort(
            (a, b) => parseFloat(String(a.price)) - parseFloat(String(b.price))
          );
        } else if (currentSort === "price_desc") {
          items = [...items].sort(
            (a, b) => parseFloat(String(b.price)) - parseFloat(String(a.price))
          );
        }

        setProducts(items);
        setPagination(res.pagination || null);
        setError(null);
        setIsLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || "Gagal memuat daftar produk");
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentSearch, currentCategory, currentPage, currentSort]);

  const updateFilters = (newParams: Record<string, string | number | null>) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === "" || value === undefined) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      router.push(`/products?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({
      search: searchInput.trim() || null,
      page: 1,
    });
  };

  const handleCategorySelect = (catId: string | number | null) => {
    updateFilters({
      category_id: catId,
      page: 1,
    });
  };

  const handleSortChange = (newSort: string) => {
    updateFilters({
      sort: newSort === "latest" ? null : newSort,
    });
  };

  const handlePageChange = (newPage: number) => {
    updateFilters({ page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResetFilters = () => {
    setSearchInput("");
    router.push("/products");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header & Title */}
      <div className="flex flex-col gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-950 sm:text-3xl dark:text-white">
            Katalog Produk
          </h1>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {pagination
              ? `Menampilkan ${products.length} dari ${pagination.totalItems} produk tersedia`
              : "Jelajahi berbagai pilihan produk original berkualitas"}
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <label
            htmlFor="sort-select"
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-300"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-zinc-500" />
            <span>Urutkan:</span>
          </label>
          <select
            id="sort-select"
            value={currentSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="rounded-xl border border-zinc-200 bg-white py-1.5 pl-3 pr-8 text-xs font-medium text-zinc-800 shadow-2xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
          >
            <option value="latest">Terbaru</option>
            <option value="price_asc">Harga Terendah</option>
            <option value="price_desc">Harga Tertinggi</option>
          </select>
        </div>
      </div>

      {/* Filter & Search Bar Row */}
      <div className="mt-6 flex flex-col gap-4">
        {/* Search Input Box */}
        <form
          key={currentSearch}
          onSubmit={handleSearchSubmit}
          className="relative flex max-w-lg"
        >
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            defaultValue={currentSearch}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari dalam katalog (cth. Sepatu, Kemeja, Polo)..."
            className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-24 text-xs text-zinc-900 placeholder-zinc-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover shadow-2xs transition-colors"
          >
            Cari
          </button>
        </form>

        {/* Categories Pill Filters */}
        <CategoryFilter
          categories={categories}
          activeCategoryId={currentCategory}
          onSelectCategory={handleCategorySelect}
        />
      </div>

      {/* Product Content List */}
      <div className="mt-8">
        {isLoading || isPending ? (
          <ProductSkeleton count={12} />
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/50 dark:bg-red-950/20">
            <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
            <h3 className="mt-3 text-sm font-semibold text-red-900 dark:text-red-200">
              Gagal Memuat Produk
            </h3>
            <p className="mt-1 text-xs text-red-600 dark:text-red-300">
              {error}
            </p>
            <button
              onClick={() => updateFilters({ page: currentPage })}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 shadow-2xs transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Coba Muat Ulang
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary dark:bg-primary-light dark:text-primary">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-bold text-zinc-900 dark:text-zinc-100">
              Produk Tidak Ditemukan
            </h3>
            <p className="mt-1.5 text-xs text-zinc-500 max-w-sm mx-auto dark:text-zinc-400">
              {currentSearch
                ? `Tidak ada produk yang cocok dengan kata kunci "${currentSearch}".`
                : "Belum ada produk untuk kategori yang dipilih saat ini."}
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover shadow-2xs transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Filter & Tampilkan Semua
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                hasPreviousPage={pagination.hasPreviousPage}
                hasNextPage={pagination.hasNextPage}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <ProductSkeleton count={12} />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
