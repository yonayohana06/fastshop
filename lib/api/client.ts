import { API_BASE_URL, STORAGE_KEYS } from "@/lib/constants";
import { ApiResponse } from "@/types";

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
  token?: string | null;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { params, token, headers = {}, ...customConfig } = options;

  let url = `${API_BASE_URL.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  let bearerToken = token;
  if (!bearerToken && typeof window !== "undefined") {
    bearerToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  const defaultHeaders: Record<string, string> = {
    Accept: "application/json",
  };

  if (!(customConfig.body instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  if (bearerToken) {
    defaultHeaders["Authorization"] = `Bearer ${bearerToken}`;
  }

  const response = await fetch(url, {
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    ...customConfig,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage =
      data?.message || `Terjadi kesalahan (Status ${response.status})`;
    throw new Error(errorMessage);
  }

  return data as ApiResponse<T>;
}
