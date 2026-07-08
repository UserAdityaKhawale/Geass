"use client";

import { useGeassStore } from "@/store/useGeassStore";
import GreetingHeader from "./components/GreetingHeader";
import StatsRow from "./components/StatsRow";
import MomentumStreak from "./components/MomentumStreak";
import DailyTimeline from "./components/DailyTimeline";
import TodaysTasks from "./components/TodaysTasks";
import CalendarPreview from "./components/CalendarPreview";
import PomodoroTimer from "./components/PomodoroTimer";
import MusicPlayer from "./components/MusicPlayer";
import QuickNotes from "./components/QuickNotes";
import ActivityFeed from "./components/ActivityFeed";
import AnalyticsSnapshot from "./components/AnalyticsSnapshot";
import BentoDragGrid from "./components/BentoDragGrid";

// ─── Widget definitions for each sortable row ─────────────────────────────────

/** Row 2 — Timeline, Tasks, Calendar (3-col grid) */
const ROW2_WIDGETS = [
  {
    id: "timeline",
    label: "Today's Timeline",
    colSpan: "col-span-1",
    component: <DailyTimeline />,
  },
  {
    id: "tasks",
    label: "Today's Tasks",
    colSpan: "col-span-1",
    component: <TodaysTasks />,
  },
  {
    id: "calendar",
    label: "Calendar Preview",
    colSpan: "col-span-1",
    component: <CalendarPreview />,
  },
];

/** Row 3 — Pomodoro, Music, Notes (3-col grid) */
const ROW3_WIDGETS = [
  {
    id: "pomodoro",
    label: "Pomodoro Timer",
    colSpan: "col-span-1",
    component: <PomodoroTimer />,
  },
  {
    id: "music",
    label: "Music & White Noise",
    colSpan: "col-span-1",
    component: <MusicPlayer />,
  },
  {
    id: "notes",
    label: "Quick Notes",
    colSpan: "col-span-1",
    component: <QuickNotes />,
  },
];

/** Row 4 — Activity Feed, Analytics (5+7 of 12) */
const ROW4_WIDGETS = [
  {
    id: "activity",
    label: "Activity Log",
    colSpan: "col-span-5",
    component: <ActivityFeed />,
  },
  {
    id: "analytics",
    label: "Analytics Snapshot",
    colSpan: "col-span-7",
    component: <AnalyticsSnapshot />,
  },
];

// ─── Skeleton fallback ────────────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="p-4 space-y-3 min-h-full">
      <div className="flex gap-3">
        <div className="flex-1 min-w-0 space-y-3">
          <div className="h-10 bg-[#0e0e10] border border-white/[0.04] rounded-2xl animate-pulse" />
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-16 bg-[#0e0e10] border border-white/[0.04] rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </div>
        <div className="w-[300px] shrink-0 h-[120px] bg-[#0e0e10] border border-white/[0.04] rounded-2xl animate-pulse" />
      </div>
      <div className="grid grid-cols-3 gap-3 h-[320px]">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-full bg-[#0e0e10] border border-white/[0.04] rounded-2xl animate-pulse"
          />
        ))}
      </div>
      <div className="grid grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 bg-[#0e0e10] border border-white/[0.04] rounded-2xl animate-pulse"
          />
        ))}
      </div>
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-5 h-44 bg-[#0e0e10] border border-white/[0.04] rounded-2xl animate-pulse" />
        <div className="col-span-7 h-44 bg-[#0e0e10] border border-white/[0.04] rounded-2xl animate-pulse" />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { isHydrated } = useGeassStore();

  if (!isHydrated) return <DashboardSkeleton />;

  return (
    <div className="min-h-full space-y-3 p-3 sm:p-4">
      {/* ── Row 1: Greeting + Stats | Streak ─────── fixed, not draggable ── */}
      <div className="flex flex-col gap-3 xl:flex-row">
        <div className="min-w-0 flex-1 space-y-3">
          <GreetingHeader />
          <StatsRow />
        </div>
        <div className="w-full shrink-0 xl:w-[300px]">
          <MomentumStreak />
        </div>
      </div>

      {/* ── Row 2: Timeline | Tasks | Calendar  ──── draggable ── */}
      <BentoDragGrid
        widgets={ROW2_WIDGETS}
        storageKey="geass-bento-row2"
        gridClass="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3"
        className="min-h-[320px]"
      />

      {/* ── Row 3: Pomodoro | Music | Projects | Notes  ── draggable ── */}
      <BentoDragGrid
        widgets={ROW3_WIDGETS}
        storageKey="geass-bento-row3"
        gridClass="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-4"
      />

      {/* ── Row 4: Activity | Analytics  ──────────── draggable ── */}
      <BentoDragGrid
        widgets={ROW4_WIDGETS}
        storageKey="geass-bento-row4"
        gridClass="grid grid-cols-1 gap-3 xl:grid-cols-12"
      />
    </div>
  );
}
