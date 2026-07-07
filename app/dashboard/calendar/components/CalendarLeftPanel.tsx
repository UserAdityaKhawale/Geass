"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, RefreshCw, Link, Unlink, CheckSquare } from "lucide-react";

const CALENDARS = [
  { name: "Personal",  color: "#EF5A6F" },
  { name: "College",   color: "#7C3AED" },
  { name: "Work",      color: "#3b82f6" },
  { name: "Fitness",   color: "#22c55e" },
];

interface Props {
  syncState: { connected: boolean; lastSynced: string | null; syncing: boolean };
  onConnect: () => void;
  onDisconnect: () => void;
  onSync: () => void;
  activeCalendars: string[];
  onToggleCalendar: (name: string) => void;
  focusedDate: Date;
  onDateClick: (date: Date) => void;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDay(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function CalendarLeftPanel({
  syncState, onConnect, onDisconnect, onSync,
  activeCalendars, onToggleCalendar,
  focusedDate, onDateClick,
}: Props) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDay(viewYear, viewMonth);
  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div className="w-[240px] shrink-0 border-r border-white/[0.05] bg-[#0a0a0c] flex flex-col min-h-0">
      {/* Mini calendar */}
      <div className="px-4 py-4 border-b border-white/[0.05] shrink-0">
        <div className="flex items-center justify-between mb-3">
          <button onClick={prevMonth} className="text-neutral-700 hover:text-white transition-colors p-0.5 rounded hover:bg-white/[0.05]">
            <ChevronLeft size={13} />
          </button>
          <span className="text-[11px] font-bold text-white">{monthLabel}</span>
          <button onClick={nextMonth} className="text-neutral-700 hover:text-white transition-colors p-0.5 rounded hover:bg-white/[0.05]">
            <ChevronRight size={13} />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {["S","M","T","W","T","F","S"].map((d, i) => (
            <div key={i} className="text-center text-[8px] font-mono text-neutral-700 py-0.5">{d}</div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-y-0.5">
          {cells.map((day, i) => {
            if (!day) return <div key={i} />;
            const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
            const isFocused = day === focusedDate.getDate() && viewMonth === focusedDate.getMonth() && viewYear === focusedDate.getFullYear();

            return (
              <button
                key={i}
                onClick={() => onDateClick(new Date(viewYear, viewMonth, day))}
                className={`text-[10px] font-semibold h-6 w-6 mx-auto rounded-lg transition-all ${
                  isToday
                    ? "bg-[#EF5A6F] text-white font-black"
                    : isFocused
                    ? "bg-white/[0.12] text-white"
                    : "text-neutral-600 hover:bg-white/[0.06] hover:text-neutral-200"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* My Calendars */}
      <div className="px-4 py-3 border-b border-white/[0.05] shrink-0">
        <p className="text-[9px] font-mono uppercase tracking-widest text-neutral-700 mb-2">My Calendars</p>
        <div className="space-y-1.5">
          {CALENDARS.map(cal => {
            const active = activeCalendars.includes(cal.name);
            return (
              <button
                key={cal.name}
                onClick={() => onToggleCalendar(cal.name)}
                className="w-full flex items-center gap-2.5 group"
              >
                <div
                  className={`w-4 h-4 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                    active ? "border-transparent" : "border-white/20"
                  }`}
                  style={active ? { backgroundColor: cal.color } : {}}
                >
                  {active && <CheckSquare size={9} className="text-white" />}
                </div>
                <span className={`text-[11px] font-semibold transition-colors ${active ? "text-neutral-200" : "text-neutral-600"}`}>
                  {cal.name}
                </span>
                <div className="w-2 h-2 rounded-full ml-auto shrink-0" style={{ backgroundColor: cal.color, opacity: active ? 1 : 0.3 }} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Google Sync card */}
      <div className="px-4 py-3 flex-1 flex flex-col">
        <p className="text-[9px] font-mono uppercase tracking-widest text-neutral-700 mb-2">Google Sync</p>
        <div className={`rounded-xl border p-3 ${syncState.connected ? "border-[#22c55e]/20 bg-[#22c55e]/[0.04]" : "border-white/[0.07] bg-white/[0.02]"}`}>
          {!syncState.connected ? (
            <div className="text-center">
              <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mx-auto mb-2">
                <span className="text-base">📅</span>
              </div>
              <p className="text-[10px] text-neutral-400 font-semibold mb-0.5">Connect Google Calendar</p>
              <p className="text-[9px] text-neutral-700 mb-2.5">Sync your events automatically</p>
              <button
                onClick={onConnect}
                disabled={syncState.syncing}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#EF5A6F]/10 border border-[#EF5A6F]/20 text-[#EF5A6F] text-[10px] font-bold rounded-lg hover:bg-[#EF5A6F]/20 transition-all disabled:opacity-50"
              >
                {syncState.syncing ? (
                  <>
                    <RefreshCw size={10} className="animate-spin" />
                    Connecting…
                  </>
                ) : (
                  <>
                    <Link size={10} />
                    Connect
                  </>
                )}
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                <span className="text-[11px] font-bold text-[#22c55e]">Connected</span>
              </div>
              {syncState.lastSynced && (
                <p className="text-[9px] text-neutral-700 mb-2.5">Last synced: {syncState.lastSynced}</p>
              )}
              <div className="flex gap-1.5">
                <button
                  onClick={onSync}
                  disabled={syncState.syncing}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-white/[0.04] border border-white/[0.08] text-neutral-400 text-[9px] font-semibold rounded-lg hover:bg-white/[0.08] hover:text-white transition-all disabled:opacity-50"
                >
                  <RefreshCw size={9} className={syncState.syncing ? "animate-spin" : ""} />
                  Sync
                </button>
                <button
                  onClick={onDisconnect}
                  className="flex items-center justify-center gap-1 px-2 py-1 text-neutral-700 hover:text-[#EF5A6F] text-[9px] rounded-lg hover:bg-[#EF5A6F]/[0.06] transition-all"
                >
                  <Unlink size={9} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
