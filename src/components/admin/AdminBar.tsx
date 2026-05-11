"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function AdminBar() {
  const router = useRouter();
  const { user, clearToken } = useAuth();

  const displayName = user?.fullname?.trim() || user?.nickname?.trim() || user?.email?.trim() || "Admin";

  const handleLogout = () => {
    clearToken();
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <span className="truncate text-sm font-medium text-foreground">{displayName}</span>
      <Button type="button" variant="outline" size="sm" className="gap-2" onClick={handleLogout}>
        <LogOut className="h-4 w-4" />
        Đăng xuất
      </Button>
    </header>
  );
}
