"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.07]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[90vh] lg:min-h-[95vh] bg-[#1A0205] text-[#FFFDF9] flex items-center justify-center overflow-hidden"
    >
      {/* ── CINEMATIC BACKGROUND FILM ── */}
      <motion.div style={{ scale: videoScale }} className="absolute inset-0 z-0 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/images/hero-campaign-shot.png"
          className="w-full h-full object-cover object-center opacity-75 md:opacity-80"
        >
          <source src="/videos/hero-campaign.mp4" type="video/mp4" />
        </video>

        {/* Subtle Burgundy Color Grade */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A0205]/85 via-[#260407]/50 to-[#1A0205]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A0205] via-transparent to-[#1A0205]/50" />
      </motion.div>

      {/* ── HERO EDITORIAL COMPOSITION ── */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 sm:py-28 w-full flex flex-col justify-center items-start"
      >
        <div className="max-w-3xl space-y-8">
          
          {/* Eyebrow: Quiet Brand Attribution */}
          <div className="overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 text-[#E4C98A]/80 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-sans font-light"
            >
              <span>MATILDA</span>
              <span className="text-[#C8A15A]/40">•</span>
              <span className="font-serif italic tracking-wide lowercase">by duha ajaz pandith</span>
            </motion.div>
          </div>

          {/* High-Fashion Editorial Headline Composition */}
          <div className="space-y-0 leading-[0.92] text-[#FFFDF9]">
            {/* Line 1 */}
            <div className="overflow-hidden">
              <motion.h1
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-normal tracking-tight block"
              >
                JEWELS
              </motion.h1>
            </div>

            {/* Line 2: Connector phrase in refined Manrope */}
            <div className="overflow-hidden py-1">
              <motion.span
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="font-sans font-light text-xs sm:text-sm uppercase tracking-[0.22em] text-[#E4C98A] block pl-1 sm:pl-2"
              >
                for every
              </motion.span>
            </div>

            {/* Line 3: Italic Serif statement */}
            <div className="overflow-hidden">
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif italic text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tight text-[#EFE3D2]"
              >
                version of you.
              </motion.div>
            </div>
          </div>

          {/* Single Refined Luxury CTA */}
          <div className="overflow-hidden pt-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-6"
            >
              <Link
                href="/shop"
                className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#C8A15A] text-[#1A0205] font-sans font-medium text-xs uppercase tracking-[0.18em] hover:bg-[#E4C98A] transition-all duration-300 shadow-luxury"
              >
                <span>Discover The Collection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
