import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  hasPreviousPage,
  hasNextPage,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const maxButtons = 5;
  let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  const end = Math.min(totalPages, start + maxButtons - 1);

  if (end - start + 1 < maxButtons) {
    start = Math.max(1, end - maxButtons + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <nav
      className="flex items-center justify-center gap-1.5 pt-8"
      aria-label="Paginasi Halaman"
    >
      {/* Previous Button */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPreviousPage}
        className="flex h-9 items-center justify-center gap-1 rounded-xl border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-700 transition-colors hover:border-primary/50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
        aria-label="Halaman Sebelumnya"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Sebelumnya</span>
      </button>

      {/* First Page if needed */}
      {start > 1 && (
        <>
          <button
            type="button"
            onClick={() => onPageChange(1)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:border-primary/50 hover:text-primary dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          >
            1
          </button>
          {start > 2 && <span className="px-1 text-zinc-400">...</span>}
        </>
      )}

      {/* Number Pages */}
      {pages.map((p) => {
        const isActive = p === currentPage;
        return (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            aria-current={isActive ? "page" : undefined}
            className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-semibold transition-all ${
              isActive
                ? "bg-primary text-white shadow-xs"
                : "border border-zinc-200 bg-white text-zinc-700 hover:border-primary/50 hover:text-primary dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
            }`}
          >
            {p}
          </button>
        );
      })}

      {/* Last Page if needed */}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && (
            <span className="px-1 text-zinc-400">...</span>
          )}
          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 hover:border-primary/50 hover:text-primary dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next Button */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className="flex h-9 items-center justify-center gap-1 rounded-xl border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-700 transition-colors hover:border-primary/50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
        aria-label="Halaman Berikutnya"
      >
        <span className="hidden sm:inline">Berikutnya</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
