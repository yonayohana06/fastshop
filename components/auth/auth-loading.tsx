import React from "react";
import { Loader2 } from "lucide-react";

export function AuthLoading() {
  return (
    <div
      role="status"
      aria-label="Memuat status akun"
      className="flex min-h-[50vh] items-center justify-center"
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="sr-only">Memuat...</span>
    </div>
  );
}
