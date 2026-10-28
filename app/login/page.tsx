"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShoppingBag,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { loginApi } from "@/lib/api/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, redirectUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Silakan masukkan email dan kata sandi Anda.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const res = await loginApi({ email, password });
      if (res.data?.token && res.data?.user) {
        login(res.data.token, res.data.user);
        router.push(redirectUrl);
      } else {
        throw new Error("Respon data login tidak lengkap.");
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Email atau kata sandi tidak sesuai.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail("agussumanto@example.com");
    setPassword("password123");
    setError(null);
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
            Masuk ke Akun Anda
          </h1>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Masuk untuk melanjutkan proses belanja &amp; melihat status pesanan
          </p>
        </div>

        {/* Demo Account Helper Button */}
        <div className="rounded-xl border border-primary/20 bg-primary-light p-3.5 text-center dark:border-primary/40 dark:bg-primary-light">
          <p className="text-xs font-semibold text-primary">
            Ingin mencoba fitur dengan cepat?
          </p>
          <button
            type="button"
            onClick={handleFillDemo}
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-primary-hover shadow-2xs transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-secondary" />
            <span>Gunakan Akun Demo (1-Klik)</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
            >
              Alamat Email
            </label>
            <div className="relative mt-1.5 flex items-center">
              <Mail className="absolute left-3.5 h-4 w-4 text-zinc-400 pointer-events-none" />
              <input
                id="email"
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
              htmlFor="password"
              className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
            >
              Kata Sandi
            </label>
            <div className="relative mt-1.5 flex items-center">
              <Lock className="absolute left-3.5 h-4 w-4 text-zinc-400 pointer-events-none" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
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

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 px-4 text-xs font-bold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50 shadow-xs transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Memproses Masuk...</span>
              </>
            ) : (
              <span>Masuk Sekarang</span>
            )}
          </button>
        </form>

        {/* Footer switch to Register */}
        <div className="border-t border-zinc-100 pt-5 text-center dark:border-zinc-800">
          <p className="text-xs text-zinc-500">
            Belum memiliki akun?{" "}
            <Link
              href="/register"
              className="font-bold text-primary hover:text-primary-hover transition-colors"
            >
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-140px)] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
