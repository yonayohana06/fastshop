"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingBag, ShoppingCart, Menu } from "lucide-react";
import { NavSearch } from "./nav-search";
import { NavUserMenu } from "./nav-user-menu";
import { MobileMenu } from "./mobile-menu";
import { useCart } from "@/context/cart-context";
import { NAV_LINKS } from "@/lib/constants";
import { useAuth } from "@/context/auth-context";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { isAuthenticated } = useAuth();

  return (
    <>
      {/* Top Banner */}
      <div className="bg-indigo-600 px-4 py-1.5 text-center text-xs font-medium text-white tracking-wide">
        ⚡ Belanja Cepat & Aman di FastShop | Gratis Ongkir untuk Pesanan Pertama!
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/90 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Left: Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 lg:hidden"
              aria-label="Buka menu navigasi"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link
              href="/"
              className="flex items-center gap-2.5 font-extrabold text-xl tracking-tight text-zinc-950 dark:text-white group"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-500 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <span>
                Fast<span className="text-indigo-600 dark:text-indigo-400">Shop</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {NAV_LINKS.map((link) => {
              if (link.requiresAuth && !isAuthenticated) return null;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Center: Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-2">
            <NavSearch />
          </div>

          {/* Right: Actions (Cart & User Menu) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cart Button */}
            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-zinc-700 hover:bg-zinc-100 hover:text-indigo-600 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white transition-colors"
              aria-label={`Keranjang belanja (${totalItems} item)`}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-indigo-600 px-1 text-[11px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-zinc-950 animate-in zoom-in-50 duration-200">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>

            {/* User Session Menu */}
            <div className="border-l border-zinc-200 dark:border-zinc-800 pl-2 sm:pl-3">
              <NavUserMenu />
            </div>
          </div>
        </div>

        {/* Mobile Search Input Row below header on smaller screens */}
        <div className="flex md:hidden border-t border-zinc-100 dark:border-zinc-800/60 px-4 py-2.5">
          <NavSearch />
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
