import { apiClient } from "./client";
import { Order, ApiResponse } from "@/types";

export interface CheckoutPayload {
  shipping_address: string;
}

export interface GetOrdersParams {
  status?: string;
  page?: number;
  limit?: number;
}

export async function checkoutOrderApi(
  payload: CheckoutPayload,
  token?: string
): Promise<ApiResponse<Order>> {
  return apiClient<Order>("orders/checkout", {
    method: "POST",
    body: JSON.stringify(payload),
    token,
  });
}

export async function uploadPaymentProofApi(
  orderId: string | number,
  proofFile: File,
  token?: string
): Promise<ApiResponse<Order>> {
  const formData = new FormData();
  formData.append("proof_image", proofFile);

  return apiClient<Order>(`orders/${orderId}/pay`, {
    method: "POST",
    body: formData,
    token,
  });
}

export async function getOrdersApi(
  params?: GetOrdersParams,
  token?: string
): Promise<ApiResponse<Order[]>> {
  return apiClient<Order[]>("orders", {
    method: "GET",
    params: params as Record<string, string | number | boolean | undefined | null>,
    token,
    cache: "no-store",
  });
}

export async function getOrderByIdApi(
  orderId: string | number,
  token?: string
): Promise<ApiResponse<Order>> {
  return apiClient<Order>(`orders/${orderId}`, {
    method: "GET",
    token,
    cache: "no-store",
  });
}
