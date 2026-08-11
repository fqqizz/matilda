"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export const Preloader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [phase, setPhase] = useState<"logo" | "divider" | "text" | "tagline" | "exit">("logo");

  useEffect(() => {
    const hasShown = sessionStorage.getItem("matilda_preloader_shown");
    if (hasShown) {
      setIsVisible(false);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sessionStorage.setItem("matilda_preloader_shown", "1");
      setIsVisible(false);
      return;
    }

    sessionStorage.setItem("matilda_preloader_shown", "1");

    // ── Animation timeline ────────────────────────────────────
    // 0ms      → logo begins opacity 0→1, scale 0.92→1  (1400ms)
    // 1100ms   → gold divider line draws in               (600ms)
    // 1600ms   → "by Duha Ajaz Pandith" fades up          (700ms)
    // 2200ms   → tagline fades in                         (600ms)
    // 3400ms   → everything exits                         (600ms)
    // Total visible: ~4000ms

    const t1 = setTimeout(() => setPhase("divider"),  1100);
    const t2 = setTimeout(() => setPhase("text"),     1600);
    const t3 = setTimeout(() => setPhase("tagline"),  2200);
    const t4 = setTimeout(() => setPhase("exit"),     3400);
    const t5 = setTimeout(() => setIsVisible(false),  4000);

    return () => {
      [t1, t2, t3, t4, t5].forEach(clearTimeout);
    };
  }, []);

  const afterDivider  = ["divider", "text", "tagline", "exit"].includes(phase);
  const afterText     = ["text", "tagline", "exit"].includes(phase);
  const afterTagline  = ["tagline", "exit"].includes(phase);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#1E0306] select-none"
        >
          {/* Very faint repeating texture */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "url('/images/matilda-pattern-secondary.png')",
              backgroundSize: "380px 380px",
              backgroundRepeat: "repeat",
              opacity: 0.035,
            }}
          />

          {/* Centred content stack */}
          <div className="relative flex flex-col items-center gap-0">

            {/* ── LOGO ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 1.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative w-64 h-28 sm:w-80 sm:h-36"
            >
              <Image
                src="/images/matilda-logo-leopard-transparent.png"
                alt="MATILDA"
                fill
                className="object-contain"
                priority
              />
            </motion.div>

            {/* ── GOLD DIVIDER LINE ── */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={
                afterDivider
                  ? { scaleX: 1, opacity: 1 }
                  : { scaleX: 0, opacity: 0 }
              }
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "center" }}
              className="w-20 h-px bg-gradient-to-r from-transparent via-[#C8A15A] to-transparent mt-3"
            />

            {/* ── FOUNDER ATTRIBUTION ── */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={
                afterText
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 8 }
              }
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="mt-3 font-serif italic text-base sm:text-lg text-[#E4C98A]/80 tracking-wide"
            >
              by Duha Ajaz Pandith
            </motion.p>

            {/* ── TAGLINE ── */}
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={
                afterTagline
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 6 }
              }
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mt-2 text-[9px] sm:text-[10px] uppercase tracking-[0.5em] text-[#EFE3D2]/35 font-sans font-light"
            >
              Timeless Silhouettes
            </motion.p>
          </div>

          {/* Skip — subtle, bottom right */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            onClick={() => {
              setPhase("exit");
              setIsVisible(false);
            }}
            className="absolute bottom-7 right-7 text-[10px] uppercase tracking-[0.3em] text-[#E4C98A]/25 hover:text-[#E4C98A]/60 transition-colors duration-300 font-sans"
          >
            skip
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
