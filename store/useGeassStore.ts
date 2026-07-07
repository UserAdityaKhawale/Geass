// store/useGeassStore.ts
// Central Zustand store — offline-first with optimistic UI
// Write order: Zustand → localStorage → MongoDB (background)

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Workspace {
  _id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Project {
  _id: string;
  workspaceId: string;
  name: string;
  description: string;
  status: "active" | "archived" | "done";
  progress: number;
  color: string;
  icon: string;
  dueDate?: string;
}

export interface Task {
  _id: string;
  workspaceId: string;
  projectId?: string;
  title: string;
  status: "todo" | "in_progress" | "done" | "backlog";
  priority: "high" | "medium" | "low";
  dueDate?: string;
  estimatedTime?: number;
  orderIndex: number;
  tag?: string;
  progress?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FocusSession {
  _id: string;
  workspaceId: string;
  duration: number;
  type: "pomodoro" | "deep_work";
  completedAt: string;
}

export interface Note {
  _id: string;
  workspaceId: string;
  title: string;
  snippet: string;
  content: string;
  pinned: boolean;
  tags: string[];
  color: string;
  updatedAt?: string;
}

export interface TimeBlock {
  _id: string;
  workspaceId: string;
  title: string;
  sub: string;
  start: string; // "hh:mm"
  end: string;   // "hh:mm"
  color: string;
  date: string;  // "YYYY-MM-DD"
}

export interface ActivityEntry {
  id: string;
  action: string;
  subject: string;
  detail?: string;
  timestamp: string;
  type: "task" | "project" | "focus" | "system" | "note" | "schedule";
}

export type SyncStatus = "idle" | "syncing" | "error" | "offline";

// ─── Store Interface ───────────────────────────────────────────────────────────

interface GeassStore {
  // State
  activeWorkspaceId: string | null;
  workspaces: Workspace[];
  projects: Project[];
  tasks: Task[];
  focusSessions: FocusSession[];
  notes: Note[];
  timeblocks: TimeBlock[];
  activityLog: ActivityEntry[];
  syncStatus: SyncStatus;
  isHydrated: boolean;

  // Workspace actions
  setActiveWorkspace: (id: string) => void;
  setWorkspaces: (ws: Workspace[]) => void;
  addWorkspace: (ws: Workspace) => void;

  // Project actions
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, changes: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Task actions
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, changes: Partial<Task>) => void;
  moveTask: (taskId: string, newStatus: Task["status"], newIndex: number) => void;
  deleteTask: (id: string) => void;

  // Focus actions
  setFocusSessions: (sessions: FocusSession[]) => void;
  addFocusSession: (session: FocusSession) => void;

  // Note actions
  setNotes: (notes: Note[]) => void;
  addNote: (note: Note) => void;
  updateNote: (id: string, changes: Partial<Note>) => void;
  deleteNote: (id: string) => void;

  // TimeBlock actions
  setTimeBlocks: (blocks: TimeBlock[]) => void;
  addTimeBlock: (block: TimeBlock) => void;

  // Activity log
  pushActivity: (entry: Omit<ActivityEntry, "id" | "timestamp">) => void;

  // Hydration
  hydrateFromServer: (data: {
    workspaces?: Workspace[];
    projects?: Project[];
    tasks?: Task[];
    focusSessions?: FocusSession[];
    notes?: Note[];
    timeblocks?: TimeBlock[];
  }) => void;
  setHydrated: (v: boolean) => void;
  setSyncStatus: (s: SyncStatus) => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useGeassStore = create<GeassStore>()(
  persist(
    (set, get) => ({
      // ── Initial state ──
      activeWorkspaceId: null,
      workspaces: [],
      projects: [],
      tasks: [],
      focusSessions: [],
      notes: [],
      timeblocks: [],
      activityLog: [],
      syncStatus: "idle",
      isHydrated: false,

      // ── Workspace ──
      setActiveWorkspace: (id) => {
        set({ activeWorkspaceId: id, isHydrated: false });
      },
      setWorkspaces: (workspaces) => set({ workspaces }),
      addWorkspace: (ws) => {
        set((s) => ({ workspaces: [...s.workspaces, ws] }));
        get().pushActivity({ action: "created workspace", subject: ws.name, type: "system" });
        bgFetch("POST", "/api/workspaces", ws);
      },

      // ── Projects ──
      setProjects: (projects) => set({ projects }),
      addProject: (project) => {
        set((s) => ({ projects: [...s.projects, project] }));
        get().pushActivity({ action: "created project", subject: project.name, type: "project" });
        bgFetch("POST", "/api/projects", project);
      },
      updateProject: (id, changes) => {
        set((s) => ({
          projects: s.projects.map((p) => (p._id === id ? { ...p, ...changes } : p)),
        }));
        bgFetch("PATCH", `/api/projects/${id}`, changes);
      },
      deleteProject: (id) => {
        const proj = get().projects.find((p) => p._id === id);
        set((s) => ({ projects: s.projects.filter((p) => p._id !== id) }));
        if (proj) get().pushActivity({ action: "archived project", subject: proj.name, type: "project" });
        bgFetch("DELETE", `/api/projects/${id}`, {});
      },

      // ── Tasks ──
      setTasks: (tasks) => set({ tasks }),
      addTask: (task) => {
        set((s) => ({ tasks: [...s.tasks, task] }));
        get().pushActivity({ action: "created task", subject: task.title, type: "task" });
        bgFetch("POST", "/api/tasks", task);
      },
      updateTask: (id, changes) => {
        set((s) => ({
          tasks: s.tasks.map((t) => (t._id === id ? { ...t, ...changes } : t)),
        }));
        bgFetch("PATCH", `/api/tasks/${id}`, changes);
      },
      moveTask: (taskId, newStatus, newIndex) => {
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t._id === taskId ? { ...t, status: newStatus, orderIndex: newIndex } : t
          ),
        }));
        const task = get().tasks.find((t) => t._id === taskId);
        if (task) get().pushActivity({ action: `moved to ${newStatus.replace("_", " ")}`, subject: task.title, type: "task" });
        bgFetch("PATCH", `/api/tasks/${taskId}`, { status: newStatus, orderIndex: newIndex });
      },
      deleteTask: (id) => {
        const task = get().tasks.find((t) => t._id === id);
        set((s) => ({ tasks: s.tasks.filter((t) => t._id !== id) }));
        if (task) get().pushActivity({ action: "deleted task", subject: task.title, type: "task" });
        bgFetch("DELETE", `/api/tasks/${id}`, {});
      },

      // ── Focus ──
      setFocusSessions: (sessions) => set({ focusSessions: sessions }),
      addFocusSession: (session) => {
        set((s) => ({ focusSessions: [...s.focusSessions, session] }));
        get().pushActivity({
          action: `completed ${session.type.replace("_", " ")}`,
          subject: `${session.duration} min session`,
          type: "focus",
        });
        bgFetch("POST", "/api/focus", session);
      },

      // ── Notes ──
      setNotes: (notes) => set({ notes }),
      addNote: (note) => {
        set((s) => ({ notes: [note, ...s.notes] }));
        get().pushActivity({ action: "created note", subject: note.title, type: "note" });
        bgFetch("POST", "/api/notes", note);
      },
      updateNote: (id, changes) => {
        set((s) => ({
          notes: s.notes.map((n) => (n._id === id ? { ...n, ...changes, updatedAt: "Just now" } : n)),
        }));
        bgFetch("PATCH", `/api/notes/${id}`, changes);
      },
      deleteNote: (id) => {
        const note = get().notes.find((n) => n._id === id);
        set((s) => ({ notes: s.notes.filter((n) => n._id !== id) }));
        if (note) get().pushActivity({ action: "deleted note", subject: note.title, type: "note" });
        bgFetch("DELETE", `/api/notes/${id}`, {});
      },

      // ── TimeBlocks ──
      setTimeBlocks: (blocks) => set({ timeblocks: blocks }),
      addTimeBlock: (block) => {
        set((s) => ({ timeblocks: [...s.timeblocks, block].sort((a, b) => a.start.localeCompare(b.start)) }));
        get().pushActivity({ action: "added timeblock", subject: block.title, type: "schedule" });
        bgFetch("POST", "/api/timeblocks", block);
      },

      // ── Activity ──
      pushActivity: (entry) => {
        const full: ActivityEntry = {
          ...entry,
          id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          timestamp: new Date().toISOString(),
        };
        set((s) => ({
          activityLog: [full, ...s.activityLog].slice(0, 50), // keep last 50
        }));
      },

      // ── Hydration ──
      hydrateFromServer: (data) => {
        set({
          workspaces:    data.workspaces    ?? get().workspaces,
          projects:      data.projects      ?? get().projects,
          tasks:         data.tasks         ?? get().tasks,
          focusSessions: data.focusSessions ?? get().focusSessions,
          notes:         data.notes         ?? get().notes,
          timeblocks:    data.timeblocks    ?? get().timeblocks,
          isHydrated: true,
          syncStatus: "idle",
        });
      },
      setHydrated: (v) => set({ isHydrated: v }),
      setSyncStatus: (s) => set({ syncStatus: s }),
    }),
    {
      name: "geass-store",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
        }
        return localStorage;
      }),
      partialize: (state) => ({
        activeWorkspaceId: state.activeWorkspaceId,
        workspaces:        state.workspaces,
        projects:          state.projects,
        tasks:             state.tasks,
        focusSessions:     state.focusSessions,
        notes:             state.notes,
        timeblocks:        state.timeblocks,
        activityLog:       state.activityLog,
      }),
    }
  )
);

// ─── Background fetch with offline queue ──────────────────────────────────────

function bgFetch(method: string, url: string, body: object) {
  if (typeof window === "undefined") return;

  const request = async () => {
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch {
      queueMutation(method, url, body);
    }
  };

  if (!navigator.onLine) {
    queueMutation(method, url, body);
    return;
  }

  request();
}

// ─── Sync Queue (offline mutations) ───────────────────────────────────────────

interface QueuedMutation {
  method: string;
  url: string;
  body: object;
  queuedAt: number;
}

const QUEUE_KEY = "geass_sync_queue";

function queueMutation(method: string, url: string, body: object) {
  if (typeof window === "undefined") return;
  try {
    const existing: QueuedMutation[] = JSON.parse(localStorage.getItem(QUEUE_KEY) ?? "[]");
    existing.push({ method, url, body, queuedAt: Date.now() });
    localStorage.setItem(QUEUE_KEY, JSON.stringify(existing));
  } catch {}
}

export async function flushSyncQueue() {
  if (typeof window === "undefined") return;
  try {
    const queue: QueuedMutation[] = JSON.parse(localStorage.getItem(QUEUE_KEY) ?? "[]");
    if (queue.length === 0) return;

    const failed: QueuedMutation[] = [];
    for (const item of queue) {
      try {
        const res = await fetch(item.url, {
          method: item.method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item.body),
        });
        if (!res.ok) failed.push(item);
      } catch {
        failed.push(item);
      }
    }

    localStorage.setItem(QUEUE_KEY, JSON.stringify(failed));
  } catch {}
}
