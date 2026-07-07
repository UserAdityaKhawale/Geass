"use client";

import { useState } from "react";
import { Play, XIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type AnimationStyle =
  | "from-bottom"
  | "from-center"
  | "from-top"
  | "from-left"
  | "from-right"
  | "fade"
  | "top-in-bottom-out"
  | "left-in-right-out";

interface HeroVideoProps {
  animationStyle?: AnimationStyle;
  videoSrc: string;
  thumbnailSrc?: string;
  thumbnailAlt?: string;
  className?: string;
  /** Custom trigger — if provided, thumbnail UI is hidden and only this trigger opens the dialog */
  children?: React.ReactNode;
}

const animationVariants = {
  "from-bottom": {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  "from-center": {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.5, opacity: 0 },
  },
  "from-top": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "-100%", opacity: 0 },
  },
  "from-left": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  },
  "from-right": {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  "top-in-bottom-out": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  "left-in-right-out": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
};

export function HeroVideoDialog({
  animationStyle = "from-center",
  videoSrc,
  thumbnailSrc,
  thumbnailAlt = "Video thumbnail",
  className,
  children,
}: HeroVideoProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const selectedAnimation = animationVariants[animationStyle];

  return (
    <>
      {/* Trigger */}
      {children ? (
        <span
          onClick={() => setIsVideoOpen(true)}
          className={`cursor-pointer ${className ?? ""}`}
          role="button"
          tabIndex={0}
          onKeyDown={e => (e.key === "Enter" || e.key === " ") && setIsVideoOpen(true)}
        >
          {children}
        </span>
      ) : thumbnailSrc ? (
        <div className={`relative ${className ?? ""}`}>
          <button
            type="button"
            aria-label="Play video"
            className="group relative cursor-pointer border-0 bg-transparent p-0 w-full"
            onClick={() => setIsVideoOpen(true)}
          >
            <img
              src={thumbnailSrc}
              alt={thumbnailAlt}
              width={1920}
              height={1080}
              className="w-full rounded-2xl border border-white/10 shadow-2xl transition-all duration-200 ease-out group-hover:brightness-75"
            />
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex size-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-md ring-1 ring-white/20 transition-all duration-200 group-hover:scale-110 group-hover:bg-white/20">
                <Play className="size-8 fill-white text-white ml-1" />
              </div>
            </div>
          </button>
        </div>
      ) : null}

      {/* Modal overlay */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Video player"
            onClick={() => setIsVideoOpen(false)}
            onKeyDown={e => {
              if (e.key === "Escape") setIsVideoOpen(false);
            }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-xl"
          >
            <motion.div
              {...selectedAnimation}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="relative mx-4 aspect-video w-full max-w-4xl md:mx-0"
            >
              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsVideoOpen(false)}
                className="absolute -top-14 right-0 z-10 flex items-center justify-center rounded-full bg-white/10 p-2.5 text-white ring-1 ring-white/20 backdrop-blur-md transition-all hover:bg-white/20"
                aria-label="Close video"
              >
                <XIcon className="size-5" />
              </motion.button>

              {/* Video iframe */}
              <div className="relative size-full overflow-hidden rounded-2xl border border-white/20 shadow-[0_40px_120px_rgba(0,0,0,0.8)]">
                {/* Glow */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#EF5A6F]/20 via-transparent to-[#7C3AED]/20 blur-sm pointer-events-none" />
                <iframe
                  src={videoSrc}
                  title="Demo Video"
                  className="size-full rounded-2xl relative z-10"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
