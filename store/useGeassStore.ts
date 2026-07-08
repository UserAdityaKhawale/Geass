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

export interface Subtask {
  _id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface TaskAttachment {
  _id: string;
  filename: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export interface RepeatConfig {
  enabled: boolean;
  frequency: "daily" | "weekly" | "monthly" | "custom";
  interval?: number;
  daysOfWeek?: number[];
  dayOfMonth?: number;
  endDate?: string;
}

export interface Task {
  _id: string;
  workspaceId: string;
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
  // Extended fields
  description?: string;
  endDate?: string;
  subtasks: Subtask[];
  attachments: TaskAttachment[];
  repeat?: RepeatConfig;
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
  type: "task" | "focus" | "system" | "note" | "schedule";
}

export type SyncStatus = "idle" | "syncing" | "error" | "offline";

export interface TimerState {
  running: boolean;
  seconds: number;
  sessionIndex: number;
  customMinutes: number | null;
  completedCount: number;
}

export interface MusicState {
  playing: boolean;
  currentTrackIndex: number;
  volume: number;
  currentTab: "Music" | "White Noise" | "Ambient";
}

// ─── Store Interface ───────────────────────────────────────────────────────────

interface GeassStore {
  // State
  activeWorkspaceId: string | null;
  workspaces: Workspace[];
  tasks: Task[];
  focusSessions: FocusSession[];
  notes: Note[];
  timeblocks: TimeBlock[];
  activityLog: ActivityEntry[];
  syncStatus: SyncStatus;
  isHydrated: boolean;
  timerState: TimerState;
  musicState: MusicState;

  // Workspace actions
  setActiveWorkspace: (id: string) => void;
  setWorkspaces: (ws: Workspace[]) => void;
  addWorkspace: (ws: Workspace) => void;
  deleteWorkspace: (id: string) => void;

  // Task actions
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Omit<Task, "subtasks" | "attachments"> & { subtasks?: Subtask[]; attachments?: TaskAttachment[] }) => void;
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

  // Subtask actions
  addSubtask: (taskId: string, subtask: Subtask) => void;
  updateSubtask: (taskId: string, subtaskId: string, changes: Partial<Subtask>) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;

  // Attachment actions
  addAttachment: (taskId: string, attachment: TaskAttachment) => void;
  deleteAttachment: (taskId: string, attachmentId: string) => void;

  // Repeat actions
  updateRepeatConfig: (taskId: string, config: RepeatConfig) => void;

  // TimeBlock actions
  setTimeBlocks: (blocks: TimeBlock[]) => void;
  addTimeBlock: (block: TimeBlock) => void;
  updateTimeBlock: (id: string, changes: Partial<TimeBlock>) => void;
  deleteTimeBlock: (id: string) => void;
  cleanupPastTimeBlocks: () => void;

  // Activity log
  pushActivity: (entry: Omit<ActivityEntry, "id" | "timestamp">) => void;

  // Timer actions
  setTimerState: (state: Partial<TimerState>) => void;
  setTimerRunning: (running: boolean) => void;
  setTimerSeconds: (seconds: number) => void;
  setTimerSessionIndex: (index: number) => void;
  setTimerCustomMinutes: (minutes: number | null) => void;
  incrementTimerCompletedCount: () => void;
  startTimer: () => void;
  stopTimer: () => void;
  toggleTimer: () => void;

  // Music actions
  setMusicState: (state: Partial<MusicState>) => void;
  setMusicPlaying: (playing: boolean) => void;
  setMusicCurrentTrackIndex: (index: number) => void;
  setMusicVolume: (volume: number) => void;
  setMusicCurrentTab: (tab: "Music" | "White Noise" | "Ambient") => void;

  // Hydration
  hydrateFromServer: (data: {
    workspaces?: Workspace[];
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
      tasks: [],
      focusSessions: [],
      notes: [],
      timeblocks: [],
      activityLog: [],
      syncStatus: "idle",
      isHydrated: false,
      timerState: {
        running: false,
        seconds: 25 * 60,
        sessionIndex: 0,
        customMinutes: null,
        completedCount: 0,
      },
      musicState: {
        playing: false,
        currentTrackIndex: 0,
        volume: 0.5,
        currentTab: "Music",
      },

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
      deleteWorkspace: (id) => {
        const workspace = get().workspaces.find((w) => w._id === id);
        set((s) => ({
          workspaces: s.workspaces.filter((w) => w._id !== id),
          tasks: s.tasks.filter((t) => t.workspaceId !== id),
          notes: s.notes.filter((n) => n.workspaceId !== id),
          focusSessions: s.focusSessions.filter((f) => f.workspaceId !== id),
          timeblocks: s.timeblocks.filter((tb) => tb.workspaceId !== id),
        }));
        if (workspace) {
          get().pushActivity({ action: "deleted workspace", subject: workspace.name, type: "system" });
        }
        bgFetch("DELETE", `/api/workspaces/${id}`, {});
      },

      // ── Tasks ──
      setTasks: (tasks) => set({ tasks }),
      addTask: (task) => {
        const taskWithDefaults: Task = {
          ...task,
          subtasks: task.subtasks || [],
          attachments: task.attachments || [],
        };
        set((s) => ({ tasks: [...s.tasks, taskWithDefaults] }));
        get().pushActivity({ action: "created task", subject: taskWithDefaults.title, type: "task" });
        bgFetch("POST", "/api/tasks", taskWithDefaults);
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

      // ── Subtasks ──
      addSubtask: (taskId, subtask) => {
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t._id === taskId
              ? { ...t, subtasks: [...(t.subtasks || []), subtask] }
              : t
          ),
        }));
        const task = get().tasks.find((t) => t._id === taskId);
        if (task) bgFetch("PATCH", `/api/tasks/${taskId}`, { subtasks: task.subtasks });
      },
      updateSubtask: (taskId, subtaskId, changes) => {
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t._id === taskId
              ? { ...t, subtasks: (t.subtasks || []).map((st) => st._id === subtaskId ? { ...st, ...changes } : st) }
              : t
          ),
        }));
        const task = get().tasks.find((t) => t._id === taskId);
        if (task) bgFetch("PATCH", `/api/tasks/${taskId}`, { subtasks: task.subtasks });
      },
      deleteSubtask: (taskId, subtaskId) => {
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t._id === taskId
              ? { ...t, subtasks: (t.subtasks || []).filter((st) => st._id !== subtaskId) }
              : t
          ),
        }));
        const task = get().tasks.find((t) => t._id === taskId);
        if (task) bgFetch("PATCH", `/api/tasks/${taskId}`, { subtasks: task.subtasks });
      },
      toggleSubtask: (taskId, subtaskId) => {
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t._id === taskId
              ? { ...t, subtasks: (t.subtasks || []).map((st) => st._id === subtaskId ? { ...st, completed: !st.completed } : st) }
              : t
          ),
        }));
        const task = get().tasks.find((t) => t._id === taskId);
        if (task) bgFetch("PATCH", `/api/tasks/${taskId}`, { subtasks: task.subtasks });
      },

      // ── Attachments ──
      addAttachment: (taskId, attachment) => {
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t._id === taskId
              ? { ...t, attachments: [...(t.attachments || []), attachment] }
              : t
          ),
        }));
        const task = get().tasks.find((t) => t._id === taskId);
        if (task) bgFetch("PATCH", `/api/tasks/${taskId}`, { attachments: task.attachments });
      },
      deleteAttachment: (taskId, attachmentId) => {
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t._id === taskId
              ? { ...t, attachments: (t.attachments || []).filter((a) => a._id !== attachmentId) }
              : t
          ),
        }));
        const task = get().tasks.find((t) => t._id === taskId);
        if (task) bgFetch("PATCH", `/api/tasks/${taskId}`, { attachments: task.attachments });
      },

      // ── Repeat ──
      updateRepeatConfig: (taskId, config) => {
        set((s) => ({
          tasks: s.tasks.map((t) => t._id === taskId ? { ...t, repeat: config } : t),
        }));
        bgFetch("PATCH", `/api/tasks/${taskId}`, { repeat: config });
      },

      // ── TimeBlock CRUD ──
      updateTimeBlock: (id, changes) => {
        set((s) => ({
          timeblocks: s.timeblocks.map((tb) => (tb._id === id ? { ...tb, ...changes } : tb)),
        }));
        bgFetch("PATCH", `/api/timeblocks/${id}`, changes);
      },
      deleteTimeBlock: (id) => {
        const block = get().timeblocks.find((tb) => tb._id === id);
        set((s) => ({ timeblocks: s.timeblocks.filter((tb) => tb._id !== id) }));
        if (block) get().pushActivity({ action: "deleted timeblock", subject: block.title, type: "schedule" });
        bgFetch("DELETE", `/api/timeblocks/${id}`, {});
      },
      cleanupPastTimeBlocks: () => {
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const cutoffDate = sevenDaysAgo.toISOString().split("T")[0];
        const todayStr = now.toISOString().split("T")[0];
        const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

        set((s) => ({
          timeblocks: s.timeblocks.filter((tb) => {
            if (tb.date < cutoffDate) return false;
            if (tb.date > todayStr) return true;
            if (tb.date === todayStr && tb.end > currentTime) return true;
            if (tb.date < todayStr) return tb.date >= cutoffDate;
            return false;
          }),
        }));
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

      // ── Timer ──
      setTimerState: (state) => set((s) => ({ timerState: { ...s.timerState, ...state } })),
      setTimerRunning: (running) => set((s) => ({ timerState: { ...s.timerState, running } })),
      setTimerSeconds: (seconds) => set((s) => ({ timerState: { ...s.timerState, seconds } })),
      setTimerSessionIndex: (sessionIndex) => set((s) => ({ timerState: { ...s.timerState, sessionIndex } })),
      setTimerCustomMinutes: (customMinutes) => set((s) => ({ timerState: { ...s.timerState, customMinutes } })),
      incrementTimerCompletedCount: () => set((s) => ({ timerState: { ...s.timerState, completedCount: s.timerState.completedCount + 1 } })),

      startTimer: () => {
        const state = get();
        if (timerIntervalRef || state.timerState.running) return;

        set((s) => ({ timerState: { ...s.timerState, running: true } }));

        timerIntervalRef = setInterval(() => {
          const currentState = get().timerState;
          const newSeconds = currentState.seconds - 1;

          if (newSeconds <= 0) {
            get().stopTimer();
            get().incrementTimerCompletedCount();
            // Timer completion handled by components (focus session logging, etc.)
          } else {
            set((s) => ({ timerState: { ...s.timerState, seconds: newSeconds } }));
          }
        }, 1000);
      },

      stopTimer: () => {
        if (timerIntervalRef) {
          clearInterval(timerIntervalRef);
          timerIntervalRef = null;
        }
        set((s) => ({ timerState: { ...s.timerState, running: false } }));
      },

      toggleTimer: () => {
        const state = get();
        if (state.timerState.running) {
          get().stopTimer();
        } else {
          get().startTimer();
        }
      },

      // ── Music ──
      setMusicState: (state) => set((s) => ({ musicState: { ...s.musicState, ...state } })),
      setMusicPlaying: (playing) => set((s) => ({ musicState: { ...s.musicState, playing } })),
      setMusicCurrentTrackIndex: (currentTrackIndex) => set((s) => ({ musicState: { ...s.musicState, currentTrackIndex } })),
      setMusicVolume: (volume) => set((s) => ({ musicState: { ...s.musicState, volume } })),
      setMusicCurrentTab: (currentTab) => set((s) => ({ musicState: { ...s.musicState, currentTab } })),

      // ── Hydration ──
      hydrateFromServer: (data) => {
        set({
          workspaces:    data.workspaces    ?? get().workspaces,
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
        tasks:             state.tasks,
        focusSessions:     state.focusSessions,
        notes:             state.notes,
        timeblocks:        state.timeblocks,
        activityLog:       state.activityLog,
        timerState:        state.timerState,
        musicState:        state.musicState,
      }),
    }
  )
);

// ─── Timer singleton interval ─────────────────────────────────────────────────

let timerIntervalRef: ReturnType<typeof setInterval> | null = null;

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
