"use client";

import { useEffect, useRef, useState } from "react";
import { useGeassStore } from "@/store/useGeassStore";
import { Play, Pause, RotateCcw, Maximize2, Minimize2, Sparkles, Volume2, Music, CheckCircle } from "lucide-react";

const SESSIONS = [
  { label: "Focus Sprint", mins: 25, color: "#EF5A6F", type: "pomodoro" as const },
  { label: "Short Break", mins: 5,  color: "#22c55e", type: "deep_work" as const },
  { label: "Long Break",  mins: 15, color: "#3b82f6", type: "deep_work" as const },
];

const TRACKS = [
  { title: "Chill Lofi Hip Hop", url: "/Music%20For%20geass/vibehorn-chill-lofi-hip-hop-482143.mp3" },
  { title: "Keyboard ASMR", url: "/Music%20For%20geass/dragon-studio-typing-keyboard-asmr-356116.mp3" },
  { title: "Calming Rain", url: "/Music%20For%20geass/liecio-calming-rain-257596.mp3" },
];

export default function FocusPage() {
  const { activeWorkspaceId, tasks, addFocusSession, updateTask } = useGeassStore();

  const [activeIdx, setActiveIdx] = useState(0);
  const [secs, setSecs] = useState(SESSIONS[0].mins * 60);
  const [running, setRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Target task select
  const todayStr = new Date().toISOString().split("T")[0];
  const todaysTasks = tasks.filter(t => t.workspaceId === activeWorkspaceId && (t.dueDate?.startsWith(todayStr) || !t.dueDate) && t.status !== "done");
  const [targetTaskId, setTargetTaskId] = useState<string>("");

  // Audio Streaming
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [trackIdx, setTrackIdx] = useState(0);
  const [volume, setVolume] = useState(0.4);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sess = SESSIONS[activeIdx];

  // Timer loop
  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setSecs(s => {
          if (s <= 1) {
            setRunning(false);
            // Log session on completion
            if (activeWorkspaceId) {
              addFocusSession({
                _id: `focus-${Date.now()}`,
                workspaceId: activeWorkspaceId,
                duration: sess.mins,
                type: sess.type,
                completedAt: new Date().toISOString(),
              });
            }
            alert(`🎉 session "${sess.label}" completed!`);
            return sess.mins * 60;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running, sess, activeWorkspaceId, addFocusSession]);

  // Audio lifecycle
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = TRACKS[trackIdx].url;
      if (audioPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [trackIdx]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (audioPlaying) {
      audioRef.current.pause();
      setAudioPlaying(false);
    } else {
      audioRef.current.play().then(() => setAudioPlaying(true)).catch(() => {});
    }
  };

  const resetTimer = () => {
    setRunning(false);
    setSecs(sess.mins * 60);
  };

  const selectSession = (i: number) => {
    setRunning(false);
    setActiveIdx(i);
    setSecs(SESSIONS[i].mins * 60);
  };

  const handleCompleteTask = () => {
    if (targetTaskId) {
      updateTask(targetTaskId, { status: "done" });
      setTargetTaskId("");
    }
  };

  const targetTask = todaysTasks.find(t => t._id === targetTaskId);

  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  const total = sess.mins * 60;
  const progress = (total - secs) / total;

  const R = 90;
  const circ = 2 * Math.PI * R;
  const strokeDashoffset = circ * (1 - progress);

  return (
    <div className={`flex flex-col h-full bg-[#030303] items-center justify-center p-6 transition-all duration-500 relative ${
      isFullscreen ? "fixed inset-0 z-50 bg-[#020202]" : ""
    }`}>
      {/* Hidden audio element */}
      <audio ref={audioRef} loop />

      {/* Top action toolbar */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
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

      <div className="max-w-md w-full flex flex-col items-center gap-8 z-10 mt-6">
        {/* Session selector tabs */}
        <div className="flex bg-white/[0.02] border border-white/[0.08] rounded-xl p-1 shrink-0 gap-1">
          {SESSIONS.map((s, i) => (
            <button
              key={s.label}
              onClick={() => selectSession(i)}
              className={`px-4 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                activeIdx === i ? "bg-white/[0.06] text-white" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Big circular SVG timer */}
        <div className="relative">
          <svg width="240" height="240" viewBox="0 0 240 240">
            <circle cx="120" cy="120" r={R} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
            <circle
              cx="120" cy="120" r={R}
              fill="none"
              stroke={sess.color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 120 120)"
              style={{ transition: running ? "stroke-dashoffset 1s linear" : "none" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
            <span className="text-[44px] font-black tracking-tighter text-white tabular-nums leading-none mb-1">
              {mm}:{ss}
            </span>
            <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest">
              {sess.label}
            </span>
          </div>
        </div>

        {/* Task selector and complete controls */}
        <div className="w-full bg-[#0e0e10] border border-white/[0.06] rounded-2xl p-4 space-y-3.5">
          <div>
            <label className="text-[9px] font-mono uppercase tracking-widest text-neutral-600 block mb-2">Focus Target</label>
            <select
              value={targetTaskId}
              onChange={e => setTargetTaskId(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-3 py-2 text-[11px] text-white outline-none cursor-pointer focus:border-[#EF5A6F]/30"
            >
              <option value="">-- Select a task to focus on --</option>
              {todaysTasks.map(t => (
                <option key={t._id} value={t._id}>{t.title}</option>
              ))}
            </select>
          </div>

          {targetTask && (
            <div className="flex items-center justify-between border-t border-white/[0.04] pt-3 animate-fadeIn">
              <span className="text-[11px] text-neutral-400 font-semibold truncate flex-1 pr-4">{targetTask.title}</span>
              <button
                onClick={handleCompleteTask}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] text-[10px] font-bold rounded-xl hover:bg-[#22c55e]/20 transition-all shrink-0"
              >
                <CheckCircle size={11} /> Complete Task
              </button>
            </div>
          )}
        </div>

        {/* Lofi player controller */}
        <div className="w-full bg-[#0e0e10] border border-white/[0.06] rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-white flex items-center gap-1.5">
              <Music size={11} className="text-[#EF5A6F]" />
              Lofi Space Radio
            </span>
            <button
              onClick={toggleAudio}
              className={`px-3 py-1 rounded-xl text-[10px] font-bold transition-all border ${
                audioPlaying
                  ? "bg-[#EF5A6F]/10 border-[#EF5A6F]/30 text-[#EF5A6F]"
                  : "border-white/[0.08] text-neutral-600 hover:text-white"
              }`}
            >
              {audioPlaying ? "Mute stream" : "Play stream"}
            </button>
          </div>

          {/* Sound source selector */}
          <div className="grid grid-cols-3 gap-1 bg-white/[0.01] border border-white/[0.05] p-0.5 rounded-xl">
            {TRACKS.map((t, idx) => (
              <button
                key={t.title}
                onClick={() => setTrackIdx(idx)}
                className={`py-1 text-[9px] font-bold rounded-lg truncate ${
                  trackIdx === idx ? "bg-white/[0.05] text-white" : "text-neutral-700 hover:text-neutral-400"
                }`}
              >
                {t.title.split(" ")[0]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 px-1">
            <Volume2 size={10} className="text-neutral-700" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={e => setVolume(parseFloat(e.target.value))}
              className="flex-1 h-1 bg-white/[0.05] rounded-lg appearance-none cursor-pointer accent-[#EF5A6F]"
            />
          </div>
        </div>

        {/* Timer controls */}
        <div className="flex gap-3 w-full shrink-0">
          <button
            onClick={() => setRunning(!running)}
            className="flex-1 py-2.5 bg-[#EF5A6F] hover:bg-[#d94a5f] text-white font-bold text-[12px] rounded-xl transition-all shadow-lg shadow-[#EF5A6F]/20 flex items-center justify-center gap-1.5"
          >
            {running ? <Pause size={13} fill="white" /> : <Play size={13} fill="white" />}
            {running ? "Pause Sprint" : "Start Focus Session"}
          </button>
          <button
            onClick={resetTimer}
            className="px-4 py-2.5 border border-white/[0.08] bg-white/[0.02] text-neutral-500 hover:text-white hover:bg-white/[0.05] rounded-xl transition-all"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
