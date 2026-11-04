import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Star, ArrowLeft, AlertCircle, Package } from "lucide-react";
import { Product } from "@/types";
import { getProductById, getProducts } from "@/lib/api/products";
import { SITE_URL } from "@/lib/constants";
import { parseProductId, slugify } from "@/lib/utils";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ProductPurchaseBox } from "@/components/products/product-purchase-box";
import { ProductCard } from "@/components/products/product-card";
import { ProductImageGallery } from "@/components/products/product-image-gallery";
import { ProductDetailsTabs } from "@/components/products/product-details-tabs";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id: rawId } = await params;
  const id = parseProductId(rawId);

  try {
    const res = await getProductById(id);
    const product = res.data;

    if (!product) {
      return {
        title: "Produk Tidak Ditemukan | FastShop",
        description: "Produk yang Anda cari tidak ditemukan di katalog FastShop.",
      };
    }

    const title = `${product.name} | Beli Online di FastShop`;
    const cleanDesc = product.description
      ? product.description.replace(/\s+/g, " ").trim().slice(0, 160)
      : `Beli ${product.name} original dengan harga terbaik dan pengiriman cepat hanya di FastShop.`;
    const productSlug = product.name ? `-${slugify(product.name)}` : "";
    const productUrl = `${SITE_URL}/products/${product.id}${productSlug}`;
    const imageUrl = product.image_url || `${SITE_URL}/icons/icon-512x512.png`;

    const categoryName = product.category_name || "Fashion";
    const keywords = [
      product.name,
      categoryName,
      "FastShop",
      "original",
      "beli online",
      "fashion pria",
      "fashion wanita",
      "belanja murah",
    ];

    return {
      title,
      description: cleanDesc,
      keywords,
      alternates: {
        canonical: productUrl,
      },
      openGraph: {
        title: product.name,
        description: cleanDesc,
        url: productUrl,
        siteName: "FastShop",
        type: "website",
        images: [
          {
            url: imageUrl,
            width: 800,
            height: 800,
            alt: `Foto produk ${product.name}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.name} | FastShop`,
        description: cleanDesc,
        images: [imageUrl],
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch {
    return {
      title: "Detail Produk | FastShop",
      description: "Lihat rincian produk fashion pilihan berkualitas di FastShop.",
    };
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id: rawId } = await params;
  const id = parseProductId(rawId);

  let product: Product | null = null;
  let relatedProducts: Product[] = [];
  let error: string | null = null;

  try {
    const res = await getProductById(id);
    product = res.data;

    if (product && product.category_id) {
      try {
        const relatedRes = await getProducts({
          category_id: product.category_id,
          limit: 5,
        });
        const currentProductId = product.id;
        relatedProducts = (relatedRes.data || [])
          .filter((p) => String(p.id) !== String(currentProductId))
          .slice(0, 4);
      } catch {
        relatedProducts = [];
      }
    }
  } catch (err: unknown) {
    error = err instanceof Error ? err.message : "Gagal memuat detail produk";
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-zinc-950 dark:text-white">
          Produk Tidak Ditemukan
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
          {error ||
            "Produk yang Anda cari mungkin telah dihapus, stok kosong, atau alamat tautan tidak sesuai."}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-white hover:bg-primary-hover shadow-xs transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Katalog</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          >
            Beranda
          </Link>
        </div>
      </div>
    );
  }

  const breadcrumbs = [
    { label: "Semua Produk", href: "/products" },
    ...(product.category_name
      ? [
          {
            label: product.category_name,
            href: `/products?category_id=${product.category_id}`,
          },
        ]
      : []),
    { label: product.name },
  ];

  const productSlug = product.name ? `-${slugify(product.name)}` : "";
  const productUrl = `${SITE_URL}/products/${product.id}${productSlug}`;
  const cleanDescription = product.description
    ? product.description.replace(/\s+/g, " ").trim().slice(0, 200)
    : `Beli ${product.name} di FastShop.`;

  // JSON-LD Schemas for Rich Results
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image_url ? [product.image_url] : [],
    description: cleanDescription,
    sku: `FASTSHOP-PROD-${product.id}`,
    mpn: `MPN-${product.id}`,
    brand: {
      "@type": "Brand",
      name: "FastShop",
    },
    category: product.category_name || "Fashion",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "150",
      bestRating: "5",
      worstRating: "1",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "IDR",
      price: typeof product.price === "string" ? parseFloat(product.price) || product.price : product.price,
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: productUrl,
      seller: {
        "@type": "Organization",
        name: "PT FastShop Indonesia",
      },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Beranda",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Semua Produk",
        item: `${SITE_URL}/products`,
      },
      ...(product.category_name
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: product.category_name,
              item: `${SITE_URL}/products?category_id=${product.category_id}`,
            },
            {
              "@type": "ListItem",
              position: 4,
              name: product.name,
              item: productUrl,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 3,
              name: product.name,
              item: productUrl,
            },
          ]),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Main Product Layout */}
        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
          {/* Left Column: Image Gallery & Highlights */}
          <div className="lg:col-span-5">
            <ProductImageGallery product={product} />
          </div>

          {/* Right Column: Information & Purchase Controls */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div>
              {/* Category Tag */}
              {product.category_name && (
                <Link
                  href={`/products?category_id=${product.category_id}`}
                  className="inline-block rounded-md bg-primary-light px-2.5 py-0.5 text-xs font-semibold text-primary hover:bg-primary/20 dark:bg-primary-light dark:text-primary transition-colors"
                >
                  {product.category_name}
                </Link>
              )}

              {/* Product Title (Single H1) */}
              <h1 className="mt-2.5 text-2xl font-black tracking-tight text-zinc-950 sm:text-3xl dark:text-white">
                {product.name}
              </h1>

              {/* Social Proof */}
              <div className="mt-3 flex items-center gap-3 text-xs text-zinc-500">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span>4.9</span>
                </div>
                <span className="text-zinc-300 dark:text-zinc-700">&bull;</span>
                <span>Terjual 150+ produk</span>
                <span className="text-zinc-300 dark:text-zinc-700">&bull;</span>
                <span className="text-primary font-medium">Original FastShop</span>
              </div>
            </div>

            {/* Interactive Purchase Box Component */}
            <ProductPurchaseBox product={product} />
          </div>
        </div>

        {/* Description & Specification Tabs */}
        <ProductDetailsTabs product={product} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 border-t border-zinc-200 pt-10 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold text-zinc-950 dark:text-white">
                  Produk Terkait Lainnya
                </h2>
              </div>
              {product.category_id && (
                <Link
                  href={`/products?category_id=${product.category_id}`}
                  className="text-xs font-semibold text-primary hover:text-primary-hover"
                >
                  Lihat Kategori Ini &rarr;
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
