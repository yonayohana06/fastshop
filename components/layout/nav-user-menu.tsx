"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User as UserIcon, LogOut, Package, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export function NavUserMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="text-sm font-medium text-zinc-700 hover:text-primary dark:text-zinc-300 dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          Masuk
        </Link>
        <Link
          href="/register"
          className="text-sm font-medium text-white bg-primary hover:bg-primary-hover px-3.5 py-1.5 rounded-lg shadow-sm transition-all hover:shadow"
        >
          Daftar
        </Link>
      </div>
    );
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full p-1 pr-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none"
        aria-expanded={isOpen}
      >
        <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-medium text-xs shadow-sm">
          {initials}
        </div>
        <span className="hidden lg:inline-block text-xs font-medium text-zinc-800 dark:text-zinc-200 max-w-[120px] truncate">
          {user.name}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-zinc-200 bg-white py-1.5 shadow-lg shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/50 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800">
            <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
              {user.name}
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
              {user.email}
            </p>
          </div>

          <div className="py-1">
            <Link
              href="/orders"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/60"
            >
              <Package className="h-4 w-4 text-zinc-500" />
              Pesanan Saya
            </Link>
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/60"
            >
              <UserIcon className="h-4 w-4 text-zinc-500" />
              Profil Akun
            </Link>
          </div>

          <div className="border-t border-zinc-100 dark:border-zinc-800 pt-1">
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 text-left"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
