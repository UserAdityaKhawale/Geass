"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";

const TABS = ["Music", "White Noise", "Ambient"] as const;
type Tab  = typeof TABS[number];

const TRACKS: Record<Tab, { title: string; sub: string; color: string; url: string }[]> = {
  Music: [
    { title: "Lofi Focus Beats",  sub: "Synth Focus Loop", color: "#7C3AED", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { title: "Deep Concentration", sub: "Piano Ambient",    color: "#3b82f6", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { title: "Chillwave Study",   sub: "Synths & Pads",    color: "#06b6d4", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  ],
  "White Noise": [
    { title: "Steady Brown Noise", sub: "Constant Hiss",    color: "#92400e", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
    { title: "Calm Pink Noise",    sub: "Flicker Focus",    color: "#ec4899", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
  ],
  Ambient: [
    { title: "Rainy Day Loop",     sub: "Raindrops",        color: "#22c55e", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
    { title: "Cozy Fireplace",     sub: "Crackling Wood",   color: "#c2410c", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
  ],
};

export default function MusicPlayer() {
  const [tab, setTab]     = useState<Tab>("Music");
  const [playing, setPlaying] = useState(false);
  const [cur, setCur]     = useState(0);
  const [volume, setVolume] = useState(0.5);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const tracks = TRACKS[tab];
  const track = tracks[cur];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = track.url;
      if (playing) {
        audioRef.current.play().catch(e => console.log("Play interrupted:", e));
      }
    }
  }, [cur, tab]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(e => console.log("Play error:", e));
    }
  };

  const changeTab = (t: Tab) => {
    setTab(t);
    setCur(0);
    setPlaying(false);
  };

  const prev = () => {
    setCur(c => (c - 1 + tracks.length) % tracks.length);
  };

  const next = () => {
    setCur(c => (c + 1) % tracks.length);
  };

  return (
    <div className="bg-[#0e0e10] border border-white/[0.06] rounded-2xl p-4 flex flex-col gap-3 h-full">
      <span className="text-[12px] font-bold text-white shrink-0">Music & White Noise</span>

      {/* Hidden audio tag */}
      <audio
        ref={audioRef}
        src={track.url}
        loop
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

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
      <div className="flex-1 overflow-y-auto space-y-1 min-h-0 scrollbar-thin scrollbar-thumb-white/[0.08]">
        {tracks.map((tr, i) => (
          <div
            key={i}
            onClick={() => { setCur(i); if (!playing) togglePlay(); }}
            className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer transition-colors ${cur === i ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"}`}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm" style={{ backgroundColor: `${tr.color}20` }}>
              ♪
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-white truncate">{tr.title}</p>
              <p className="text-[9px] text-neutral-600">{tr.sub}</p>
            </div>
            {cur === i && playing ? (
              <Pause size={11} className="text-[#EF5A6F] shrink-0" />
            ) : (
              <Play size={11} className="text-neutral-600 hover:text-white transition-colors shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="border-t border-white/[0.05] pt-3 shrink-0 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md shrink-0" style={{ backgroundColor: `${track.color}25` }} />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold text-white truncate">{track.title}</p>
            <p className="text-[9px] text-neutral-600">{playing ? "Now Playing" : "Paused"}</p>
          </div>
        </div>

        {/* Volume controller */}
        <div className="flex items-center gap-2 px-1">
          <Volume2 size={10} className="text-neutral-600" />
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

        <div className="flex items-center justify-center gap-5">
          <button onClick={prev} className="text-neutral-500 hover:text-white transition-colors"><SkipBack size={14} /></button>
          <button onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-[#EF5A6F] flex items-center justify-center text-white hover:bg-[#d43d59] transition-colors shadow-[0_0_16px_rgba(239,90,111,0.35)]">
            {playing ? <Pause size={13} fill="white" /> : <Play size={13} fill="white" />}
          </button>
          <button onClick={next} className="text-neutral-500 hover:text-white transition-colors"><SkipForward size={14} /></button>
        </div>
      </div>
    </div>
  );
}
