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
      <div className="flex h-screen w-screen bg-[#030303] overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {children}
          </main>
        </div>
      </div>
    </StoreProvider>
  );
}
