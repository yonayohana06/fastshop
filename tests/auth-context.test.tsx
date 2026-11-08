import React from "react";
import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AuthProvider, useAuth } from "@/context/auth-context";
import { STORAGE_KEYS } from "@/lib/constants";
import type { User } from "@/types";

const user: User = {
  id: 7,
  name: "Budi",
  email: "budi@example.com",
  role: "user",
};

function seedSession() {
  localStorage.setItem(STORAGE_KEYS.TOKEN, "token-a");
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

function AuthProbe() {
  const { isAuthenticated, isHydrated, isLoading } = useAuth();

  return (
    <div>
      <span data-testid="hydrated">{String(isHydrated)}</span>
      <span data-testid="loading">{String(isLoading)}</span>
      <span data-testid="authenticated">{String(isAuthenticated)}</span>
    </div>
  );
}

describe("AuthProvider hydration", () => {
  it("reports an authenticated session after hydration", () => {
    seedSession();

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>
    );

    expect(screen.getByTestId("hydrated")).toHaveTextContent("true");
    expect(screen.getByTestId("loading")).toHaveTextContent("false");
    expect(screen.getByTestId("authenticated")).toHaveTextContent("true");
  });

  it("reports a ready but unauthenticated session without a token", () => {
    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>
    );

    expect(screen.getByTestId("hydrated")).toHaveTextContent("true");
    expect(screen.getByTestId("loading")).toHaveTextContent("false");
    expect(screen.getByTestId("authenticated")).toHaveTextContent("false");
  });

  it("renders the server snapshot as not hydrated and still loading", () => {
    seedSession();

    const html = renderToString(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>
    );

    expect(html).toContain('data-testid="hydrated">false');
    expect(html).toContain('data-testid="loading">true');
    expect(html).toContain('data-testid="authenticated">false');
  });
});
