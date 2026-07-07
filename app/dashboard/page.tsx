import GreetingHeader    from "./components/GreetingHeader";
import StatsRow          from "./components/StatsRow";
import MomentumStreak    from "./components/MomentumStreak";
import DailyTimeline     from "./components/DailyTimeline";
import TodaysTasks       from "./components/TodaysTasks";
import CalendarPreview   from "./components/CalendarPreview";
import PomodoroTimer     from "./components/PomodoroTimer";
import MusicPlayer       from "./components/MusicPlayer";
import ProjectsOverview  from "./components/ProjectsOverview";
import QuickNotes        from "./components/QuickNotes";
import ActivityFeed      from "./components/ActivityFeed";
import AnalyticsSnapshot from "./components/AnalyticsSnapshot";

export default function DashboardPage() {
  return (
    <div className="p-4 space-y-3 min-h-full">

      {/* ── Row 1: Greeting + Stats (left 67%) | Streak (right 33%) ── */}
      <div className="flex gap-3">
        <div className="flex-1 min-w-0 space-y-3">
          <GreetingHeader />
          <StatsRow />
        </div>
        {/* Streak spans both sub-rows */}
        <div className="w-[300px] shrink-0">
          <MomentumStreak />
        </div>
      </div>

      {/* ── Row 2: Timeline | Tasks | Calendar ── */}
      <div className="grid grid-cols-3 gap-3" style={{ height: "320px" }}>
        <DailyTimeline />
        <TodaysTasks />
        <CalendarPreview />
      </div>

      {/* ── Row 3: Pomodoro | Music | Projects | Notes ── */}
      <div className="grid grid-cols-4 gap-3">
        <PomodoroTimer />
        <MusicPlayer />
        <ProjectsOverview />
        <QuickNotes />
      </div>

      {/* ── Row 4: Activity | Analytics ── */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-5">
          <ActivityFeed />
        </div>
        <div className="col-span-7">
          <AnalyticsSnapshot />
        </div>
      </div>

    </div>
  );
}
