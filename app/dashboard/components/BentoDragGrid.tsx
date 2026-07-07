"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import { GripVertical } from "lucide-react";
import { MagicCard } from "./MagicCard";

// ─── Widget registry ──────────────────────────────────────────────────────────

export interface WidgetDef {
  id: string;
  label: string;
  /** CSS grid column span class (e.g. "col-span-1", "col-span-2") */
  colSpan: string;
  component: React.ReactNode;
}

// ─── Single sortable card ─────────────────────────────────────────────────────

function SortableCard({
  widget,
  isDraggingAny,
}: {
  widget: WidgetDef;
  isDraggingAny: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? "transform 300ms cubic-bezier(0.25, 1, 0.5, 1)",
    opacity: isDragging ? 0 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      layoutId={widget.id}
      initial={false}
      animate={{ scale: 1, opacity: isDragging ? 0 : 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 35, mass: 0.5 }}
      className={`relative group ${widget.colSpan}`}
    >
      {/* Drag handle — top-right, visible on hover */}
      <div
        {...attributes}
        {...listeners}
        className={`absolute top-2 right-2 z-30 p-1.5 rounded-lg cursor-grab active:cursor-grabbing
          opacity-0 group-hover:opacity-100 transition-all duration-200
          bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08]`}
        title="Drag to rearrange"
      >
        <GripVertical size={11} className="text-neutral-500" />
      </div>

      {/* Drag-over dashed outline */}
      {isDraggingAny && !isDragging && (
        <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-white/[0.06] pointer-events-none z-10" />
      )}

      {/* Magic card spotlight wrapping the card content */}
      <MagicCard
        className={`h-full rounded-2xl transition-opacity duration-200 ${
          isDragging ? "opacity-0" : "opacity-100"
        }`}
        gradientSize={160}
        gradientOpacity={0.055}
        borderOpacity={0.28}
      >
        {widget.component}
      </MagicCard>
    </motion.div>
  );
}

// ─── Ghost overlay (card shown while dragging) ────────────────────────────────

function DragGhost({ widget }: { widget: WidgetDef }) {
  return (
    <motion.div
      initial={{ scale: 1, rotate: 0, boxShadow: "none" }}
      animate={{
        scale: 1.03,
        rotate: 0.8,
        boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 40px rgba(239,90,111,0.15)",
      }}
      transition={{ type: "spring", stiffness: 600, damping: 30 }}
      className={`${widget.colSpan} pointer-events-none`}
      style={{ zIndex: 9999 }}
    >
      <div className="rounded-2xl border border-[#EF5A6F]/30 bg-[#0e0e10] overflow-hidden">
        {/* Shimmer overlay */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full animate-[shimmer_1.5s_ease_infinite]" />
        </div>
        <div className="opacity-80 pointer-events-none select-none">
          {widget.component}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main exported component ──────────────────────────────────────────────────

interface BentoDragGridProps {
  widgets: WidgetDef[];
  storageKey?: string;
  /** Tailwind grid class for the container */
  gridClass?: string;
  className?: string;
}

export default function BentoDragGrid({
  widgets: initialWidgets,
  storageKey = "geass-bento-order",
  gridClass = "grid grid-cols-4 gap-3",
  className = "",
}: BentoDragGridProps) {
  const [order, setOrder] = useState<string[]>(() => {
    if (typeof window === "undefined") return initialWidgets.map(w => w.id);
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed: string[] = JSON.parse(saved);
        // Only keep IDs that still exist; append any new widgets at the end
        const valid = parsed.filter(id => initialWidgets.some(w => w.id === id));
        const added = initialWidgets.filter(w => !valid.includes(w.id)).map(w => w.id);
        return [...valid, ...added];
      }
    } catch {}
    return initialWidgets.map(w => w.id);
  });

  const [activeId, setActiveId] = useState<string | null>(null);

  // Persist order
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify(order));
    }
  }, [order, storageKey]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  const orderedWidgets = order
    .map(id => initialWidgets.find(w => w.id === id))
    .filter(Boolean) as WidgetDef[];

  const activeWidget = activeId ? initialWidgets.find(w => w.id === activeId) : null;

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id as string);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null);
    if (!over || active.id === over.id) return;
    setOrder(prev => {
      const from = prev.indexOf(active.id as string);
      const to   = prev.indexOf(over.id as string);
      return arrayMove(prev, from, to);
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={order} strategy={rectSortingStrategy}>
        <motion.div
          layout
          className={`${gridClass} ${className}`}
        >
          {orderedWidgets.map(widget => (
            <SortableCard
              key={widget.id}
              widget={widget}
              isDraggingAny={!!activeId}
            />
          ))}
        </motion.div>
      </SortableContext>

      <DragOverlay dropAnimation={{
        duration: 250,
        easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
      }}>
        {activeWidget ? <DragGhost widget={activeWidget} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
