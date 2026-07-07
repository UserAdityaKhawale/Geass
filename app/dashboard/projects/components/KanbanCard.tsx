"use client";

import { MoreHorizontal, Calendar } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface Task {
  _id: string;
  workspaceId: string;
  projectId?: string;
  title: string;
  priority: "high" | "medium" | "low";
  status: "todo" | "in_progress" | "done" | "backlog";
  due?: string;
  assignee?: string;
  progress?: number;
  tag?: string;
}

const PRIORITY_COLORS = {
  high:   "#EF5A6F",
  medium: "#f59e0b",
  low:    "#22c55e",
};

const ASSIGNEE_COLORS = ["#7C3AED", "#EF5A6F", "#3b82f6", "#22c55e", "#f59e0b"];

interface Props {
  task: Task;
  index: number;
  showProgress?: boolean;
}

export default function KanbanCard({ task, index, showProgress }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const accentColor = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group bg-[#111113] border border-white/[0.07] rounded-xl p-3 cursor-grab active:cursor-grabbing hover:border-white/[0.14] hover:bg-[#161618] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30 touch-none"
    >
      {/* Top row: tag + menu */}
      <div className="flex items-center justify-between mb-2">
        {task.tag && (
          <span
            className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
            style={{ color: accentColor, backgroundColor: `${accentColor}18` }}
          >
            {task.tag}
          </span>
        )}
        <button className="ml-auto opacity-0 group-hover:opacity-100 text-neutral-700 hover:text-neutral-300 transition-all">
          <MoreHorizontal size={13} />
        </button>
      </div>

      {/* Title */}
      <p className="text-[12px] font-semibold text-neutral-200 leading-snug mb-2.5">
        {task.title}
      </p>

      {/* Progress bar — only for In Progress column */}
      {showProgress && task.progress !== undefined && (
        <div className="mb-2.5">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] text-neutral-700">Progress</span>
            <span className="text-[9px] font-bold" style={{ color: accentColor }}>{task.progress}%</span>
          </div>
          <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${task.progress}%`, backgroundColor: accentColor, transition: "width 0.6s ease" }}
            />
          </div>
        </div>
      )}

      {/* Footer: due + assignee + priority */}
      <div className="flex items-center gap-2 mt-1">
        {task.due && (
          <div className="flex items-center gap-1 text-[9px] text-neutral-700 font-mono">
            <Calendar size={9} />
            {task.due}
          </div>
        )}

        <div className="ml-auto flex items-center gap-1.5">
          {/* Assignee avatar */}
          <div
            className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-black text-white shrink-0"
            style={{ backgroundColor: ASSIGNEE_COLORS[index % ASSIGNEE_COLORS.length] }}
          >
            {String.fromCharCode(65 + (index % 5))}
          </div>

          {/* Priority badge */}
          <span
            className="text-[8px] font-bold px-1.5 py-0.5 rounded-md uppercase"
            style={{ color: accentColor, backgroundColor: `${accentColor}18` }}
          >
            {task.priority}
          </span>
        </div>
      </div>
    </div>
  );
}
