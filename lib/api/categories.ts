import { apiClient } from "./client";
import { Category, ApiResponse } from "@/types";

export interface GetCategoriesParams {
  search?: string;
}

export async function getCategories(
  params: GetCategoriesParams = {}
): Promise<ApiResponse<Category[]>> {
  return apiClient<Category[]>("categories", {
    method: "GET",
    params: {
      search: params.search,
    },
    cache: "no-store",
  });
}

export async function getCategoryById(
  id: string | number
): Promise<ApiResponse<Category>> {
  return apiClient<Category>(`categories/${id}`, {
    method: "GET",
    cache: "no-store",
  });
}
