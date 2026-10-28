import { apiClient } from "./client";
import { Product, ApiResponse } from "@/types";

export interface GetProductsParams {
  search?: string;
  category_id?: number | string;
  page?: number;
  limit?: number;
}

export async function getProducts(
  params: GetProductsParams = {}
): Promise<ApiResponse<Product[]>> {
  return apiClient<Product[]>("products", {
    method: "GET",
    params: {
      search: params.search,
      category_id: params.category_id,
      page: params.page || 1,
      limit: params.limit || 12,
    },
    cache: "no-store",
  });
}

export async function getProductById(
  id: string | number
): Promise<ApiResponse<Product>> {
  return apiClient<Product>(`products/${id}`, {
    method: "GET",
    cache: "no-store",
  });
}
