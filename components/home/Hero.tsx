"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] bg-[#260407] text-[#FFFDF9] flex items-center overflow-hidden">
      {/* Background Campaign Image with Slow Scale Motion */}
      <motion.div
        initial={{ scale: 1.05, opacity: 0.85 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0"
      >
        <Image
          src="/images/hero-campaign-shot.png"
          alt="MATILDA Jewellery Campaign"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-65 md:opacity-75"
        />
        {/* Subtle radial and linear gradient vignette for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#260407]/90 via-[#260407]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#260407] via-transparent to-[#260407]/40" />
      </motion.div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-2xl space-y-6">
          
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5A1118]/80 border border-[#C8A15A]/40 text-[#E4C98A] text-[11px] uppercase tracking-[0.25em] font-medium"
          >
            <Sparkles className="w-3 h-3 text-[#C8A15A]" />
            <span>MATILDA • BY Duha Ajaz Pandith</span>
          </motion.div>

          {/* Main Statement Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#FFFDF9] leading-[1.08]"
          >
            TIMELESS, <br />
            <span className="italic font-normal font-serif text-[#E4C98A]">WITH ATTITUDE.</span>
          </motion.h1>

          {/* Brand Bio */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-sm sm:text-base text-[#EFE3D2]/90 leading-relaxed font-sans max-w-xl"
          >
            Timeless silhouettes offering the look of fine jewellery at a fraction of the cost. Designed for your everyday era with delivery across India.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
          >
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#C8A15A] text-[#260407] font-semibold text-xs uppercase tracking-[0.22em] hover:bg-[#E4C98A] transition-all shadow-lg hover:shadow-gold-glow active:scale-[0.98]"
            >
              <span>Shop Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#EFE3D2]/40 text-[#FFFDF9] hover:bg-[#FFFDF9]/10 text-xs uppercase tracking-[0.22em] font-medium transition-all"
            >
              <span>Explore Matilda</span>
            </Link>
          </motion.div>

          {/* Quick trust line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 1, delay: 1 }}
            className="pt-4 flex items-center gap-6 text-[11px] text-[#EFE3D2]/70 uppercase tracking-widest"
          >
            <span>Starting from ₹39</span>
            <span>•</span>
            <span>Pan-India Delivery</span>
            <span>•</span>
            <span>No Piercing Naths</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
