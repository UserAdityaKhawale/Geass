"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useGeassStore } from "@/store/useGeassStore";
import { Play, Pause, RotateCcw, Maximize2, Minimize2, Sparkles, CheckCircle2, Check, Target, Clock, Minus, Plus } from "lucide-react";
import Orb from "@/components/ui/Orb";
import MusicPlayer from "../components/MusicPlayer";

const SESSIONS = [
  { label: "Focus Sprint", mins: 25, color: "#EF5A6F", type: "pomodoro" as const },
  { label: "Short Break", mins: 5,  color: "#22c55e", type: "deep_work" as const },
  { label: "Long Break",  mins: 15, color: "#3b82f6", type: "deep_work" as const },
];

export default function FocusPage() {
  const { activeWorkspaceId, tasks, addFocusSession, updateTask, timerState, setTimerSeconds, setTimerSessionIndex, setTimerCustomMinutes, toggleTimer } = useGeassStore();

  const [isFullscreen, setIsFullscreen] = useState(false);

  // Target task select
  const todayStr = new Date().toISOString().split("T")[0];
  const todaysTasks = tasks.filter(t => t.workspaceId === activeWorkspaceId && (t.dueDate?.startsWith(todayStr) || !t.dueDate) && t.status !== "done");
  const [targetTaskId, setTargetTaskId] = useState<string>("");

  const { running, seconds, sessionIndex, customMinutes, completedCount } = timerState;
  const sess = SESSIONS[sessionIndex];
  const activeMins = customMinutes !== null ? customMinutes : sess.mins;

  const resetTimer = () => {
    const store = useGeassStore.getState();
    store.stopTimer();
    setTimerSeconds(activeMins * 60);
  };

  const adjustTime = (delta: number) => {
    const store = useGeassStore.getState();
    store.stopTimer();
    const currentMins = Math.floor(seconds / 60);
    const next = Math.max(1, Math.min(120, currentMins + delta));
    setTimerCustomMinutes(next);
    setTimerSeconds(next * 60);
  };

  const selectSession = (i: number) => {
    const store = useGeassStore.getState();
    store.stopTimer();
    setTimerSessionIndex(i);
    setTimerCustomMinutes(null);
    setTimerSeconds(SESSIONS[i].mins * 60);
  };

  const handleCompleteTask = () => {
    if (targetTaskId) {
      updateTask(targetTaskId, { status: "done" });
      setTargetTaskId("");
    }
  };

  const targetTask = todaysTasks.find(t => t._id === targetTaskId);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const total = activeMins * 60;
  const progress = (total - seconds) / total;

  const R = 90;
  const circ = 2 * Math.PI * R;
  const strokeDashoffset = circ * (1 - progress);

  return (
    <div className={`flex flex-col lg:flex-row h-full bg-[var(--background)] gap-6 p-6 transition-all duration-500 relative overflow-hidden ${
      isFullscreen ? "fixed inset-0 z-50 bg-[var(--surface-alt)]" : ""
    }`}>
      {/* Orb Background */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <Orb
          hue={320}
          hoverIntensity={0.36}
          rotateOnHover={false}
          forceHoverState={true}
          backgroundColor="#030303"
        />
      </div>

      {/* Top action toolbar */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-[#EF5A6F] animate-pulse" />
          <span className="text-[11px] font-bold text-white tracking-widest uppercase">Deep Focus Space</span>
        </div>
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 border border-white/[0.08] rounded-xl hover:bg-white/[0.05] text-neutral-500 hover:text-white transition-all"
        >
          {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
        </button>
      </div>

      {/* Left Column: Timer + Task */}
      <div className="flex flex-col items-center gap-5 w-full lg:w-[420px] shrink-0 z-10 mt-12 lg:mt-8">
        {/* Session selector tabs */}
        <div className="flex bg-white/[0.02] border border-white/[0.08] rounded-2xl p-1.5 shrink-0 gap-1">
          {SESSIONS.map((s, i) => (
            <button
              key={s.label}
              onClick={() => selectSession(i)}
              className={`px-4 py-2 text-[11px] font-bold rounded-xl transition-all duration-300 flex flex-col items-center ${
                sessionIndex === i ? "bg-white/[0.08] text-white shadow-lg" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              <Clock size={12} className={sessionIndex === i ? "mb-1" : "mb-1 opacity-50"} />
              {s.label}
            </button>
          ))}
        </div>

        {/* Big circular SVG timer */}
        <div className="relative">
          <motion.svg
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            width="240" height="240" viewBox="0 0 240 240"
          >
            <circle cx="120" cy="120" r={R} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
            <motion.circle
              cx="120" cy="120" r={R}
              fill="none"
              stroke={sess.color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 120 120)"
              style={{ transition: running ? "stroke-dashoffset 1s linear" : "stroke-dashoffset 0.3s ease-out" }}
            />
          </motion.svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
            <motion.span
              key={`${mm}:${ss}`}
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              className="text-[48px] font-black tracking-tighter text-white tabular-nums leading-none mb-1"
            >
              {mm}:{ss}
            </motion.span>
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
              {sess.label}
            </span>
          </div>
        </div>

        {/* Time adjuster — − N min + */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => adjustTime(-1)}
            disabled={running}
            className="w-8 h-8 rounded-full border border-white/[0.12] flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="−1 minute"
          >
            <Minus size={13} />
          </button>
          <span className="text-[13px] font-bold text-neutral-300 tabular-nums w-16 text-center">
            {activeMins} min
          </span>
          <button
            onClick={() => adjustTime(1)}
            disabled={running}
            className="w-8 h-8 rounded-full border border-white/[0.12] flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="+1 minute"
          >
            <Plus size={13} />
          </button>
        </div>

        {/* Task selector */}
        <div className="w-full bg-[var(--surface)] border border-white/[0.08] rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Target size={12} className="text-neutral-500" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Focus Target</span>
          </div>

          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            <button
              onClick={() => setTargetTaskId("")}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all duration-200 ${
                targetTaskId === ""
                  ? "bg-white/[0.06] border border-white/[0.12] text-white"
                  : "bg-white/[0.02] border border-transparent text-neutral-400 hover:bg-white/[0.04] hover:border-white/[0.08]"
              }`}
            >
              <div className="w-5 h-5 rounded-lg border border-dashed border-neutral-600 flex items-center justify-center shrink-0">
                {targetTaskId === "" && <Check size={11} className="text-[#EF5A6F]" />}
              </div>
              <span className="text-[11px] font-semibold">No specific task</span>
            </button>

            {todaysTasks.map((t) => (
              <button
                key={t._id}
                onClick={() => setTargetTaskId(t._id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all duration-200 ${
                  targetTaskId === t._id
                    ? "bg-white/[0.06] border border-white/[0.12] text-white"
                    : "bg-white/[0.02] border border-transparent text-neutral-400 hover:bg-white/[0.04] hover:border-white/[0.08]"
                }`}
              >
                <div
                  className="w-5 h-5 rounded-lg border flex items-center justify-center shrink-0"
                  style={{ borderColor: targetTaskId === t._id ? "#EF5A6F" : "rgba(255,255,255,0.12)" }}
                >
                  {targetTaskId === t._id && <Check size={11} className="text-[#EF5A6F]" />}
                </div>
                <span className="text-[11px] font-semibold truncate flex-1">{t.title}</span>
                {t.priority && (
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: t.priority === "high" ? "rgba(239,90,111,0.15)" : t.priority === "medium" ? "rgba(245,158,11,0.15)" : "rgba(34,197,94,0.15)",
                      color: t.priority === "high" ? "#EF5A6F" : t.priority === "medium" ? "#f59e0b" : "#22c55e"
                    }}
                  >
                    {t.priority}
                  </span>
                )}
              </button>
            ))}
          </div>

          <AnimatePresence>
            {targetTask && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between border-t border-white/[0.05] pt-3 mt-2"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <CheckCircle2 size={14} className="text-[#22c55e] shrink-0" />
                  <span className="text-[11px] text-neutral-300 font-semibold truncate">{targetTask.title}</span>
                </div>
                <button
                  onClick={handleCompleteTask}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] text-[10px] font-bold rounded-xl hover:bg-[#22c55e]/20 transition-all shrink-0"
                >
                  <CheckCircle2 size={11} />
                  Complete Task
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Timer controls */}
        <div className="flex gap-3 w-full shrink-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={toggleTimer}
            className="flex-1 py-3 bg-[#EF5A6F] hover:bg-[#d94a5f] text-white font-bold text-[12px] rounded-xl transition-all shadow-lg shadow-[#EF5A6F]/20 flex items-center justify-center gap-1.5"
          >
            {running ? <Pause size={14} fill="white" /> : <Play size={14} fill="white" />}
            {running ? "Pause Sprint" : "Start Focus Session"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetTimer}
            className="px-4 py-3 border border-white/[0.08] bg-white/[0.03] text-neutral-500 hover:text-white hover:bg-white/[0.05] rounded-xl transition-all"
          >
            <RotateCcw size={14} />
          </motion.button>
        </div>
      </div>

      {/* Right Column: Music Player */}
      <div className="flex-1 flex flex-col min-h-0 z-10 w-full lg:w-auto lg:pt-8">
        <div className="flex-1 min-h-0 max-h-[350px] lg:max-h-none overflow-hidden rounded-2xl">
          <MusicPlayer />
        </div>
      </div>
    </div>
  );
}
