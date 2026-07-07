"use client";

import { motion } from "framer-motion";
import { 
  Sparkles, 
  Terminal, 
  Flame, 
  CheckCircle2,
  Zap,
  Target,
  Command,
  EyeOff
} from "lucide-react";

export default function BentoGrid() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#EF5A6F]/10 bg-[#EF5A6F]/5 px-3 py-1 text-[10px] uppercase tracking-widest text-[#EF5A6F] font-semibold mb-4">
            <Target size={12} />
            <span>Product Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
            Built for execution. <br />
            <span className="text-neutral-400 font-light">Shaped for focus.</span>
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-neutral-400 leading-relaxed font-semibold">
            Geass replaces scattered spreadsheets and chaotic note-taking apps with a single execution system designed to maintain your momentum.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px] sm:auto-rows-[280px]">
          
          {/* Card 1: CLARITY (Large Card) */}
          <div className="group relative rounded-3xl border border-white/5 bg-[#0a0a0c]/60 p-6 md:col-span-2 overflow-hidden flex flex-col justify-between hover:border-[#EF5A6F]/20 hover:bg-[#111114]/80 transition-all duration-300 shadow-xl">
            {/* Ambient card spotlight */}
            <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#EF5A6F]/5 blur-[70px] pointer-events-none group-hover:bg-[#EF5A6F]/10 transition-colors" />
            
            <div className="space-y-2 relative z-10">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#EF5A6F] font-black">Clarity</span>
              <h3 className="text-xl font-extrabold text-white mt-1">One source of truth for daily execution.</h3>
              <p className="text-xs text-neutral-400 max-w-sm font-semibold">
                Geass merges your checklists, calendars, and focus sessions into a single, cohesive canvas. Stop context switching and start executing.
              </p>
            </div>

            {/* Visual Element: Command Bar / Quick Logs */}
            <div className="relative z-10 mt-6 rounded-2xl border border-white/5 bg-[#030303]/80 p-4 shadow-2xl space-y-3 max-w-md">
              <div className="flex items-center justify-between text-[9px] font-mono text-neutral-500">
                <span className="flex items-center gap-1.5"><Terminal size={11} /> DAILY TIMELINE</span>
                <span className="text-[#EF5A6F] font-bold flex items-center gap-1">● ACTIVE FOCUS</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-xs py-2 px-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <CheckCircle2 size={12} className="text-[#EF5A6F]" />
                  <span className="line-through text-neutral-500 font-semibold">Refactor Auth State Provider</span>
                </div>
                <div className="flex items-center gap-3 text-xs py-2 px-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <div className="h-4 w-4 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[7px] text-amber-500">2</div>
                  <span className="text-neutral-200 font-semibold">Integrate bulge canvas background field</span>
                  <span className="ml-auto text-[9px] font-mono text-neutral-500">1:30 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: MOMENTUM (Small Card) */}
          <div className="group relative rounded-3xl border border-white/5 bg-[#0a0a0c]/60 p-6 md:col-span-1 overflow-hidden flex flex-col justify-between hover:border-[#EF5A6F]/20 hover:bg-[#111114]/80 transition-all duration-300 shadow-xl">
            <div className="absolute -left-20 -bottom-20 w-60 h-60 rounded-full bg-[#EF5A6F]/5 blur-[70px] pointer-events-none group-hover:bg-[#EF5A6F]/10 transition-colors" />

            <div className="space-y-2 relative z-10">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#EF5A6F] font-black">Momentum</span>
              <h3 className="text-xl font-extrabold text-white mt-1">Streaks that adapt to real life.</h3>
              <p className="text-xs text-neutral-400 font-semibold">
                Never lose momentum. Geass tracks your habits and auto-suggests buffer hours based on past metrics, keeping your consistency score alive even on busy days.
              </p>
            </div>

            {/* Visual Element: Pulse Streak Indicator */}
            <div className="relative z-10 flex items-center gap-4 bg-[#030303]/80 border border-white/5 p-4 rounded-2xl w-full shadow-lg">
              <motion.div 
                className="h-12 w-12 rounded-xl bg-[#EF5A6F]/10 flex items-center justify-center text-amber-500 shrink-0"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                <Flame size={24} className="fill-amber-500" />
              </motion.div>
              <div>
                <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block">consistency streak</span>
                <span className="text-base font-black text-white font-mono">14 Days Plan</span>
              </div>
              <div className="ml-auto flex gap-1">
                {[true, true, true, false, true].map((checked, i) => (
                  <div key={i} className={`h-4.5 w-1.5 rounded-full ${checked ? "bg-[#EF5A6F]" : "bg-white/5"}`} />
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: FOCUS (Small Card) */}
          <div className="group relative rounded-3xl border border-white/5 bg-[#0a0a0c]/60 p-6 md:col-span-1 overflow-hidden flex flex-col justify-between hover:border-[#EF5A6F]/20 hover:bg-[#111114]/80 transition-all duration-300 shadow-xl">
            <div className="absolute -right-20 -bottom-20 w-60 h-60 rounded-full bg-[#EF5A6F]/5 blur-[70px] pointer-events-none group-hover:bg-[#EF5A6F]/10 transition-colors" />

            <div className="space-y-2 relative z-10">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#EF5A6F] font-black">Focus</span>
              <h3 className="text-xl font-extrabold text-white mt-1">Deep focus is a shortcut away.</h3>
              <p className="text-xs text-neutral-400 font-semibold">
                A clean slate for your mind. Collapse secondary widgets instantly with a single keystroke, leaving only your primary milestone in view.
              </p>
            </div>

            {/* Visual Element: Minimal Keyboard shortcut pill */}
            <div className="relative z-10 flex flex-col justify-center gap-3 bg-[#030303]/80 border border-white/5 p-4 rounded-2xl w-full shadow-lg">
              <div className="flex items-center justify-between text-[9px] font-mono text-neutral-500">
                <span>FOCUS SHORTCUT</span>
                <span>CMD + ESC</span>
              </div>
              <div className="flex gap-2">
                <kbd className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 text-[10px] font-mono text-neutral-300 shadow">ESC</kbd>
                <span className="text-neutral-400 self-center text-xs">➔</span>
                <span className="rounded-lg border border-[#EF5A6F]/20 bg-[#EF5A6F]/5 px-3 py-1.5 text-[9px] font-mono text-[#ff8191] font-bold flex items-center gap-1">
                  <EyeOff size={11} /> COLLAPSE ALL
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: AI SMART PLANNER (Large Card) */}
          <div className="group relative rounded-3xl border border-white/5 bg-[#0a0a0c]/60 p-6 md:col-span-2 overflow-hidden flex flex-col justify-between hover:border-[#EF5A6F]/20 hover:bg-[#111114]/80 transition-all duration-300 shadow-xl">
            <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-[#8de2ff]/3 blur-[80px] pointer-events-none group-hover:bg-[#8de2ff]/5 transition-colors" />

            <div className="space-y-2 relative z-10">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#EF5A6F] font-black">Smart Planning</span>
                <span className="rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2.5 py-0.5 text-[8px] font-mono uppercase tracking-wider font-extrabold flex items-center gap-1">
                  <Sparkles size={8} /> Beta
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-white mt-1">Planning that respects your actual limits.</h3>
              <p className="text-xs text-neutral-400 max-w-sm font-semibold">
                Our capacity-aware planner flags potential over-commitments before they happen, automatically redistributing tasks to match your peak energy blocks.
              </p>
            </div>

            {/* Visual Element: AI suggestion bubble */}
            <div className="relative z-10 mt-6 rounded-2xl border border-white/10 bg-[#030303]/90 p-4 shadow-2xl flex items-start gap-4 max-w-md">
              <div className="p-2 rounded-xl bg-[#EF5A6F]/10 text-[#EF5A6F] shrink-0">
                <Zap size={16} className="fill-[#EF5A6F]" />
              </div>
              <div className="space-y-2">
                <p className="text-xs text-neutral-300 font-semibold leading-relaxed">
                  "Based on your performance log, you have high energy on Tuesday mornings. Let's schedule Deep Work at 9:00 AM."
                </p>
                <div className="flex gap-2 pt-1">
                  <button className="rounded-lg bg-[#EF5A6F] px-3.5 py-1.5 text-[9px] font-bold text-white uppercase tracking-wider hover:bg-[#ff6678] transition-colors cursor-pointer">Accept</button>
                  <button className="rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3.5 py-1.5 text-[9px] font-bold text-neutral-400 hover:text-white uppercase tracking-wider transition-colors cursor-pointer">Defer</button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
