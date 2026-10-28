"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Truck,
  ShoppingBag,
  Tag,
  ShieldCheck,
  Pause,
  Play,
} from "lucide-react";

interface PromoSlide {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  bgColor: string;
  badgeStyle: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight: string;
}

const PROMO_SLIDES: PromoSlide[] = [
  {
    id: "gajian-sale",
    tag: "PROMO SPESIAL 2026",
    title: "Mega Sale Gajian: Diskon Kilat Hingga 70%",
    subtitle:
      "Koleksi kemeja premium, celana denim original, dan t-shirt kasual dengan harga termurah.",
    ctaText: "Belanja Sekarang",
    ctaLink: "/products",
    bgColor: "bg-primary",
    badgeStyle: "bg-secondary text-white",
    icon: Sparkles,
    highlight: "HEMAT HINGGA 70%",
  },
  {
    id: "gratis-ongkir",
    tag: "BEBAS BIAYA KIRIM",
    title: "Gratis Ongkir ke Seluruh Wilayah Indonesia",
    subtitle:
      "Puas berbelanja tanpa khawatir ongkos kirim. Berlaku untuk seluruh pesanan tanpa minimum belanja.",
    ctaText: "Klaim Gratis Ongkir",
    ctaLink: "/products",
    bgColor: "bg-secondary",
    badgeStyle: "bg-white text-secondary font-bold",
    icon: Truck,
    highlight: "100% BEBAS ONGKIR",
  },
  {
    id: "sepatu-sneakers",
    tag: "KOLEKSI SEPATU ORIGINAL",
    title: "Sepatu Lari & Sneakers Sporty Pilihan Terbaik",
    subtitle:
      "Tingkatkan performa olahraga dan gaya kasual harianmu dengan sepatu berkualitas original.",
    ctaText: "Lihat Koleksi Sepatu",
    ctaLink: "/products?category_id=13",
    bgColor: "bg-[#18463b]",
    badgeStyle: "bg-emerald-500 text-white",
    icon: ShoppingBag,
    highlight: "ORIGINAL GUARANTEE",
  },
  {
    id: "fashion-pria-wanita",
    tag: "KEMEJA & JEANS TRENDING",
    title: "Upgrade Penampilan Harian Lebih Percaya Diri",
    subtitle:
      "Bahan katun 100% adem dan potongan pas badan yang nyaman untuk kerja maupun hangout.",
    ctaText: "Jelajahi Produk",
    ctaLink: "/products",
    bgColor: "bg-[#8b4513]",
    badgeStyle: "bg-amber-400 text-neutral-950 font-bold",
    icon: Tag,
    highlight: "KATUN 100% PREMIUM",
  },
];

export function PromoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const totalSlides = PROMO_SLIDES.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Auto-play timer (slides every 4.5 seconds)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      // Swiped left
      nextSlide();
    } else if (distance < -50) {
      // Swiped right
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const activeSlide = PROMO_SLIDES[currentIndex];
  const IconComponent = activeSlide.icon;

  return (
    <div
      className="relative w-full group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main Banner Slide Container */}
      <div
        className={`relative w-full min-h-[300px] sm:min-h-[340px] md:min-h-[380px] rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-14 overflow-hidden text-white flex flex-col justify-between transition-colors duration-500 shadow-md ${activeSlide.bgColor}`}
      >
        {/* Solid Decorative Accent Elements (Zero Gradients) */}
        <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-black/10 pointer-events-none" />

        {/* Top Slide Meta: Badge & Counter */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider shadow-xs">
            <span className={`px-2.5 py-0.5 rounded-full ${activeSlide.badgeStyle}`}>
              {activeSlide.tag}
            </span>
            <span className="hidden sm:inline text-white/80 text-[11px] font-semibold">
              FastShop Official
            </span>
          </div>

          {/* Tokopedia-style Slide Counter Pill */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-black/30 backdrop-none px-3 py-1 text-xs font-semibold text-white">
            <span>
              {currentIndex + 1} / {totalSlides}
            </span>
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              aria-label={isPaused ? "Lanjutkan otomatis" : "Jeda carousel"}
              className="hover:text-amber-300 transition-colors ml-0.5"
            >
              {isPaused ? (
                <Play className="h-3 w-3 fill-current" />
              ) : (
                <Pause className="h-3 w-3 fill-current" />
              )}
            </button>
          </div>
        </div>

        {/* Center Content: Headline & Subtitle */}
        <div className="relative z-10 my-4 max-w-2xl space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 rounded-md bg-white/10 px-2.5 py-1 text-xs font-bold text-white tracking-wide">
            <IconComponent className="h-4 w-4 shrink-0 text-amber-300" />
            <span>{activeSlide.highlight}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight sm:leading-tight">
            {activeSlide.title}
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-white/90 leading-relaxed max-w-xl">
            {activeSlide.subtitle}
          </p>
        </div>

        {/* Bottom Bar: Action Button & Trust Points */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3">
            <Link
              href={activeSlide.ctaLink}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-xs sm:text-sm font-bold text-neutral-900 shadow-sm hover:bg-neutral-100 transition-colors"
            >
              <span>{activeSlide.ctaText}</span>
              <ArrowRight className="h-4 w-4 text-primary" />
            </Link>
          </div>

          {/* Micro Trust Points (Desktop) */}
          <div className="hidden lg:flex items-center gap-5 text-xs text-white/90 font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              <span>100% Produk Original</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-amber-300" />
              <span>Pengiriman Cepat</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrow Buttons (Muncul hanya saat di-hover ke banner) */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Slide sebelumnya"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white text-neutral-800 shadow-md border border-neutral-200 hover:bg-neutral-100 hover:scale-105 active:scale-95 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Slide berikutnya"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white text-neutral-800 shadow-md border border-neutral-200 hover:bg-neutral-100 hover:scale-105 active:scale-95 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Pagination Indicators (Tokopedia style active pill expansion) */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {PROMO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={slide.id}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Buka slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                isActive
                  ? "w-8 bg-primary"
                  : "w-2 bg-neutral-300 hover:bg-neutral-400"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
