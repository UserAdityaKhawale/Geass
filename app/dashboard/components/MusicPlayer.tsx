"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, Radio, Waves, ChevronDown, ChevronUp } from "lucide-react";
import { useGeassStore } from "@/store/useGeassStore";

const TABS = ["Music", "White Noise", "Ambient"] as const;
type Tab  = typeof TABS[number];

const TRACKS: Record<Tab, { title: string; sub: string; color: string; url: string; icon?: string }[]> = {
  Music: [
    { title: "Chill Lofi Hip Hop", sub: "Vibehorn Beats", color: "#7C3AED", url: "/Music%20For%20geass/vibehorn-chill-lofi-hip-hop-482143.mp3", icon: "🎵" },
    { title: "Romantic Jazzy Love", sub: "Jazzy Lofi Loop", color: "#3b82f6", url: "/Music%20For%20geass/vibehorn-lo-fi-music-romantic-jazzy-love-479215.mp3", icon: "🎷" },
    { title: "Dark Suspense Trip Hop", sub: "Trip Hop Focus", color: "#06b6d4", url: "/Music%20For%20geass/databend-dark-suspense-trip-hop-background-30-seconds-edit-500757.mp3", icon: "🎹" },
  ],
  "White Noise": [
    { title: "Mechanical Keyboard ASMR", sub: "Dragon Studio ASMR", color: "#92400e", url: "/Music%20For%20geass/dragon-studio-typing-keyboard-asmr-356116.mp3", icon: "⌨️" },
    { title: "Keyboard Typing SFX", sub: "Sound Reality Type", color: "#ec4899", url: "/Music%20For%20geass/soundreality-keyboard-typing-sfx-525007.mp3", icon: "📝" },
    { title: "Quiet Library Ambience", sub: "Dreamy Soul Ambient", color: "#8b5cf6", url: "/Music%20For%20geass/u_dreamysoul-library-ambience-542977.mp3", icon: "📚" },
    { title: "Grand Library Hall", sub: "Community Library Loop", color: "#f59e0b", url: "/Music%20For%20geass/freesound_community-library-ambiance-60000.mp3", icon: "🏛️" },
  ],
  Ambient: [
    { title: "Calming Rain Storm", sub: "Liecio Rain Ambience", color: "#22c55e", url: "/Music%20For%20geass/liecio-calming-rain-257596.mp3", icon: "🌧️" },
    { title: "Steady Rain Showers", sub: "Sound Reality Rain", color: "#06b6d4", url: "/Music%20For%20geass/soundreality-rain-sound-550289.mp3", icon: "💧" },
    { title: "Raindrop Dreams", sub: "Raindrop Focus Beats", color: "#a855f7", url: "/Music%20For%20geass/ahyoungssi-raindrop-dreams-226868.mp3", icon: "💭" },
    { title: "Tropical Jungle Birds", sub: "Placidplace Nature", color: "#10b981", url: "/Music%20For%20geass/placidplace-nature-soundstropicaljunglebirds-108380.mp3", icon: "🦜" },
    { title: "Jungle Nature Streams", sub: "Soul Serenity Streams", color: "#3b82f6", url: "/Music%20For%20geass/soul_serenity_sounds-jungle-nature-229896.mp3", icon: "🌊" },
  ],
};

const TAB_ICONS: Record<Tab, any> = {
  Music: Music,
  "White Noise": Radio,
  Ambient: Waves,
};

export default function MusicPlayer() {
  const { musicState, setMusicPlaying, setMusicCurrentTrackIndex, setMusicVolume, setMusicCurrentTab } = useGeassStore();
  const [showTrackList, setShowTrackList] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { playing, currentTrackIndex, volume, currentTab } = musicState;
  const tracks = TRACKS[currentTab];
  const track = tracks[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const fadeRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fade effect - only runs on track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let currentVol = volume;
    if (fadeRef.current) clearInterval(fadeRef.current);

    fadeRef.current = setInterval(() => {
      currentVol = Math.max(0, currentVol - 0.1);
      audio.volume = currentVol;

      if (currentVol <= 0) {
        if (fadeRef.current) clearInterval(fadeRef.current);
        audio.src = track.url;
        
        if (playing) {
          audio.play().then(() => {
            fadeRef.current = setInterval(() => {
              currentVol = Math.min(volume, currentVol + 0.1);
              audio.volume = currentVol;
              if (currentVol >= volume) {
                if (fadeRef.current) clearInterval(fadeRef.current);
              }
            }, 30);
          }).catch(e => console.log("Fade play error:", e));
        } else {
          audio.volume = volume;
        }
      }
    }, 30);

    return () => {
      if (fadeRef.current) clearInterval(fadeRef.current);
    };
  }, [currentTrackIndex, currentTab, track.url, volume]);

  // Separate effect for play/pause control
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.play().catch(e => console.log("Play error:", e));
    } else {
      audio.pause();
    }
  }, [playing]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setMusicPlaying(false);
    } else {
      audioRef.current.play().then(() => setMusicPlaying(true)).catch(e => console.log("Play error:", e));
    }
  };

  const changeTab = (t: Tab) => {
    setMusicCurrentTab(t);
    setMusicCurrentTrackIndex(0);
    setMusicPlaying(false);
    setShowTrackList(false);
  };

  const selectTrack = (i: number) => {
    setMusicCurrentTrackIndex(i);
    setShowTrackList(false);
    setMusicPlaying(true);
  };

  const prev = () => {
    const newIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setMusicCurrentTrackIndex(newIndex);
  };

  const next = () => {
    const newIndex = (currentTrackIndex + 1) % tracks.length;
    setMusicCurrentTrackIndex(newIndex);
  };

  const TabIcon = TAB_ICONS[currentTab];

  return (
    <div className="bg-transparent border border-white/[0.06] rounded-2xl p-4 flex flex-col gap-3 h-full min-h-0 relative overflow-hidden backdrop-blur-sm">
      {/* Gradient background effect */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${track.color} 0%, transparent 70%)`
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-2">
          <TabIcon size={14} className="text-[#EF5A6F]" />
          <span className="text-[12px] font-bold text-white">Music Player</span>
        </div>
        <button
          onClick={() => setShowTrackList(!showTrackList)}
          className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors border border-white/[0.06]"
        >
          {showTrackList ? <ChevronUp size={12} className="text-neutral-400" /> : <ChevronDown size={12} className="text-neutral-400" />}
        </button>
      </div>

      {/* Hidden audio tag */}
      <audio
        ref={audioRef}
        src={track.url}
        loop
        onPlay={() => setMusicPlaying(true)}
        onPause={() => setMusicPlaying(false)}
      />

      {/* Tabs */}
      <div className="flex rounded-xl border border-white/[0.06] overflow-hidden shrink-0 relative z-10">
        {TABS.map(t => {
          const Icon = TAB_ICONS[t];
          return (
            <button key={t} onClick={() => changeTab(t)}
              className={`flex-1 py-2 text-[10px] font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                currentTab === t 
                  ? "bg-gradient-to-r from-[#EF5A6F]/20 to-transparent text-[#EF5A6F] border-l border-r border-white/[0.08]" 
                  : "text-neutral-600 hover:text-white hover:bg-white/[0.02]"
              }`}>
              <Icon size={10} />
              {t}
            </button>
          );
        })}
      </div>

      {/* Now_playing card */}
      <div className="relative z-10 shrink-0">
        <div 
          className="rounded-2xl p-4 border border-white/[0.06] transition-all duration-300"
          style={{
            background: `linear-gradient(135deg, ${track.color}15 0%, transparent 100%)`,
            borderColor: `${track.color}30`
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg"
              style={{ 
                background: `linear-gradient(135deg, ${track.color} 0%, ${track.color}80 100%)`,
                boxShadow: `0 8px 24px ${track.color}40`
              }}
            >
              {track.icon || "🎵"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-white truncate">{track.title}</p>
              <p className="text-[9px] text-neutral-400">{track.sub}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <div className={`w-2 h-2 rounded-full ${playing ? 'bg-[#22c55e] animate-pulse' : 'bg-neutral-600'}`} />
                <span className="text-[8px] text-neutral-500">{playing ? "Now Playing" : "Paused"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Track list - collapsible */}
      <div className={`flex-1 overflow-hidden transition-all duration-300 relative z-10 ${showTrackList ? 'max-h-[200px]' : 'max-h-0'}`}>
        <div className="overflow-y-auto space-y-1.5 min-h-0 scrollbar-thin scrollbar-thumb-white/[0.08] pt-2">
          {tracks.map((tr, i) => (
            <div
              key={i}
              onClick={() => selectTrack(i)}
              className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all duration-200 border ${
                currentTrackIndex === i 
                  ? `bg-white/[0.08] border-[${tr.color}40]` 
                  : 'hover:bg-white/[0.04] border-transparent'
              }`}
              style={currentTrackIndex === i ? { borderColor: `${tr.color}40` } : {}}
            >
              <div 
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-lg transition-all duration-200"
                style={{ 
                  backgroundColor: currentTrackIndex === i ? `${tr.color}30` : `${tr.color}15`,
                  boxShadow: currentTrackIndex === i ? `0 4px 12px ${tr.color}30` : 'none'
                }}
              >
                {tr.icon || "🎵"}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-[11px] font-semibold truncate ${currentTrackIndex === i ? 'text-white' : 'text-neutral-300'}`}>{tr.title}</p>
                <p className="text-[9px] text-neutral-600">{tr.sub}</p>
              </div>
              {currentTrackIndex === i && playing ? (
                <div className="flex items-center gap-0.5">
                  {[0, 1, 2].map((j) => (
                    <div 
                      key={j}
                      className="w-0.5 bg-[#EF5A6F] rounded-full"
                      style={{ 
                        height: `${8 + j * 2}px`,
                        animation: `equalizerPulse 0.6s ease-in-out infinite`,
                        animationDelay: `${j * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              ) : (
                <Play size={12} className="text-neutral-600" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="border-t border-white/[0.05] pt-3 shrink-0 space-y-3 relative z-10">
        {/* Volume controller */}
        <div className="flex items-center gap-2.5 px-1 relative">
          <Volume2 size={12} className="text-neutral-500 pointer-events-none z-10" />
          <div className="flex-1 h-1.5 bg-white/[0.08] rounded-full overflow-hidden pointer-events-none z-10">
            <div 
              className="h-full bg-gradient-to-r from-[#EF5A6F] to-[#ff8b98] rounded-full transition-all duration-200 pointer-events-none"
              style={{ width: `${volume * 100}%` }}
            />
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={e => setMusicVolume(parseFloat(e.target.value))}
            className="absolute left-8 right-10 h-6 opacity-0 cursor-pointer z-20"
          />
          <span className="text-[9px] text-neutral-600 w-8 text-right pointer-events-none z-10">{Math.round(volume * 100)}%</span>
        </div>

        {/* Playback controls */}
        <div className="flex items-center justify-center gap-4">
          <button 
            onClick={prev} 
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-500 hover:text-white transition-all duration-200 border border-white/[0.06] hover:border-white/[0.1]"
          >
            <SkipBack size={16} />
          </button>
          <button 
            onClick={togglePlay}
            className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#EF5A6F] to-[#ff8b98] flex items-center justify-center text-white hover:shadow-[0_0_24px_rgba(239,90,111,0.4)] transition-all duration-300 transform hover:scale-105"
          >
            {playing ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" className="ml-0.5" />}
          </button>
          <button 
            onClick={next} 
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-500 hover:text-white transition-all duration-200 border border-white/[0.06] hover:border-white/[0.1]"
          >
            <SkipForward size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
