"use client";

import Link from "next/link";
import { useGeassStore } from "@/store/useGeassStore";

export default function ProjectsOverview() {
  const { activeWorkspaceId, projects } = useGeassStore();

  const workspaceProjects = projects.filter(p => p.workspaceId === activeWorkspaceId);

  return (
    <div className="bg-[#0e0e10] border border-white/[0.06] rounded-2xl p-4 flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between shrink-0">
        <span className="text-[12px] font-bold text-white">Projects Overview</span>
        <Link href="/dashboard/projects" className="text-[10px] text-[#EF5A6F] hover:text-[#ff8b98] font-semibold transition-colors">
          View all
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-between gap-4 overflow-hidden scrollbar-thin scrollbar-thumb-white/[0.08]">
        {workspaceProjects.map(p => (
          <div key={p._id} className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[13px]">{p.icon || "⚡"}</span>
              <span className="text-[11px] font-semibold text-neutral-300 flex-1 truncate">{p.name}</span>
              <span className="text-[10px] font-black shrink-0" style={{ color: p.color }}>{p.progress || 0}%</span>
            </div>
            <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${p.progress || 0}%`, backgroundColor: p.color, transition: "width 0.8s ease" }}
              />
            </div>
          </div>
        ))}

        {workspaceProjects.length === 0 && (
          <div className="text-center py-8 text-neutral-700 text-[10px]">No active projects.</div>
        )}
      </div>
    </div>
  );
}
