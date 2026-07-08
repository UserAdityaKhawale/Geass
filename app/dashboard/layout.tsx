import type { ReactNode } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import StoreProvider from "./components/StoreProvider";

export const metadata = {
  title: "Dashboard — Geass",
  description: "Your personal productivity command center.",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#030303] lg:flex-row">
        <div className="w-full border-b border-white/[0.05] bg-[#0a0a0c] lg:h-full lg:w-[220px] lg:border-b-0 lg:border-r">
          <Sidebar />
        </div>
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <div className="mx-auto flex h-full min-h-0 w-full max-w-[1600px] flex-col dashboard-shell">
              {children}
            </div>
          </main>
        </div>
      </div>
    </StoreProvider>
  );
}
