"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/context/StoreContext";

type PreloaderPhase = "initial" | "logo" | "brandText" | "founderText" | "exit" | "done";

export const Preloader = () => {
  const { setIsPreloaderComplete } = useStore();
  const [phase, setPhase] = useState<PreloaderPhase>("initial");
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Exact Luxury Editorial Timeline:
    // 0.0s - 0.4s : Deep burgundy canvas (#1A0205)
    // 0.4s - 1.4s : Luminous Cream MATILDA logo emerges
    // 1.1s - 2.0s : Small MATILDA title appears beneath logo
    // 1.5s - 2.4s : "by Duha Ajaz Pandith" reveals beneath in editorial italic
    // 2.5s - 3.2s : Entire burgundy screen dissolves smoothly to reveal hero
    // 3.25s       : Preloader completes and unmounts
    const tLogo = setTimeout(() => setPhase("logo"), 400);
    const tBrand = setTimeout(() => setPhase("brandText"), 1100);
    const tFounder = setTimeout(() => setPhase("founderText"), 1500);
    const tExit = setTimeout(() => {
      setPhase("exit");
      setIsPreloaderComplete(true);
    }, 2500);
    const tDone = setTimeout(() => {
      setPhase("done");
      setIsDismissed(true);
    }, 3200);

    return () => {
      clearTimeout(tLogo);
      clearTimeout(tBrand);
      clearTimeout(tFounder);
      clearTimeout(tExit);
      clearTimeout(tDone);
    };
  }, [setIsPreloaderComplete]);

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="matilda-master-editorial-preloader"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === "exit" ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#1A0205] select-none pointer-events-none"
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
            {/* Authentic Luminous Cream Logo Emergence */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={
                phase !== "initial"
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.94 }
              }
              transition={{
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative w-64 h-32 sm:w-80 sm:h-40 md:w-96 md:h-48"
            >
              <Image
                src="/images/matilda-logo-cream-transparent.png"
                alt="MATILDA"
                fill
                priority
                className="object-contain"
              />
            </motion.div>

            {/* Typography Reveal */}
            <div className="mt-3 sm:mt-5 space-y-2">
              {/* MATILDA */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={
                  phase === "brandText" || phase === "founderText" || phase === "exit"
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 8 }
                }
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="font-serif text-sm sm:text-base uppercase tracking-[0.32em] text-[#E4C98A] font-normal block">
                  MATILDA
                </span>
              </motion.div>

              {/* Founder Text */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={
                  phase === "founderText" || phase === "exit"
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 8 }
                }
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="font-serif italic text-sm sm:text-base text-[#E4C98A]/85 font-light block">
                  by Duha Ajaz Pandith
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
