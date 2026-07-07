"use client";

import type { CalendarEvent } from "../hooks/useGoogleCalendar";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HOURS = Array.from({ length: 17 }, (_, i) => i + 6); // 6AM – 10PM

function formatHour(h: number) {
  if (h === 12) return "12 PM";
  if (h < 12)  return `${h} AM`;
  return `${h - 12} PM`;
}

function dateStr(date: Date) {
  return date.toISOString().split("T")[0];
}

interface Props {
  weekStart: Date;
  events: CalendarEvent[];
  activeCalendars: string[];
  onEventClick: (event: CalendarEvent) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

export default function CalendarWeekView({ weekStart, events, activeCalendars, onEventClick, onPrevWeek, onNextWeek }: Props) {
  const today = new Date();
  const todayStr = dateStr(today);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const HOUR_HEIGHT = 56; // px per hour
  const START_HOUR = 6;

  const visibleEvents = events.filter(e => activeCalendars.includes(e.calendar));

  const weekLabel = `${days[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${days[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* Week nav header */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-white/[0.05] shrink-0">
        <button onClick={onPrevWeek} className="text-neutral-700 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/[0.06]">
          <ChevronLeft size={14} />
        </button>
        <span className="text-[12px] font-bold text-white">{weekLabel}</span>
        <button onClick={onNextWeek} className="text-neutral-700 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/[0.06]">
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-[52px_repeat(7,1fr)] border-b border-white/[0.05] shrink-0">
        <div />
        {days.map((day, i) => {
          const isToday = dateStr(day) === todayStr;
          return (
            <div key={i} className={`text-center py-2 border-l border-white/[0.04] ${isToday ? "bg-[#EF5A6F]/[0.04]" : ""}`}>
              <p className="text-[9px] font-mono uppercase text-neutral-700">
                {day.toLocaleDateString("en-US", { weekday: "short" })}
              </p>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto mt-0.5 text-[13px] font-black ${
                isToday ? "bg-[#EF5A6F] text-white" : "text-neutral-300"
              }`}>
                {day.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-white/[0.08]">
        <div className="relative" style={{ height: `${HOURS.length * HOUR_HEIGHT}px` }}>
          {/* Hour rows */}
          {HOURS.map((h, hi) => (
            <div
              key={h}
              className="absolute w-full border-t border-white/[0.04] grid grid-cols-[52px_repeat(7,1fr)]"
              style={{ top: `${hi * HOUR_HEIGHT}px`, height: `${HOUR_HEIGHT}px` }}
            >
              <div className="text-right pr-2 pt-1">
                <span className="text-[9px] text-neutral-700 font-mono">{formatHour(h)}</span>
              </div>
              {days.map((_, di) => (
                <div key={di} className="border-l border-white/[0.04] relative" />
              ))}
            </div>
          ))}

          {/* Events */}
          {visibleEvents.map(ev => {
            const dayIdx = days.findIndex(d => dateStr(d) === ev.date);
            if (dayIdx === -1) return null;

            const topPx = (ev.startHour - START_HOUR) * HOUR_HEIGHT;
            const heightPx = (ev.endHour - ev.startHour) * HOUR_HEIGHT;
            // Column offset: 52px (time col) + dayIdx * (100%/7 of remaining)
            const colWidthPct = 100 / 7;
            const leftPct = (dayIdx / 7) * 100;

            return (
              <button
                key={ev.id}
                onClick={() => onEventClick(ev)}
                className="absolute rounded-lg px-2 py-1 text-left hover:brightness-110 hover:scale-[1.02] transition-all shadow-lg overflow-hidden"
                style={{
                  top: `${topPx + 2}px`,
                  height: `${heightPx - 4}px`,
                  left: `calc(52px + ${leftPct}% * (100% - 52px) / 100%)`,
                  width: `calc((100% - 52px) / 7 - 4px)`,
                  backgroundColor: `${ev.color}25`,
                  borderLeft: `2px solid ${ev.color}`,
                }}
              >
                <p className="text-[10px] font-bold leading-tight truncate" style={{ color: ev.color }}>{ev.title}</p>
                {heightPx > 36 && (
                  <p className="text-[9px] font-mono mt-0.5" style={{ color: `${ev.color}99` }}>
                    {formatHour(ev.startHour)} – {formatHour(ev.endHour)}
                  </p>
                )}
                {ev.isGoogle && heightPx > 52 && (
                  <span className="text-[7px] bg-white/10 text-white/60 rounded px-1 mt-0.5 inline-block">G</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
