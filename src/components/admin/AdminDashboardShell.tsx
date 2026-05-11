"use client";

import { useState } from "react";

import { CVManager } from "@/components/admin/CVManager";
import { RepoManager } from "@/components/admin/RepoManager";
import { Sidebar } from "@/components/admin/Sidebar";
import type { AdminMenuId } from "@/types/admin";

export function AdminDashboardShell() {
  const [activeMenu, setActiveMenu] = useState<AdminMenuId>("cv");

  return (
    <div className="min-h-[calc(100vh-0px)] bg-background">
      <div className="flex min-h-screen">
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        <main className="min-w-0 flex-1 border-l border-border p-6 transition-[margin] duration-200">
          <div className="mx-auto max-w-5xl">
            {activeMenu === "cv" ? <CVManager /> : <RepoManager />}
          </div>
        </main>
      </div>
    </div>
  );
}
