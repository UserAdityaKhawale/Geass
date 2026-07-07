"use client";

import { useEffect, useState } from "react";
import { useGeassStore, flushSyncQueue } from "@/store/useGeassStore";

interface Props {
  children: React.ReactNode;
}

export default function StoreProvider({ children }: Props) {
  const store = useGeassStore();
  const [loading, setLoading] = useState(true);

  // Sync state hydration
  useEffect(() => {
    async function initSync() {
      try {
        store.setSyncStatus("syncing");

        // 1. Initial workspace lookup
        // If we have an activeWorkspaceId stored, load it. Otherwise get all workspaces first.
        let wsId = store.activeWorkspaceId;

        // We fetch/sync with temporary default of "default_init" to let the route return user workspaces
        const res = await fetch(`/api/sync/${wsId || "new_user"}`);
        if (!res.ok) throw new Error("Sync failed");

        const data = await res.json();

        // If activeWorkspaceId was not set, set it to the first seeded/returned workspace
        const targetWsId = wsId || data.workspaces?.[0]?._id;

        if (data.workspaces?.length > 0) {
          store.setWorkspaces(data.workspaces);
        }

        if (targetWsId) {
          store.setActiveWorkspace(targetWsId);

          // If we had to switch/resolve the workspace, re-fetch state specifically for it
          if (!wsId) {
            const finalRes = await fetch(`/api/sync/${targetWsId}`);
            const finalData = await finalRes.json();
            store.hydrateFromServer(finalData);
          } else {
            store.hydrateFromServer(data);
          }
        }
      } catch (err) {
        console.error("Hydration failed, using offline cache:", err);
        store.setSyncStatus("offline");
      } finally {
        setLoading(false);
      }
    }

    initSync();
  }, [store.activeWorkspaceId]);

  // Online/Offline listener + Queue flusher
  useEffect(() => {
    if (typeof window === "undefined") return;

    function handleOnline() {
      store.setSyncStatus("syncing");
      flushSyncQueue().then(() => store.setSyncStatus("idle"));
    }

    function handleOffline() {
      store.setSyncStatus("offline");
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Periodic flush queue check
    const interval = setInterval(() => {
      if (navigator.onLine) {
        flushSyncQueue();
      }
    }, 15000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-screen bg-[#030303] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#EF5A6F] border-t-transparent animate-spin" />
          <span className="text-[11px] font-bold text-neutral-400 tracking-wider uppercase">Loading Workspace…</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
