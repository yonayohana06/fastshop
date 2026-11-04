import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/constants";
import { AppProvider } from "@/context/app-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FastShop - Belanja Cepat & Terpercaya",
    template: "%s | FastShop",
  },
  description:
    "Pusat belanja online pakaian, kemeja, jeans, dan sepatu original berkualitas tinggi dengan proses cepat dan aman.",
  keywords: [
    "fastshop",
    "toko online",
    "belanja online",
    "fashion pria",
    "fashion wanita",
    "kemeja",
    "jeans",
    "sepatu",
    "ecommerce indonesia",
  ],
  authors: [{ name: "FastShop Team" }],
  creator: "FastShop Indonesia",
  publisher: "PT FastShop Indonesia",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: "FastShop",
    title: "FastShop - Belanja Cepat & Terpercaya",
    description:
      "Pusat belanja online pakaian, kemeja, jeans, dan sepatu original berkualitas tinggi dengan proses cepat dan aman.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FastShop - Belanja Cepat & Terpercaya",
    description:
      "Pusat belanja online pakaian, kemeja, jeans, dan sepatu original berkualitas tinggi dengan proses cepat dan aman.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50/50 text-zinc-900">
        <AppProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
