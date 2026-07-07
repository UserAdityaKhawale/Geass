"use client";

import { useState } from "react";
import { Plus, Filter, SortAsc, LayoutGrid, List } from "lucide-react";
import ProjectsPageHeader from "./components/ProjectsPageHeader";
import KanbanBoard from "./components/KanbanBoard";
import AICopilotPanel from "./components/AICopilotPanel";
import ProjectDetailsTabs from "./components/ProjectDetailsTabs";

export default function ProjectsPage() {
  const [selectedProjectId, setSelectedProjectId] = useState(1);

  return (
    <div className="flex flex-col h-full bg-[#030303] min-h-0">
      {/* Project header with selector + stats */}
      <ProjectsPageHeader
        selectedId={selectedProjectId}
        onSelect={setSelectedProjectId}
      />

      {/* Action toolbar */}
      <div className="flex items-center gap-3 px-6 py-2.5 border-b border-white/[0.05] bg-[#0a0a0c] shrink-0">
        <button className="flex items-center gap-2 px-3 py-1.5 bg-[#EF5A6F] hover:bg-[#d94a5f] text-white text-[11px] font-bold rounded-xl transition-all shadow-lg shadow-[#EF5A6F]/20">
          <Plus size={12} />
          Add Task
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
            <KanbanBoard />
          </div>
        </div>

        {/* AI Copilot panel */}
        <AICopilotPanel />
      </div>

      {/* Bottom detail tabs */}
      <ProjectDetailsTabs />
    </div>
  );
}
