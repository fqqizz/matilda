"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import { useStore } from "@/lib/context/StoreContext";
import { Heart, Eye, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  aspectRatio?: "portrait" | "square" | "tall";
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  priority = false,
  aspectRatio = "portrait",
}) => {
  const { wishlist, toggleWishlist, addToCart, setQuickViewProduct } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const isWishlisted = wishlist.includes(product.id);

  const primaryImage = product.images[0] || "/images/golden-waist-chain.png";
  const secondaryImage = product.images[1] || primaryImage;

  const aspectClass =
    aspectRatio === "tall"
      ? "aspect-[3/4.2]"
      : aspectRatio === "square"
      ? "aspect-square"
      : "aspect-[4/5]";

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── IMAGE WRAPPER ── */}
      <Link
        href={`/product/${product.id}`}
        className={`relative w-full ${aspectClass} overflow-hidden bg-[#FAF6F0] rounded-sm border border-[#EFE3D2]/60 block`}
        aria-label={`View ${product.name}`}
      >
        {/* Primary Image */}
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover object-center transition-all duration-700 ease-cinematic ${
            isHovered && secondaryImage !== primaryImage
              ? "opacity-0 scale-105"
              : "opacity-100 group-hover:scale-[1.03]"
          }`}
        />

        {/* Secondary Cross-fade Image (Lifestyle context) */}
        {secondaryImage !== primaryImage && (
          <Image
            src={secondaryImage}
            alt={`${product.name} context`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover object-center transition-all duration-700 ease-cinematic absolute inset-0 ${
              isHovered ? "opacity-100 scale-[1.03]" : "opacity-0 scale-100"
            }`}
          />
        )}

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.isNewArrival && (
            <span className="px-2 py-0.5 text-[8.5px] uppercase tracking-[0.14em] font-sans font-medium bg-[#1A0205]/90 text-[#E4C98A] backdrop-blur-xs">
              New Edition
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="px-2 py-0.5 text-[8.5px] uppercase tracking-[0.14em] font-sans font-light bg-[#5A1118]/90 text-[#FFFDF9] backdrop-blur-xs">
              Few Left
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-all duration-200 z-20 ${
            isWishlisted
              ? "bg-[#1A0205] text-[#E4C98A]"
              : "bg-[#FFFDF9]/85 text-[#191414] hover:bg-[#1A0205] hover:text-[#E4C98A] opacity-0 group-hover:opacity-100"
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-[#E4C98A]" : ""}`} />
        </button>

        {/* Quick Action Overlay (Bottom) */}
        <div className="absolute bottom-2.5 inset-x-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1.5 group-hover:translate-y-0 z-20">
          <button
            onClick={handleQuickView}
            className="flex-1 py-2 px-3 bg-[#FFFDF9]/95 text-[#1A0205] hover:bg-[#1A0205] hover:text-[#E4C98A] text-[9.5px] uppercase tracking-[0.14em] font-sans font-medium transition-colors flex items-center justify-center gap-1 shadow-xs"
          >
            <Eye className="w-3 h-3" />
            <span>Quick View</span>
          </button>
          <button
            onClick={handleQuickAdd}
            disabled={product.stock === 0}
            className="p-2 bg-[#C8A15A] text-[#1A0205] hover:bg-[#E4C98A] transition-colors disabled:opacity-50 shadow-xs"
            aria-label="Add to bag"
          >
            <ShoppingBag className="w-3 h-3" />
          </button>
        </div>
      </Link>

      {/* ── CARD METADATA ── */}
      <div className="pt-3 pb-1 space-y-0.5">
        <p className="text-[9.5px] uppercase tracking-[0.14em] text-[#C8A15A] font-sans font-normal">
          {product.category}
        </p>
        
        <Link href={`/product/${product.id}`} className="block group-hover:text-[#3A080C] transition-colors">
          <h3 className="font-serif text-base sm:text-lg font-medium text-[#1A0205] leading-snug line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <div className="pt-0.5 flex items-baseline gap-2">
          <span className="font-sans font-medium text-xs sm:text-sm text-[#1A0205]">
            {formatINR(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-[11px] text-[#7A7373] line-through font-sans font-light">
              {formatINR(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
