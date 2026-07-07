"use client";

import { ChevronDown, ChevronUp, MapPin, ExternalLink } from "lucide-react";
import { useState } from "react";
import type { CalendarEvent } from "../hooks/useGoogleCalendar";

function formatHour(h: number) {
  const period = h < 12 ? "AM" : "PM";
  const hour = h % 12 === 0 ? 12 : Math.floor(h % 12);
  const mins = h % 1 === 0.5 ? "30" : "00";
  return `${hour}:${mins} ${period}`;
}

function groupByDate(events: CalendarEvent[]) {
  const map = new Map<string, CalendarEvent[]>();
  for (const ev of events) {
    if (!map.has(ev.date)) map.set(ev.date, []);
    map.get(ev.date)!.push(ev);
  }
  return map;
}

function formatDateLabel(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (dateStr === today.toISOString().split("T")[0]) return "Today";
  if (dateStr === tomorrow.toISOString().split("T")[0]) return "Tomorrow";
  return d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
}

interface Props {
  events: CalendarEvent[];
  activeCalendars: string[];
  onEventClick: (event: CalendarEvent) => void;
}

export default function UpcomingEvents({ events, activeCalendars, onEventClick }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const upcoming = events
    .filter(e => e.date >= today && activeCalendars.includes(e.calendar))
    .sort((a, b) => a.date.localeCompare(b.date) || a.startHour - b.startHour)
    .slice(0, 12);

  const grouped = groupByDate(upcoming);
  const dateKeys = Array.from(grouped.keys()).sort().slice(0, 4);

  return (
    <div className="border-t border-white/[0.05] bg-[#0a0a0c] shrink-0">
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="w-full flex items-center justify-between px-6 py-2.5 hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-600">
          Upcoming Events ({upcoming.length})
        </span>
        {collapsed ? <ChevronUp size={12} className="text-neutral-700" /> : <ChevronDown size={12} className="text-neutral-700" />}
      </button>

      {!collapsed && (
        <div className="px-6 pb-4 overflow-x-auto">
          <div className="flex gap-4 min-w-0">
            {dateKeys.map(dk => (
              <div key={dk} className="flex-1 min-w-[200px]">
                <p className="text-[10px] font-bold text-neutral-400 mb-2">{formatDateLabel(dk)}</p>
                <div className="space-y-1.5">
                  {grouped.get(dk)!.map(ev => (
                    <button
                      key={ev.id}
                      onClick={() => onEventClick(ev)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.08] transition-all group text-left"
                    >
                      <div className="w-0.5 self-stretch rounded-full shrink-0" style={{ backgroundColor: ev.color }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-white truncate">{ev.title}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[9px] font-mono text-neutral-700">{formatHour(ev.startHour)} – {formatHour(ev.endHour)}</span>
                          {ev.platform && (
                            <>
                              <span className="text-neutral-800">·</span>
                              <div className="flex items-center gap-0.5 text-[9px] text-neutral-700">
                                <MapPin size={8} />
                                {ev.platform}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      {ev.isGoogle && (
                        <ExternalLink size={10} className="text-neutral-800 opacity-0 group-hover:opacity-100 shrink-0 transition-opacity" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
