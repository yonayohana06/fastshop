import React from "react";

interface ProductSkeletonProps {
  count?: number;
}

export function ProductSkeleton({ count = 8 }: ProductSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col rounded-2xl border border-zinc-200/80 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900 animate-pulse"
        >
          {/* Image Skeleton */}
          <div className="aspect-square w-full rounded-xl bg-zinc-200 dark:bg-zinc-800" />

          {/* Category Tag */}
          <div className="mt-3.5 h-4 w-20 rounded-md bg-zinc-200 dark:bg-zinc-800" />

          {/* Title */}
          <div className="mt-2.5 space-y-1.5">
            <div className="h-4 w-full rounded-md bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-3/4 rounded-md bg-zinc-200 dark:bg-zinc-800" />
          </div>

          {/* Price & Action */}
          <div className="mt-4 flex items-center justify-between pt-2">
            <div className="h-5 w-24 rounded-md bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-8 w-8 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
