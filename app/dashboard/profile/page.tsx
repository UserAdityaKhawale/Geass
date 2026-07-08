"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Key, Cpu, Save } from "lucide-react";
import { useGeassStore } from "@/store/useGeassStore";
import { UserButton } from "@clerk/nextjs";

export default function ProfilePage() {
  const { workspaces, activeWorkspaceId, setActiveWorkspace } = useGeassStore();
  const [apiKey, setApiKey] = useState("sk-xxxxxxxxxxxxxxxxxx");
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const activeWorkspace = workspaces.find((w) => w._id === activeWorkspaceId);

  const handleSaveKey = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Profile</h1>
          <p className="text-xs text-neutral-500">Manage your account, keys, and workspace.</p>
        </div>
        <UserButton appearance={{ elements: { avatarBox: "w-10 h-10 rounded-xl border border-white/[0.08]" } }} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0e0e10] border border-white/[0.08] rounded-2xl p-4 space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EF5A6F]/15 border border-[#EF5A6F]/20 flex items-center justify-center">
              <User size={16} className="text-[#EF5A6F]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Account</h2>
              <p className="text-[11px] text-neutral-500">Your personal workspace configuration</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Active Workspace</label>
              <div className="mt-1 bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 flex items-center gap-2">
                <span className="text-lg">{activeWorkspace?.icon || "📁"}</span>
                <span className="text-sm font-medium text-white">{activeWorkspace?.name || "Default Workspace"}</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Workspaces</label>
              <div className="mt-1 space-y-1.5">
                {workspaces.map((ws) => (
                  <button
                    key={ws._id}
                    onClick={() => setActiveWorkspace(ws._id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                      activeWorkspaceId === ws._id
                        ? "bg-white/[0.06] text-white border border-white/[0.08]"
                        : "text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.02]"
                    }`}
                  >
                    <span>{ws.icon}</span>
                    {ws.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* API Keys Card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-[#0e0e10] border border-white/[0.08] rounded-2xl p-4 space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#7C3AED]/15 border border-[#7C3AED]/20 flex items-center justify-center">
              <Key size={16} className="text-[#7C3AED]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">API Keys</h2>
              <p className="text-[11px] text-neutral-500">External integration keys for automations</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">OpenAI Key</label>
              <div className="mt-1 relative">
                <input
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C3AED]/50"
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                >
                  {showKey ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              onClick={handleSaveKey}
              className="flex items-center justify-center gap-2 w-full bg-[#7C3AED] text-white text-xs font-bold py-2 rounded-xl hover:bg-[#6d28d9] transition-all"
            >
              {isSaved ? (
                <>
                  <Save size={12} />
                  Saved
                </>
              ) : (
                <>
                  <Save size={12} />
                  Save Key
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* System Info Card (wide Card Card (full width) */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2 bg-[#0e0e10] border border-white/[0.08] rounded-2xl p-4 space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#22c55e]/15 border border-[#22c55e]/20 flex items-center justify-center">
              <Cpu size={16} className="text-[#22c55e]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">System</h2>
              <p className="text-[11px] text-neutral-500">Geass runtime information</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3">
              <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Version</div>
              <div className="text-xs text-white mt-1">1.0.0</div>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3">
              <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Status</div>
              <div className="text-xs text-[#22c55e] mt-1">Online</div>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3">
              <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Storage</div>
              <div className="text-xs text-white mt-1">LocalStorage</div>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3">
              <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Theme</div>
              <div className="text-xs text-white mt-1">Dark</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
