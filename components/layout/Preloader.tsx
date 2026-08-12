"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export const Preloader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [phase, setPhase] = useState<"logo" | "text" | "exit">("logo");

  useEffect(() => {
    // Only show on first visit per browser session
    const hasShown = sessionStorage.getItem("matilda_preloader_shown");
    if (hasShown) {
      setIsVisible(false);
      return;
    }

    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sessionStorage.setItem("matilda_preloader_shown", "1");
      setIsVisible(false);
      return;
    }

    sessionStorage.setItem("matilda_preloader_shown", "1");

    // Timeline:
    // 0ms   : Logo fades in & floats up (scale: 0.96 -> 1.0)
    // 1100ms: Founder attribution fades in ("by Duha Ajaz Pandith")
    // 2200ms: Smooth dissolve exit
    // 2700ms: Component unmounts
    const t1 = setTimeout(() => setPhase("text"), 1100);
    const t2 = setTimeout(() => setPhase("exit"), 2200);
    const t3 = setTimeout(() => setIsVisible(false), 2700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#1A0205] select-none"
        >
          {/* Subtle brand watermark background */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: "url('/images/matilda-pattern-secondary.png')",
              backgroundSize: "360px 360px",
              backgroundRepeat: "repeat",
            }}
          />

          <div className="relative flex flex-col items-center text-center px-4">
            {/* The Authentic MATILDA Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 1.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative w-64 h-28 sm:w-80 sm:h-36"
            >
              <Image
                src="/images/matilda-logo-leopard-transparent.png"
                alt="MATILDA"
                fill
                priority
                className="object-contain"
              />
            </motion.div>

            {/* Founder Attribution — Delayed reveal, pure typography */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={phase === "text" || phase === "exit" ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 space-y-1.5"
            >
              <p className="font-serif italic text-base sm:text-lg text-[#E4C98A]/85 tracking-wide">
                by Duha Ajaz Pandith
              </p>
              <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-[#EFE3D2]/40 font-sans font-light">
                Timeless Silhouettes
              </p>
            </motion.div>
          </div>

          {/* Minimalist Skip Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            onClick={() => {
              setPhase("exit");
              setIsVisible(false);
            }}
            className="absolute bottom-8 right-8 text-[10px] uppercase tracking-[0.3em] text-[#E4C98A]/30 hover:text-[#E4C98A]/80 transition-colors font-sans"
          >
            skip
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
