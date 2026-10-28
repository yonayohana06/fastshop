"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

export function NavSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/products?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/products");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-center w-full max-w-md"
    >
      <div className="relative w-full flex items-center">
        <Search className="absolute left-3.5 h-4 w-4 text-zinc-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari pakaian, sepatu, celana..."
          className="w-full rounded-full border border-zinc-200 bg-zinc-50/80 py-2 pl-10 pr-9 text-sm text-zinc-900 placeholder-zinc-400 transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-primary dark:focus:ring-primary/20"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            aria-label="Bersihkan pencarian"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
  );
}
