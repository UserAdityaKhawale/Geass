"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import StoreProvider from "./StoreProvider";
import { Menu } from "lucide-react";

export default function DashboardShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <StoreProvider>
      <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#030303] lg:flex-row">
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar — fixed overlay on mobile, relative on desktop */}
        <div
          className={`fixed inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out lg:relative lg:inset-auto lg:z-auto lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Main content */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* TopBar wrapper with mobile hamburger prepended */}
          <div className="relative flex items-center shrink-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden absolute left-0 top-0 bottom-0 z-10 flex items-center justify-center w-12 text-neutral-500 hover:text-white hover:bg-white/[0.06] transition-all"
              aria-label="Open sidebar"
            >
              <Menu size={18} />
            </button>
            <div className="flex-1 min-w-0 lg:pl-0 pl-12">
              <TopBar />
            </div>
          </div>

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
