"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { 
  Play, 
  ArrowRight, 
  Sparkles,
  ShieldCheck
} from "lucide-react";
import { HeroVideoDialog } from "./components/HeroVideoDialog";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Component imports
import TextType from "@/components/TextType";
import ShinyText from "@/components/ShinyText";
import GradientText from "@/components/GradientText";
import BentoGrid from "@/components/BentoGrid";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

// Register GSAP ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Inline Counter for scroll stats rollup
const ScrollCounter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    let startTimestamp: number | null = null;
    const duration = 1800; // ms

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    const currentRef = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animationFrameId = requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (observer && currentRef) observer.disconnect();
    };
  }, [value]);

  return (
    <div ref={ref} className="text-3xl sm:text-4xl font-black text-white font-mono">
      {count.toLocaleString()}{suffix}
    </div>
  );
};

export default function MarketingPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  // CTA Spotlight mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // GSAP animations for sections on mount
  useEffect(() => {
    // Entrance fade for Hero components
    const tl = gsap.timeline();
    tl.fromTo(
      ".hero-el",
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" }
    );

    // ScrollTrigger fade ups for sections
    const scrollRevealEls = document.querySelectorAll(".scroll-reveal");
    scrollRevealEls.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  }, []);

  return (
    <div ref={containerRef} className="relative z-10 w-full overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative px-6 pt-32 pb-24 md:pt-40 md:pb-32 flex flex-col items-center text-center">
        {/* Soft background light */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] sm:h-[450px] sm:w-[450px] rounded-full bg-[#EF5A6F]/5 blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-6 relative z-10 flex flex-col items-center">
          
          {/* Label Badge */}
          <div className="hero-el opacity-0 inline-flex items-center gap-2 rounded-full border border-[#EF5A6F]/10 bg-[#EF5A6F]/5 px-4 py-1.5 text-[10px] uppercase tracking-widest text-[#ff8191] font-bold">
            <Sparkles size={11} className="text-[#EF5A6F]" />
            <span>Introducing Geass Workspace</span>
          </div>

          {/* Core Headline */}
          <h1 className="hero-el opacity-0 text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase leading-none max-w-3xl">
            Turn Ideas Into <br />
            <TextType
              text={["Daily Execution", "Calm Momentum", "Productive Flow"]}
              className="text-[#EF5A6F] h-12 sm:h-18 md:h-20 inline-block font-black select-none text-glow lowercase"
              typingSpeed={60}
              deletingSpeed={45}
              pauseDuration={2500}
              showCursor={true}
              cursorCharacter="|"
              cursorClassName="text-[#EF5A6F]"
            />
          </h1>

          {/* Subheading */}
          <p className="hero-el opacity-0 text-xs sm:text-sm text-neutral-400 max-w-xl leading-relaxed font-medium">
            Geass helps you organize tasks, build lasting habits, manage projects, and maintain focus every day. Designed to feel more human than templated workspaces.
          </p>

          {/* Action CTAs */}
          <div className="hero-el opacity-0 flex flex-col sm:flex-row justify-center items-center gap-4 w-full sm:w-auto pt-4">
            <Link 
              href="/sign-up" 
              className="w-full sm:w-auto text-center rounded-xl bg-gradient-to-r from-[#ff6678] to-[#EF5A6F] px-8 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300 shadow-[0_10px_35px_rgba(239,90,111,0.25)] cursor-pointer"
            >
              Start For Free ➔
            </Link>
            
            <HeroVideoDialog
              animationStyle="from-center"
              videoSrc="https://www.youtube.com/embed/XqZsoesa55w?autoplay=1"
            >
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 text-xs font-extrabold uppercase tracking-wider text-neutral-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer">
                <Play size={12} className="text-[#EF5A6F] fill-[#EF5A6F]" />
                Watch Demo
              </button>
            </HeroVideoDialog>
          </div>

          {/* Small tagline */}
          <p className="hero-el opacity-0 text-[9px] font-mono tracking-widest text-neutral-500 uppercase">
            No credit card required • Local-first storage enabled
          </p>
        </div>
      </section>

      {/* 2. TRUSTED BY MARQUEE */}
      <section className="py-12 border-y border-white/[0.02] bg-black/40 overflow-hidden select-none">
        <div className="max-w-6xl mx-auto px-6 text-center mb-6">
          <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase font-black">
            Trusted by builders worldwide at
          </span>
        </div>
        <div className="relative flex overflow-x-hidden w-full">
          <div className="flex animate-marquee gap-24 whitespace-nowrap text-xs font-mono font-extrabold uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-600">
            <span>STUDENTS</span>
            <span>DEVELOPERS</span>
            <span>FREELANCERS</span>
            <span>FOUNDERS</span>
            <span>INDIE HACKERS</span>
            <span>DESIGNERS</span>
            <span>CREATORS</span>
            
            {/* Duplicates to enable infinite scroll marquee */}
            <span>STUDENTS</span>
            <span>DEVELOPERS</span>
            <span>FREELANCERS</span>
            <span>FOUNDERS</span>
            <span>INDIE HACKERS</span>
            <span>DESIGNERS</span>
            <span>CREATORS</span>
          </div>
        </div>
      </section>

      {/* 3. BENTO FEATURES GRID */}
      <BentoGrid />

      {/* 5. STATISTICS ROLLUP */}
      <section id="stats" className="py-24 relative overflow-hidden bg-black/40 border-y border-white/[0.02]">
        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-widest text-[#EF5A6F] font-semibold mb-4">
              <ShieldCheck size={12} />
              <span>Metrics & Reliability</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              Proven Results <br />
              <span className="text-neutral-500 font-light">For Execution.</span>
            </h2>
          </div>

          <div className="grid gap-6 grid-cols-2 md:grid-cols-4 max-w-4xl mx-auto">
            {[
              { value: 12500, suffix: "+", label: "Tasks Completed" },
              { value: 96, suffix: "%", label: "Streak Consistency" },
              { value: 890, suffix: "+", label: "Active Builders" },
              { value: 24, suffix: "/7", label: "Local Storage Sync" }
            ].map((stat, idx) => (
              <div key={idx} className="rounded-2xl border border-white/5 bg-[#0a0a0c]/30 p-6 flex flex-col justify-center items-center shadow-sm">
                <ScrollCounter value={stat.value} suffix={stat.suffix} />
                <p className="mt-2 text-[9px] uppercase tracking-wider text-neutral-500 font-extrabold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <Testimonials />

      {/* 7. FAQ */}
      <FAQ />

      {/* 8. FINAL CTA CARD */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div 
          className="max-w-5xl mx-auto rounded-[32px] border border-white/5 bg-gradient-to-b from-white/[0.01] to-transparent p-8 md:p-16 text-center relative overflow-hidden group cursor-default shadow-sm"
          onMouseMove={handleMouseMove}
        >
          {/* Spotlight background mask */}
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-[32px] opacity-0 group-hover:opacity-100 transition duration-300"
            style={{
              background: useMotionTemplate`
                radial-gradient(
                  350px circle at ${mouseX}px ${mouseY}px,
                  rgba(239, 90, 111, 0.12),
                  transparent 80%
                )
              `,
            }}
          />

          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#EF5A6F]/5 blur-[70px] pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto space-y-6 flex flex-col items-center">
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-none">
              Design your flow. <br />
              <span className="text-neutral-500 font-light">Ship daily.</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-medium">
              Start building realistic planning habits and maintain deep focus milestones. Join builders tracking goals with clarity.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link 
                href="/sign-up" 
                className="w-full sm:w-auto text-center rounded-xl bg-gradient-to-r from-[#ff6678] to-[#EF5A6F] px-10 py-4 text-xs font-extrabold uppercase tracking-wider text-white hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300 shadow-xl shadow-[#EF5A6F]/20 cursor-pointer"
              >
                Launch Geass Free ➔
              </Link>
            </div>
            <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest mt-4">
              Fully optimized dark & light interfaces
            </span>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <Footer />

    </div>
  );
}
