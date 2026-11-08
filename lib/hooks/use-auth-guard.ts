"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

/**
 * Protects a client route while auth state is being restored from storage.
 * Redirects only after hydration so a hard refresh with a valid session is
 * never mistaken for an unauthenticated visit.
 */
export function useAuthGuard(redirectTo: string) {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuth();
  const hasRedirectedRef = useRef(false);

  const isReady = isHydrated && isAuthenticated;

  useEffect(() => {
    if (!isHydrated || isAuthenticated || hasRedirectedRef.current) {
      return;
    }

    hasRedirectedRef.current = true;
    router.replace(`/login?redirect=${encodeURIComponent(redirectTo)}`);
  }, [isHydrated, isAuthenticated, redirectTo, router]);

  return { isReady };
}
