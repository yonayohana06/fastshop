import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/api/products";
import { SITE_URL } from "@/lib/constants";
import { slugify } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL.replace(/\/+$/, "");

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  let productRoutes: MetadataRoute.Sitemap = [];

  try {
    const res = await getProducts({ limit: 1000, revalidate: 3600 });
    const products = res.data || [];

    productRoutes = products.map((product) => {
      const slug = product.name ? `-${slugify(product.name)}` : "";
      return {
        url: `${baseUrl}/products/${product.id}${slug}`,
        lastModified: product.updated_at
          ? new Date(product.updated_at)
          : product.created_at
            ? new Date(product.created_at)
            : new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      };
    });
  } catch {
    productRoutes = [];
  }

  return [...staticRoutes, ...productRoutes];
}
