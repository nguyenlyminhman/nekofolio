"use client";

import { useState } from "react";

import { AdminBar } from "@/components/admin/AdminBar";
import { ConversationManager } from "@/components/admin/ConversationManager";
import { CVManager } from "@/components/admin/CVManager";
import { RepoManager } from "@/components/admin/RepoManager";
import { ServerDashboard } from "@/components/admin/ServerDashboard";
import { LogManager } from "@/components/admin/LogManager";
import { Sidebar } from "@/components/admin/Sidebar";
import { cn } from "@/lib/utils";
import type { AdminMenuId } from "@/types/admin";

export function AdminDashboardShell() {
  const [activeMenu, setActiveMenu] = useState<AdminMenuId>("svd");

  return (
    <div className="min-h-[calc(100vh-0px)] bg-background">
      <div className="flex min-h-screen">
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        <div className="flex min-w-0 flex-1 flex-col border-l border-border">
          <AdminBar />
          <main
            className={cn(
              "flex-1 p-6 transition-[margin] duration-200",
              activeMenu === "conv" && "flex min-h-0 flex-col",
            )}
          >
            <div
              className={cn(
                activeMenu === "conv" ? "flex min-h-0 min-w-0 flex-1 flex-col" : "mx-auto",
              )}
            >
              { activeMenu === "svd" 
              ? (<ServerDashboard />) 
              : activeMenu === "cv" 
              ? (<CVManager />) 
              : activeMenu === "repo" 
              ? ( <RepoManager />) 
              : activeMenu === "log" 
              ? ( <LogManager />) 
              : (
                <ConversationManager />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
