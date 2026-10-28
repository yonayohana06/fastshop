"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { X, ShoppingBag, Package, LogIn, UserPlus } from "lucide-react";
import { NAV_LINKS, FEATURED_CATEGORIES } from "@/lib/constants";
import { useAuth } from "@/context/auth-context";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Drawer */}
      <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white dark:bg-zinc-950 p-6 shadow-xl flex flex-col justify-between overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-zinc-100 dark:border-zinc-800">
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center gap-2 font-bold text-lg text-zinc-900 dark:text-white"
            >
              <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <span>Fast<span className="text-indigo-600">Shop</span></span>
            </Link>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="Tutup menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User info if authenticated */}
          {isAuthenticated && user && (
            <div className="mt-4 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-sm">
                {user.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-zinc-500 truncate">{user.email}</p>
              </div>
            </div>
          )}

          {/* Main Navigation Links */}
          <nav className="mt-6 flex flex-col gap-1">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Menu Utama
            </p>
            {NAV_LINKS.map((link) => {
              if (link.requiresAuth && !isAuthenticated) return null;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900 transition-colors"
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Categories Quick Links */}
          <div className="mt-6 border-t border-zinc-100 dark:border-zinc-800 pt-5">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Kategori Populer
            </p>
            <div className="mt-2 flex flex-col gap-1">
              {FEATURED_CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/products?category=${cat.slug}`}
                  onClick={onClose}
                  className="rounded-lg px-3 py-2 text-xs text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions inside mobile menu */}
        <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 mt-6">
          {isAuthenticated ? (
            <div className="flex flex-col gap-2">
              <Link
                href="/orders"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-sm font-medium text-zinc-800 dark:text-zinc-200"
              >
                <Package className="h-4 w-4" />
                Pesanan Saya
              </Link>
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full py-2 px-4 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 text-center"
              >
                Keluar dari Akun
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              <Link
                href="/login"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50"
              >
                <LogIn className="h-4 w-4" />
                Masuk
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 shadow-sm"
              >
                <UserPlus className="h-4 w-4" />
                Daftar Akun
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
