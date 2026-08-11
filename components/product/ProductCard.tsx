"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { useStore } from "@/lib/context/StoreContext";
import { formatINR, calculateDiscount } from "@/lib/utils";
import { Heart, Eye, ShoppingBag, Star } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, priority = false }) => {
  const { isInWishlist, toggleWishlist, addToCart, setQuickViewProduct } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const isSaved = isInWishlist(product.id);
  const discount = calculateDiscount(product.originalPrice, product.price);

  const hasSecondaryImage = product.images.length > 1;
  const primaryImg = product.images[0] || "/images/golden-waist-chain.png";
  const secondaryImg = product.images[1] || primaryImg;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      className="group relative flex flex-col bg-[#FFFDF9] border border-[#F3ECE0] hover:border-[#C8A15A]/40 transition-all duration-300 rounded-sm overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with link */}
      <Link href={`/product/${product.slug}`} className="relative block aspect-[4/5] bg-[#FAF6F0] overflow-hidden">
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 pointer-events-none">
          {product.isBestSeller && (
            <span className="bg-[#3A080C] text-[#E4C98A] text-[9px] uppercase tracking-widest font-semibold px-2 py-0.5 shadow-sm">
              Best Seller
            </span>
          )}
          {product.isNewArrival && !product.isBestSeller && (
            <span className="bg-[#5A1118] text-[#FFFDF9] text-[9px] uppercase tracking-widest font-semibold px-2 py-0.5 shadow-sm">
              New Arrival
            </span>
          )}
          {discount && (
            <span className="bg-[#C8A15A] text-[#260407] text-[9px] font-bold px-1.5 py-0.5 shadow-sm">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
            isSaved
              ? "bg-[#3A080C] text-[#E4C98A]"
              : "bg-white/80 text-[#3A080C] hover:bg-[#3A080C] hover:text-[#E4C98A]"
          }`}
          aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
        >
          <motion.div whileTap={{ scale: 0.85 }}>
            <Heart className={`w-4 h-4 ${isSaved ? "fill-[#E4C98A]" : ""}`} />
          </motion.div>
        </button>

        {/* Primary and Hover Secondary Image */}
        <div className="relative w-full h-full">
          <Image
            src={primaryImg}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className={`object-cover transition-all duration-700 ease-out ${
              isHovered && hasSecondaryImage ? "opacity-0 scale-105" : "opacity-100 scale-100"
            }`}
          />
          {hasSecondaryImage && (
            <Image
              src={secondaryImg}
              alt={`${product.name} alternate view`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-cover transition-all duration-700 ease-out ${
                isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
              }`}
            />
          )}
        </div>

        {/* Hover Quick Actions Bar */}
        <div className="absolute inset-x-2 bottom-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleQuickView}
            className="flex-1 py-2 px-3 bg-white/90 backdrop-blur-md text-[#3A080C] hover:bg-[#3A080C] hover:text-[#E4C98A] text-[11px] uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Quick View</span>
          </button>
          <button
            onClick={handleQuickAdd}
            className="flex-1 py-2 px-3 bg-[#3A080C] text-[#E4C98A] hover:bg-[#5A1118] text-[11px] uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </Link>

      {/* Product Content Details */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between space-y-2">
        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#C8A15A] font-medium truncate">
              {product.category}
            </span>
            {product.rating > 0 && (
              <div className="flex items-center gap-0.5 text-[10px] text-[#7A7373] shrink-0">
                <Star className="w-3 h-3 fill-[#C8A15A] text-[#C8A15A]" />
                <span className="font-semibold text-[#191414]">{product.rating}</span>
                <span>({product.reviewCount})</span>
              </div>
            )}
          </div>

          <Link href={`/product/${product.slug}`} className="block group-hover:text-[#C8A15A] transition-colors">
            <h3 className="font-serif text-sm sm:text-base font-semibold text-[#3A080C] line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>
          
          {product.subtitle && (
            <p className="text-[11px] text-[#7A7373] line-clamp-1 mt-0.5 font-sans">
              {product.subtitle}
            </p>
          )}
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 pt-1 border-t border-[#F7F1E8]">
          <span className="font-serif text-base sm:text-lg font-bold text-[#3A080C]">
            {formatINR(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-[#7A7373] line-through">
              {formatINR(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
