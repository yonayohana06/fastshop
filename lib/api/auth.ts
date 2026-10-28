import { apiClient } from "./client";
import { User, ApiResponse } from "@/types";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponseData {
  user: User;
  token: string;
}

export async function loginApi(
  credentials: LoginCredentials
): Promise<ApiResponse<LoginResponseData>> {
  return apiClient<LoginResponseData>("auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function registerApi(
  payload: RegisterPayload
): Promise<ApiResponse<User>> {
  return apiClient<User>("auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getMeApi(token?: string): Promise<ApiResponse<User>> {
  return apiClient<User>("auth/me", {
    method: "GET",
    token,
  });
}
