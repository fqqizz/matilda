"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/context/StoreContext";

type PreloaderPhase = "initial" | "logo" | "brandText" | "founderText" | "exit" | "done";

export const Preloader = () => {
  const { setIsPreloaderComplete } = useStore();
  const [phase, setPhase] = useState<PreloaderPhase>("initial");
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Respect user's reduced motion settings if enabled
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("done");
      setIsVisible(false);
      setIsPreloaderComplete(true);
      return;
    }

    // Exact Luxury Editorial Timeline (2.75 seconds total):
    // 0.0s - 0.4s : Initial deep burgundy canvas silence (#1A0205)
    // 0.4s - 1.25s: Logo gently emerges (opacity 0 -> 1, scale 0.96 -> 1.0) with subtle ease-out
    // 1.15s - 1.75s: Small MATILDA appears beneath logo
    // 1.45s - 2.15s: "by Duha Ajaz Pandith" reveals beneath in editorial italic
    // 2.15s - 2.75s: Entire burgundy screen dissolves smoothly to reveal hero
    // 2.75s        : Preloader completes and unmounts
    const tLogo = setTimeout(() => setPhase("logo"), 400);
    const tBrand = setTimeout(() => setPhase("brandText"), 1150);
    const tFounder = setTimeout(() => setPhase("founderText"), 1450);
    const tExit = setTimeout(() => {
      setPhase("exit");
      setIsPreloaderComplete(true);
    }, 2150);
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
  }, [setIsPreloaderComplete]);

  if (!isVisible || phase === "done") return null;

  return (
    <AnimatePresence>
      <motion.div
        key="matilda-master-editorial-preloader"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "exit" ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#1A0205] select-none pointer-events-none"
      >
        {/* Subtle authentic watermark grain */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "url('/images/matilda-pattern-secondary.png')",
            backgroundSize: "360px 360px",
            backgroundRepeat: "repeat",
          }}
        />

        <div className="relative flex flex-col items-center text-center px-6">
          {/* 0.4s – 1.25s: Authentic Logo Emergence */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={
              phase !== "initial"
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.96 }
            }
            transition={{
              duration: 0.85,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative w-48 h-24 sm:w-64 sm:h-32"
          >
            <Image
              src="/images/matilda-logo-leopard-transparent.png"
              alt="MATILDA"
              fill
              priority
              className="object-contain"
            />
          </motion.div>

          {/* Typography Reveal */}
          <div className="mt-4 space-y-1.5">
            {/* 1.15s – 1.75s: MATILDA */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={
                phase === "brandText" || phase === "founderText" || phase === "exit"
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 6 }
              }
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="font-serif text-xs sm:text-sm uppercase tracking-[0.3em] text-[#E4C98A]/90 font-normal block">
                MATILDA
              </span>
            </motion.div>

            {/* 1.45s – 2.15s: Founder Text */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={
                phase === "founderText" || phase === "exit"
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 6 }
              }
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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
