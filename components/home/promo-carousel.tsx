"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

export interface BannerSlide {
  id: string;
  title: string;
  imageUrl: string;
  altText: string;
  targetUrl: string;
  badge?: string;
  badgeColor?: string;
}

export const BANNER_SLIDES: BannerSlide[] = [
  {
    id: "gajian-mega-sale",
    title: "Mega Sale Gajian FastShop Diskon Hingga 70%",
    imageUrl: "/images/banners/banner-fashion-wanita.webp",
    altText: "Promo Spesial Gajian Fashion FastShop",
    targetUrl: "/products",
    badge: "Diskon 70%",
    badgeColor: "bg-secondary text-white",
  },
  {
    id: "bebas-ongkir",
    title: "Bebas Biaya Kirim ke Seluruh Wilayah Indonesia",
    imageUrl: "/images/banners/banner-gratis-ongkir.webp",
    altText: "Bebas Ongkir Seluruh Indonesia Tanpa Minimum Belanja",
    targetUrl: "/products",
    badge: "Gratis Ongkir",
    badgeColor: "bg-primary text-white",
  },
  {
    id: "sneakers-running",
    title: "Koleksi Sepatu Lari & Sneakers Sporty Original",
    imageUrl: "/images/banners/banner-sepatu-sneakers.webp",
    altText: "Koleksi Sepatu Sneakers Sporty Original",
    targetUrl: "/products?category=sepatu",
    badge: "Original 100%",
    badgeColor: "bg-secondary text-white",
  },
  {
    id: "fashion-casual-pria",
    title: "Kemeja Kasual & Celana Denim Pilihan Terbaik",
    imageUrl: "/images/banners/banner-fashion-pria.webp",
    altText: "Upgrade Penampilan Fashion Pria & Wanita",
    targetUrl: "/products?category=kemeja",
    badge: "Trending 2026",
    badgeColor: "bg-primary text-white",
  },
];

interface PromoCarouselProps {
  slides?: BannerSlide[];
}

export function PromoCarousel({ slides = BANNER_SLIDES }: PromoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    if (totalSlides === 0) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides === 0) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Autoplay timer (5 seconds interval when unpaused)
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide, totalSlides]);

  // Touch handlers for mobile swipe gesture
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setIsSwiping(false);
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
    touchStartTime.current = Date.now();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
    if (touchStartX.current !== null && touchEndX.current !== null) {
      if (Math.abs(touchStartX.current - touchEndX.current) > 10) {
        setIsSwiping(true);
      }
    }
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (touchStartX.current === null || touchEndX.current === null) {
      touchStartX.current = null;
      touchEndX.current = null;
      setTimeout(() => setIsSwiping(false), 50);
      return;
    }

    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
    setTimeout(() => setIsSwiping(false), 50);
  };

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <div
      className="relative w-full group select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main Viewport Container */}
      <div className="relative w-full overflow-hidden sm:rounded-2xl border-y sm:border border-zinc-200/90 dark:border-zinc-800 bg-zinc-950 sm:shadow-sm">
        {/* Horizontal Sliding Track */}
        <div
          className="flex w-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className="relative w-full shrink-0 flex-none aspect-2/1 sm:aspect-21/9 md:aspect-24/9 lg:aspect-3/1 overflow-hidden bg-zinc-900"
            >
              <Link
                href={slide.targetUrl}
                onClick={(e) => {
                  if (isSwiping) {
                    e.preventDefault();
                  }
                }}
                className="block relative w-full h-full cursor-pointer focus:outline-hidden"
                tabIndex={index === currentIndex ? 0 : -1}
                aria-label={slide.title}
              >
                <Image
                  src={slide.imageUrl}
                  alt={slide.altText}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1280px"
                  className="object-cover transition-transform duration-700 ease-out hover:scale-102"
                />

                {/* Subtle Bottom Shade for Title Readability (Solid black opacity) */}
                <div className="absolute inset-x-0 bottom-0 h-16 sm:h-20 bg-black/40 flex items-end p-3 sm:p-5 pointer-events-none">
                  <p className="text-white text-xs sm:text-sm md:text-base font-bold tracking-tight truncate drop-shadow-xs">
                    {slide.title}
                  </p>
                </div>

                {/* Solid Campaign Badge */}
                {slide.badge && (
                  <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-10">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-md ${
                        slide.badgeColor || "bg-primary text-white"
                      }`}
                    >
                      {slide.badge}
                    </span>
                  </div>
                )}
              </Link>
            </div>
          ))}
        </div>

        {/* Circular Prev/Next Arrow Buttons (Desktop Hover) */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            prevSlide();
          }}
          aria-label="Slide sebelumnya"
          className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-white text-zinc-900 shadow-md border border-zinc-200/80 hover:bg-zinc-100 hover:scale-105 active:scale-95 opacity-0 group-hover:opacity-100 transition-all duration-200 focus:opacity-100 focus:outline-hidden"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            nextSlide();
          }}
          aria-label="Slide berikutnya"
          className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-white text-zinc-900 shadow-md border border-zinc-200/80 hover:bg-zinc-100 hover:scale-105 active:scale-95 opacity-0 group-hover:opacity-100 transition-all duration-200 focus:opacity-100 focus:outline-hidden"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Floating Slide Counter Pill (Top-Right on Mobile & Desktop) */}
        <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[10px] sm:text-xs font-semibold text-white backdrop-blur-xs">
          <span>
            {currentIndex + 1} / {totalSlides}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setIsPaused((prev) => !prev);
            }}
            aria-label={isPaused ? "Lanjutkan putar otomatis" : "Jeda putar otomatis"}
            className="p-0.5 rounded-full hover:bg-white/20 transition-colors"
          >
            {isPaused ? (
              <Play className="h-2.5 w-2.5 fill-current" />
            ) : (
              <Pause className="h-2.5 w-2.5 fill-current" />
            )}
          </button>
        </div>
      </div>

      {/* Pagination Indicators (Tokopedia style active pill expansion) */}
      <div className="mt-3 sm:mt-4 flex items-center justify-center gap-1.5">
        {slides.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Buka slide ${idx + 1}`}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 focus:outline-hidden ${
                isActive
                  ? "w-6 sm:w-8 bg-primary"
                  : "w-1.5 sm:w-2 bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-700"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
