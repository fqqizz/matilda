import React from "react";
import { Hero } from "@/components/home/Hero";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { EditorialStory } from "@/components/home/EditorialStory";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { BrandStatement } from "@/components/home/BrandStatement";
import { InstagramFeed } from "@/components/home/InstagramFeed";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FFFDF9]">
      {/* 01: Full-Viewport Cinematic Video Hero */}
      <Hero />

      {/* 02: Asymmetric Featured Editorial Collection */}
      <FeaturedSection />

      {/* 03: Pinned Signature Editorial Story (3 Chapters) */}
      <EditorialStory />

      {/* 04: Thematic Silhouette Category Tiles */}
      <CategoryGrid />

      {/* 05: Minimalist Brand Statement & Founder Note */}
      <BrandStatement />

      {/* 06: Editorial Lookbook Strip (@matilldaaa._) */}
      <InstagramFeed />
    </main>
  );
}
