import Link from "next/link";
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import { TrustBadges } from "@/components/layout/trust-badges";
import { FEATURED_CATEGORIES } from "@/lib/constants";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-white to-zinc-50/50 py-16 sm:py-24 dark:from-primary/15 dark:via-zinc-950 dark:to-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary shadow-xs dark:border-primary/30 dark:bg-primary/10">
              <Sparkles className="h-3.5 w-3.5 text-secondary" />
              <span>Koleksi Original & Tren Terbaru 2026</span>
            </div>

            {/* Headline */}
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl dark:text-white">
              Belanja Cepat, Tampil{" "}
              <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                Lebih Percaya Diri
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
              Temukan pakaian pria & wanita pilihan, kemeja formal premium,
              celana jeans klasik, hingga sepatu running sporty dengan jaminan kualitas terbaik.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Link
                href="/products"
                className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-primary/25 hover:bg-primary-hover hover:shadow-lg transition-all"
              >
                <ShoppingBag className="h-4 w-4" />
                Mulai Belanja Sekarang
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/categories"
                className="flex items-center justify-center w-full sm:w-auto rounded-xl border border-zinc-200 bg-white px-6 py-3.5 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800/80 transition-colors"
              >
                Lihat Semua Kategori
              </Link>
            </div>
          </div>

          {/* Quick Categories Preview Grid */}
          <div className="mt-16 sm:mt-20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  Kategori Unggulan
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Pilih kategori favorit untuk langsung melihat koleksi produk
                </p>
              </div>
              <Link
                href="/categories"
                className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1"
              >
                Lihat Semua <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {FEATURED_CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/products?category=${cat.slug}`}
                  className="group flex flex-col items-center justify-center rounded-2xl border border-zinc-200/80 bg-white p-5 text-center shadow-xs transition-all hover:border-primary/40 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-primary/50"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all dark:bg-primary/20">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <span className="mt-3 text-xs font-semibold text-zinc-800 group-hover:text-primary dark:text-zinc-200">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Guarantee Banner */}
      <TrustBadges />
    </div>
  );
}
