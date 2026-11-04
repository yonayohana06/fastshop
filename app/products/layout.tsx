import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Katalog Produk Pilihan",
  description:
    "Jelajahi koleksi busana, kemeja, jeans, dan sepatu original berkualitas terbaik dengan harga terjangkau di FastShop.",
  openGraph: {
    title: "Katalog Produk Pilihan | FastShop",
    description:
      "Jelajahi koleksi busana, kemeja, jeans, dan sepatu original berkualitas terbaik dengan harga terjangkau di FastShop.",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
