"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
} from "react";
import { User } from "@/types";
import { STORAGE_KEYS } from "@/lib/constants";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function subscribeAuth(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("fastshop-auth-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("fastshop-auth-change", callback);
  };
}

function getAuthSnapshot() {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const user = localStorage.getItem(STORAGE_KEYS.USER);
  return `${token ?? ""}:::${user ?? ""}`;
}

function getServerAuthSnapshot() {
  return ":::";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const authString = useSyncExternalStore(
    subscribeAuth,
    getAuthSnapshot,
    getServerAuthSnapshot
  );

  const [tokenStr, userStr] = authString.split(":::");
  const token = tokenStr ? tokenStr : null;
  let user: User | null = null;
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch {
      user = null;
    }
  }

  const login = useCallback((newToken: string, newUser: User) => {
    try {
      localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
      window.dispatchEvent(new Event("fastshop-auth-change"));
    } catch {
      console.warn("Gagal menyimpan session");
    }
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.dispatchEvent(new Event("fastshop-auth-change"));
    } catch {
      console.warn("Gagal menghapus session");
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading: false,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
