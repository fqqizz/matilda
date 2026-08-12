"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/context/StoreContext";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export const CategoryGrid = () => {
  const { categories } = useStore();

  return (
    <section className="py-24 sm:py-32 bg-[#FAF6F0] text-[#191414] border-b border-[#EFE3D2]/70 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* ── SECTION HEADER ── */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] uppercase tracking-[0.18em] text-[#C8A15A] font-sans font-medium block">
            Categories
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#1A0205] leading-tight">
            Explore by silhouette.
          </h2>
        </div>

        {/* ── EDITORIAL CATEGORY TILES (Grid) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="group relative aspect-[4/5] block rounded-sm overflow-hidden bg-[#260407] border border-[#EFE3D2]/80 shadow-xs"
              >
                {/* Background Image */}
                <Image
                  src={cat.image || "/images/gothic-star-pendant.png"}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-cinematic group-hover:scale-105 opacity-90 group-hover:opacity-100"
                />

                {/* Subtle Gradient Veil */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A0205]/85 via-[#1A0205]/20 to-transparent transition-opacity duration-300" />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between text-[#FFFDF9]">
                  <div className="flex justify-end">
                    <span className="w-8 h-8 rounded-full bg-[#FFFDF9]/10 backdrop-blur-xs border border-[#FFFDF9]/20 flex items-center justify-center text-[#E4C98A] group-hover:bg-[#C8A15A] group-hover:text-[#1A0205] transition-colors duration-300">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[9.5px] uppercase tracking-[0.18em] text-[#E4C98A]/90 font-sans font-normal">
                      Silhouette 0{index + 1}
                    </p>
                    <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#FFFDF9] leading-tight">
                      {cat.name}
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
