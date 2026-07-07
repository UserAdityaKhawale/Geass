"use client";

import { useState } from "react";
import { Plus, MoreHorizontal } from "lucide-react";
import { useGeassStore } from "@/store/useGeassStore";
import KanbanCard, { Task } from "./KanbanCard";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface Column {
  id: Task["status"];
  label: string;
  dotColor: string;
}

const COLUMNS: Column[] = [
  { id: "todo",        label: "To Do",       dotColor: "#6b7280" },
  { id: "in_progress", label: "In Progress",  dotColor: "#EF5A6F" },
  { id: "done",        label: "Done",        dotColor: "#22c55e" },
  { id: "backlog",     label: "Backlog",     dotColor: "#6b7280" },
];

interface Props {
  projectId: string | null;
}

export default function KanbanBoard({ projectId }: Props) {
  const { activeWorkspaceId, tasks, addTask, moveTask } = useGeassStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require drag movement before activating drag behavior
      },
    })
  );

  const filteredTasks = tasks.filter(
    (t) =>
      t.workspaceId === activeWorkspaceId &&
      (!projectId || t.projectId === projectId)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    // Find active task
    const activeTask = tasks.find((t) => t._id === activeId);
    if (!activeTask) return;

    // Determine target column and index
    let targetStatus = activeTask.status;
    let targetIndex = 0;

    // Check if over a column container or another card
    const targetColumn = COLUMNS.find((c) => c.id === overId);
    if (targetColumn) {
      targetStatus = targetColumn.id;
      // Get all tasks in target column
      const columnTasks = filteredTasks.filter((t) => t.status === targetStatus);
      targetIndex = columnTasks.length;
    } else {
      // Over another card, find that target card's column and index
      const targetCard = tasks.find((t) => t._id === overId);
      if (targetCard) {
        targetStatus = targetCard.status;
        const columnTasks = filteredTasks
          .filter((t) => t.status === targetStatus)
          .sort((a, b) => a.orderIndex - b.orderIndex);
        const cardIndex = columnTasks.findIndex((t) => t._id === overId);
        targetIndex = cardIndex >= 0 ? cardIndex : columnTasks.length;
      }
    }

    if (activeTask.status !== targetStatus || activeTask.orderIndex !== targetIndex) {
      moveTask(activeId, targetStatus, targetIndex);
    }
  };

  const handleCreateTask = (colId: Task["status"]) => {
    if (!activeWorkspaceId) return;
    const taskName = prompt("Enter task title:");
    if (!taskName) return;

    addTask({
      _id: `task-${Date.now()}`,
      workspaceId: activeWorkspaceId,
      projectId: projectId || undefined,
      title: taskName,
      priority: "medium",
      status: colId,
      orderIndex: filteredTasks.filter((t) => t.status === colId).length,
    });
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex flex-nowrap gap-4 h-full overflow-x-auto pb-2 px-6 pt-4 min-w-0 select-none scrollbar-thin scrollbar-thumb-white/[0.08]">
        {COLUMNS.map((col) => {
          const colTasks = filteredTasks
            .filter((t) => t.status === col.id)
            .sort((a, b) => a.orderIndex - b.orderIndex);

          return (
            <div
              key={col.id}
              className="flex flex-col shrink-0 w-[280px] md:w-[310px] rounded-2xl border border-white/[0.06] bg-[#0e0e10]"
            >
              {/* Column header */}
              <div className="flex items-center justify-between px-4 py-3 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.dotColor }} />
                  <span className="text-[12px] font-bold text-white">{col.label}</span>
                  <span className="text-[10px] text-neutral-600 font-mono bg-white/[0.05] px-1.5 py-0.5 rounded-md">
                    {colTasks.length}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCreateTask(col.id)}
                    className="text-neutral-700 hover:text-white transition-colors p-0.5 rounded hover:bg-white/[0.06]"
                  >
                    <Plus size={13} />
                  </button>
                  <button className="text-neutral-700 hover:text-white transition-colors p-0.5 rounded hover:bg-white/[0.06]">
                    <MoreHorizontal size={13} />
                  </button>
                </div>
              </div>

              {/* Sortable Context wrapper for task list */}
              <SortableContext items={colTasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
                <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2.5 min-h-0 scrollbar-thin scrollbar-thumb-white/[0.08] scrollbar-track-transparent">
                  {colTasks.map((task, i) => (
                    <KanbanCard
                      key={task._id}
                      task={task}
                      index={i}
                      showProgress={col.id === "in_progress"}
                    />
                  ))}
                  {colTasks.length === 0 && (
                    <div
                      id={col.id}
                      className="h-16 border border-dashed border-white/[0.04] rounded-xl flex items-center justify-center text-[10px] text-neutral-800"
                    >
                      Drop tasks here
                    </div>
                  )}
                </div>
              </SortableContext>

              {/* Add task button */}
              <button
                onClick={() => handleCreateTask(col.id)}
                className="mx-3 mb-3 flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-white/[0.08] text-[11px] text-neutral-700 hover:text-neutral-400 hover:border-white/[0.14] transition-all shrink-0"
              >
                <Plus size={11} />
                Add Task
              </button>
            </div>
          );
        })}
      </div>
    </DndContext>
  );
}
