"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth, UserButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { name: "Features", href: "#features" },
  { name: "Demo", href: "#demo" },
  { name: "Stats", href: "#stats" },
  { name: "FAQ", href: "#faq" },
];

const Navbar = () => {
  const { userId } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 transition-all duration-300 sm:px-6">
      <nav
        className={`
          group
          relative
          flex
          w-full
          max-w-6xl
          items-center
          justify-between
          rounded-2xl
          border
          border-white/5
          px-6
          backdrop-blur-xl
          shadow-[0_15px_60px_rgba(0,0,0,.4)]
          transition-all
          duration-500
          hover:border-[#EF5A6F]/20
          hover:shadow-[0_20px_80px_rgba(239,90,111,0.08)]
          ${scrolled ? "h-[58px] bg-black/85" : "h-[68px] bg-black/50"}
        `}
      >
        {/* Shiny sweep effect */}
        <div className="navbar-shine absolute -left-60 top-0 h-full w-52 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Dynamic ambient highlight */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-[#EF5A6F]/5 to-transparent blur-xl transition-opacity duration-500 group-hover:via-[#EF5A6F]/10" />
        
        {/* Logo */}
        <div className="relative z-10 flex items-center">
          <Link href="/" className="flex items-center gap-1.5 transition-transform duration-300 hover:scale-[1.02]">
            <img
              src="/geass-logo.png"
              alt="Geass Logo"
              className="h-6.5 w-auto object-contain filter drop-shadow-[0_0_6px_rgba(239,90,111,0.3)]"
            />
            <span className="text-[18px] font-black tracking-tight text-white uppercase">
              Geass
            </span>
          </Link>
        </div>

        {/* Center links (Desktop only) */}
        <div className="hidden md:flex items-center gap-1 relative z-10">
          {NAV_LINKS.map((link, idx) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative rounded-lg px-4 py-1.5 text-xs font-semibold text-neutral-400 transition-colors duration-300 hover:text-white"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {hoveredIndex === idx && (
                <motion.span
                  layoutId="nav-hover-pill"
                  className="absolute inset-0 -z-10 rounded-lg bg-white/5 border border-white/5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              {link.name}
            </Link>
          ))}
        </div>

        {/* Action Buttons (Desktop & Mobile) */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="scale-90 md:scale-100">
            <ThemeToggle />
          </div>
          <div className="hidden sm:flex items-center gap-3">
            {!userId ? (
              <>
                <Link
                  href="/sign-in"
                  className="rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/sign-up"
                  className="group/btn relative overflow-hidden rounded-xl bg-gradient-to-r from-[#ff6678] to-[#EF5A6F] px-4.5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg transition-transform hover:scale-[1.03] active:scale-[0.98]"
                >
                  <span className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                  <span className="relative z-10 flex items-center gap-1">
                    Launch Geass <ArrowRight size={12} className="transition-transform group-hover/btn:translate-x-0.5" />
                  </span>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="text-xs font-bold uppercase tracking-wider text-neutral-300 transition hover:text-white"
                >
                  Dashboard
                </Link>
                <UserButton />
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* Mobile Dropdown Panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-xl border border-white/10 bg-black/95 p-6 backdrop-blur-2xl md:hidden"
            >
              <div className="flex flex-col gap-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-semibold text-neutral-300 hover:text-white"
                  >
                    {link.name}
                  </Link>
                ))}
                <hr className="border-white/10 my-1" />
                {!userId ? (
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/sign-in"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-300"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/sign-up"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center rounded-xl bg-[#EF5A6F] py-2.5 text-xs font-bold uppercase tracking-wider text-white"
                    >
                      Launch Geass
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm font-semibold text-neutral-300"
                    >
                      Go to Dashboard
                    </Link>
                    <UserButton />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Navbar;
