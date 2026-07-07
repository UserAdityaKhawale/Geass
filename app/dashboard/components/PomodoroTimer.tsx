"use client";

import { useEffect, useRef, useState } from "react";
import { Settings } from "lucide-react";
import { useGeassStore } from "@/store/useGeassStore";

const SESSIONS = [
  { label: "Focus",       short: "Focus",    mins: 25, color: "#EF5A6F", type: "pomodoro" as const },
  { label: "Short Break", short: "Shrt Brk", mins: 5,  color: "#22c55e", type: "deep_work" as const }, // just mapping breaks as different focus types or ignore log
  { label: "Long Break",  short: "Long Brk", mins: 15, color: "#3b82f6", type: "deep_work" as const },
];

export default function PomodoroTimer() {
  const { activeWorkspaceId, addFocusSession } = useGeassStore();
  const [idx, setIdx]         = useState(0);
  const [secs, setSecs]       = useState(SESSIONS[0].mins * 60);
  const [running, setRunning] = useState(false);
  const [count, setCount]     = useState(1);
  const ref                   = useRef<ReturnType<typeof setInterval> | null>(null);
  const sess                  = SESSIONS[idx];

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => {
        setSecs(s => {
          if (s <= 1) {
            setRunning(false);
            setCount(c => c + 1);

            // Log session if it's the "Focus" session type
            if (sess.label === "Focus" && activeWorkspaceId) {
              addFocusSession({
                _id: `focus-${Date.now()}`,
                workspaceId: activeWorkspaceId,
                duration: sess.mins,
                type: "pomodoro",
                completedAt: new Date().toISOString(),
              });
            }

            return sess.mins * 60;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      if (ref.current) clearInterval(ref.current);
    }
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running, sess, activeWorkspaceId, addFocusSession]);

  const switchSession = (i: number) => {
    setRunning(false); setIdx(i); setSecs(SESSIONS[i].mins * 60);
  };

  const mm   = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss   = String(secs % 60).padStart(2, "0");
  const total = sess.mins * 60;
  const prog  = (total - secs) / total;
  const R     = 52;
  const circ  = 2 * Math.PI * R;
  const dash  = circ * (1 - prog);

  return (
    <div className="bg-[#0e0e10] border border-white/[0.06] rounded-2xl p-4 flex flex-col items-center gap-3">
      <div className="w-full flex items-center justify-between">
        <span className="text-[12px] font-bold text-white">Pomodoro</span>
        <button className="text-neutral-600 hover:text-white transition-colors">
          <Settings size={14} />
        </button>
      </div>

      {/* Ring */}
      <div className="relative">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
          <circle
            cx="60" cy="60" r={R}
            fill="none"
            stroke={sess.color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={dash}
            transform="rotate(-90 60 60)"
            style={{ transition: running ? "stroke-dashoffset 1s linear" : "none", filter: `drop-shadow(0 0 8px ${sess.color}80)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[26px] font-black text-white tabular-nums tracking-tight">{mm}:{ss}</span>
          <span className="text-[10px] text-neutral-500 font-semibold">{sess.label}</span>
        </div>
      </div>

      <p className="text-[10px] text-neutral-600">#{count} of 4</p>

      <button
        onClick={() => setRunning(r => !r)}
        className="w-full py-2.5 rounded-xl text-[12px] font-bold text-white transition-all duration-200"
        style={{ backgroundColor: sess.color, boxShadow: `0 6px 24px ${sess.color}40` }}
      >
        {running ? "Pause" : "Start Focus"}
      </button>

      {/* Session switcher */}
      <div className="w-full grid grid-cols-3 gap-1.5">
        {SESSIONS.map((s, i) => (
          <button
            key={s.label}
            onClick={() => switchSession(i)}
            className={`py-2 rounded-xl transition-all text-center ${idx === i ? "bg-white/[0.08] border border-white/[0.08]" : "hover:bg-white/[0.04]"}`}
          >
            <p className="text-[10px] font-bold" style={{ color: idx === i ? s.color : "#6b7280" }}>{s.short}</p>
            <p className="text-[9px] text-neutral-700">{String(s.mins).padStart(2,"0")}:00</p>
          </button>
        ))}
      </div>
    </div>
  );
}
