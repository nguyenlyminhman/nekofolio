"use client";

import { useState } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AdminMenuId } from "@/types/admin";

const MENU_ITEMS: {
  id: AdminMenuId;
  icon: string;
  label: string;
}[] = [
  { id: "cv", icon: "📄", label: "Quản lý CV" },
  { id: "repo", icon: "📁", label: "Quản lý Repo" },
  { id: "conv", icon: "💬", label: "Quản hội thoại" },
];

type SidebarProps = {
  activeMenu: AdminMenuId;
  onMenuChange: (id: AdminMenuId) => void;
};

export function Sidebar({ activeMenu, onMenuChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen flex-col border-r border-border bg-card/40 transition-[width] duration-200 ease-out",
        collapsed ? "w-[4.25rem]" : "w-56",
      )}
    >
      <div className="flex h-14 items-center justify-between gap-2 border-b border-border px-2">
        {!collapsed && (
          <span className="truncate pl-2 text-sm font-semibold tracking-tight">Admin</span>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn("shrink-0", collapsed && "mx-auto")}
          aria-label={collapsed ? "Mở sidebar" : "Thu sidebar"}
          onClick={() => setCollapsed((c) => !c)}
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-2">
        {MENU_ITEMS.map((item) => {
          const active = activeMenu === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              onClick={() => onMenuChange(item.id)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                active && "bg-primary/15 text-primary ring-1 ring-primary/30",
                collapsed && "justify-center px-0",
              )}
            >
              <span className="text-lg leading-none" aria-hidden>
                {item.icon}
              </span>
              {!collapsed && <span className="truncate font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
