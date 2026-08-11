"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/context/StoreContext";
import { ProductCard } from "../product/ProductCard";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const FeaturedSection = () => {
  const { products } = useStore();
  const [activeTab, setActiveTab] = useState<"all" | "bestsellers" | "new" | "under200">("all");

  const filteredProducts = products.filter((p) => {
    if (!p.isPublished) return false;
    if (activeTab === "bestsellers") return p.isBestSeller;
    if (activeTab === "new") return p.isNewArrival;
    if (activeTab === "under200") return p.price <= 200;
    return true;
  });

  return (
    <section className="py-20 sm:py-28 bg-[#FFFDF9] text-[#191414] border-b border-[#F7F1E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header and Filter Pills */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C8A15A] font-semibold flex items-center justify-center md:justify-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Signature Jewellery</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3A080C] tracking-tight">
              Featured Pieces
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 text-xs">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-full transition-all uppercase tracking-wider font-semibold ${
                activeTab === "all"
                  ? "bg-[#3A080C] text-[#E4C98A] shadow-sm"
                  : "bg-[#FAF6F0] text-[#7A7373] hover:text-[#3A080C] border border-[#EFE3D2]"
              }`}
            >
              All Pieces ({products.length})
            </button>
            <button
              onClick={() => setActiveTab("bestsellers")}
              className={`px-4 py-2 rounded-full transition-all uppercase tracking-wider font-semibold ${
                activeTab === "bestsellers"
                  ? "bg-[#3A080C] text-[#E4C98A] shadow-sm"
                  : "bg-[#FAF6F0] text-[#7A7373] hover:text-[#3A080C] border border-[#EFE3D2]"
              }`}
            >
              Best Sellers
            </button>
            <button
              onClick={() => setActiveTab("new")}
              className={`px-4 py-2 rounded-full transition-all uppercase tracking-wider font-semibold ${
                activeTab === "new"
                  ? "bg-[#3A080C] text-[#E4C98A] shadow-sm"
                  : "bg-[#FAF6F0] text-[#7A7373] hover:text-[#3A080C] border border-[#EFE3D2]"
              }`}
            >
              New Arrivals
            </button>
            <button
              onClick={() => setActiveTab("under200")}
              className={`px-4 py-2 rounded-full transition-all uppercase tracking-wider font-semibold ${
                activeTab === "under200"
                  ? "bg-[#3A080C] text-[#E4C98A] shadow-sm"
                  : "bg-[#FAF6F0] text-[#7A7373] hover:text-[#3A080C] border border-[#EFE3D2]"
              }`}
            >
              Under ₹200
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.slice(0, 8).map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#FAF6F0] border border-[#C8A15A]/40 text-[#3A080C] hover:bg-[#3A080C] hover:text-[#E4C98A] text-xs uppercase tracking-[0.2em] font-semibold transition-all shadow-sm"
          >
            <span>Explore Complete Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
