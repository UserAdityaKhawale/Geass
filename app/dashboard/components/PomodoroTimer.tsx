"use client";

import { useEffect, useRef, useState } from "react";
import { Minus, Plus, Settings, X } from "lucide-react";
import { useGeassStore } from "@/store/useGeassStore";

const PRESETS = [
  { label: "Focus",      short: "Focus",    mins: 25, color: "#EF5A6F", type: "pomodoro" as const },
  { label: "Short Break", short: "Shrt Brk", mins: 5,  color: "#22c55e", type: "deep_work" as const },
  { label: "Long Break", short: "Long Brk", mins: 15, color: "#3b82f6", type: "deep_work" as const },
];

export default function PomodoroTimer() {
  const { activeWorkspaceId, addFocusSession } = useGeassStore();
  const [idx, setIdx]             = useState(0);
  const [customMins, setCustomMins] = useState<number | null>(null); // null = use preset
  const [secs, setSecs]           = useState(PRESETS[0].mins * 60);
  const [running, setRunning]     = useState(false);
  const [count, setCount]         = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [settingInput, setSettingInput] = useState("");
  const ref                       = useRef<ReturnType<typeof setInterval> | null>(null);

  const sess = PRESETS[idx];
  const activeMins = customMins !== null ? customMins : sess.mins;

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => {
        setSecs(s => {
          if (s <= 1) {
            setRunning(false);
            setCount(c => c + 1);
            if (sess.label === "Focus" && activeWorkspaceId) {
              addFocusSession({
                _id: `focus-${Date.now()}`,
                workspaceId: activeWorkspaceId,
                duration: activeMins,
                type: "pomodoro",
                completedAt: new Date().toISOString(),
              });
            }
            return activeMins * 60;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      if (ref.current) clearInterval(ref.current);
    }
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running, sess, activeWorkspaceId, addFocusSession, activeMins]);

  const switchSession = (i: number) => {
    setRunning(false);
    setIdx(i);
    setCustomMins(null);
    setSecs(PRESETS[i].mins * 60);
    setShowSettings(false);
  };

  const adjustTime = (delta: number) => {
    const cur = Math.floor(secs / 60);
    const next = Math.max(1, Math.min(120, cur + delta));
    setCustomMins(next);
    setSecs(next * 60);
    setRunning(false);
  };

  const applyCustomMins = () => {
    const parsed = parseInt(settingInput, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 120) {
      setCustomMins(parsed);
      setSecs(parsed * 60);
      setRunning(false);
    }
    setShowSettings(false);
    setSettingInput("");
  };

  const mm    = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss    = String(secs % 60).padStart(2, "0");
  const total = activeMins * 60;
  const prog  = (total - secs) / total;
  const R     = 52;
  const circ  = 2 * Math.PI * R;
  const dash  = circ * (1 - prog);

  return (
    <div className="bg-[#0e0e10] border border-white/[0.06] rounded-2xl p-4 flex flex-col items-center gap-3 relative">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <span className="text-[12px] font-bold text-white">Pomodoro</span>
        <button
          onClick={() => setShowSettings(v => !v)}
          className="text-neutral-600 hover:text-white transition-colors"
          title="Custom duration"
        >
          <Settings size={14} />
        </button>
      </div>

      {/* Custom duration settings popover */}
      {showSettings && (
        <div className="absolute top-11 right-3 z-40 bg-[#18181a] border border-white/[0.09] rounded-2xl p-3 shadow-2xl w-52 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-white">Set Custom Duration</span>
            <button onClick={() => setShowSettings(false)} className="text-neutral-600 hover:text-white"><X size={12} /></button>
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              min={1}
              max={120}
              value={settingInput}
              onChange={e => setSettingInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && applyCustomMins()}
              placeholder={`${activeMins} min`}
              className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-1.5 text-[12px] text-white focus:outline-none focus:border-[#EF5A6F]/50 [appearance:textfield]"
            />
            <button
              onClick={applyCustomMins}
              className="bg-[#EF5A6F] text-white font-bold text-[10px] px-3 py-1.5 rounded-xl hover:bg-[#d94a5f] transition-all"
            >
              Set
            </button>
          </div>
          <p className="text-[9px] text-neutral-600 font-mono">Enter 1–120 minutes</p>
        </div>
      )}

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
          {customMins !== null && (
            <span className="text-[8px] text-[#EF5A6F] font-mono mt-0.5">custom {customMins}m</span>
          )}
        </div>
      </div>

      {/* +/- time adjuster */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => adjustTime(-1)}
          disabled={running}
          className="w-7 h-7 rounded-xl border border-white/[0.08] flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="−1 minute"
        >
          <Minus size={12} />
        </button>
        <span className="text-[10px] text-neutral-600 font-mono">{activeMins} min</span>
        <button
          onClick={() => adjustTime(1)}
          disabled={running}
          className="w-7 h-7 rounded-xl border border-white/[0.08] flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="+1 minute"
        >
          <Plus size={12} />
        </button>
      </div>

      <p className="text-[10px] text-neutral-600">#{count} of 4</p>

      <button
        onClick={() => setRunning(r => !r)}
        className="w-full py-2.5 rounded-xl text-[12px] font-bold text-white transition-all duration-200 active:scale-95"
        style={{ backgroundColor: sess.color, boxShadow: `0 6px 24px ${sess.color}40` }}
      >
        {running ? "Pause" : "Start Focus"}
      </button>

      {/* Session switcher */}
      <div className="w-full grid grid-cols-3 gap-1.5">
        {PRESETS.map((s, i) => (
          <button
            key={s.label}
            onClick={() => switchSession(i)}
            className={`py-2 rounded-xl transition-all text-center ${idx === i ? "bg-white/[0.08] border border-white/[0.08]" : "hover:bg-white/[0.04]"}`}
          >
            <p className="text-[10px] font-bold" style={{ color: idx === i ? s.color : "#6b7280" }}>{s.short}</p>
            <p className="text-[9px] text-neutral-700">{String(s.mins).padStart(2, "0")}:00</p>
          </button>
        ))}
      </div>
    </div>
  );
}
