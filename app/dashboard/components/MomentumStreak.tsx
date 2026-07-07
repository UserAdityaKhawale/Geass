"use client";

import { useGeassStore } from "@/store/useGeassStore";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const AreaChart = ({ data }: { data: number[] }) => {
  const max = Math.max(...data, 1); // Avoid division by zero
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
        <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#7C3AED" opacity={i === data.indexOf(Math.max(...data)) ? 1 : 0.5} />
      ))}
    </svg>
  );
};

export default function MomentumStreak() {
  const { activeWorkspaceId, focusSessions } = useGeassStore();

  const workspaceSessions = focusSessions.filter(s => s.workspaceId === activeWorkspaceId);

  // Group focus sessions completed by date
  const countsByDate: Record<string, number> = {};
  workspaceSessions.forEach(sess => {
    try {
      const dateStr = sess.completedAt.split("T")[0];
      countsByDate[dateStr] = (countsByDate[dateStr] || 0) + 1;
    } catch {}
  });

  // Calculate last 7 days metrics
  const today = new Date();
  const last7DaysData: number[] = [];
  const last7DaysLabels: string[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    last7DaysData.push(countsByDate[dateStr] || 0);
    last7DaysLabels.push(DAYS_OF_WEEK[d.getDay()]);
  }

  // Calculate continuous daily streak
  let streak = 0;
  let checkDate = new Date(today);

  // If nothing completed today, check starting from yesterday to allow streak preservation
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

  // Adjust for today if streak was completed today
  if (hasToday && streak === 0) {
    streak = 1;
  }

  return (
    <div className="h-full bg-[#0e0e10] border border-white/[0.06] rounded-2xl p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm">🔥</span>
        <span className="text-[12px] font-bold text-white">Momentum Streak</span>
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-[52px] font-black text-white leading-none tracking-tighter">{streak}</span>
        <span className="text-xl text-neutral-400 font-semibold mb-1">days</span>
      </div>

      <p className="text-[11px] text-neutral-500 leading-relaxed mb-auto">
        {streak > 0
          ? "Keep up the momentum! You're performing great."
          : "Start a focus session today to build your streak!"}
      </p>

      <div className="mt-4">
        <AreaChart data={last7DaysData} />
        <div className="grid grid-cols-7 mt-1.5">
          {last7DaysLabels.map((d, idx) => (
            <span key={idx} className="text-center text-[9px] text-neutral-700 font-mono">{d}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
