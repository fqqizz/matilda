"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const EditorialStory = () => {
  return (
    <section className="py-24 sm:py-32 bg-[#260407] text-[#FFFDF9] relative overflow-hidden">
      {/* Background Leopard Texture Watermark */}
      <div
        className="absolute inset-0 bg-repeat opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: "url('/images/matilda-pattern-secondary.png')",
          backgroundSize: "360px 360px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Ornate Instagram Editorial Campaign Frame */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative"
          >
            <div className="relative mx-auto max-w-md aspect-[4/5] rounded-sm overflow-hidden border-2 border-[#C8A15A]/40 shadow-2xl bg-[#3A080C]">
              {/* Campaign Image */}
              <Image
                src="/images/editorial-campaign-era.png"
                alt="Made For Your Era Campaign"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />

              {/* Inset Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#260407]/80 via-transparent to-black/30" />

              {/* Inset Decorative Tag */}
              <div className="absolute bottom-6 inset-x-6 p-4 bg-[#260407]/85 backdrop-blur-md border border-[#C8A15A]/30 text-center">
                <p className="font-serif italic text-xl text-[#E4C98A]">
                  by Duha Ajaz Pandith
                </p>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#EFE3D2]/80 mt-0.5">
                  Autumn / Everyday Capsule
                </p>
              </div>
            </div>

            {/* Floating Ornamental Accent Badge */}
            <div className="hidden sm:block absolute -top-4 -right-4 bg-[#5A1118] border border-[#C8A15A] p-4 rounded shadow-xl max-w-[160px] text-center">
              <Sparkles className="w-4 h-4 text-[#E4C98A] mx-auto mb-1" />
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#E4C98A] font-bold block">
                FINE LOOK.
              </span>
              <span className="text-[10px] text-[#FFFDF9]/90 font-serif italic block">
                Fraction of the cost
              </span>
            </div>
          </motion.div>

          {/* Right Column: Editorial Narrative */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6 lg:pl-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3A080C] border border-[#C8A15A]/30 text-[#E4C98A] text-[10px] uppercase tracking-[0.25em]">
              <span>Editorial Series 01</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#FFFDF9] leading-[1.12]">
              MADE FOR <br />
              <span className="italic font-normal text-[#E4C98A]">YOUR EVERYDAY ERA.</span>
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-[#EFE3D2]/85 leading-relaxed font-sans max-w-xl mx-auto lg:mx-0">
              <p>
                Jewellery shouldn&apos;t just sit in a velvet box waiting for rare occasions. At MATILDA, we believe in pieces you put on without overthinking and never want to take off.
              </p>
              <p>
                Whether it&apos;s the romantic gold-leaf enamel detailing of our stackable bangles, the celestial engraving on the Gothic star, or our adjustable waist chains that adapt to your body, each design is an effortless staple.
              </p>
            </div>

            {/* Capsule highlights */}
            <div className="pt-2 grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0 text-left">
              <div className="p-3 bg-[#3A080C]/70 border border-[#5A1118] rounded">
                <span className="text-[10px] uppercase tracking-wider text-[#E4C98A] font-bold block">
                  Pendant Collection
                </span>
                <span className="text-xs text-[#EFE3D2]/80 font-serif">
                  From ₹149 to ₹179
                </span>
              </div>
              <div className="p-3 bg-[#3A080C]/70 border border-[#5A1118] rounded">
                <span className="text-[10px] uppercase tracking-wider text-[#E4C98A] font-bold block">
                  Enamel Bangles
                </span>
                <span className="text-xs text-[#EFE3D2]/80 font-serif">
                  Gold Leaf at ₹229
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-[#C8A15A] text-[#260407] font-semibold text-xs uppercase tracking-[0.2em] hover:bg-[#E4C98A] transition-all shadow-lg hover:shadow-gold-glow"
              >
                <span>Shop The Pieces</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/about"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-[#EFE3D2]/30 text-[#FFFDF9] hover:bg-white/10 text-xs uppercase tracking-[0.2em] font-medium transition-colors"
              >
                <span>Read The Story</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
