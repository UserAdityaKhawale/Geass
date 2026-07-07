"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Is Geass free to use?",
    answer: "Yes, Geass offers a fully functional free tier that includes daily planners, tasks checklists, and standard habit tracking. For advanced features like AI scheduling, full analytics reports, and integrations, we offer a Pro plan."
  },
  {
    question: "How does the AI Smart Planner make suggestions?",
    answer: "The planning engine observes your historically logged focus patterns and task completion rates. It suggests minor daily calendar adjustments (e.g., rescheduling high-effort tasks to your peak energy hours) to help you execute consistently without burning out."
  },
  {
    question: "Can I sync Geass with Google Calendar or Outlook?",
    answer: "Yes. Geass supports direct, bi-directional synchronization with Google Calendar, Microsoft Outlook, and Apple Calendar. External events will populate directly in your Daily Execution view."
  },
  {
    question: "Is there offline support?",
    answer: "Absolutely. Geass uses a local-first design. All workspace updates, completed tasks, and timers run offline seamlessly. Once an active connection is detected, data syncs securely with the cloud."
  },
  {
    question: "How secure is my personal and workspace data?",
    answer: "We take privacy very seriously. Your notes, plans, and habit schedules are fully encrypted in transit and at rest. We never sell your analytics or personal data to third parties."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Title */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#EF5A6F]/10 bg-[#EF5A6F]/5 px-3 py-1 text-[10px] uppercase tracking-widest text-[#EF5A6F] font-semibold mb-4">
            <HelpCircle size={12} />
            <span>Common Queries</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
            Frequently Asked <br />
            <span className="text-neutral-400 font-light">Questions.</span>
          </h2>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-white/5 bg-[#0a0a0c]/40 overflow-hidden transition-all duration-300 hover:border-white/10 shadow-sm"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-[#EF5A6F] cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-xs sm:text-sm font-extrabold text-white tracking-wide">
                    {item.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-neutral-500 shrink-0 ml-4"
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-5 md:px-6 md:pb-6 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 font-semibold border-t border-neutral-200 dark:border-white/5 pt-4">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
