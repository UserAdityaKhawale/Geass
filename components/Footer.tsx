"use client";

import Link from "next/link";
import { useState } from "react";
import { Globe, ArrowRight } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="border-t border-white/5 bg-[#030303] pt-16 pb-12 px-6 relative overflow-hidden">
      
      {/* Ambient background glow */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-[#EF5A6F]/3 blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Top footer row: Logo, Links and Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-white/5">
          
          {/* Logo column */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-1.5 w-fit">
              <img
                src="/geass-logo.png"
                alt="Geass Logo"
                className="h-7 w-auto object-contain filter drop-shadow-[0_0_6px_rgba(239,90,111,0.3)]"
              />
              <span className="text-[20px] font-black tracking-tight text-white uppercase">
                Geass
              </span>
            </Link>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed font-semibold">
              A modern execution workspace shaped for focus, momentum, and beautifully calm daily planning. Feel more human than template-driven workflows.
            </p>

            {/* Social Links */}
            <div className="flex gap-4 pt-2">
              {[
                { 
                  icon: (
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ), 
                  href: "https://twitter.com", 
                  label: "Twitter" 
                },
                { 
                  icon: (
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                    </svg>
                  ), 
                  href: "https://github.com", 
                  label: "GitHub" 
                },
                { 
                  icon: <Globe size={14} />, 
                  href: "https://geass.app", 
                  label: "Website" 
                }
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/5 bg-white/5 text-neutral-400 hover:border-[#EF5A6F]/20 hover:bg-[#EF5A6F]/5 hover:text-[#EF5A6F] transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[#EF5A6F]">Product</h4>
            <ul className="space-y-2 text-xs font-semibold text-neutral-400">
              <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#demo" className="hover:text-white transition-colors">Join Discord</Link></li>
              <li><Link href="#faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><span className="text-neutral-600 cursor-not-allowed">Changelog (Soon)</span></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[#EF5A6F]">Company</h4>
            <ul className="space-y-2 text-xs font-semibold text-neutral-400">
              <li><span className="text-neutral-500 hover:text-white cursor-pointer transition-colors">About Us</span></li>
              <li><span className="text-neutral-500 hover:text-white cursor-pointer transition-colors">Careers</span></li>
              <li><span className="text-neutral-500 hover:text-white cursor-pointer transition-colors">Press Kit</span></li>
              <li><span className="text-neutral-500 hover:text-white cursor-pointer transition-colors">Blog</span></li>
            </ul>
          </div>

          {/* Newsletter subscription column */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-white">Join the Newsletter</h4>
            <p className="text-[11px] leading-relaxed text-neutral-400 font-semibold">
              Get capacity planning updates, focus strategies, and changelogs.
            </p>
            {subscribed ? (
              <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/5 px-3 py-2 text-[10px] font-bold text-emerald-500 uppercase tracking-wide">
                ✓ Thanks for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email..."
                  required
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 pr-10 text-[11px] text-white placeholder-neutral-500 focus:outline-none focus:border-[#EF5A6F]/50 transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-1 px-2.5 py-1.5 text-neutral-400 hover:text-[#EF5A6F] transition-colors"
                  aria-label="Subscribe"
                >
                  <ArrowRight size={14} />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-[10px] font-mono text-neutral-500">
          <div>
            © {new Date().getFullYear()} Geass. All rights reserved.
          </div>
          <div className="flex gap-4">
            <span className="hover:text-neutral-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-neutral-400 cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
