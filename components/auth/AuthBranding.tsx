import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Zap } from "lucide-react";

const highlights = [
  "✨ AI plans your day",
  "⚡ Finish what matters",
  "🎯 Keep momentum moving",
];

const AuthBranding = () => {
  return (
    <div className="relative z-20 hidden w-full max-w-xl flex-col gap-8 rounded-[32px] border border-white/10 bg-[#0f172a]/90 p-8 backdrop-blur-2xl lg:flex">
      <div className="space-y-8">
        <div className="inline-flex items-center gap-3 text-white">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-[#EF5A6F]/25 bg-[#ef5a6f]/10 text-[#EF5A6F] shadow-[0_0_40px_rgba(239,90,111,0.18)] animate-pulse-slow">
            <Sparkles size={24} />
          </div>

          <span className="text-3xl font-black tracking-tight">GEASS</span>
        </div>

        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#EF5A6F]/25 bg-[#EF5A6F]/10 px-4 py-2 text-sm font-semibold text-[#FFE4EC] shadow-[0_0_30px_rgba(239,90,111,0.08)]">
            <Zap size={16} />
            Premium execution workflow
          </div>

          <h1 className="max-w-xl text-4xl font-black leading-tight text-white">
            Turn ideas into daily execution.
          </h1>

          <p className="max-w-lg text-lg leading-8 text-neutral-300">
            Build habits, prioritize what matters, and move faster with the
            right AI-powered workspace.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {highlights.map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-neutral-200"
          >
            <ShieldCheck size={18} className="text-[#EF5A6F]" />
            <span>{item}</span>
          </div>
        ))}

        <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-neutral-300 shadow-[0_0_30px_rgba(0,0,0,0.18)]">
          <p className="text-[0.85rem] uppercase tracking-[0.25em] text-[#EF5A6F]/80">
            Trusted by builders
          </p>
          <p className="mt-3 text-lg font-semibold text-white">
            10,000+ tasks launched with Geass
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#EF5A6F] transition hover:gap-3"
        >
          Explore the landing page
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default AuthBranding;
