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

  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[92vh] lg:min-h-[96vh] bg-[#1A0205] text-[#FFFDF9] flex items-center justify-center overflow-hidden"
    >
      {/* ── CINEMATIC BACKGROUND FILM ── */}
      <motion.div style={{ scale: videoScale }} className="absolute inset-0 z-0">
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

        {/* Rich Burgundy Color-Grading Veil for Text Readability & Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A0205]/90 via-[#260407]/60 to-[#1A0205]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A0205] via-transparent to-[#1A0205]/60" />
      </motion.div>

      {/* ── HERO EDITORIAL CONTENT ── */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 w-full flex flex-col justify-center items-start"
      >
        <div className="max-w-3xl space-y-6 sm:space-y-8">
          
          {/* Eyebrow Label */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 text-[#E4C98A] text-[10px] sm:text-[11px] uppercase tracking-[0.35em] font-medium"
          >
            <span>MATILDA</span>
            <span className="text-[#C8A15A]/60">•</span>
            <span className="font-serif italic tracking-wide">by Duha Ajaz Pandith</span>
          </motion.div>

          {/* Large Kinetic Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-normal tracking-tight text-[#FFFDF9] leading-[1.05]"
          >
            Timeless silhouettes. <br />
            <span className="italic text-[#E4C98A] font-light">Shaped for your era.</span>
          </motion.h1>

          {/* Brand Philosophy Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs sm:text-sm md:text-base text-[#EFE3D2]/85 leading-relaxed font-sans max-w-xl font-light tracking-wide"
          >
            Everyday heirlooms offering the rich finish and weight of fine jewellery at an accessible price. Curated for your personal stack with express delivery across India.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6"
          >
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-3 px-9 py-4 bg-[#C8A15A] text-[#1A0205] font-semibold text-xs uppercase tracking-[0.25em] hover:bg-[#E4C98A] transition-all duration-300 shadow-luxury hover:shadow-gold"
            >
              <span>Discover The Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#EFE3D2]/30 text-[#FFFDF9] hover:bg-[#FFFDF9]/10 text-xs uppercase tracking-[0.25em] font-medium transition-all duration-300"
            >
              <span>The Brand Story</span>
            </Link>
          </motion.div>

          {/* Micro trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            transition={{ duration: 1.2, delay: 1.0 }}
            className="pt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] sm:text-[11px] text-[#EFE3D2]/70 uppercase tracking-[0.25em] font-light"
          >
            <span>Pan-India Delivery</span>
            <span>•</span>
            <span>Pieces from ₹39</span>
            <span>•</span>
            <span>Express Dispatch</span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
