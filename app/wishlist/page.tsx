"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/lib/context/StoreContext";
import { ProductCard } from "@/components/product/ProductCard";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  const { wishlist, products } = useStore();

  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="bg-[#FFFDF9] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C8A15A] font-semibold">
            Saved For Later
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3A080C]">
            Your Wishlist ({savedProducts.length})
          </h1>
          <p className="text-xs sm:text-sm text-[#7A7373]">
            Keep track of your dream stacks, pendants, and waist chains.
          </p>
        </div>

        {savedProducts.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-16 bg-[#FAF6F0] rounded-sm border border-[#EFE3D2] p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#C8A15A] mx-auto">
              <Heart className="w-8 h-8 stroke-1" />
            </div>
            <h2 className="font-serif text-2xl text-[#3A080C]">Your wishlist is empty</h2>
            <p className="text-xs text-[#7A7373] leading-relaxed">
              Explore our fine jewellery pieces and click the heart icon on any piece to save it here.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#3A080C] text-[#E4C98A] text-xs uppercase tracking-widest font-semibold hover:bg-[#5A1118] transition-colors"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {savedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
