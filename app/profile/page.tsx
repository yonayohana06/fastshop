"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  ShoppingCart,
  ShoppingBag,
  LogOut,
  ShieldCheck,
  Calendar,
  Mail,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { getMeApi } from "@/lib/api/auth";
import { User } from "@/types";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser, token, isAuthenticated, logout } = useAuth();
  const [profile, setProfile] = useState<User | null>(authUser);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/profile");
      return;
    }

    if (token) {
      getMeApi(token)
        .then((res) => {
          if (res.data) {
            setProfile(res.data);
          }
        })
        .catch((err) => {
          console.warn("Gagal memperbarui profil:", err);
        });
    }
  }, [isAuthenticated, token, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentUser = profile || authUser;
  const initials = currentUser?.name
    ? currentUser.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  const formattedDate = currentUser?.created_at
    ? new Date(currentUser.created_at).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "September 2026";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[{ label: "Akun Pengguna", href: "#" }, { label: "Profil Akun" }]}
      />

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Left Column: User Card */}
        <div className="md:col-span-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-black text-white shadow-xs">
            {initials}
          </div>

          <h1 className="mt-4 text-lg font-bold text-zinc-950 dark:text-white">
            {currentUser?.name || "Pengguna FastShop"}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            {currentUser?.email}
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary dark:bg-primary-light">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Akun Pelanggan Aktif</span>
          </div>

          <div className="mt-6 border-t border-zinc-100 pt-5 text-left text-xs text-zinc-600 dark:border-zinc-800 dark:text-zinc-400 space-y-2.5">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-zinc-400 shrink-0" />
              <span className="truncate">{currentUser?.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-zinc-400 shrink-0" />
              <span>Bergabung sejak {formattedDate}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50/70 py-2.5 px-4 text-xs font-semibold text-red-600 hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-400 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Keluar dari Akun</span>
          </button>
        </div>

        {/* Right Column: Quick Links & Summary */}
        <div className="md:col-span-7 flex flex-col gap-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-base font-bold text-zinc-950 dark:text-white">
              Menu &amp; Aktivitas Belanja
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Kelola pesanan, keranjang, dan aktivitas belanja Anda di FastShop
            </p>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link
                href="/orders"
                className="flex items-start gap-3 rounded-xl border border-zinc-200 p-4 hover:border-primary/50 hover:shadow-2xs dark:border-zinc-800 transition-all"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    Pesanan Saya
                  </h3>
                  <p className="mt-0.5 text-[11px] text-zinc-500">
                    Lihat status pengiriman &amp; unggah bukti bayar
                  </p>
                </div>
              </Link>

              <Link
                href="/cart"
                className="flex items-start gap-3 rounded-xl border border-zinc-200 p-4 hover:border-primary/50 hover:shadow-2xs dark:border-zinc-800 transition-all"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-white">
                  <ShoppingCart className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    Keranjang Belanja
                  </h3>
                  <p className="mt-0.5 text-[11px] text-zinc-500">
                    Kelola barang yang siap Anda beli
                  </p>
                </div>
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/50 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-950 dark:text-white">
                Siap untuk Belanja Lagi?
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Temukan rilisan produk baru dengan harga distributor terbaik
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover shadow-2xs transition-colors shrink-0"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Katalog</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
