import { apiClient } from "./client";
import { CartData, ApiResponse } from "@/types";

export interface AddToCartPayload {
  product_id: number | string;
  quantity: number;
}

export interface UpdateCartPayload {
  quantity: number;
}

export async function getCartApi(
  token?: string
): Promise<ApiResponse<CartData>> {
  return apiClient<CartData>("cart", {
    method: "GET",
    token,
    cache: "no-store",
  });
}

export async function addToCartApi(
  payload: AddToCartPayload,
  token?: string
): Promise<ApiResponse<unknown>> {
  return apiClient<unknown>("cart", {
    method: "POST",
    body: JSON.stringify(payload),
    token,
  });
}

export async function updateCartItemApi(
  cartItemId: number | string,
  payload: UpdateCartPayload,
  token?: string
): Promise<ApiResponse<unknown>> {
  return apiClient<unknown>(`cart/${cartItemId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    token,
  });
}

export async function deleteCartItemApi(
  cartItemId: number | string,
  token?: string
): Promise<ApiResponse<unknown>> {
  return apiClient<unknown>(`cart/${cartItemId}`, {
    method: "DELETE",
    token,
  });
}

export async function clearCartApi(
  token?: string
): Promise<ApiResponse<unknown>> {
  return apiClient<unknown>("cart", {
    method: "DELETE",
    token,
  });
}
