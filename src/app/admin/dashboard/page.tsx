import type { Metadata } from "next";

import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function AdminDashboardPage() {
  return <AdminDashboardShell />;
}
