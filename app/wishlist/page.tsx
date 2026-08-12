"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/lib/context/StoreContext";
import { ProductCard } from "@/components/product/ProductCard";
import { Heart, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  const { wishlist, products } = useStore();

  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="bg-[#FFFDF9] min-h-screen py-10 sm:py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#C8A15A] font-medium">
            Saved Pieces
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#1A0205]">
            Your Wishlist ({savedProducts.length})
          </h1>
          <p className="text-xs sm:text-sm text-[#7A7373] font-light">
            Keep track of your dream stacks, pendants, and waist chains.
          </p>
        </div>

        {savedProducts.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-16 bg-[#FAF6F0] rounded-sm border border-[#EFE3D2] p-8 space-y-4">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#C8A15A] mx-auto">
              <Heart className="w-6 h-6 stroke-1" />
            </div>
            <h2 className="font-serif text-2xl font-normal text-[#1A0205]">Your wishlist is empty</h2>
            <p className="text-xs text-[#7A7373] font-light leading-relaxed">
              Explore our jewellery collection and click the heart icon on any piece to save it here.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A0205] text-[#E4C98A] text-xs uppercase tracking-[0.14em] font-medium hover:bg-[#3A080C] transition-colors shadow-luxury"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {savedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
