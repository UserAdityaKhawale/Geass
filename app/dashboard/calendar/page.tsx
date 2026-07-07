"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import CalendarLeftPanel from "./components/CalendarLeftPanel";
import CalendarWeekView from "./components/CalendarWeekView";
import CalendarMonthView from "./components/CalendarMonthView";
import EventModal from "./components/EventModal";
import UpcomingEvents from "./components/UpcomingEvents";
import { useGoogleCalendar, CalendarEvent } from "./hooks/useGoogleCalendar";

type ViewMode = "Week" | "Month" | "Day";

function getWeekStart(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function CalendarPage() {
  const { events, syncState, connect, disconnect, syncNow, addEvent, deleteEvent } = useGoogleCalendar();
  const [viewMode, setViewMode] = useState<ViewMode>("Week");
  const [focusedDate, setFocusedDate] = useState(new Date());
  const [weekStart, setWeekStart] = useState(getWeekStart(new Date()));
  const [activeCalendars, setActiveCalendars] = useState(["Personal", "College", "Work", "Fitness"]);
  const [modalState, setModalState] = useState<{
    open: boolean;
    event?: CalendarEvent;
  }>({ open: false });

  const toggleCalendar = (name: string) => {
    setActiveCalendars(cs =>
      cs.includes(name) ? cs.filter(c => c !== name) : [...cs, name]
    );
  };

  const goToday = () => {
    const now = new Date();
    setFocusedDate(now);
    setWeekStart(getWeekStart(now));
  };

  const prevWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d);
  };

  const nextWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d);
  };

  return (
    <div className="flex flex-col h-full bg-[#030303] min-h-0 overflow-hidden">
      {/* Top toolbar */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-white/[0.05] bg-[#0a0a0c] shrink-0">
        <button
          onClick={goToday}
          className="px-3 py-1.5 border border-white/[0.08] bg-white/[0.03] text-[11px] font-bold text-white rounded-xl hover:bg-white/[0.08] transition-all"
        >
          Today
        </button>

        {/* View mode toggle */}
        <div className="flex items-center border border-white/[0.08] rounded-xl overflow-hidden bg-white/[0.02]">
          {(["Week", "Month", "Day"] as ViewMode[]).map(v => (
            <button
              key={v}
              onClick={() => setViewMode(v)}
              className={`px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                viewMode === v
                  ? "bg-[#EF5A6F]/15 text-[#EF5A6F]"
                  : "text-neutral-600 hover:text-neutral-300"
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {syncState.connected && (
            <div className="flex items-center gap-1.5 text-[10px] text-[#22c55e] font-semibold">
              <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
              Google synced
            </div>
          )}
          <button
            onClick={() => setModalState({ open: true })}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#EF5A6F] hover:bg-[#d94a5f] text-white text-[11px] font-bold rounded-xl transition-all shadow-lg shadow-[#EF5A6F]/20"
          >
            <Plus size={12} />
            New Event
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left panel */}
        <CalendarLeftPanel
          syncState={syncState}
          onConnect={connect}
          onDisconnect={disconnect}
          onSync={syncNow}
          activeCalendars={activeCalendars}
          onToggleCalendar={toggleCalendar}
          focusedDate={focusedDate}
          onDateClick={d => {
            setFocusedDate(d);
            setWeekStart(getWeekStart(d));
          }}
        />

        {/* Calendar view */}
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {viewMode === "Week" && (
            <CalendarWeekView
              weekStart={weekStart}
              events={events}
              activeCalendars={activeCalendars}
              onEventClick={event => setModalState({ open: true, event })}
              onPrevWeek={prevWeek}
              onNextWeek={nextWeek}
            />
          )}
          {viewMode === "Month" && (
            <CalendarMonthView
              events={events}
              activeCalendars={activeCalendars}
              onEventClick={event => setModalState({ open: true, event })}
            />
          )}
          {viewMode === "Day" && (
            // Day view reuses WeekView with a single-day array — simplified
            <CalendarWeekView
              weekStart={focusedDate}
              events={events}
              activeCalendars={activeCalendars}
              onEventClick={event => setModalState({ open: true, event })}
              onPrevWeek={() => { const d = new Date(focusedDate); d.setDate(d.getDate() - 1); setFocusedDate(d); }}
              onNextWeek={() => { const d = new Date(focusedDate); d.setDate(d.getDate() + 1); setFocusedDate(d); }}
            />
          )}
        </div>
      </div>

      {/* Upcoming events */}
      <UpcomingEvents
        events={events}
        activeCalendars={activeCalendars}
        onEventClick={event => setModalState({ open: true, event })}
      />

      {/* Event modal */}
      {modalState.open && (
        <EventModal
          event={modalState.event}
          onClose={() => setModalState({ open: false })}
          onSave={ev => addEvent(ev)}
          onDelete={deleteEvent}
        />
      )}
    </div>
  );
}
