import React from "react";
import Link from "next/link";
import { ShoppingBag, Mail, Phone, MapPin } from "lucide-react";
import { FEATURED_CATEGORIES } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Info */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-2.5 font-extrabold text-xl tracking-tight text-zinc-950 dark:text-white"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <span>
                Fast<span className="text-indigo-600 dark:text-indigo-400">Shop</span>
              </span>
            </Link>
            <p className="mt-4 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              Platform e-commerce terpercaya untuk kebutuhan fashion, sepatu, kemeja,
              dan busana pria & wanita dengan pengalaman belanja yang cepat, aman, dan mudah.
            </p>
            <div className="mt-4 flex flex-col gap-2 text-xs text-zinc-500">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-indigo-600" />
                <span>Yogyakarta, Indonesia</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-indigo-600" />
                <span>support@fastshop.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-indigo-600" />
                <span>+62 812-3456-7890</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
              Kategori Pilihan
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              {FEATURED_CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className="hover:text-indigo-600 dark:hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service & Help */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
              Pusat Bantuan
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link
                  href="/orders"
                  className="hover:text-indigo-600 dark:hover:text-white transition-colors"
                >
                  Cek Status Pesanan
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="hover:text-indigo-600 dark:hover:text-white transition-colors"
                >
                  Keranjang Belanja
                </Link>
              </li>
              <li>
                <span className="cursor-default text-zinc-400">
                  Konfirmasi Pembayaran
                </span>
              </li>
              <li>
                <span className="cursor-default text-zinc-400">
                  Panduan Pengiriman
                </span>
              </li>
              <li>
                <span className="cursor-default text-zinc-400">
                  Syarat & Ketentuan
                </span>
              </li>
            </ul>
          </div>

          {/* Payment & Trust */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
              Metode Pembayaran
            </h3>
            <p className="mt-4 text-xs text-zinc-500 leading-relaxed">
              Kami mendukung pembayaran transfer bank & dompet digital dengan verifikasi bukti bayar manual maupun otomatis:
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                BCA
              </span>
              <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                Mandiri
              </span>
              <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                BNI
              </span>
              <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                BRI
              </span>
              <span className="rounded-md border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-400">
                QRIS
              </span>
            </div>
            <p className="mt-4 text-[11px] text-zinc-400">
              Transaksi aman terenkripsi & data Anda terjaga dengan baik.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} FastShop E-Commerce. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-zinc-500">
            <span className="hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer">
              Kebijakan Privasi
            </span>
            <span className="hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer">
              Ketentuan Layanan
            </span>
            <span className="hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer">
              Keamanan Akun
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
