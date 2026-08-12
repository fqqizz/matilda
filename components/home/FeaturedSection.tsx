"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/lib/context/StoreContext";
import { ProductCard } from "@/components/product/ProductCard";
import { ArrowRight } from "lucide-react";

export const FeaturedSection = () => {
  const { products } = useStore();
  const featured = products.filter((p) => p.isFeatured && p.isPublished).slice(0, 5);

  if (featured.length === 0) return null;

  return (
    <section className="py-24 sm:py-32 bg-[#FFFDF9] text-[#191414] border-b border-[#F7F1E8] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* ── SECTION HEADER (Editorial Hierarchy) ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#EFE3D2]/50 pb-6">
          <div className="space-y-2 max-w-lg">
            <span className="text-[10px] uppercase tracking-[0.18em] text-[#C8A15A] font-sans font-medium block">
              Featured
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#1A0205] leading-tight">
              A little <span className="italic text-[#3A080C] font-light">extraordinary.</span>
            </h2>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] font-sans font-medium text-[#1A0205] hover:text-[#C8A15A] transition-colors pb-0.5 border-b border-[#1A0205]/40 hover:border-[#C8A15A] self-start md:self-end"
          >
            <span>View All Pieces</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ── ASYMMETRICAL EDITORIAL GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Large Hero Card (Left 7 cols) */}
          {featured[0] && (
            <div className="lg:col-span-7">
              <ProductCard product={featured[0]} priority aspectRatio="tall" />
            </div>
          )}

          {/* Two Secondary Cards (Right 5 cols) */}
          <div className="lg:col-span-5 space-y-8 lg:space-y-12">
            {featured[1] && (
              <ProductCard product={featured[1]} aspectRatio="portrait" />
            )}
            {featured[2] && (
              <ProductCard product={featured[2]} aspectRatio="portrait" />
            )}
          </div>
        </div>

        {/* Balanced Editorial Row */}
        {featured.length > 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12 pt-2">
            {featured[3] && (
              <ProductCard product={featured[3]} aspectRatio="portrait" />
            )}
            {featured[4] && (
              <ProductCard product={featured[4]} aspectRatio="portrait" />
            )}
          </div>
        )}
      </div>
    </section>
  );
};
