"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft, Sparkles, Send, ListTodo, Zap, Clock, BarChart2 } from "lucide-react";

const QUICK_ACTIONS = [
  { icon: ListTodo, label: "Generate Task List",   desc: "Break down project into tasks" },
  { icon: Zap,      label: "Suggest Priorities",   desc: "AI suggests task priorities" },
  { icon: Clock,    label: "Estimate Timeline",    desc: "Get project time estimation" },
  { icon: BarChart2,label: "Summarize Progress",  desc: "AI summary of project status" },
];

const QUICK_PROMPTS = [
  "What should I work on next?",
  "Show me project risks",
  "Estimate remaining time",
  "Suggest improvements",
];

const BOT_RESPONSE: Record<string, string> = {
  "What should I work on next?": "Based on your current sprint, I recommend focusing on **Integrate AI Copilot** (30% complete) since it has a medium priority and is a dependency for several upcoming tasks. After that, tackle **Implement real-time notifications**.",
  "Show me project risks": "⚠️ **3 risks identified:**\n1. **Timeline** — 8 tasks in 'To Do' with May 30 deadline\n2. **Scope creep** — Backlog has 4 unplanned items\n3. **Testing** — Unit tests not started yet",
  "Estimate remaining time": "📊 At the current velocity (4 tasks/week), you need approximately **2.5 more weeks** to complete all remaining tasks. Consider breaking down the larger tasks.",
  "Suggest improvements": "💡 **3 recommendations:**\n1. Move 'Mobile app development' to a separate project\n2. Assign due dates to all backlog items\n3. Enable daily standups to track In Progress tasks",
};

export default function AICopilotPanel() {
  const [collapsed, setCollapsed] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([
    { role: "bot", text: "Hello Aditya! 👋\nHow can I help you with **Geass Redesign**?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg = { role: "user" as const, text };
    const botText = BOT_RESPONSE[text] ?? "I'm analyzing your project... Let me check the task distribution and timeline for you.";
    setMessages(m => [...m, userMsg, { role: "bot", text: botText }]);
    setInput("");
  };

  if (collapsed) {
    return (
      <div className="w-8 shrink-0 border-l border-white/[0.05] bg-[#0a0a0c] flex flex-col items-center pt-4">
        <button
          onClick={() => setCollapsed(false)}
          className="text-neutral-600 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/[0.06]"
        >
          <ChevronLeft size={14} />
        </button>
        <div className="mt-4 writing-mode-vertical text-[9px] text-neutral-700 font-mono uppercase tracking-widest rotate-90 whitespace-nowrap mt-8">
          AI Copilot
        </div>
      </div>
    );
  }

  return (
    <div className="w-[280px] shrink-0 border-l border-white/[0.05] bg-[#0a0a0c] flex flex-col min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05] shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles size={13} className="text-[#EF5A6F]" />
          <span className="text-[12px] font-bold text-white">AI Copilot</span>
          <span className="text-[8px] font-black bg-[#EF5A6F]/20 text-[#EF5A6F] px-1.5 py-0.5 rounded-md tracking-widest uppercase">Beta</span>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="text-neutral-700 hover:text-white transition-colors p-0.5 rounded hover:bg-white/[0.06]"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Avatar + greeting */}
      <div className="px-4 py-4 flex flex-col items-center text-center border-b border-white/[0.05] shrink-0">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#EF5A6F]/30 to-[#7C3AED]/30 border border-[#EF5A6F]/20 flex items-center justify-center mb-3">
          <div className="text-2xl">🤖</div>
        </div>
        {messages.length > 0 && (
          <div className="text-[11px] text-neutral-300 leading-relaxed whitespace-pre-line">
            {messages[0].text.split("**").map((part, i) =>
              i % 2 === 1 ? <strong key={i} className="text-[#EF5A6F]">{part}</strong> : <span key={i}>{part}</span>
            )}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="px-4 py-3 border-b border-white/[0.05] shrink-0">
        <p className="text-[9px] font-mono uppercase tracking-widest text-neutral-700 mb-2">Quick Actions</p>
        <div className="space-y-1.5">
          {QUICK_ACTIONS.map(({ icon: Icon, label, desc }) => (
            <button
              key={label}
              onClick={() => sendMessage(label)}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-[#EF5A6F]/[0.06] hover:border-[#EF5A6F]/20 transition-all group text-left"
            >
              <div className="w-6 h-6 rounded-lg bg-[#EF5A6F]/10 flex items-center justify-center shrink-0">
                <Icon size={11} className="text-[#EF5A6F]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-neutral-300 group-hover:text-white transition-colors">{label}</p>
                <p className="text-[9px] text-neutral-700 truncate">{desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 min-h-0 scrollbar-thin scrollbar-thumb-white/[0.08]">
        {messages.slice(1).map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[90%] text-[10px] leading-relaxed px-3 py-2 rounded-xl ${
              msg.role === "user"
                ? "bg-[#EF5A6F]/15 text-[#EF5A6F] border border-[#EF5A6F]/20"
                : "bg-white/[0.04] text-neutral-300 border border-white/[0.06]"
            }`}>
              {msg.text.split("**").map((part, j) =>
                j % 2 === 1 ? <strong key={j} className="text-white">{part}</strong> : <span key={j}>{part}</span>
              )}
            </div>
          </div>
        ))}

        {/* Ask Anything quick prompts */}
        {messages.length <= 1 && (
          <div>
            <p className="text-[9px] font-mono uppercase tracking-widest text-neutral-700 mb-2">Ask Anything</p>
            <div className="space-y-1">
              {QUICK_PROMPTS.map(p => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  className="w-full text-left text-[10px] text-neutral-500 hover:text-neutral-200 px-2.5 py-1.5 rounded-lg hover:bg-white/[0.04] transition-all"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-white/[0.05] shrink-0">
        <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 focus-within:border-[#EF5A6F]/30 transition-colors">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage(input)}
            placeholder="Type your message…"
            className="flex-1 bg-transparent text-[11px] text-neutral-300 placeholder:text-neutral-700 outline-none"
          />
          <button
            onClick={() => sendMessage(input)}
            className="text-[#EF5A6F]/50 hover:text-[#EF5A6F] transition-colors"
          >
            <Send size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
