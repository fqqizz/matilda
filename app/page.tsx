import React from "react";
import { Hero } from "@/components/home/Hero";
import { BrandStatement } from "@/components/home/BrandStatement";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { EditorialStory } from "@/components/home/EditorialStory";
import { InstagramFeed } from "@/components/home/InstagramFeed";
import { DeliveryTrust } from "@/components/home/DeliveryTrust";

export default function HomePage() {
  return (
    <div>
      {/* 01: Hero Campaign */}
      <Hero />

      {/* 02: Brand Statement & Founder Note */}
      <BrandStatement />

      {/* 03: Shop by Category */}
      <CategoryGrid />

      {/* 04: Featured Collection & New Arrivals */}
      <FeaturedSection />

      {/* 05: Editorial Story ("Made For Your Era") */}
      <EditorialStory />

      {/* 06: Instagram Feed (@matilldaaa._) */}
      <InstagramFeed />

      {/* 07: Delivery & Trust Strip */}
      <DeliveryTrust />
    </div>
  );
}
