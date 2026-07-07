"use client";

import { useState, useCallback } from "react";

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

const MOCK_GOOGLE_EVENTS: CalendarEvent[] = [
  { id: "g1", title: "Team Standup",         date: getTodayStr(),       startHour: 9,  endHour: 9.5,  color: "#7C3AED", calendar: "College",  platform: "Google Meet", isGoogle: true },
  { id: "g2", title: "Project Discussion",   date: getTodayStr(),       startHour: 11, endHour: 12,   color: "#3b82f6", calendar: "Work",     platform: "Google Meet", isGoogle: true },
  { id: "g3", title: "Client Call",          date: getTodayStr(),       startHour: 14, endHour: 15,   color: "#EF5A6F", calendar: "Work",     platform: "Zoom",        isGoogle: true },
  { id: "g4", title: "Gym Time",             date: getTodayStr(),       startHour: 17, endHour: 18.5, color: "#22c55e", calendar: "Fitness",  platform: "Personal",    isGoogle: true },
  { id: "g5", title: "Study Session",        date: getOffsetStr(1),     startHour: 10, endHour: 12,   color: "#f59e0b", calendar: "College",  platform: "Personal",    isGoogle: true },
  { id: "g6", title: "Design Review",        date: getOffsetStr(2),     startHour: 14, endHour: 15.5, color: "#7C3AED", calendar: "Work",     platform: "Google Meet", isGoogle: true },
  { id: "g7", title: "Dentist Appointment",  date: getOffsetStr(3),     startHour: 11, endHour: 12,   color: "#ec4899", calendar: "Personal", platform: "In Person",   isGoogle: true },
  { id: "g8", title: "Weekend Run",          date: getOffsetStr(5),     startHour: 7,  endHour: 8,    color: "#22c55e", calendar: "Fitness",  platform: "Personal",    isGoogle: true },
  { id: "g9", title: "Movie Night",          date: getOffsetStr(6),     startHour: 20, endHour: 22.5, color: "#f59e0b", calendar: "Personal", platform: "Personal",    isGoogle: false },
];

function getTodayStr() {
  return new Date().toISOString().split("T")[0];
}

function getOffsetStr(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export function useGoogleCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_GOOGLE_EVENTS);
  const [syncState, setSyncState] = useState<GoogleSyncState>({
    connected: false,
    lastSynced: null,
    syncing: false,
  });

  const connect = useCallback(async () => {
    setSyncState(s => ({ ...s, syncing: true }));
    // Simulate OAuth + fetch delay
    await new Promise(res => setTimeout(res, 1800));
    setSyncState({ connected: true, lastSynced: "Just now", syncing: false });
  }, []);

  const disconnect = useCallback(() => {
    setSyncState({ connected: false, lastSynced: null, syncing: false });
  }, []);

  const syncNow = useCallback(async () => {
    if (!syncState.connected) return;
    setSyncState(s => ({ ...s, syncing: true }));
    await new Promise(res => setTimeout(res, 1200));
    setSyncState(s => ({ ...s, syncing: false, lastSynced: "Just now" }));
  }, [syncState.connected]);

  const addEvent = useCallback((event: Omit<CalendarEvent, "id">) => {
    setEvents(es => [...es, { ...event, id: `local-${Date.now()}` }]);
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents(es => es.filter(e => e.id !== id));
  }, []);

  const updateEvent = useCallback((id: string, changes: Partial<CalendarEvent>) => {
    setEvents(es => es.map(e => e.id === id ? { ...e, ...changes } : e));
  }, []);

  return { events, syncState, connect, disconnect, syncNow, addEvent, deleteEvent, updateEvent };
}
