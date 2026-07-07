"use client";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DATA  = [8, 12, 6, 15, 10, 18, 14];

const AreaChart = ({ data }: { data: number[] }) => {
  const max = Math.max(...data);
  const W = 220; const H = 72;
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - (v / max) * (H - 8),
  }));
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p.x},${p.y}`).join(" ");
  const area = `${line}L${W},${H}L0,${H}Z`;
  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="sGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#7C3AED" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sGrad)" />
      <path d={line} fill="none" stroke="#7C3AED" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#7C3AED" opacity={i === DATA.indexOf(max) ? 1 : 0.5} />
      ))}
    </svg>
  );
};

export default function MomentumStreak() {
  return (
    <div className="h-full bg-[#0e0e10] border border-white/[0.06] rounded-2xl p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm">🔥</span>
        <span className="text-[12px] font-bold text-white">Momentum Streak</span>
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-[52px] font-black text-white leading-none tracking-tighter">23</span>
        <span className="text-xl text-neutral-400 font-semibold mb-1">days</span>
      </div>

      <p className="text-[11px] text-neutral-500 leading-relaxed mb-auto">
        Keep going! You&apos;re building<br />something great.
      </p>

      <div className="mt-4">
        <AreaChart data={DATA} />
        <div className="grid grid-cols-7 mt-1.5">
          {DAYS.map(d => (
            <span key={d} className="text-center text-[9px] text-neutral-700 font-mono">{d}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
