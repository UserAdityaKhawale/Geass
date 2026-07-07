"use client";

import { useState, useEffect } from "react";
import { Plus, Filter, SortAsc, LayoutGrid, List } from "lucide-react";
import { useGeassStore } from "@/store/useGeassStore";
import ProjectsPageHeader from "./components/ProjectsPageHeader";
import KanbanBoard from "./components/KanbanBoard";
import AICopilotPanel from "./components/AICopilotPanel";
import ProjectDetailsTabs from "./components/ProjectDetailsTabs";

export default function ProjectsPage() {
  const { activeWorkspaceId, projects, addProject } = useGeassStore();

  const workspaceProjects = projects.filter(p => p.workspaceId === activeWorkspaceId);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Auto-select first project in workspace if none selected or if selection is invalid
  useEffect(() => {
    if (workspaceProjects.length > 0) {
      if (!selectedProjectId || !workspaceProjects.some(p => p._id === selectedProjectId)) {
        setSelectedProjectId(workspaceProjects[0]._id);
      }
    } else {
      setSelectedProjectId(null);
    }
  }, [workspaceProjects, selectedProjectId]);

  const handleCreateProject = () => {
    if (!activeWorkspaceId) return;
    const name = prompt("Enter project name:");
    if (!name) return;

    addProject({
      _id: `proj-${Date.now()}`,
      workspaceId: activeWorkspaceId,
      name,
      description: "Project initialized via dashboard",
      status: "active",
      progress: 0,
      color: "#EF5A6F",
      icon: "⚡",
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#030303] min-h-0">
      {/* Project header with selector + stats */}
      {selectedProjectId ? (
        <ProjectsPageHeader
          selectedId={selectedProjectId}
          onSelect={setSelectedProjectId}
        />
      ) : (
        <div className="px-6 py-8 border-b border-white/[0.05] bg-[#0a0a0c] shrink-0 text-center">
          <p className="text-[12px] text-neutral-500 font-semibold mb-2">No projects found in this workspace.</p>
          <button
            onClick={handleCreateProject}
            className="px-3.5 py-1.5 bg-[#EF5A6F] text-white text-[11px] font-bold rounded-xl hover:bg-[#d94a5f]"
          >
            Create Project
          </button>
        </div>
      )}

      {/* Action toolbar */}
      <div className="flex items-center gap-3 px-6 py-2.5 border-b border-white/[0.05] bg-[#0a0a0c] shrink-0">
        <button
          onClick={handleCreateProject}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#EF5A6F] hover:bg-[#d94a5f] text-white text-[11px] font-bold rounded-xl transition-all shadow-lg shadow-[#EF5A6F]/20"
        >
          <Plus size={12} />
          New Project
        </button>
        <button className="flex items-center gap-1.5 px-2.5 py-1.5 border border-white/[0.08] bg-white/[0.03] text-neutral-500 text-[11px] font-semibold rounded-xl hover:bg-white/[0.06] hover:text-white transition-all">
          <Filter size={11} />
          Filter
        </button>
        <button className="flex items-center gap-1.5 px-2.5 py-1.5 border border-white/[0.08] bg-white/[0.03] text-neutral-500 text-[11px] font-semibold rounded-xl hover:bg-white/[0.06] hover:text-white transition-all">
          <SortAsc size={11} />
          Sort
        </button>
        <button className="flex items-center gap-1.5 px-2.5 py-1.5 border border-white/[0.08] bg-white/[0.03] text-neutral-500 text-[11px] font-semibold rounded-xl hover:bg-white/[0.06] hover:text-white transition-all">
          Group by: Status ▾
        </button>

        {/* View toggles */}
        <div className="ml-auto flex items-center gap-1 border border-white/[0.08] rounded-xl overflow-hidden bg-white/[0.02]">
          {[
            { Icon: LayoutGrid, tip: "Board" },
            { Icon: List, tip: "List" },
          ].map(({ Icon, tip }) => (
            <button
              key={tip}
              title={tip}
              className={`p-2 transition-colors ${tip === "Board" ? "bg-white/[0.08] text-white" : "text-neutral-700 hover:text-neutral-300"}`}
            >
              <Icon size={12} />
            </button>
          ))}
        </div>
      </div>

      {/* Main area: Kanban + AI Copilot */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Kanban board scrollable */}
        <div className="flex-1 min-w-0 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-x-auto overflow-y-hidden min-h-0">
            <KanbanBoard projectId={selectedProjectId} />
          </div>
        </div>

        {/* AI Copilot panel */}
        <AICopilotPanel projectId={selectedProjectId} />
      </div>

      {/* Bottom detail tabs */}
      <ProjectDetailsTabs />
    </div>
  );
}
