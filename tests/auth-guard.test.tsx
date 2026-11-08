import React from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthGuard } from "@/lib/hooks/use-auth-guard";

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  push: vi.fn(),
  auth: { isHydrated: false, isAuthenticated: false },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mocks.replace, push: mocks.push }),
}));

vi.mock("@/context/auth-context", () => ({
  useAuth: () => mocks.auth,
}));

function GuardProbe({ redirectTo = "/orders" }: { redirectTo?: string }) {
  const { isReady } = useAuthGuard(redirectTo);

  return (
    <div>
      {isReady ? <span>protected-content</span> : <span>auth-loading</span>}
    </div>
  );
}

beforeEach(() => {
  mocks.replace.mockReset();
  mocks.push.mockReset();
  mocks.auth.isHydrated = false;
  mocks.auth.isAuthenticated = false;
});

describe("useAuthGuard", () => {
  it("does not redirect before auth hydration finishes", () => {
    render(<GuardProbe />);

    expect(screen.getByText("auth-loading")).toBeInTheDocument();
    expect(screen.queryByText("protected-content")).not.toBeInTheDocument();
    expect(mocks.replace).not.toHaveBeenCalled();
  });

  it("redirects to login with the origin path after hydration", () => {
    mocks.auth.isHydrated = true;

    render(<GuardProbe redirectTo="/orders" />);

    expect(mocks.replace).toHaveBeenCalledTimes(1);
    expect(mocks.replace).toHaveBeenCalledWith(
      "/login?redirect=%2Forders"
    );
    expect(screen.getByText("auth-loading")).toBeInTheDocument();
    expect(screen.queryByText("protected-content")).not.toBeInTheDocument();
  });

  it("allows authenticated users without redirecting", () => {
    mocks.auth.isHydrated = true;
    mocks.auth.isAuthenticated = true;

    render(<GuardProbe />);

    expect(screen.getByText("protected-content")).toBeInTheDocument();
    expect(mocks.replace).not.toHaveBeenCalled();
  });

  it("redirects only once even when the guard re-renders", () => {
    const { rerender } = render(<GuardProbe />);

    mocks.auth.isHydrated = true;
    rerender(<GuardProbe />);
    expect(mocks.replace).toHaveBeenCalledTimes(1);

    rerender(<GuardProbe />);
    expect(mocks.replace).toHaveBeenCalledTimes(1);
  });

  it("encodes nested origin routes in the redirect parameter", () => {
    mocks.auth.isHydrated = true;

    render(<GuardProbe redirectTo="/orders/123" />);

    expect(mocks.replace).toHaveBeenCalledWith(
      "/login?redirect=%2Forders%2F123"
    );
  });
});
