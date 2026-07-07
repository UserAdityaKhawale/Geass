"use client";

import { useState, useCallback, useMemo } from "react";
import { useGeassStore } from "@/store/useGeassStore";

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startHour: number; // e.g. 9 for 9:00 AM
  endHour: number;
  color: string;
  calendar: string;
  platform?: string;
  description?: string;
  isGoogle?: boolean;
}

interface GoogleSyncState {
  connected: boolean;
  lastSynced: string | null;
  syncing: boolean;
}

const GOOGLE_MOCK_EVENTS: CalendarEvent[] = [
  { id: "g1", title: "Team Standup",         date: getTodayStr(),       startHour: 9,  endHour: 9.5,  color: "#7C3AED", calendar: "College",  platform: "Google Meet", isGoogle: true },
  { id: "g2", title: "Project Discussion",   date: getTodayStr(),       startHour: 11, endHour: 12,   color: "#3b82f6", calendar: "Work",     platform: "Google Meet", isGoogle: true },
  { id: "g3", title: "Client Call",          date: getTodayStr(),       startHour: 14, endHour: 15,   color: "#EF5A6F", calendar: "Work",     platform: "Zoom",        isGoogle: true },
];

function getTodayStr() {
  return new Date().toISOString().split("T")[0];
}

const PRIORITY_COLORS = {
  high: "#EF5A6F",
  medium: "#f59e0b",
  low: "#22c55e",
};

export function useGoogleCalendar() {
  const { activeWorkspaceId, tasks, addTask, deleteTask } = useGeassStore();
  const [syncState, setSyncState] = useState<GoogleSyncState>({
    connected: false,
    lastSynced: null,
    syncing: false,
  });

  // Connect Google Sync
  const connect = useCallback(async () => {
    setSyncState(s => ({ ...s, syncing: true }));
    await new Promise(res => setTimeout(res, 1500));
    setSyncState({ connected: true, lastSynced: "Just now", syncing: false });
  }, []);

  const disconnect = useCallback(() => {
    setSyncState({ connected: false, lastSynced: null, syncing: false });
  }, []);

  const syncNow = useCallback(async () => {
    if (!syncState.connected) return;
    setSyncState(s => ({ ...s, syncing: true }));
    await new Promise(res => setTimeout(res, 1000));
    setSyncState(s => ({ ...s, syncing: false, lastSynced: "Just now" }));
  }, [syncState.connected]);

  // Combine tasks with dueDates (mapped to calendar events) and optional synced Google events
  const events = useMemo(() => {
    const workspaceTasks = tasks.filter(t => t.workspaceId === activeWorkspaceId && t.dueDate);
    const localEvents: CalendarEvent[] = workspaceTasks.map(t => {
      let datePart = getTodayStr();
      try {
        if (t.dueDate) datePart = t.dueDate.split("T")[0];
      } catch {}

      return {
        id: t._id,
        title: t.title,
        date: datePart,
        startHour: 10 + (t.orderIndex % 5), // distribute placeholder hours based on index
        endHour: 11 + (t.orderIndex % 5),
        color: PRIORITY_COLORS[t.priority] || PRIORITY_COLORS.medium,
        calendar: t.tag || "Personal",
        description: `Task priority: ${t.priority}`,
      };
    });

    if (syncState.connected) {
      return [...localEvents, ...GOOGLE_MOCK_EVENTS];
    }
    return localEvents;
  }, [tasks, activeWorkspaceId, syncState.connected]);

  const addEvent = useCallback((event: Omit<CalendarEvent, "id">) => {
    if (!activeWorkspaceId) return;
    // Map calendar event back to a Task inside Zustand + MongoDB
    addTask({
      _id: `task-${Date.now()}`,
      workspaceId: activeWorkspaceId,
      title: event.title,
      priority: event.color === "#EF5A6F" ? "high" : event.color === "#f59e0b" ? "medium" : "low",
      status: "todo",
      dueDate: new Date(event.date + "T10:00:00.000Z").toISOString(),
      orderIndex: tasks.length,
      tag: event.calendar,
    });
  }, [addTask, activeWorkspaceId, tasks.length]);

  const removeEvent = useCallback((id: string) => {
    deleteTask(id);
  }, [deleteTask]);

  return { events, syncState, connect, disconnect, syncNow, addEvent, deleteEvent: removeEvent };
}
