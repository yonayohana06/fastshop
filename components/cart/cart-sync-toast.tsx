"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { useCart } from "@/context/cart-context";

export function CartSyncToast() {
  const { syncError, dismissSyncError } = useCart();

  if (!syncError) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 sm:left-auto sm:right-6 sm:bottom-6 sm:w-full sm:max-w-sm">
      <div
        role="alert"
        className="flex items-start gap-3 rounded-xl border border-red-200 bg-white p-4 shadow-lg dark:border-red-900/60 dark:bg-zinc-900"
      >
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Keranjang belum tersinkron
          </p>
          <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-300">
            {syncError}
          </p>
        </div>
        <button
          type="button"
          onClick={dismissSyncError}
          aria-label="Tutup pesan kesalahan sinkronisasi"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
