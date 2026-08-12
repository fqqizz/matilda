"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CHAPTERS = [
  {
    id: "01",
    tagline: "The Daily Signature",
    headline: "Little objects. Big energy.",
    narrative:
      "Crafted for daily rotation. These are the pieces that never leave your neck, wrists, or waistline—designed to carry the presence of heirlooms while feeling weightless on skin.",
    image: "/images/gothic-star-pendant.png",
    link: "/shop?category=Necklaces%20%26%20Pendants",
    linkText: "Explore Pendants",
  },
  {
    id: "02",
    tagline: "The Evening Contour",
    headline: "Heirloom weight. Zero pretense.",
    narrative:
      "Slender golden belly chains and vintage floral enamel bangles that catch candlelight in intimate spaces. Quiet luxury with a contemporary edge.",
    image: "/images/golden-waist-chain.png",
    link: "/shop?category=Waist%20Chains",
    linkText: "Explore Waist Chains",
  },
  {
    id: "03",
    tagline: "Everyday Romance",
    headline: "Jewellery for every version of you.",
    narrative:
      "From botanical gemstone accents to traditional no-piercing Marathi naths, every piece is curated by founder Duha Ajaz Pandith for effortless personal style.",
    image: "/images/tulip-gemstone-bracelet.png",
    link: "/shop?category=Bracelets",
    linkText: "Explore Bracelets",
  },
];

export const EditorialStory = () => {
  const [activeChapter, setActiveChapter] = useState(0);
  const chapter = CHAPTERS[activeChapter];

  return (
    <section className="py-24 sm:py-32 bg-[#1A0205] text-[#FFFDF9] relative overflow-hidden border-b border-[#3A080C]">
      {/* Background ambient watermark */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "url('/images/matilda-pattern-secondary.png')",
          backgroundSize: "360px 360px",
          backgroundRepeat: "repeat",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-14">
        
        {/* ── SECTION HEADER ── */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#E4C98A] font-sans font-medium block">
            Campaign Narrative
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#FFFDF9] leading-tight">
            The MATILDA Chapters
          </h2>
        </div>

        {/* ── CHAPTER CONTROLS (TABS) ── */}
        <div className="flex justify-center border-b border-[#3A080C]/80">
          <div className="flex gap-4 sm:gap-10 overflow-x-auto pb-3 scrollbar-none">
            {CHAPTERS.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setActiveChapter(i)}
                className={`text-left transition-all duration-300 pb-2 relative whitespace-nowrap ${
                  activeChapter === i
                    ? "text-[#E4C98A]"
                    : "text-[#EFE3D2]/40 hover:text-[#EFE3D2]/80"
                }`}
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-serif italic text-xs text-[#C8A15A]">{c.id}</span>
                  <span className="text-[11px] uppercase tracking-[0.14em] font-sans font-normal">
                    {c.tagline}
                  </span>
                </div>
                {activeChapter === i && (
                  <motion.div
                    layoutId="activeChapterIndicator"
                    className="absolute bottom-0 inset-x-0 h-[1px] bg-[#C8A15A]"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── CHAPTER CONTENT & CINEMATIC DISPLAY ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left: Interactive Editorial Narrative */}
          <div className="lg:col-span-5 space-y-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-5"
              >
                <span className="text-[9.5px] uppercase tracking-[0.18em] text-[#C8A15A] font-sans font-medium block">
                  Chapter {chapter.id}
                </span>

                <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#FFFDF9] leading-[1.1]">
                  {chapter.headline}
                </h3>

                <p className="text-xs sm:text-sm text-[#EFE3D2]/75 leading-[1.65] font-sans font-light max-w-md">
                  {chapter.narrative}
                </p>

                <div className="pt-2">
                  <Link
                    href={chapter.link}
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#C8A15A] text-[#1A0205] text-xs uppercase tracking-[0.14em] font-sans font-medium hover:bg-[#E4C98A] transition-colors"
                  >
                    <span>{chapter.linkText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Dual Media Container (Campaign Video + Tactile Photo) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            
            {/* Cinematic Campaign Film */}
            <div className="relative aspect-[3/4] rounded-sm overflow-hidden bg-[#260407] border border-[#3A080C] shadow-luxury">
              <video
                autoPlay
                loop
                muted
                playsInline
                poster="/images/editorial-campaign-era.png"
                className="w-full h-full object-cover opacity-85"
              >
                <source src="/videos/editorial-film.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A0205]/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 text-[9px] uppercase tracking-[0.16em] text-[#E4C98A] font-sans font-normal bg-[#1A0205]/80 px-2 py-0.5 backdrop-blur-xs">
                Film 02 • Motion
              </div>
            </div>

            {/* Chapter Hero Still */}
            <div className="relative aspect-[3/4] rounded-sm overflow-hidden bg-[#260407] border border-[#3A080C] shadow-luxury">
              <AnimatePresence mode="wait">
                <motion.div
                  key={chapter.id}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={chapter.image}
                    alt={chapter.headline}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A0205]/70 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 text-[9px] uppercase tracking-[0.16em] text-[#EFE3D2]/80 font-sans font-light bg-[#1A0205]/80 px-2 py-0.5 backdrop-blur-xs">
                    {chapter.tagline}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
