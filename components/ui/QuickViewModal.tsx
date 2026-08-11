"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/context/StoreContext";
import { formatINR, calculateDiscount } from "@/lib/utils";
import { X, Star, Heart, ShoppingBag, ArrowRight, Check, Truck, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const QuickViewModal = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, isInWishlist, toggleWishlist } = useStore();
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isSaved = isInWishlist(product.id);
  const discount = calculateDiscount(product.originalPrice, product.price);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariants);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setQuickViewProduct(null)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25 }}
          className="relative z-10 w-full max-w-3xl bg-[#FFFDF9] rounded-sm shadow-2xl border border-[#EFE3D2] overflow-hidden my-auto"
        >
          {/* Close button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 text-[#3A080C] hover:bg-[#3A080C] hover:text-[#E4C98A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image Gallery Column */}
            <div className="p-6 bg-[#FAF6F0] flex flex-col justify-between">
              <div className="relative aspect-square rounded-sm overflow-hidden bg-white border border-[#EFE3D2] mb-3">
                <Image
                  src={product.images[selectedImgIndex] || product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImgIndex(idx)}
                      className={`relative w-14 h-14 rounded-sm overflow-hidden border-2 transition-all ${
                        selectedImgIndex === idx ? "border-[#3A080C]" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info Column */}
            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C8A15A] font-semibold">
                  {product.category}
                </span>

                <h2 className="font-serif text-2xl font-bold text-[#3A080C] mt-1">
                  {product.name}
                </h2>

                {/* Rating */}
                {product.rating > 0 && (
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-[#7A7373]">
                    <div className="flex text-[#C8A15A]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.floor(product.rating) ? "fill-[#C8A15A]" : "text-[#EFE3D2]"
                          }`}
                        />
                      ))}
                    </div>
                    <span>({product.reviewCount} customer reviews)</span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-baseline gap-3 my-3">
                  <span className="font-serif text-2xl font-bold text-[#3A080C]">
                    {formatINR(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="text-sm text-[#7A7373] line-through">
                        {formatINR(product.originalPrice)}
                      </span>
                      {discount && (
                        <span className="bg-[#C8A15A] text-[#260407] text-[10px] font-bold px-1.5 py-0.5 rounded">
                          Save {discount}%
                        </span>
                      )}
                    </>
                  )}
                </div>

                <p className="text-xs text-[#4A4545] leading-relaxed line-clamp-3">
                  {product.description}
                </p>
              </div>

              {/* Variants Picker if available */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-[#F7F1E8]">
                  {product.variants.map((variant) => (
                    <div key={variant.name}>
                      <label className="text-[11px] uppercase tracking-wider text-[#3A080C] font-semibold block mb-1.5">
                        {variant.name}:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {variant.options.map((opt) => (
                          <button
                            key={opt.label}
                            onClick={() =>
                              setSelectedVariants((prev) => ({ ...prev, [variant.name]: opt.label }))
                            }
                            className={`px-3 py-1.5 text-xs rounded border transition-all ${
                              selectedVariants[variant.name] === opt.label
                                ? "border-[#3A080C] bg-[#3A080C] text-[#E4C98A] font-medium"
                                : "border-[#EFE3D2] bg-[#FAF6F0] text-[#3A080C] hover:border-[#C8A15A]"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3 pt-4 border-t border-[#F7F1E8]">
                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-3 px-4 bg-[#3A080C] text-[#E4C98A] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#5A1118] transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4 text-[#25D366]" />
                        <span>Added to Bag</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Bag</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-3 rounded border transition-colors ${
                      isSaved
                        ? "border-[#3A080C] bg-[#3A080C] text-[#E4C98A]"
                        : "border-[#EFE3D2] bg-[#FAF6F0] text-[#3A080C] hover:text-[#C8A15A]"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isSaved ? "fill-[#E4C98A]" : ""}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-[#7A7373] pt-1">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-[#C8A15A]" />
                    <span>Delivery Across India</span>
                  </span>

                  <Link
                    href={`/product/${product.slug}`}
                    onClick={() => setQuickViewProduct(null)}
                    className="text-[#3A080C] hover:text-[#C8A15A] font-semibold flex items-center gap-1 underline underline-offset-2"
                  >
                    <span>View Full Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
