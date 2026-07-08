"use client";

import { useState, useRef, useEffect } from "react";
import { useGeassStore } from "@/store/useGeassStore";
import { CheckCircle2, Timer, Zap, Layers, History, Award, MessageSquare, Send, X, Loader2, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function AnalyticsPage() {
  const { activeWorkspaceId, tasks, focusSessions, notes } = useGeassStore();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const workspaceTasks = tasks.filter(t => t.workspaceId === activeWorkspaceId);
  const workspaceSessions = focusSessions.filter(s => s.workspaceId === activeWorkspaceId);
  const workspaceNotes = notes.filter(n => n.workspaceId === activeWorkspaceId);

  // Stats aggregate calculations
  const totalCompletedTasks = workspaceTasks.filter(t => t.status === "done").length;
  const totalTasksCount = workspaceTasks.length;

  const totalFocusMinutes = workspaceSessions.reduce((acc, curr) => acc + curr.duration, 0);
  const focusHrs = Math.floor(totalFocusMinutes / 60);
  const focusMins = totalFocusMinutes % 60;
  const focusTimeStr = focusHrs > 0 ? `${focusHrs}h ${focusMins}m` : `${focusMins}m`;

  const totalTasksInWorkspace = workspaceTasks.length;

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

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Read API key + provider saved by the Settings page
    const apiKey = typeof window !== "undefined" ? localStorage.getItem("geass_ai_api_key") || "" : "";
    const provider = typeof window !== "undefined" ? localStorage.getItem("geass_ai_provider") || "gemini" : "gemini";

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Guard: no API key configured
    if (!apiKey.trim()) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "⚙️ No API key found. Please go to **Settings → AI Config**, paste your API key, and click Save.",
        },
      ]);
      setIsLoading(false);
      return;
    }

    try {
      const context = {
        tasks: workspaceTasks.map(t => ({ _id: t._id, title: t.title, status: t.status, priority: t.priority, dueDate: t.dueDate })),
        focusSessions: workspaceSessions.map(s => ({ _id: s._id, duration: s.duration, type: s.type, completedAt: s.completedAt })),
        notes: workspaceNotes.map(n => ({ _id: n._id, title: n.title, snippet: n.snippet })),
        stats: {
          totalCompletedTasks,
          totalTasksCount,
          totalFocusMinutes,
          streak,
        },
      };

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: inputValue,
          context,
          provider,
          apiKey,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response || "Here's what I found!",
        },
      ]);
    } catch (err: any) {
      console.error("Chat error:", err);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `❌ ${err.message || "Something went wrong. Please try again."}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[20px] font-black text-white tracking-tight">Analytics Workspace</h1>
          <p className="text-[12px] text-neutral-500 mt-1">Real-time productivity summary metrics for your active workspace.</p>
        </div>
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-[#EF5A6F] text-white text-sm font-bold rounded-xl hover:bg-[#d94a5f] transition-all shadow-lg shadow-[#EF5A6F]/20"
        >
          <MessageSquare size={16} />
          <span>AI Assistant</span>
        </button>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: CheckCircle2, label: "Tasks Completed", value: String(totalCompletedTasks), sub: `/ ${totalTasksCount} total`, color: "#22c55e" },
          { icon: Timer, label: "Total Focus Time", value: focusTimeStr, sub: `${workspaceSessions.length} sessions`, color: "#7C3AED" },
          { icon: Award, label: "Current Streak", value: `${streak} days`, sub: "focus target streak", color: "#EF5A6F" },
          { icon: Layers, label: "Total Tasks", value: String(totalTasksInWorkspace), sub: "in workspace", color: "#f59e0b" },
        ].map(card => (
          <div key={card.label} className="bg-transparent backdrop-blur-sm border border-white/[0.06] rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${card.color}15` }}>
                <card.icon size={13} style={{ color: card.color }} />
              </div>
              <span className="text-[9px] font-semibold text-neutral-500 uppercase tracking-wide truncate">{card.label}</span>
            </div>
            <div>
              <p className="text-[20px] font-black text-white leading-none tracking-tight">{card.value}</p>
              <p className="text-[9px] text-neutral-600 font-medium mt-1">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Detail History Panels */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent Completed Tasks */}
        <div className="bg-transparent backdrop-blur-sm border border-white/[0.06] rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-[#22c55e]" />
            <h2 className="text-[13px] font-bold text-white">Recent Completed Tasks</h2>
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/[0.08]">
            {workspaceTasks.filter(t => t.status === "done").slice(0, 8).map(task => (
              <div key={task._id} className="flex justify-between items-center p-2.5 bg-white/[0.01] border border-white/[0.04] rounded-xl text-[11px] text-neutral-300">
                <span className="truncate flex-1 pr-3 font-semibold">{task.title}</span>
                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded uppercase text-neutral-600 bg-white/[0.04] shrink-0">
                  {task.priority}
                </span>
              </div>
            ))}
            {workspaceTasks.filter(t => t.status === "done").length === 0 && (
              <div className="text-center py-10 text-neutral-700 text-[11px]">No completed tasks logged yet.</div>
            )}
          </div>
        </div>

        {/* Completed Focus Sessions Log */}
        <div className="bg-transparent backdrop-blur-sm border border-white/[0.06] rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <History size={14} className="text-[#7C3AED]" />
            <h2 className="text-[13px] font-bold text-white">Focus Sessions History</h2>
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/[0.08]">
            {workspaceSessions.slice(0, 8).map(sess => (
              <div key={sess._id} className="flex justify-between items-center p-2.5 bg-white/[0.01] border border-white/[0.04] rounded-xl text-[11px] text-neutral-300">
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold capitalize">{sess.type.replace("_", " ")} Session</span>
                  <span className="text-[8px] text-neutral-600 font-mono">
                    {sess.completedAt ? new Date(sess.completedAt).toLocaleString() : "Recently"}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[#7C3AED] shrink-0">
                  {sess.duration} mins
                </span>
              </div>
            ))}
            {workspaceSessions.length === 0 && (
              <div className="text-center py-10 text-neutral-700 text-[11px]">No focus sessions logged yet.</div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Widget */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-96 max-w-[90vw] bg-[#0a0a0c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            {/* Chat Header */}
            <div className="flex justify-between items-center p-4 border-b border-white/10 bg-[#EF5A6F]/10">
              <div className="flex items-center gap-2">
                <Bot size={20} className="text-[#EF5A6F]" />
                <h3 className="text-white font-bold">AI Assistant</h3>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="p-4 max-h-80 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-white/10">
              {messages.length === 0 && (
                <div className="text-center text-neutral-500 text-sm py-8">
                  Ask me about your productivity or billing!
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-[#7C3AED]/20 flex items-center justify-center shrink-0">
                      <Bot size={16} className="text-[#7C3AED]" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-xl text-sm ${
                      msg.role === "user"
                        ? "bg-[#EF5A6F] text-white"
                        : "bg-white/5 text-neutral-300 border border-white/10"
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <User size={16} className="text-white" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#7C3AED]/20 flex items-center justify-center shrink-0">
                    <Bot size={16} className="text-[#7C3AED]" />
                  </div>
                  <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-neutral-400" />
                    <span className="text-neutral-400 text-sm">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask about your stats or billing..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#EF5A6F]/50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="px-4 py-2 bg-[#EF5A6F] text-white rounded-xl hover:bg-[#d94a5f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
