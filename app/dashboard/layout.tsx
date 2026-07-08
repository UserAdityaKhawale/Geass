import type { ReactNode } from "react";
import DashboardShell from "./components/DashboardShell";

export const metadata = {
  title: "Dashboard — Geass",
  description: "Your personal productivity command center.",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
