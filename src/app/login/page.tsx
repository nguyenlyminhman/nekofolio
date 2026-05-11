import type { Metadata } from "next";
import { Suspense } from "react";

import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  robots: { index: false, follow: false },
};

function LoginFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">Đang tải…</div>
  );
}

export default function LoginPage() {
  return (
    <main className="container flex min-h-[70vh] items-center justify-center py-12">
      <Suspense fallback={<LoginFallback />}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
