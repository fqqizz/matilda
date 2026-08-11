"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/context/StoreContext";
import { ArrowRight, Sparkles, Heart, ShieldCheck, Truck } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  const { settings } = useStore();

  return (
    <div className="bg-[#FFFDF9] text-[#191414] min-h-screen">
      {/* Editorial Hero Banner */}
      <section className="relative py-24 sm:py-32 bg-[#260407] text-[#FFFDF9] overflow-hidden">
        <div
          className="absolute inset-0 bg-repeat opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: "url('/images/matilda-pattern-secondary.png')",
            backgroundSize: "320px 320px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#260407] via-transparent to-[#260407]/60" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C8A15A] font-semibold">
            About MATILDA
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#FFFDF9] leading-tight">
            Timeless Silhouettes. <br />
            <span className="italic font-normal text-[#E4C98A]">Made To Become Yours.</span>
          </h1>
          <p className="font-serif italic text-2xl sm:text-3xl text-[#E4C98A]/90 pt-2">
            by Duha Ajaz Pandith
          </p>
        </div>
      </section>

      {/* Main Story Narrative */}
      <section className="py-20 sm:py-28 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Intro */}
        <div className="text-center space-y-6">
          <h2 className="font-serif text-2xl sm:text-4xl font-normal italic text-[#3A080C] leading-snug">
            We believe jewellery shouldn&apos;t be an occasional luxury saved for distant milestones.
            <br className="hidden sm:block" />
            It should be your daily signature.
          </h2>
          <div className="w-16 h-[1px] bg-[#C8A15A] mx-auto" />
        </div>

        {/* 2 Column Image & Philosophy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-[4/5] rounded-sm overflow-hidden bg-[#260407] border border-[#EFE3D2] shadow-lg">
            <Image
              src="/images/editorial-campaign-era.png"
              alt="Editorial campaign"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-[#4A4545] leading-relaxed font-sans">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#3A080C]">
              The Vision Behind MATILDA
            </h3>
            <p>
              Founded by <strong>Duha Ajaz Pandith</strong>, MATILDA emerged from a simple desire: offering modern women silhouettes with the rich finish and weight of fine jewellery, without the exorbitant price markups.
            </p>
            <p>
              From intricate gold-leaf enamel bangles to celestial gothic star pendants, our pieces are selected for their versatility, timeless aesthetic, and all-day comfort.
            </p>
            <p>
              We ship across all pin codes in India, ensuring every package arrives cushioned in protective velvet packaging ready for your everyday stack or thoughtful gifting.
            </p>
          </div>
        </div>

        {/* 3 Core Values */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-[#EFE3D2]">
          <div className="p-6 bg-[#FAF6F0] rounded border border-[#EFE3D2] text-center space-y-2">
            <Sparkles className="w-6 h-6 text-[#C8A15A] mx-auto" />
            <h4 className="font-serif text-base font-bold text-[#3A080C]">Quiet Luxury</h4>
            <p className="text-xs text-[#7A7373] leading-relaxed">
              Curated designs that command understated elegance without excessive visual noise.
            </p>
          </div>

          <div className="p-6 bg-[#FAF6F0] rounded border border-[#EFE3D2] text-center space-y-2">
            <ShieldCheck className="w-6 h-6 text-[#C8A15A] mx-auto" />
            <h4 className="font-serif text-base font-bold text-[#3A080C]">Accessible Elegance</h4>
            <p className="text-xs text-[#7A7373] leading-relaxed">
              The look of fine jewellery at a fraction of the cost, making beauty an everyday habit.
            </p>
          </div>

          <div className="p-6 bg-[#FAF6F0] rounded border border-[#EFE3D2] text-center space-y-2">
            <Truck className="w-6 h-6 text-[#C8A15A] mx-auto" />
            <h4 className="font-serif text-base font-bold text-[#3A080C]">Delivery Across India</h4>
            <p className="text-xs text-[#7A7373] leading-relaxed">
              Fast, insured shipping with direct founder customer care via WhatsApp.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#3A080C] text-[#E4C98A] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#5A1118] transition-all shadow-md"
          >
            <span>Explore The Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
