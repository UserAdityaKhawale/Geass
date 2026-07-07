"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckSquare, 
  Square, 
  Calendar, 
  Activity, 
  Flame, 
  Play, 
  Pause, 
  RotateCcw,
  Sparkles, 
  Plus, 
  CheckCircle2, 
  Timer,
  BarChart2,
  ListTodo
} from "lucide-react";

// Types
type TabType = "planner" | "habits" | "analytics" | "focus";

interface Task {
  id: number;
  text: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
}

interface Habit {
  id: number;
  name: string;
  streak: number;
  history: boolean[]; // Mon-Sun
}

const InteractiveDemo = () => {
  const [activeTab, setActiveTab] = useState<TabType>("planner");
  
  // Tab 1: Planner State
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: "Finalize Geass landing page concept", completed: true, priority: "high" },
    { id: 2, text: "Install framer-motion interactive components", completed: true, priority: "high" },
    { id: 3, text: "Build daily checklist visual demo", completed: false, priority: "medium" },
    { id: 4, text: "Configure global smooth scroll & GSAP reveals", completed: false, priority: "medium" },
    { id: 5, text: "Test responsive styles on all breakpoints", completed: false, priority: "low" },
  ]);
  const [newTaskText, setNewTaskText] = useState("");

  // Tab 2: Habits State
  const [habits, setHabits] = useState<Habit[]>([
    { id: 1, name: "Deep Focus (4 hours)", streak: 12, history: [true, true, true, true, false, false, false] },
    { id: 2, name: "Read 20 pages", streak: 5, history: [true, true, true, false, true, false, false] },
    { id: 3, name: "Gym session", streak: 3, history: [false, true, false, true, false, true, false] },
  ]);

  // Tab 4: Focus Timer State
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerActive, setTimerActive] = useState(false);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Tab 1 logic: Toggle task
  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // Add task
  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask: Task = {
      id: Date.now(),
      text: newTaskText,
      completed: false,
      priority: "medium"
    };
    setTasks([...tasks, newTask]);
    setNewTaskText("");
  };

  // Tab 2 logic: Toggle habit day
  const toggleHabitDay = (habitId: number, dayIdx: number) => {
    setHabits(habits.map(h => {
      if (h.id === habitId) {
        const nextHistory = [...h.history];
        nextHistory[dayIdx] = !nextHistory[dayIdx];
        
        // Simple streak recalculation based on consecutive trues
        let currentStreak = 0;
        for (let i = nextHistory.length - 1; i >= 0; i--) {
          if (nextHistory[i]) currentStreak++;
          else if (currentStreak > 0) break;
        }
        return {
          ...h,
          history: nextHistory,
          streak: h.streak + (nextHistory[dayIdx] ? 1 : -1)
        };
      }
      return h;
    }));
  };

  // Tab 4 logic: Focus Timer
  useEffect(() => {
    if (timerActive) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current!);
            setTimerActive(false);
            return 25 * 60; // Reset
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timerActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTimerSeconds(25 * 60);
  };

  // Calculate stats for planner progress
  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="w-full max-w-5xl rounded-[28px] border border-neutral-200 dark:border-white/5 bg-white/90 dark:bg-[#0a0a0c]/60 p-4 md:p-6 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
      
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#EF5A6F]/5 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#8de2ff]/3 blur-[90px] pointer-events-none" />
      
      {/* Header bar of mock dashboard */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-white/5 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
          <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase ml-2">Workspace://geass-sandbox</span>
        </div>
        
        {/* Dynamic active status label */}
        <div className="flex items-center gap-2 rounded-full border border-[#EF5A6F]/10 bg-[#EF5A6F]/5 px-3 py-1 text-[10px] text-[#ff8191] font-mono font-medium">
          <Sparkles size={10} className="animate-spin-slow" />
          <span>Interactive Preview</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6 relative z-10">
        
        {/* Sidebar */}
        <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 border-b md:border-b-0 md:border-r border-neutral-200 dark:border-white/5 pr-0 md:pr-4">
          <button
            onClick={() => setActiveTab("planner")}
            className={`flex items-center gap-2.5 w-full rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              activeTab === "planner" 
                ? "bg-[#EF5A6F] text-white shadow-[0_4px_20px_rgba(239,90,111,0.25)]" 
                : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            <ListTodo size={14} />
            <span>Planner</span>
          </button>
          
          <button
            onClick={() => setActiveTab("habits")}
            className={`flex items-center gap-2.5 w-full rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              activeTab === "habits" 
                ? "bg-[#EF5A6F] text-white shadow-[0_4px_20px_rgba(239,90,111,0.25)]" 
                : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            <Calendar size={14} />
            <span>Habits</span>
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-2.5 w-full rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              activeTab === "analytics" 
                ? "bg-[#EF5A6F] text-white shadow-[0_4px_20px_rgba(239,90,111,0.25)]" 
                : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            <BarChart2 size={14} />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab("focus")}
            className={`flex items-center gap-2.5 w-full rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              activeTab === "focus" 
                ? "bg-[#EF5A6F] text-white shadow-[0_4px_20px_rgba(239,90,111,0.25)]" 
                : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            <Timer size={14} />
            <span>Focus Mode</span>
          </button>
        </div>

        {/* Tab Content Panel */}
        <div className="md:col-span-3 min-h-[320px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            
            {/* PLANNER TAB */}
            {activeTab === "planner" && (
              <motion.div
                key="planner"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                {/* Progress bar info */}
                <div className="flex items-center justify-between rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/5 p-4">
                  <div>
                    <h4 className="text-sm font-extrabold text-neutral-900 dark:text-white">Daily Milestone</h4>
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1">Check items off to increase productivity scores</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono font-black text-neutral-900 dark:text-white">{progressPercent}%</span>
                    <div className="w-24 bg-neutral-200 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                      <motion.div 
                        className="bg-[#EF5A6F] h-full"
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ type: "spring", stiffness: 100 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Task list items */}
                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                  {tasks.map((task) => (
                    <motion.div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`flex items-center justify-between rounded-xl border p-3.5 transition-all cursor-pointer ${
                        task.completed 
                          ? "bg-neutral-50 dark:bg-white/[0.01] border-neutral-100 dark:border-white/5 opacity-60" 
                          : "bg-white dark:bg-white/[0.03] border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20"
                      }`}
                      whileHover={{ scale: 1.005 }}
                    >
                      <div className="flex items-center gap-3">
                        {task.completed ? (
                          <CheckCircle2 size={16} className="text-[#EF5A6F]" />
                        ) : (
                          <div className="h-4 w-4 rounded-md border border-neutral-400 dark:border-neutral-600 bg-white dark:bg-black/40" />
                        )}
                        <span className={`text-xs font-semibold ${task.completed ? "line-through text-neutral-400 dark:text-neutral-500" : "text-neutral-700 dark:text-neutral-200"}`}>
                          {task.text}
                        </span>
                      </div>
                      <span className={`text-[8px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        task.priority === "high" 
                          ? "bg-red-500/10 text-red-500 dark:text-red-400" 
                          : task.priority === "medium" 
                            ? "bg-amber-500/10 text-amber-500 dark:text-amber-400" 
                            : "bg-neutral-500/10 text-neutral-600 dark:text-neutral-400"
                      }`}>
                        {task.priority}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Add new task mock form */}
                <form onSubmit={addTask} className="flex gap-2">
                  <input
                    type="text"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    placeholder="Quick add dynamic task..."
                    className="flex-1 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-black/40 px-4 py-2.5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-[#EF5A6F]/50"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-[#EF5A6F] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#ff6678] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={14} />
                    Add
                  </button>
                </form>
              </motion.div>
            )}

            {/* HABITS TAB */}
            {activeTab === "habits" && (
              <motion.div
                key="habits"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="grid gap-3.5">
                  {habits.map((habit) => (
                    <div 
                      key={habit.id}
                      className="rounded-xl border border-neutral-200 dark:border-white/5 bg-neutral-50 dark:bg-white/[0.02] p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-extrabold text-neutral-900 dark:text-white">{habit.name}</h4>
                          <span className="flex items-center gap-0.5 text-[10px] text-amber-500 dark:text-amber-400 font-mono font-bold">
                            <Flame size={12} className="fill-amber-500" />
                            {habit.streak}d
                          </span>
                        </div>
                        <p className="text-[9px] text-neutral-500">Streak stays alive if you complete daily goals</p>
                      </div>

                      {/* Mon-Sun tracker grid */}
                      <div className="flex gap-1.5">
                        {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => (
                          <div key={idx} className="flex flex-col items-center gap-1">
                            <button
                              onClick={() => toggleHabitDay(habit.id, idx)}
                              className={`h-7 w-7 rounded-lg border transition-all flex items-center justify-center text-[9px] font-mono font-extrabold cursor-pointer ${
                                habit.history[idx]
                                  ? "bg-[#EF5A6F] border-[#EF5A6F] text-white shadow-[0_0_8px_rgba(239,90,111,0.3)]"
                                  : "bg-white dark:bg-black/40 border-neutral-200 dark:border-white/10 text-neutral-500 hover:border-neutral-300 dark:hover:border-white/20"
                              }`}
                            >
                              {day}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ANALYTICS TAB */}
            {activeTab === "analytics" && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Micro Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Focus Hours", value: "34.5", change: "+12%" },
                    { label: "Completion Rate", value: "88%", change: "+5%" },
                    { label: "Streak Record", value: "18 days", change: "Current: 12" }
                  ].map((stat, idx) => (
                    <div key={idx} className="rounded-xl border border-neutral-200 dark:border-white/5 bg-neutral-50 dark:bg-white/[0.01] p-3 text-center">
                      <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider">{stat.label}</p>
                      <h5 className="text-sm font-black text-neutral-900 dark:text-white mt-1.5">{stat.value}</h5>
                      <span className="text-[8px] font-semibold text-emerald-500 dark:text-emerald-400 mt-1 block">{stat.change}</span>
                    </div>
                  ))}
                </div>

                {/* SVG Area Chart */}
                <div className="rounded-xl border border-neutral-200 dark:border-white/5 bg-neutral-50 dark:bg-black/40 p-4 h-36 relative">
                  <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#EF5A6F" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#EF5A6F" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Chart Grid Lines */}
                    <line x1="0" y1="30" x2="500" y2="30" stroke="currentColor" strokeOpacity="0.08" className="text-neutral-400 dark:text-neutral-600" />
                    <line x1="0" y1="60" x2="500" y2="60" stroke="currentColor" strokeOpacity="0.08" className="text-neutral-400 dark:text-neutral-600" />
                    <line x1="0" y1="90" x2="500" y2="90" stroke="currentColor" strokeOpacity="0.08" className="text-neutral-400 dark:text-neutral-600" />

                    {/* Gradient Area Fill */}
                    <path
                      d="M0,110 L50,90 L120,95 L200,60 L280,45 L360,75 L430,30 L500,20 L500,120 L0,120 Z"
                      fill="url(#chart-glow)"
                    />

                    {/* Line Chart */}
                    <motion.path
                      d="M0,110 L50,90 L120,95 L200,60 L280,45 L360,75 L430,30 L500,20"
                      fill="none"
                      stroke="#EF5A6F"
                      strokeWidth="2.5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />

                    {/* Node dots */}
                    <circle cx="200" cy="60" r="4.5" fill="#EF5A6F" stroke="var(--background)" strokeWidth="2" />
                    <circle cx="280" cy="45" r="4.5" fill="#EF5A6F" stroke="var(--background)" strokeWidth="2" />
                    <circle cx="430" cy="30" r="4.5" fill="#EF5A6F" stroke="var(--background)" strokeWidth="2" />
                    <circle cx="500" cy="20" r="4.5" fill="#EF5A6F" stroke="var(--background)" strokeWidth="2" />
                  </svg>
                  
                  {/* Overlay labels */}
                  <div className="absolute inset-x-4 bottom-2 flex justify-between text-[8px] font-mono text-neutral-500 uppercase tracking-widest">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* FOCUS TIMER TAB */}
            {activeTab === "focus" && (
              <motion.div
                key="focus"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center justify-center py-2 relative"
              >
                {/* Big glow rings */}
                <div className={`absolute h-40 w-40 rounded-full bg-[#EF5A6F]/5 filter blur-xl transition-transform duration-1000 ${timerActive ? "scale-125" : "scale-100"}`} />

                {/* Countdown Time */}
                <h3 className="text-5xl font-mono font-black text-neutral-900 dark:text-white tracking-widest relative z-10">
                  {formatTime(timerSeconds)}
                </h3>
                <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-500 mt-2 font-semibold">Focus Session Active</p>
                
                {/* Controls */}
                <div className="flex gap-4 mt-6 relative z-10">
                  <button
                    onClick={() => setTimerActive(!timerActive)}
                    className="flex items-center gap-1.5 rounded-xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 hover:bg-neutral-200 dark:hover:bg-white/10 hover:border-neutral-300 dark:hover:border-white/20 px-5 py-2.5 text-xs font-bold text-neutral-800 dark:text-white uppercase tracking-wider transition-all cursor-pointer"
                  >
                    {timerActive ? (
                      <>
                        <Pause size={12} className="fill-neutral-800 dark:fill-white" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play size={12} className="fill-[#EF5A6F] text-[#EF5A6F]" />
                        <span>Start</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={resetTimer}
                    className="flex items-center justify-center h-9 w-9 rounded-xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all cursor-pointer"
                    title="Reset"
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default InteractiveDemo;
