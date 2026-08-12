"use client";

import React from "react";
import Image from "next/image";
import { Instagram, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const LOOKBOOK_ITEMS = [
  {
    image: "/images/instagram-enamel-bangles.png",
    title: "Broad Enamel Bangles in Ruby & Jade",
    tag: "Everyday Stack",
  },
  {
    image: "/images/golden-waist-chain.png",
    title: "Slender Golden Belly Chain",
    tag: "Summer Silhouette",
  },
  {
    image: "/images/gothic-star-pendant.png",
    title: "Gothic Star on Tactile Cord",
    tag: "Statement Piece",
  },
  {
    image: "/images/tulip-gemstone-bracelet.png",
    title: "Tulip Vine Gemstone Links",
    tag: "Botanical Gold",
  },
  {
    image: "/images/instagram-men-bracelet.png",
    title: "MATILDA MEN Floral Cross Links",
    tag: "Bold Silver",
  },
];

export const InstagramFeed = () => {
  return (
    <section className="py-20 sm:py-28 bg-[#FFFDF9] text-[#191414] border-b border-[#F7F1E8] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header with Direct Instagram Link */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EFE3D2]/60 pb-6">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#C8A15A] font-semibold block">
              Editorial Lookbook
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-normal text-[#1A0205]">
              As Styled by the Community
            </h2>
          </div>

          <a
            href="https://www.instagram.com/matilldaaa._/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FAF6F0] border border-[#EFE3D2] text-[#1A0205] text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-[#1A0205] hover:text-[#E4C98A] transition-all self-start sm:self-auto"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>@matilldaaa._</span>
            <ArrowUpRight className="w-3 h-3 text-[#C8A15A]" />
          </a>
        </div>

        {/* 5-Column Editorial Photo Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {LOOKBOOK_ITEMS.map((item, i) => (
            <motion.a
              key={i}
              href="https://www.instagram.com/matilldaaa._/"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group relative aspect-[3/4] rounded-sm overflow-hidden bg-[#FAF6F0] border border-[#EFE3D2] block"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 50vw, 20vw"
                className="object-cover transition-transform duration-700 ease-cinematic group-hover:scale-105"
              />

              {/* Hover Caption Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A0205]/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3.5 flex flex-col justify-between text-[#FFFDF9]">
                <div className="flex justify-end">
                  <Instagram className="w-4 h-4 text-[#E4C98A]" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[8.5px] uppercase tracking-[0.2em] text-[#E4C98A] font-light">
                    {item.tag}
                  </span>
                  <p className="text-[11px] font-serif text-[#FFFDF9] line-clamp-2">
                    {item.title}
                  </p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
