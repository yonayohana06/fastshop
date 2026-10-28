"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  User as UserIcon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { registerApi, loginApi } from "@/lib/api/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      setError("Semua kolom formulir wajib diisi.");
      return;
    }

    if (password.length < 6) {
      setError("Kata sandi minimal harus terdiri dari 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok dengan kata sandi.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // 1. Call Register Endpoint
      await registerApi({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      setSuccessMessage("Pendaftaran berhasil! Mengarahkan ke toko...");

      // 2. Auto-login immediately after registration
      const loginRes = await loginApi({
        email: email.trim().toLowerCase(),
        password,
      });

      if (loginRes.data?.token && loginRes.data?.user) {
        login(loginRes.data.token, loginRes.data.user);
        setTimeout(() => {
          router.push("/");
        }, 800);
      } else {
        router.push("/login");
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Pendaftaran gagal. Pastikan email belum pernah terdaftar.";
      setError(msg);
      setSuccessMessage(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-zinc-200 bg-white p-8 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        {/* Brand & Heading */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-extrabold text-2xl tracking-tight text-zinc-950 dark:text-white"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-xs">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <span>
              Fast<span className="text-secondary">Shop</span>
            </span>
          </Link>
          <h1 className="mt-5 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Buat Akun Baru
          </h1>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Daftar untuk kemudahan berbelanja &amp; pelacakan riwayat pesanan Anda
          </p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="flex items-center gap-2.5 rounded-xl border border-primary/30 bg-primary-light p-3.5 text-xs font-semibold text-primary dark:border-primary/50 dark:bg-primary-light">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="reg-name"
              className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
            >
              Nama Lengkap
            </label>
            <div className="relative mt-1.5 flex items-center">
              <UserIcon className="absolute left-3.5 h-4 w-4 text-zinc-400 pointer-events-none" />
              <input
                id="reg-name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Anda"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 pl-10 pr-3.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-100"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="reg-email"
              className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
            >
              Alamat Email
            </label>
            <div className="relative mt-1.5 flex items-center">
              <Mail className="absolute left-3.5 h-4 w-4 text-zinc-400 pointer-events-none" />
              <input
                id="reg-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 pl-10 pr-3.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-100"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="reg-password"
              className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
            >
              Kata Sandi (Min. 6 Karakter)
            </label>
            <div className="relative mt-1.5 flex items-center">
              <Lock className="absolute left-3.5 h-4 w-4 text-zinc-400 pointer-events-none" />
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 pl-10 pr-10 text-xs text-zinc-900 placeholder-zinc-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="reg-confirm-password"
              className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
            >
              Konfirmasi Kata Sandi
            </label>
            <div className="relative mt-1.5 flex items-center">
              <Lock className="absolute left-3.5 h-4 w-4 text-zinc-400 pointer-events-none" />
              <input
                id="reg-confirm-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 pl-10 pr-3.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 px-4 text-xs font-bold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50 shadow-xs transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Mendaftarkan Akun...</span>
              </>
            ) : (
              <span>Daftar Akun Sekarang</span>
            )}
          </button>
        </form>

        {/* Footer switch to Login */}
        <div className="border-t border-zinc-100 pt-5 text-center dark:border-zinc-800">
          <p className="text-xs text-zinc-500">
            Sudah memiliki akun?{" "}
            <Link
              href="/login"
              className="font-bold text-primary hover:text-primary-hover transition-colors"
            >
              Masuk di Sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
