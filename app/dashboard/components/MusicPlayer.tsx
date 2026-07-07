"use client";

import { useState } from "react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

const TABS = ["Music", "White Noise", "Ambient"] as const;
type Tab  = typeof TABS[number];

const TRACKS: Record<Tab, { title: string; sub: string; color: string }[]> = {
  Music: [
    { title: "Lo-fi Beats",   sub: "Focus",        color: "#7C3AED" },
    { title: "Deep Focus",    sub: "Instrumental",  color: "#3b82f6" },
    { title: "Rain Sounds",   sub: "Nature",        color: "#22c55e" },
    { title: "Night Waves",   sub: "Ocean",         color: "#06b6d4" },
  ],
  "White Noise": [
    { title: "Brown Noise",   sub: "Classic",       color: "#92400e" },
    { title: "Pink Noise",    sub: "Sleep",         color: "#ec4899" },
    { title: "Fan Sound",     sub: "Ambient",       color: "#374151" },
    { title: "Static Hum",    sub: "Steady",        color: "#6b7280" },
  ],
  Ambient: [
    { title: "Coffee Shop",   sub: "Cozy",          color: "#b45309" },
    { title: "Forest Rain",   sub: "Nature",        color: "#15803d" },
    { title: "Fireplace",     sub: "Warm",          color: "#c2410c" },
    { title: "Ocean Waves",   sub: "Calming",       color: "#0e7490" },
  ],
};

export default function MusicPlayer() {
  const [tab, setTab]     = useState<Tab>("Music");
  const [playing, setP]   = useState(false);
  const [cur, setCur]     = useState(0);
  const tracks            = TRACKS[tab];
  const track             = tracks[cur];

  const changeTab = (t: Tab) => { setTab(t); setCur(0); setP(false); };
  const prev = () => setCur(c => (c - 1 + tracks.length) % tracks.length);
  const next = () => setCur(c => (c + 1) % tracks.length);

  return (
    <div className="bg-[#0e0e10] border border-white/[0.06] rounded-2xl p-4 flex flex-col gap-3 h-full">
      <span className="text-[12px] font-bold text-white shrink-0">Music & White Noise</span>

      {/* Tabs */}
      <div className="flex rounded-xl border border-white/[0.06] overflow-hidden shrink-0">
        {TABS.map(t => (
          <button key={t} onClick={() => changeTab(t)}
            className={`flex-1 py-1.5 text-[10px] font-semibold transition-colors ${tab === t ? "bg-white/[0.08] text-white" : "text-neutral-600 hover:text-white"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Track list */}
      <div className="flex-1 overflow-y-auto space-y-1 min-h-0">
        {tracks.map((tr, i) => (
          <div key={i} onClick={() => { setCur(i); setP(true); }}
            className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer transition-colors ${cur === i ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"}`}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm" style={{ backgroundColor: `${tr.color}20` }}>
              ♪
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-white truncate">{tr.title}</p>
              <p className="text-[9px] text-neutral-600">{tr.sub}</p>
            </div>
            <Play size={11} className="text-neutral-600 hover:text-white transition-colors shrink-0" />
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="border-t border-white/[0.05] pt-3 shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-md shrink-0" style={{ backgroundColor: `${track.color}25` }} />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold text-white truncate">{track.title}</p>
            <p className="text-[9px] text-neutral-600">Now Playing</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <button onClick={prev} className="text-neutral-500 hover:text-white transition-colors"><SkipBack size={14} /></button>
          <button onClick={() => setP(p => !p)}
            className="w-8 h-8 rounded-full bg-[#EF5A6F] flex items-center justify-center text-white hover:bg-[#d43d59] transition-colors shadow-[0_0_16px_rgba(239,90,111,0.35)]">
            {playing ? <Pause size={13} fill="white" /> : <Play size={13} fill="white" />}
          </button>
          <button onClick={next} className="text-neutral-500 hover:text-white transition-colors"><SkipForward size={14} /></button>
        </div>
      </div>
    </div>
  );
}
