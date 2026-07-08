"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

const QUOTES = [
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "Small daily improvements are the key to staggering long-term results.", author: "Robin Sharma" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function GreetingHeader() {
  const { user, isLoaded } = useUser();
  const [greeting, setGreeting] = useState("Good evening");
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  const userName = isLoaded && user?.firstName ? user.firstName : "";

  return (
    <div className="flex items-start justify-between gap-6">
      <div>
        <h1 className="text-[22px] font-black text-white tracking-tight leading-tight">
          {greeting}{userName && `, ${userName}`}! 👋
        </h1>
        <p className="text-[11px] text-neutral-500 mt-0.5 font-medium">
          Stay focused. Stay consistent. Make it count.
        </p>
      </div>
      <div className="text-right max-w-[260px] shrink-0 hidden xl:block pt-1">
        <p className="text-[11px] text-neutral-500 leading-relaxed italic">&ldquo;{quote.text}&rdquo;</p>
        <p className="text-[10px] text-neutral-700 mt-0.5">— {quote.author}</p>
      </div>
    </div>
  );
}
