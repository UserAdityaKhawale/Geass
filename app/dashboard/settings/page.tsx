"use client";

import { useState, useEffect } from "react";
import { Sparkles, Save, ShieldCheck, Key, RefreshCw } from "lucide-react";

export default function SettingsPage() {
  const [provider, setProvider] = useState("gemini");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load initial settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProvider = localStorage.getItem("geass_ai_provider") || "gemini";
      const storedKey = localStorage.getItem("geass_ai_api_key") || "";
      setProvider(storedProvider);
      setApiKey(storedKey);
    }
  }, []);

  const handleSave = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("geass_ai_provider", provider);
      localStorage.setItem("geass_ai_api_key", apiKey);

      setMessage({ type: "success", text: "Settings saved successfully! You can now use AI Copilot." });
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
      <div>
        <h1 className="text-[20px] font-black text-white tracking-tight">Settings</h1>
        <p className="text-[12px] text-neutral-500 mt-1">Configure your personal command center integrations.</p>
      </div>

      {/* AI Copilot Configuration Card */}
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

        {/* Status notification */}
        {message && (
          <div className={`p-3 rounded-xl border text-[11px] font-medium ${
            message.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-rose-500/10 border-rose-500/20 text-rose-500"
          }`}>
            {message.text}
          </div>
        )}

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
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#EF5A6F] hover:bg-[#d94a5f] text-white text-[11px] font-bold rounded-xl transition-all shadow-lg shadow-[#EF5A6F]/20 ml-auto"
          >
            <Save size={12} />
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
