"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import DotField from "../../app/(marketing)/DotField";

type AuthLayoutProps = {
  children: ReactNode;
};

const FEATURE_PILLS = [
  { icon: "⚡", label: "AI-scheduled daily plans" },
  { icon: "🔥", label: "Habit streak tracking" },
  { icon: "🎯", label: "Deep focus sessions" },
];

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <main className="w-screen h-screen flex bg-[#030303] overflow-hidden">

      {/* ── LEFT PANEL (Desktop only) ── */}
      <div className="hidden lg:flex lg:w-[52%] h-full bg-[#0a0a0c] relative flex-col overflow-hidden border-r border-white/[0.04]">

        {/* DotField canvas — full panel */}
        <DotField
          dotRadius={1.5}
          dotSpacing={14}
          cursorRadius={160}
          cursorForce={0.14}
          bulgeStrength={34}
          glowRadius={120}
          glowColor="#5a1a1a"
          gradientFrom="#7C3AED"
          gradientTo="#ef0707"
          className="absolute inset-0 h-full w-full opacity-60 pointer-events-auto"
        />

        {/* Top vignette so dots fade near top */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#0a0a0c] to-transparent pointer-events-none z-10" />
        {/* Bottom vignette so copy is readable */}
        <div className="absolute bottom-0 inset-x-0 h-72 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/80 to-transparent pointer-events-none z-10" />

        {/* Ambient pink orb top-right */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#EF5A6F]/8 blur-[100px] pointer-events-none z-0" />
        {/* Ambient purple orb bottom-left */}
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[#7C3AED]/6 blur-[90px] pointer-events-none z-0" />

        {/* ── Top: Logo ── */}
        <div className="relative z-20 p-10 pb-0">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <img
              src="/geass-logo.png"
              alt="Geass Logo"
              className="h-7 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(239,90,111,0.4)] group-hover:drop-shadow-[0_0_14px_rgba(239,90,111,0.6)] transition-all duration-300"
            />
            <span className="text-[17px] font-black tracking-widest text-white uppercase opacity-90 group-hover:opacity-100 transition-opacity">
              Geass
            </span>
          </Link>
        </div>

        {/* ── Center: Main Copy ── */}
        <div className="relative z-20 flex-1 flex flex-col justify-center px-10 py-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#EF5A6F]/20 bg-[#EF5A6F]/8 px-3 py-1 text-[9px] uppercase tracking-[0.2em] text-[#EF5A6F] font-bold mb-3 w-fit">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#EF5A6F] animate-pulse" />
            Premium execution workspace
          </div>

          {/* Headline */}
          <h1 className="text-3xl xl:text-4xl font-black text-white uppercase tracking-tight leading-[1.0] mb-3">
            Turn ideas<br />
            <span className="text-[#EF5A6F]">into</span> daily<br />
            execution.
          </h1>

          {/* Sub-description */}
          <p className="text-xs text-neutral-400 font-medium leading-relaxed max-w-xs mb-4">
            A workspace that helps you ship more, stay consistent, and actually finish what you start.
          </p>

          {/* Feature pills */}
          <div className="flex flex-col gap-1.5">
            {FEATURE_PILLS.map((pill) => (
              <div
                key={pill.label}
                className="inline-flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-neutral-300 w-fit backdrop-blur-sm"
              >
                <span className="text-sm">{pill.icon}</span>
                {pill.label}
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom: Social Proof ── */}
        <div className="relative z-20 px-10 pb-6">
          <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 backdrop-blur-sm">
            {/* Star rating */}
            <div className="flex gap-0.5 shrink-0">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-3 h-3 text-[#EF5A6F]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-[11px] text-neutral-400 font-medium leading-tight">
              <span className="text-white font-semibold">"Finally an app that doesn't get in the way."</span>
              <span className="block text-neutral-500 mt-0.5 text-[10px]">— 10,000+ tasks launched with Geass</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: Auth Form ── */}
      <div className="w-full lg:w-[48%] h-full bg-[#030303] relative flex items-start justify-center overflow-y-auto">

        {/* Ambient pink glow top-right of form panel */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[#EF5A6F]/6 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-[#7C3AED]/5 blur-[80px] pointer-events-none" />

        {/* Back to home — pinned top-left */}
        <div className="absolute top-5 left-6 z-20">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-neutral-500 hover:text-white transition-colors duration-200 group"
          >
            <svg
              className="w-3 h-3 transition-transform duration-200 group-hover:-translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to home
          </Link>
        </div>

        <div className="relative z-10 w-full max-w-[400px] px-6 pt-6 pb-4 sm:px-8 flex flex-col gap-3">

          {/* Logo — always visible on right column */}
          <div className="flex justify-center">
            <Link href="/" className="inline-flex items-center gap-1.5 hover:opacity-80 transition-opacity group">
              <img
                src="/geass-logo.png"
                alt="Geass"
                className="h-5 w-auto object-contain filter drop-shadow-[0_0_6px_rgba(239,90,111,0.35)]"
              />
              <span className="text-[13px] font-black tracking-widest text-white uppercase">
                Geass
              </span>
            </Link>
          </div>

          {/* Thin divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Clerk Component */}
          <div className="w-full">
            {children}
          </div>

          {/* Bottom micro-footer */}
          <div className="flex justify-between items-center text-[9px] font-mono text-neutral-600 uppercase tracking-widest">
            <span>© {new Date().getFullYear()} Geass</span>
            <span>Powered by execution</span>
          </div>

        </div>
      </div>

    </main>
  );
};

export default AuthLayout;
