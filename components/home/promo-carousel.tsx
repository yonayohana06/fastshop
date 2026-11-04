"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
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
  imageUrl: string;
  imageAlt: string;
  floatingTag: string;
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
    imageUrl:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80",
    imageAlt: "Koleksi busana kasual fashion FastShop",
    floatingTag: "Diskon 70%",
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
    imageUrl:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80",
    imageAlt: "Katalog belanja busana siap kirim",
    floatingTag: "Tanpa Min. Belanja",
  },
  {
    id: "sepatu-sneakers",
    tag: "KOLEKSI SEPATU ORIGINAL",
    title: "Sepatu Lari & Sneakers Sporty Pilihan Terbaik",
    subtitle:
      "Tingkatkan performa olahraga dan gaya kasual harianmu dengan sepatu berkualitas original.",
    ctaText: "Lihat Koleksi Sepatu",
    ctaLink: "/products?category=sepatu",
    bgColor: "bg-primary",
    badgeStyle: "bg-secondary text-white font-bold",
    icon: ShoppingBag,
    highlight: "ORIGINAL GUARANTEE",
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    imageAlt: "Sepatu sneakers sporty original FastShop",
    floatingTag: "100% Original",
  },
  {
    id: "fashion-pria-wanita",
    tag: "KEMEJA & JEANS TRENDING",
    title: "Upgrade Penampilan Harian Lebih Percaya Diri",
    subtitle:
      "Bahan katun 100% adem dan potongan pas badan yang nyaman untuk kerja maupun hangout.",
    ctaText: "Jelajahi Produk",
    ctaLink: "/products",
    bgColor: "bg-secondary",
    badgeStyle: "bg-white text-secondary font-bold",
    icon: Tag,
    highlight: "KATUN 100% PREMIUM",
    imageUrl:
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&auto=format&fit=crop&q=80",
    imageAlt: "Kemeja kerja dan casual wear premium FastShop",
    floatingTag: "Kualitas Teruji",
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

  // Auto-play timer (slides every 5 seconds when unpaused)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
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
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
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
        className={`relative w-full rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 overflow-hidden text-white transition-colors duration-500 shadow-md ${activeSlide.bgColor}`}
      >
        {/* Solid Decorative Accent Elements (Zero Gradients) */}
        <div className="absolute -top-12 -right-12 h-56 w-56 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-black/10 pointer-events-none" />

        {/* Top Slide Meta: Badge & Counter */}
        <div className="relative z-10 flex items-center justify-between pb-4 sm:pb-6">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-xs">
            <span className={`px-2.5 py-0.5 rounded-full ${activeSlide.badgeStyle}`}>
              {activeSlide.tag}
            </span>
            <span className="hidden sm:inline text-white/80 text-[11px] font-semibold">
              FastShop Official
            </span>
          </div>

          {/* Slide Counter Pill & Pause Toggle */}
          <div className="inline-flex items-center gap-2 rounded-full bg-black/30 px-3 py-1 text-xs font-semibold text-white">
            <span>
              {currentIndex + 1} / {totalSlides}
            </span>
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              aria-label={isPaused ? "Lanjutkan otomatis" : "Jeda carousel"}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              {isPaused ? (
                <Play className="h-3 w-3 fill-current" />
              ) : (
                <Pause className="h-3 w-3 fill-current" />
              )}
            </button>
          </div>
        </div>

        {/* Split Content: Copywriting on Left, Lookbook Imagery on Right */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
          {/* Left Column: Headline, Subtitle, CTA */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-md bg-white/15 px-2.5 py-1 text-xs font-bold text-white tracking-wide">
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

            {/* CTA & Trust Points */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href={activeSlide.ctaLink}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 sm:px-6 py-3 text-xs sm:text-sm font-bold text-zinc-900 shadow-sm hover:bg-zinc-100 transition-colors"
              >
                <span>{activeSlide.ctaText}</span>
                <ArrowRight className="h-4 w-4 text-primary" />
              </Link>

              <div className="hidden lg:flex items-center gap-4 text-xs text-white/90 font-medium">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-300" />
                  <span>100% Produk Asli</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-amber-300" />
                  <span>Kirim Se-Indonesia</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Lookbook Apparel Merchandising Image */}
          <div className="md:col-span-5 relative w-full aspect-16/10 sm:aspect-4/3 md:aspect-4/5 max-h-65 md:max-h-85 rounded-2xl overflow-hidden border border-white/20 shadow-lg bg-black/20">
            <Image
              src={activeSlide.imageUrl}
              alt={activeSlide.imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
              priority={currentIndex === 0}
            />

            {/* Solid Floating Tag */}
            <div className="absolute top-3 right-3 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-zinc-900 shadow-md">
              <span>{activeSlide.floatingTag}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrow Buttons (Desktop Hover Only, Touch Mobile Uses Swipe & Dots) */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Slide sebelumnya"
        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full bg-white text-zinc-900 shadow-md border border-zinc-200 hover:bg-zinc-100 hover:scale-105 active:scale-95 opacity-0 group-hover:opacity-100 transition-all duration-200"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Slide berikutnya"
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full bg-white text-zinc-900 shadow-md border border-zinc-200 hover:bg-zinc-100 hover:scale-105 active:scale-95 opacity-0 group-hover:opacity-100 transition-all duration-200"
      >
        <ChevronRight className="h-6 w-6" />
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
              className={`h-2 rounded-full transition-all duration-300 ${isActive
                  ? "w-8 bg-primary"
                  : "w-2 bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-700"
                }`}
            />
          );
        })}
      </div>
    </div>
  );
}
