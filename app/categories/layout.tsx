import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Direktori Kategori Belanja",
  description:
    "Temukan seluruh kategori produk busana pria, wanita, sepatu kasual, kemeja, dan pakaian terbaik di FastShop.",
  openGraph: {
    title: "Direktori Kategori Belanja | FastShop",
    description:
      "Temukan seluruh kategori produk busana pria, wanita, sepatu kasual, kemeja, dan pakaian terbaik di FastShop.",
  },
};

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
