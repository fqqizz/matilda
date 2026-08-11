"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/context/StoreContext";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const CategoryGrid = () => {
  const { categories, products } = useStore();

  return (
    <section className="py-20 sm:py-24 bg-[#FAF6F0] text-[#191414] border-b border-[#EFE3D2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C8A15A] font-semibold">
              Curated Silhouettes
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3A080C] tracking-tight">
              Shop By Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#3A080C] hover:text-[#C8A15A] transition-colors"
          >
            <span>View All Pieces</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Categories Grid (6 Real Categories) */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((cat, idx) => {
            const count = products.filter((p) => p.category === cat.name).length;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
              >
                <Link
                  href={`/shop?category=${encodeURIComponent(cat.name)}`}
                  className="group relative block aspect-[4/5] sm:aspect-[3/4] overflow-hidden rounded-sm bg-[#260407] border border-[#EFE3D2] shadow-sm hover:border-[#C8A15A] transition-all"
                >
                  {/* Category Background Image with subtle hover parallax */}
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-108 opacity-85 group-hover:opacity-95"
                  />

                  {/* Gradient Overlay for Text Clarity */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#260407]/90 via-[#260407]/30 to-transparent transition-opacity duration-300 group-hover:opacity-80" />

                  {/* Category Details */}
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 text-[#FFFDF9] flex flex-col justify-end space-y-1">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#E4C98A] font-medium">
                      {count} {count === 1 ? "Piece" : "Pieces"}
                    </span>
                    <h3 className="font-serif text-lg sm:text-2xl font-bold tracking-wide text-[#FFFDF9] group-hover:text-[#E4C98A] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-[#EFE3D2]/80 line-clamp-1 font-sans hidden sm:block">
                      {cat.description}
                    </p>
                    <div className="pt-1 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#C8A15A] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Explore Category</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
