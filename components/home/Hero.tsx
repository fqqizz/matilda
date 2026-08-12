"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useStore } from "@/lib/context/StoreContext";

// High-fashion cinematic motion curve (ultra-smooth butter curve)
const luxuryEase = [0.16, 1, 0.3, 1];

export const Hero = () => {
  const { isPreloaderComplete } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Pure GPU-accelerated entrance motion (zero layout shifts, zero abrupt popping)
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.14,
        delayChildren: 0.06,
      },
    },
  };

  const line1Variants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.15, ease: luxuryEase },
    },
  };

  const line2Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.1, ease: luxuryEase },
    },
  };

  const line3Variants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.15, ease: luxuryEase },
    },
  };

  const ctaVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.0, ease: luxuryEase },
    },
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-[92vh] sm:min-h-[96vh] bg-[#1A0205] text-[#FFFDF9] flex items-center justify-center overflow-hidden font-sans select-none"
    >
      {/* ── CINEMATIC BACKGROUND FILM ── */}
      <motion.div style={{ scale: videoScale }} className="absolute inset-0 z-0 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/images/hero-campaign-shot.png"
          className="w-full h-full object-cover object-center opacity-70 sm:opacity-80"
        >
          <source src="/videos/hero-campaign.mp4" type="video/mp4" />
        </video>

        {/* Subtle Burgundy Color Grade */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A0205]/90 via-[#260407]/55 to-[#1A0205]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A0205] via-transparent to-[#1A0205]/60" />
      </motion.div>

      {/* ── HERO EDITORIAL COMPOSITION ── */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-24 sm:py-32 w-full flex flex-col justify-center items-start"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isPreloaderComplete ? "visible" : "hidden"}
          className="max-w-4xl w-full"
        >
          {/* Eyebrow: Quiet Brand Attribution */}
          <motion.div variants={line2Variants} className="mb-5 sm:mb-8 pt-1 pl-0.5">
            <div className="inline-flex items-center gap-2 text-[#E4C98A]/85 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-light">
              <span>MATILDA</span>
              <span className="text-[#C8A15A]/40">•</span>
              <span className="font-serif italic tracking-wide lowercase text-xs">by duha ajaz pandith</span>
            </div>
          </motion.div>

          {/* ── HIGH-FASHION EDITORIAL HEADLINE (FLUID & BALANCED) ── */}
          <div className="text-[#FFFDF9] mb-8 sm:mb-10 pl-0.5">
            
            {/* Line 1: JEWELS (Unchanged font, size, and styling) */}
            <motion.div variants={line1Variants} className="pt-0.5 pb-1">
              <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal tracking-tight leading-[1.02] block text-[#FFFDF9]">
                JEWELS
              </h1>
            </motion.div>

            {/* Line 2: for every (Nudged downward with balanced vertical breathing room above and below) */}
            <motion.div variants={line2Variants} className="pt-4 sm:pt-5 md:pt-6 pb-2.5 sm:pb-3.5 md:pb-4">
              <span className="font-editorial italic text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-[0.14em] text-[#E4C98A] block leading-none">
                for every
              </span>
            </motion.div>

            {/* Line 3: version of you. (Unchanged font, size, and styling) */}
            <motion.div variants={line3Variants} className="pt-1 pb-2">
              <div className="font-serif italic text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[1.08] text-[#EFE3D2]">
                version of you.
              </div>
            </motion.div>
          </div>

          {/* ── SINGLE REFINED LUXURY CTA ── */}
          <motion.div variants={ctaVariants} className="pt-2 pl-0.5">
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 px-7 sm:px-8 py-3.5 bg-[#C8A15A] text-[#1A0205] font-sans font-medium text-xs uppercase tracking-[0.16em] hover:bg-[#E4C98A] transition-all duration-300 shadow-luxury group min-h-[44px]"
            >
              <span>Discover The Collection</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};
