export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export const STORAGE_KEYS = {
  TOKEN: "fastshop_token",
  USER: "fastshop_user",
  CART: "fastshop_cart_local",
  THEME: "fastshop_theme",
} as const;

export interface NavLinkItem {
  label: string;
  href: string;
  requiresAuth?: boolean;
}

export const NAV_LINKS: readonly NavLinkItem[] = [
  { label: "Beranda", href: "/" },
  { label: "Semua Produk", href: "/products" },
  { label: "Kategori", href: "/categories" },
  { label: "Pesanan Saya", href: "/orders", requiresAuth: true },
] as const;

export const FEATURED_CATEGORIES = [
  { name: "Fashion Pria", slug: "fashion-pria", icon: "Shirt" },
  { name: "Fashion Wanita", slug: "fashion-wanita", icon: "Sparkles" },
  { name: "Sepatu", slug: "sepatu", icon: "Footprints" },
  { name: "Kemeja", slug: "kemeja", icon: "Check" },
  { name: "Jeans", slug: "jeans", icon: "Tag" },
  { name: "T-Shirt", slug: "t-shirt", icon: "ShoppingBag" },
] as const;
