"use client";

import { motion } from "framer-motion";
import { Quote, MessageSquare } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  company: string;
  handle: string;
  avatarInitials: string;
  text: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Sarah Jenkins",
    role: "Product Designer",
    company: "Linear",
    handle: "@sarah_ux",
    avatarInitials: "SJ",
    text: "Geass completely refined my morning workflow. The focus timer and layout transition feel incredibly smooth and intentional. Absolutely premium."
  },
  {
    name: "Alex Rivera",
    role: "Indie Hacker",
    company: "DevSpace",
    handle: "@alex_rivera",
    avatarInitials: "AR",
    text: "The keyboard shortcuts combined with the minimalist checklist dashboard is a massive game-changer. Finally a workspace that keeps me focused without clutter."
  },
  {
    name: "Elena Rostova",
    role: "Frontend Engineer",
    company: "Vercel",
    handle: "@elena_dev",
    avatarInitials: "ER",
    text: "The design aesthetics are insane. Soft gradient overlays, elegant borders, and fast micro-animations. You can immediately feel the human craftsmanship behind it."
  },
  {
    name: "Marcus Chen",
    role: "Technical Founder",
    company: "Summit AI",
    handle: "@mchen_founder",
    avatarInitials: "MC",
    text: "As a founder, I used to struggle with scattered daily objectives. Geass provides the single pane of glass I need to keep execution simple, actionable, and structured."
  },
  {
    name: "Dr. Clara Vance",
    role: "AI Scientist",
    company: "Neurolab",
    handle: "@clara_vance",
    avatarInitials: "CV",
    text: "A daily planning tool that is focused on actual capacity rather than hypothetical goals. The predictive planning feature keeps milestones realistic and stress-free."
  },
  {
    name: "Leo Tanaka",
    role: "Creative Developer",
    company: "Arc Browser fan",
    handle: "@leo_creative",
    avatarInitials: "LT",
    text: "Cleanest productivity UI I've ever experienced. No unnecessary sidebars, just pure speed and execution. 10/10 would recommend to builders worldwide."
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 relative overflow-hidden">
      
      {/* Background glow highlights */}
      <div className="absolute top-[30%] left-[20%] w-[350px] h-[350px] rounded-full bg-[#EF5A6F]/3 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[350px] h-[350px] rounded-full bg-[#8de2ff]/3 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#EF5A6F]/10 bg-[#EF5A6F]/5 px-3 py-1 text-[10px] uppercase tracking-widest text-[#EF5A6F] font-semibold mb-4">
            <MessageSquare size={12} />
            <span>Social Proof</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
            Trusted by builders <br />
            <span className="text-neutral-400 font-light">Worldwide.</span>
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-neutral-400 leading-relaxed font-semibold">
            See why high-growth founders, independent developers, and product teams use Geass to plan and execute every day.
          </p>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial, idx) => (
            <motion.div
              key={testimonial.handle}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative rounded-2xl border border-neutral-200 dark:border-white/5 bg-white/70 dark:bg-[#0a0a0c]/40 p-6 flex flex-col justify-between hover:border-[#EF5A6F]/20 hover:bg-neutral-50 dark:hover:bg-[#0a0a0c]/60 transition-all duration-300 shadow-sm"
            >
              
              {/* Quote bubble icon decoration */}
              <div className="absolute top-5 right-5 text-black/5 dark:text-white/5 group-hover:text-[#EF5A6F]/10 transition-colors">
                <Quote size={24} />
              </div>

              {/* Text */}
              <p className="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300 relative z-10 mb-6 font-semibold">
                "{testimonial.text}"
              </p>

              {/* User profile section */}
              <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                
                {/* Avatar Initials mock */}
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#EF5A6F]/20 to-[#EF5A6F]/5 border border-[#EF5A6F]/10 flex items-center justify-center text-[10px] font-black text-white font-mono">
                  {testimonial.avatarInitials}
                </div>

                {/* Info labels */}
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-white leading-none">{testimonial.name}</h4>
                  <p className="text-[9px] text-neutral-400 mt-1 truncate font-medium">
                    {testimonial.role} at <span className="text-[#ff8191] font-semibold">{testimonial.company}</span>
                  </p>
                </div>

                {/* Handle */}
                <span className="ml-auto text-[8px] font-mono text-neutral-400 dark:text-neutral-600 hidden sm:block">
                  {testimonial.handle}
                </span>

              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
