"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/hooks/use-auth";

type AdminAuthGuardProps = {
  children: React.ReactNode;
};

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, hydrated } = useAuth();

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    if (!token) {
      const next = encodeURIComponent(pathname || "/admin");
      router.replace(`/login?next=${next}`);
    }
  }, [hydrated, token, router, pathname]);

  if (!hydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        Đang kiểm tra phiên đăng nhập…
      </div>
    );
  }

  if (!token) {
    return null;
  }

  return <>{children}</>;
}
