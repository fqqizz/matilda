"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export const BrandStatement = () => {
  return (
    <section className="py-24 sm:py-36 bg-[#FFFDF9] text-[#191414] border-b border-[#F7F1E8] relative overflow-hidden">
      {/* Faint luxury watermark */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none w-96 h-96">
        <Image
          src="/images/matilda-logo-cream-transparent.png"
          alt="MATILDA"
          width={400}
          height={200}
          className="object-contain"
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10 relative z-10">
        
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-block"
        >
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#C8A15A] font-semibold">
            The MATILDA Philosophy
          </span>
        </motion.div>

        {/* Large Editorial Quote (Clean, zero quotation marks) */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#1A0205] leading-[1.14] tracking-tight"
        >
          Jewellery that carries the presence of an heirloom, <br className="hidden sm:block" />
          <span className="italic font-light text-[#3A080C]">crafted for your daily signature.</span>
        </motion.h2>

        {/* Supporting Narrative */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto space-y-4 text-xs sm:text-sm text-[#4A4545] leading-relaxed font-sans font-light"
        >
          <p>
            MATILDA emerged from an uncompromising conviction: offering modern women silhouettes with the rich luster, tactile weight, and craftsmanship of fine jewellery—without the exorbitant markups.
          </p>
          <p className="text-[11px] text-[#7A7373] font-light">
            Every piece is curated in small batches and dispatched across India in signature protective packaging.
          </p>
        </motion.div>

        {/* Founder Signature Line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="pt-6 flex flex-col items-center justify-center space-y-1.5"
        >
          <div className="w-12 h-px bg-[#C8A15A] mb-3" />
          <p className="font-serif italic text-2xl sm:text-3xl text-[#3A080C]">
            Duha Ajaz Pandith
          </p>
          <p className="text-[9.5px] uppercase tracking-[0.3em] text-[#7A7373] font-sans font-light">
            Founder & Creative Director
          </p>
        </motion.div>
      </div>
    </section>
  );
};
