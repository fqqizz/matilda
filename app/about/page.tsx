"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/context/StoreContext";
import { ArrowRight, Sparkles, ShieldCheck, Truck } from "lucide-react";

export default function AboutPage() {
  const { settings } = useStore();

  return (
    <div className="bg-[#FFFDF9] text-[#191414] min-h-screen font-sans">
      {/* Editorial Hero Banner */}
      <section className="relative py-28 sm:py-36 bg-[#1A0205] text-[#FFFDF9] overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "url('/images/matilda-pattern-secondary.png')",
            backgroundSize: "360px 360px",
            backgroundRepeat: "repeat",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A0205] via-transparent to-[#1A0205]/60" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#C8A15A] font-medium">
            Brand Narrative
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-[#FFFDF9] leading-[1.08]">
            Timeless Silhouettes. <br />
            <span className="italic font-light text-[#E4C98A]">Made to become yours.</span>
          </h1>
          <p className="font-serif italic text-xl sm:text-2xl text-[#E4C98A]/85 pt-1">
            by Duha Ajaz Pandith
          </p>
        </div>
      </section>

      {/* Main Story Narrative */}
      <section className="py-24 sm:py-32 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Intro Statement */}
        <div className="text-center space-y-6">
          <h2 className="font-serif text-2xl sm:text-4xl font-normal italic text-[#1A0205] leading-snug">
            We believe jewellery shouldn&apos;t be an occasional luxury saved for distant milestones.
            <br className="hidden sm:block" />
            It should be your daily signature.
          </h2>
          <div className="w-10 h-px bg-[#C8A15A] mx-auto" />
        </div>

        {/* 2 Column Image & Philosophy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="relative aspect-[4/5] rounded-sm overflow-hidden bg-[#1A0205] border border-[#EFE3D2] shadow-luxury">
            <Image
              src="/images/editorial-campaign-era.png"
              alt="Editorial campaign"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-[#4A4545] leading-[1.65] font-light">
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#1A0205]">
              The Vision Behind MATILDA
            </h3>
            <p>
              Founded by <strong>Duha Ajaz Pandith</strong>, MATILDA emerged from an authentic desire: offering modern women silhouettes with the rich finish, tactile weight, and craftsmanship of fine jewellery—without the exorbitant price markups.
            </p>
            <p>
              From delicate gold belly chains to celestial gothic star pendants, our pieces are selected for their versatility, timeless aesthetic, and everyday comfort.
            </p>
            <p>
              Every order is carefully packaged in signature protective pouches and dispatched across India with personal concierge care.
            </p>
          </div>
        </div>

        {/* 3 Core Values */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-[#EFE3D2]">
          <div className="p-6 bg-[#FAF6F0] rounded-sm border border-[#EFE3D2] text-center space-y-2">
            <Sparkles className="w-4 h-4 text-[#C8A15A] mx-auto" />
            <h4 className="font-serif text-lg font-normal text-[#1A0205]">Quiet Luxury</h4>
            <p className="text-xs text-[#7A7373] leading-relaxed font-light">
              Understated silhouettes that command attention through craftsmanship.
            </p>
          </div>

          <div className="p-6 bg-[#FAF6F0] rounded-sm border border-[#EFE3D2] text-center space-y-2">
            <ShieldCheck className="w-4 h-4 text-[#C8A15A] mx-auto" />
            <h4 className="font-serif text-lg font-normal text-[#1A0205]">Honest Value</h4>
            <p className="text-xs text-[#7A7373] leading-relaxed font-light">
              The presence of fine jewellery at an accessible price point.
            </p>
          </div>

          <div className="p-6 bg-[#FAF6F0] rounded-sm border border-[#EFE3D2] text-center space-y-2">
            <Truck className="w-4 h-4 text-[#C8A15A] mx-auto" />
            <h4 className="font-serif text-lg font-normal text-[#1A0205]">Pan-India Courier</h4>
            <p className="text-xs text-[#7A7373] leading-relaxed font-light">
              Insured courier across all pin codes with personal founder WhatsApp support.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#1A0205] text-[#E4C98A] text-xs uppercase tracking-[0.14em] font-medium hover:bg-[#3A080C] transition-all shadow-luxury"
          >
            <span>Explore The Collection</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
