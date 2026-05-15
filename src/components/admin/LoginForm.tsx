"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { login } from "@/services/authService";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { setToken, setSession, token, hydrated } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [manualToken, setManualToken] = useState("");
  const [loading, setLoading] = useState(false);

  const safeNext = useMemo(() => {
    const nextPath = searchParams.get("next");
    return nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")
      ? decodeURIComponent(nextPath)
      : "/admin/dashboard";
  }, [searchParams]);

  useEffect(() => {
    if (hydrated && token) {
      router.replace(safeNext);
    }
  }, [hydrated, token, router, safeNext]);

  if (hydrated && token) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        Đang chuyển hướng…
      </div>
    );
  }

  const handleApiLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const u = username.trim();
    if (!u) {
      toast({ variant: "destructive", title: "Nhập username (email hoặc tài khoản)" });
      return;
    }
    if (!password) {
      toast({ variant: "destructive", title: "Nhập mật khẩu" });
      return;
    }
    setLoading(true);
    try {
      const { accessToken, user } = await login({ username: u, password });
      setSession(accessToken, user);
      toast({ title: "Đăng nhập thành công", description: user.nickname || user.email });
      router.replace(safeNext);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Đăng nhập thất bại",
        description: err instanceof Error ? err.message : "Lỗi không xác định",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManualToken = () => {
    const t = manualToken.trim();
    if (!t) {
      toast({ variant: "destructive", title: "Nhập access token" });
      return;
    }
    setToken(t);
    toast({ title: "Đã lưu token" });
    router.replace(safeNext);
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Đăng nhập Admin</CardTitle>
        <CardDescription>
          Gọi <code className="rounded bg-muted px-1 text-xs">POST /api/v1/auth/login</code> với username và password.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form className="space-y-3" onSubmit={(e) => void handleApiLogin(e)}>
          <div className="space-y-2">
            <Label htmlFor="login-username">Username</Label>
            <Input
              id="login-username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="neko@gmail.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password">Mật khẩu</Label>
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Đang đăng nhập…" : "Đăng nhập"}
          </Button>
        </form>

        {/* <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Separator className="flex-1" />
          hoặc
          <Separator className="flex-1" />
        </div>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="login-token">Access token (JWT)</Label>
            <Input
              id="login-token"
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              placeholder="Dán accessToken nếu đã có (không cần prefix Bearer)"
            />
          </div>
          <Button type="button" variant="secondary" className="w-full" onClick={handleManualToken}>
            Lưu token và vào Admin
          </Button>
        </div> */}
      </CardContent>
    </Card>
  );
}
