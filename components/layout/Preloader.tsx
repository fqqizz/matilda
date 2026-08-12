"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type PreloaderPhase = "initial" | "logo" | "brandText" | "founderText" | "exit" | "done";

export const Preloader = () => {
  const [phase, setPhase] = useState<PreloaderPhase>("initial");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show once per browser session
    const hasShown = sessionStorage.getItem("matilda_preloader_seen_v2");
    if (hasShown) {
      setPhase("done");
      setIsVisible(false);
      return;
    }

    // Respect user's reduced motion settings
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sessionStorage.setItem("matilda_preloader_seen_v2", "1");
      setPhase("done");
      setIsVisible(false);
      return;
    }

    // Initialize preloader
    setIsVisible(true);
    sessionStorage.setItem("matilda_preloader_seen_v2", "1");

    // Exact Luxury Editorial Timeline:
    // 0.0s - 0.4s : Initial pure burgundy canvas (silence)
    // 0.4s - 1.3s : Logo emerges (opacity 0 -> 1, scale 0.96 -> 1.0)
    // 1.3s - 1.7s : Brand text "MATILDA" reveals
    // 1.7s - 2.2s : Founder attribution "by Duha Ajaz Pandith" reveals
    // 2.2s - 2.7s : Entire burgundy canvas dissolves gracefully
    // 2.8s        : Component unmounts
    const tLogo = setTimeout(() => setPhase("logo"), 400);
    const tBrand = setTimeout(() => setPhase("brandText"), 1350);
    const tFounder = setTimeout(() => setPhase("founderText"), 1700);
    const tExit = setTimeout(() => setPhase("exit"), 2250);
    const tDone = setTimeout(() => {
      setPhase("done");
      setIsVisible(false);
    }, 2750);

    return () => {
      clearTimeout(tLogo);
      clearTimeout(tBrand);
      clearTimeout(tFounder);
      clearTimeout(tExit);
      clearTimeout(tDone);
    };
  }, []);

  if (!isVisible || phase === "done") return null;

  return (
    <AnimatePresence>
      <motion.div
        key="matilda-editorial-preloader"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "exit" ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#1A0205] select-none pointer-events-none"
      >
        {/* Subtle watermark grain */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "url('/images/matilda-pattern-secondary.png')",
            backgroundSize: "360px 360px",
            backgroundRepeat: "repeat",
          }}
        />

        <div className="relative flex flex-col items-center text-center px-6">
          {/* 0.4s – 1.3s: Authentic Logo Emergence */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={
              phase !== "initial"
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 0, scale: 0.96, y: 8 }
            }
            transition={{
              duration: 0.95,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative w-44 h-20 sm:w-60 sm:h-28"
          >
            <Image
              src="/images/matilda-logo-leopard-transparent.png"
              alt="MATILDA"
              fill
              priority
              className="object-contain"
            />
          </motion.div>

          {/* 1.4s – 2.0s: Typography Reveal */}
          <div className="mt-5 space-y-1">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={
                phase === "brandText" || phase === "founderText" || phase === "exit"
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 6 }
              }
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="font-serif text-xs sm:text-sm uppercase tracking-[0.28em] text-[#E4C98A]/90 font-normal block">
                MATILDA
              </span>
            </motion.div>

            {/* 1.7s – 2.2s: Founder Text */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={
                phase === "founderText" || phase === "exit"
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 6 }
              }
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="font-serif italic text-xs sm:text-sm text-[#E4C98A]/75 font-light block">
                by Duha Ajaz Pandith
              </span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
