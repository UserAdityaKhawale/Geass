"use client";

import { useState, useEffect } from "react";
import { Sparkles, Save, ShieldCheck, Key, RefreshCw, User, Settings, Sliders, BellRing, Clock, Award, Shield } from "lucide-react";
import { useGeassStore } from "@/store/useGeassStore";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "ai">("general");

  // AI settings
  const [provider, setProvider] = useState("gemini");
  const [apiKey, setApiKey] = useState("");

  // General settings
  const [username, setUsername] = useState("Aditya");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [focusLength, setFocusLength] = useState("25");
  const [shortBreak, setShortBreak] = useState("5");
  const [longBreak, setLongBreak] = useState("15");
  const [autoStartBreaks, setAutoStartBreaks] = useState(true);
  const [soundVolume, setSoundVolume] = useState("40");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const { focusSessions, activeWorkspaceId } = useGeassStore();
  const workspaceSessions = focusSessions.filter(s => s.workspaceId === activeWorkspaceId);
  const totalFocusMinutes = workspaceSessions.reduce((acc, curr) => acc + curr.duration, 0);
  const focusHrs = Math.floor(totalFocusMinutes / 60);

  // Streak calculations
  const countsByDate: Record<string, number> = {};
  workspaceSessions.forEach(sess => {
    try {
      const dateStr = sess.completedAt.split("T")[0];
      countsByDate[dateStr] = (countsByDate[dateStr] || 0) + 1;
    } catch {}
  });

  const today = new Date();
  let streak = 0;
  let checkDate = new Date(today);
  const todayStr = checkDate.toISOString().split("T")[0];
  const hasToday = (countsByDate[todayStr] || 0) > 0;

  if (!hasToday) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const checkStr = checkDate.toISOString().split("T")[0];
    if ((countsByDate[checkStr] || 0) > 0) {
      streak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  if (hasToday && streak === 0) streak = 1;
  useEffect(() => {
    if (typeof window !== "undefined") {
      setProvider(localStorage.getItem("geass_ai_provider") || "gemini");
      setApiKey(localStorage.getItem("geass_ai_api_key") || "");
      setUsername(localStorage.getItem("geass_general_username") || "Aditya");
      setAvatarUrl(localStorage.getItem("geass_general_avatar") || "");
      setFocusLength(localStorage.getItem("geass_pomodoro_focus") || "25");
      setShortBreak(localStorage.getItem("geass_pomodoro_short") || "5");
      setLongBreak(localStorage.getItem("geass_pomodoro_long") || "15");
      setAutoStartBreaks(localStorage.getItem("geass_pomodoro_autostart") !== "false");
      setSoundVolume(localStorage.getItem("geass_sound_volume") || "40");
    }
  }, []);

  const handleSaveAI = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("geass_ai_provider", provider);
      localStorage.setItem("geass_ai_api_key", apiKey);
      setMessage({ type: "success", text: "AI Copilot settings saved successfully!" });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleSaveGeneral = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("geass_general_username", username);
      localStorage.setItem("geass_general_avatar", avatarUrl);
      localStorage.setItem("geass_pomodoro_focus", focusLength);
      localStorage.setItem("geass_pomodoro_short", shortBreak);
      localStorage.setItem("geass_pomodoro_long", longBreak);
      localStorage.setItem("geass_pomodoro_autostart", String(autoStartBreaks));
      localStorage.setItem("geass_sound_volume", soundVolume);

      setMessage({ type: "success", text: "General settings saved successfully!" });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const testConnection = async () => {
    if (!apiKey.trim()) {
      setMessage({ type: "error", text: "Please enter an API key first." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: "Say 'Success'",
          context: {},
          provider,
          apiKey,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Connection failed");
      }

      setMessage({ type: "success", text: "Connection verified! The API key is valid." });
    } catch (err: any) {
      setMessage({ type: "error", text: `Verification failed: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-black text-white tracking-tight flex items-center gap-2">
            <Settings size={18} className="text-[#EF5A6F]" />
            Settings Panel
          </h1>
          <p className="text-[12px] text-neutral-500 mt-1">Configure your personal command center integrations.</p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-[#0e0e10] border border-white/[0.06] rounded-xl p-1 shrink-0 gap-1 w-fit">
        <button
          onClick={() => setActiveTab("general")}
          className={`flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
            activeTab === "general" ? "bg-white/[0.06] text-white" : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          <Sliders size={12} />
          General Settings
        </button>
        <button
          onClick={() => setActiveTab("ai")}
          className={`flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
            activeTab === "ai" ? "bg-white/[0.06] text-white" : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          <Sparkles size={12} />
          AI Config
        </button>
      </div>

      {/* Status notification */}
      {message && (
        <div className={`p-3 rounded-xl border text-[11px] font-medium transition-all ${
          message.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-rose-500/10 border-rose-500/20 text-rose-500"
        }`}>
          {message.text}
        </div>
      )}

      {/* General Settings Tab content */}
      {activeTab === "general" && (
        <div className="bg-[#0e0e10] border border-white/[0.06] rounded-2xl p-5 space-y-6">
          {/* User Profile info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User size={14} className="text-[#EF5A6F]" />
              <span className="text-[12px] font-bold text-white">General Profile</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-600">Display Name</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-3 py-2 text-[11px] text-white focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-600">Avatar Image Link</label>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={e => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-3 py-2 text-[11px] text-white focus:outline-none placeholder:text-neutral-800"
                />
              </div>
            </div>

            {/* Metadata metrics */}
            <div className="grid grid-cols-2 gap-4 border-t border-white/[0.04] pt-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.01] border border-white/[0.04]">
                <Clock size={16} className="text-[#7C3AED]" />
                <div>
                  <p className="text-[9px] text-neutral-600 font-mono uppercase tracking-widest leading-none">Focus Time</p>
                  <p className="text-[13px] font-black text-white mt-1">{focusHrs} hrs</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.01] border border-white/[0.04]">
                <Award size={16} className="text-[#EF5A6F]" />
                <div>
                  <p className="text-[9px] text-neutral-600 font-mono uppercase tracking-widest leading-none">Focus Streak</p>
                  <p className="text-[13px] font-black text-white mt-1">{streak} days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pomodoro parameters */}
          <div className="border-t border-white/[0.04] pt-5 space-y-4">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-[#EF5A6F]" />
              <span className="text-[12px] font-bold text-white">Deep Work Pomodoro Timing</span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-600">Focus Sprint (m)</label>
                <input
                  type="number"
                  value={focusLength}
                  onChange={e => setFocusLength(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-3 py-2 text-[11px] text-white focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-600">Short Break (m)</label>
                <input
                  type="number"
                  value={shortBreak}
                  onChange={e => setShortBreak(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-3 py-2 text-[11px] text-white focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-600">Long Break (m)</label>
                <input
                  type="number"
                  value={longBreak}
                  onChange={e => setLongBreak(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-3 py-2 text-[11px] text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] border border-white/[0.04]">
              <div className="space-y-0.5">
                <p className="text-[11px] font-bold text-white">Auto-start Breaks</p>
                <p className="text-[9px] text-neutral-600">Automatically switch from sprint to break interval when timer expires.</p>
              </div>
              <input
                type="checkbox"
                checked={autoStartBreaks}
                onChange={e => setAutoStartBreaks(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 accent-[#EF5A6F]"
              />
            </div>
          </div>

          {/* Preferences */}
          <div className="border-t border-white/[0.04] pt-5 space-y-4">
            <div className="flex items-center gap-2">
              <BellRing size={14} className="text-[#EF5A6F]" />
              <span className="text-[12px] font-bold text-white">Lofi Sound Defaults</span>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-600">Default Radio Volume: {soundVolume}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={soundVolume}
                onChange={e => setSoundVolume(e.target.value)}
                className="w-full h-1 bg-white/[0.05] rounded-lg appearance-none cursor-pointer accent-[#EF5A6F]"
              />
            </div>
          </div>

          <div className="flex pt-3 border-t border-white/[0.04]">
            <button
              onClick={handleSaveGeneral}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#EF5A6F] hover:bg-[#d94a5f] text-white text-[11px] font-bold rounded-xl transition-all shadow-lg shadow-[#EF5A6F]/20 ml-auto"
            >
              <Save size={12} />
              Save General Settings
            </button>
          </div>
        </div>
      )}

      {/* AI Config Tab content */}
      {activeTab === "ai" && (
        <div className="bg-[#0e0e10] border border-white/[0.06] rounded-2xl p-5 space-y-5">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#EF5A6F]" />
            <h2 className="text-[13px] font-bold text-white">AI Copilot Keys</h2>
            <span className="text-[8px] font-black bg-[#EF5A6F]/20 text-[#EF5A6F] px-1.5 py-0.5 rounded-md uppercase tracking-wider">
              Zero Server Logs
            </span>
          </div>

          <p className="text-[11px] text-neutral-500 leading-relaxed">
            Geass Copilot communicates directly with your chosen AI provider from the client using proxies. 
            Your API keys are stored safely inside your local browser storage and are never logged on our backend.
          </p>

          {/* Provider Selector */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-700 block">AI Provider</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "gemini", name: "Google Gemini", model: "Gemini 1.5 Flash" },
                { id: "openai", name: "OpenAI GPT", model: "GPT-4o Mini" },
                { id: "anthropic", name: "Anthropic Claude", model: "Claude 3.5 Haiku" },
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setProvider(p.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    provider === p.id
                      ? "bg-[#EF5A6F]/10 border-[#EF5A6F]/30 text-[#EF5A6F]"
                      : "border-white/[0.08] text-neutral-600 hover:text-neutral-300 hover:border-white/15"
                  }`}
                >
                  <p className="text-[11px] font-bold">{p.name}</p>
                  <p className="text-[9px] text-neutral-600 mt-0.5 font-medium">{p.model}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Key Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-700 block">API Key</label>
            <div className="relative">
              <Key size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-700 pointer-events-none" />
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="Paste your API key here…"
                className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl pl-9 pr-3 py-2 text-[11px] text-white focus:outline-none focus:border-[#EF5A6F]/50 transition-all font-mono"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t border-white/[0.04]">
            <button
              onClick={testConnection}
              disabled={loading}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-white/[0.08] bg-white/[0.03] text-neutral-500 text-[11px] font-semibold rounded-xl hover:bg-white/[0.06] hover:text-white transition-all disabled:opacity-50"
            >
              {loading ? <RefreshCw size={11} className="animate-spin" /> : <ShieldCheck size={12} />}
              Verify Connection
            </button>
            <button
              onClick={handleSaveAI}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#EF5A6F] hover:bg-[#d94a5f] text-white text-[11px] font-bold rounded-xl transition-all shadow-lg shadow-[#EF5A6F]/20 ml-auto"
            >
              <Save size={12} />
              Save Configuration
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
