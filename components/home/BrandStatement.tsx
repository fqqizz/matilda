"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export const BrandStatement = () => {
  return (
    <section className="py-20 sm:py-28 bg-[#FFFDF9] text-[#191414] border-b border-[#F7F1E8] relative overflow-hidden">
      {/* Faint luxury watermark */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none w-96 h-96">
        <Image
          src="/images/matilda-logo-cream-transparent.png"
          alt="MATILDA mark"
          width={400}
          height={200}
          className="object-contain"
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
        
        {/* Category Tag */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-block"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-[#C8A15A] font-semibold">
            The MATILDA Ethos
          </span>
        </motion.div>

        {/* Large Editorial Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#3A080C] leading-[1.15] tracking-tight"
        >
          Jewellery that looks like an heirloom
          <br className="hidden sm:block" />
          and costs like a treat.
        </motion.h2>

        {/* Supporting Narrative */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl mx-auto space-y-4 text-sm sm:text-base text-[#4A4545] leading-relaxed font-sans"
        >
          <p>
            MATILDA was created with a clear, uncompromising vision: to bring you timeless silhouettes offering the look of fine jewellery at an accessible fraction of the cost.
          </p>
          <p className="text-xs sm:text-sm text-[#7A7373]">
            From delicate golden waist chains to vintage enamel bangles and traditional Marathi naths, every piece is curated for effortless daily expression and delivered with care across India.
          </p>
        </motion.div>

        {/* Founder Signature Line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="pt-4 flex flex-col items-center justify-center space-y-1"
        >
          <div className="w-12 h-[1px] bg-[#C8A15A] mb-2" />
          <p className="font-serif italic text-2xl sm:text-3xl text-[#5A1118]">
            Duha Ajaz Pandith
          </p>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#7A7373]">
            Founder & Creative Director
          </p>
        </motion.div>
      </div>
    </section>
  );
};
