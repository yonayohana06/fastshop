"use client";

import React from "react";
import { Category } from "@/types";

interface CategoryFilterProps {
  categories: Category[];
  activeCategoryId: string | number | null;
  onSelectCategory: (id: string | number | null) => void;
}

export function CategoryFilter({
  categories,
  activeCategoryId,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none sm:flex-wrap">
      {/* "Semua" Pill */}
      <button
        type="button"
        onClick={() => onSelectCategory(null)}
        className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
          activeCategoryId === null || activeCategoryId === ""
            ? "bg-primary text-white shadow-xs"
            : "border border-zinc-200 bg-white text-zinc-700 hover:border-primary/50 hover:text-primary dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:text-white"
        }`}
      >
        Semua Kategori
      </button>

      {/* Category List */}
      {categories.map((cat) => {
        const isActive = String(activeCategoryId) === String(cat.id);
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`shrink-0 flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
              isActive
                ? "bg-primary text-white shadow-xs"
                : "border border-zinc-200 bg-white text-zinc-700 hover:border-primary/50 hover:text-primary dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:text-white"
            }`}
          >
            <span>{cat.name}</span>
            {typeof cat.product_count === "number" && (
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                }`}
              >
                {cat.product_count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
