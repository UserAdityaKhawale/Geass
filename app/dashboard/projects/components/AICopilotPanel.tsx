"use client";

import { useState } from "react";
import Link from "next/link";
import { useGeassStore } from "@/store/useGeassStore";
import { ChevronRight, ChevronLeft, Sparkles, Send, ListTodo, Zap, Clock, BarChart2 } from "lucide-react";

const QUICK_ACTIONS = [
  { label: "Generate Task List",   desc: "AI creates a starter task list" },
  { label: "Suggest Priorities",   desc: "AI recommends task sorting" },
  { label: "Estimate Timeline",    desc: "AI estimates hours to complete" },
  { label: "Summarize Progress",  desc: "AI reports current progress" },
];

const QUICK_PROMPTS = [
  "What should I work on next?",
  "Show me project risks",
  "Estimate remaining time",
  "Suggest improvements",
];

interface Props {
  projectId: string | null;
}

export default function AICopilotPanel({ projectId }: Props) {
  const { activeWorkspaceId, projects, tasks, addTask, updateTask } = useGeassStore();
  const [collapsed, setCollapsed] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "bot" | "system"; text: string }[]>([
    { role: "bot", text: "Hello Aditya! 👋\nHow can I help you with your project?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const project = projects.find((p) => p._id === projectId);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      // 1. Gather API keys from localStorage
      const apiKey = localStorage.getItem("geass_ai_api_key");
      const provider = localStorage.getItem("geass_ai_provider") || "gemini";

      if (!apiKey) {
        setMessages((m) => [
          ...m,
          {
            role: "system",
            text: "⚠️ No API Key found. Please configure your key in Settings first.",
          },
        ]);
        setLoading(false);
        return;
      }

      // 2. Gather context
      const projectTasks = tasks.filter((t) => t.projectId === projectId);
      const context = {
        projectName: project?.name || "General Workspace",
        workspaceId: activeWorkspaceId,
        tasks: projectTasks.map((t) => ({
          id: t._id,
          title: t.title,
          status: t.status,
          priority: t.priority,
          tag: t.tag,
        })),
      };

      // 3. Request proxy
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: text,
          context,
          provider,
          apiKey,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "LLM communication failed");
      }

      const json = await res.json();

      // Add assistant response
      setMessages((m) => [...m, { role: "bot", text: json.response }]);

      // Execute commands
      if (json.commands && Array.isArray(json.commands)) {
        for (const cmd of json.commands) {
          if (cmd.action === "create_task" && activeWorkspaceId) {
            addTask({
              _id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
              workspaceId: activeWorkspaceId,
              projectId: projectId || undefined,
              title: cmd.title,
              priority: cmd.priority || "medium",
              status: "todo",
              orderIndex: projectTasks.length,
              tag: cmd.tag,
            });
          } else if (cmd.action === "update_task_status") {
            updateTask(cmd.taskId, { status: cmd.status });
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      setMessages((m) => [
        ...m,
        { role: "system", text: `❌ Error: ${err.message || "Failed to fetch AI response"}` },
      ]);
    } finally {
      setLoading(false);
    }
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
          <span className="text-[8px] font-black bg-[#EF5A6F]/20 text-[#EF5A6F] px-1.5 py-0.5 rounded-md tracking-widest uppercase">
            Beta
          </span>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="text-neutral-700 hover:text-white transition-colors p-0.5 rounded hover:bg-white/[0.06]"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Greeting info */}
      {project && (
        <div className="px-4 py-3 bg-white/[0.01] border-b border-white/[0.04] text-[10px] text-neutral-600 font-medium">
          Context scoped to: <strong className="text-white">{project.name}</strong>
        </div>
      )}

      {/* Quick Actions */}
      <div className="px-4 py-3 border-b border-white/[0.05] shrink-0">
        <p className="text-[9px] font-mono uppercase tracking-widest text-neutral-700 mb-2">
          Quick Actions
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {QUICK_ACTIONS.map(({ label, desc }) => (
            <button
              key={label}
              disabled={loading}
              onClick={() => sendMessage(label)}
              className="flex flex-col gap-1 p-2 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-[#EF5A6F]/[0.06] hover:border-[#EF5A6F]/20 transition-all text-left disabled:opacity-50"
            >
              <span className="text-[9px] font-bold text-neutral-300">{label}</span>
              <span className="text-[7px] text-neutral-700 leading-tight">{desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 min-h-0 scrollbar-thin scrollbar-thumb-white/[0.08]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[90%] text-[10px] leading-relaxed px-3 py-2 rounded-xl ${
                msg.role === "user"
                  ? "bg-[#EF5A6F]/15 text-[#EF5A6F] border border-[#EF5A6F]/20"
                  : msg.role === "system"
                  ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                  : "bg-white/[0.04] text-neutral-300 border border-white/[0.06]"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/[0.04] px-3 py-2 rounded-xl border border-white/[0.06] flex items-center gap-1.5 text-[9px] text-neutral-500">
              <div className="w-1.5 h-1.5 rounded-full bg-[#EF5A6F] animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-[#EF5A6F] animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-[#EF5A6F] animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        {messages.length <= 1 && (
          <div>
            <p className="text-[9px] font-mono uppercase tracking-widest text-neutral-700 mb-2">
              Ask Anything
            </p>
            <div className="space-y-1">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p}
                  disabled={loading}
                  onClick={() => sendMessage(p)}
                  className="w-full text-left text-[10px] text-neutral-500 hover:text-neutral-200 px-2.5 py-1.5 rounded-lg hover:bg-white/[0.04] transition-all disabled:opacity-50"
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
            disabled={loading}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Type your message…"
            className="flex-1 bg-transparent text-[11px] text-neutral-300 placeholder:text-neutral-700 outline-none disabled:opacity-50"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading}
            className="text-[#EF5A6F]/50 hover:text-[#EF5A6F] transition-colors disabled:opacity-50"
          >
            <Send size={13} />
          </button>
        </div>
        <div className="mt-1.5 text-center">
          <Link
            href="/dashboard/settings"
            className="text-[9px] text-[#EF5A6F]/50 hover:text-[#EF5A6F] transition-colors hover:underline"
          >
            Configure API keys & provider
          </Link>
        </div>
      </div>
    </div>
  );
}
