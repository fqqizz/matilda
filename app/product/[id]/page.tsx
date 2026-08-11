"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/context/StoreContext";
import { ProductCard } from "@/components/product/ProductCard";
import { ReviewSection } from "@/components/product/ReviewSection";
import { formatINR, calculateDiscount } from "@/lib/utils";
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Package,
  MessageCircle,
  ChevronRight,
  ChevronDown,
  Check,
  Sparkles,
  Plus,
  Minus,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slugOrId = params?.id as string;

  const { products, addToCart, isInWishlist, toggleWishlist, settings } = useStore();

  // Find product by slug or id
  const product = useMemo(() => {
    return products.find(
      (p) => p.slug === slugOrId || p.id === slugOrId
    );
  }, [products, slugOrId]);

  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState<string | null>("details");
  const [isAdded, setIsAdded] = useState(false);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20 bg-[#FFFDF9]">
        <h2 className="font-serif text-3xl text-[#3A080C] mb-2">Piece Not Found</h2>
        <p className="text-xs text-[#7A7373] max-w-sm mb-6">
          The jewellery piece you are looking for might have been moved or is currently unavailable.
        </p>
        <Link
          href="/shop"
          className="px-8 py-3 bg-[#3A080C] text-[#E4C98A] text-xs uppercase tracking-widest font-semibold hover:bg-[#5A1118] transition-colors"
        >
          Return to Catalogue
        </Link>
      </div>
    );
  }

  const isSaved = isInWishlist(product.id);
  const discount = calculateDiscount(product.originalPrice, product.price);

  // Related products from the same category or best sellers
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.isBestSeller))
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariants);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariants);
    router.push("/checkout");
  };

  const toggleAccordion = (section: string) => {
    setActiveAccordion((prev) => (prev === section ? null : section));
  };

  return (
    <div className="bg-[#FFFDF9] text-[#191414] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Trail */}
        <nav className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#7A7373] mb-8 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#3A080C] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-[#C8A15A]" />
          <Link href="/shop" className="hover:text-[#3A080C] transition-colors">Jewellery</Link>
          <ChevronRight className="w-3 h-3 text-[#C8A15A]" />
          <Link
            href={`/shop?category=${encodeURIComponent(product.category)}`}
            className="hover:text-[#3A080C] transition-colors"
          >
            {product.category}
          </Link>
          <ChevronRight className="w-3 h-3 text-[#C8A15A]" />
          <span className="text-[#3A080C] font-semibold truncate">{product.name}</span>
        </nav>

        {/* Product Grid: Sticky Gallery + Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Left Column: Sticky Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            
            {/* Thumbnails list */}
            {product.images.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[500px] shrink-0 no-scrollbar">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImgIndex(idx)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-sm overflow-hidden border-2 transition-all bg-[#FAF6F0] shrink-0 ${
                      selectedImgIndex === idx
                        ? "border-[#3A080C] shadow-sm"
                        : "border-transparent opacity-65 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} angle ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Featured Image */}
            <div className="relative flex-1 aspect-[4/5] rounded-sm overflow-hidden bg-[#FAF6F0] border border-[#EFE3D2] shadow-sm">
              <Image
                src={product.images[selectedImgIndex] || product.images[0]}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                {product.isBestSeller && (
                  <span className="bg-[#3A080C] text-[#E4C98A] text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 shadow-md">
                    Signature Piece
                  </span>
                )}
                {discount && (
                  <span className="bg-[#C8A15A] text-[#260407] text-[10px] font-bold px-2 py-0.5 shadow-md">
                    Save {discount}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Product Information & Purchase Controls */}
          <div className="lg:col-span-5 space-y-6">
            
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#C8A15A] font-semibold block mb-1">
                {product.category}
              </span>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3A080C] tracking-tight leading-tight">
                {product.name}
              </h1>

              {product.subtitle && (
                <p className="text-xs sm:text-sm text-[#7A7373] mt-1 font-sans">
                  {product.subtitle}
                </p>
              )}

              {/* Reviews Summary */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex text-[#C8A15A]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(product.rating || 5)
                          ? "fill-[#C8A15A] text-[#C8A15A]"
                          : "text-[#EFE3D2]"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-[#3A080C]">
                  {product.rating > 0 ? product.rating.toFixed(1) : "5.0"}
                </span>
                <span className="text-xs text-[#7A7373]">
                  ({product.reviewCount} verified reviews)
                </span>
              </div>
            </div>

            {/* Price Row */}
            <div className="p-4 bg-[#FAF6F0] rounded-sm border border-[#EFE3D2] flex items-baseline justify-between">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl font-bold text-[#3A080C]">
                  {formatINR(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-[#7A7373] line-through">
                    {formatINR(product.originalPrice)}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-[#25D366] font-semibold bg-[#25D366]/10 px-2.5 py-1 rounded-full">
                Inclusive of all taxes
              </span>
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-[#4A4545] leading-relaxed">
              {product.description}
            </p>

            {/* Variants Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4 pt-2">
                {product.variants.map((variant) => (
                  <div key={variant.name} className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="uppercase tracking-wider font-semibold text-[#3A080C]">
                        Select {variant.name}:
                      </span>
                      {selectedVariants[variant.name] && (
                        <span className="text-[#C8A15A] font-medium">
                          {selectedVariants[variant.name]}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {variant.options.map((opt) => {
                        const isSelected = selectedVariants[variant.name] === opt.label;
                        return (
                          <button
                            key={opt.label}
                            type="button"
                            onClick={() =>
                              setSelectedVariants((prev) => ({
                                ...prev,
                                [variant.name]: opt.label,
                              }))
                            }
                            className={`px-4 py-2 text-xs rounded border transition-all ${
                              isSelected
                                ? "border-[#3A080C] bg-[#3A080C] text-[#E4C98A] font-semibold shadow-sm"
                                : "border-[#EFE3D2] bg-[#FFFDF9] text-[#3A080C] hover:border-[#C8A15A]"
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Stock Level Warning */}
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
              <span className="text-[#3A080C] font-medium">
                In Stock ({product.stock} pieces remaining across India)
              </span>
            </div>

            {/* Quantity Stepper & Add to Bag / Buy Now */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-[#EFE3D2] rounded bg-[#FAF6F0] px-2">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 text-[#3A080C] hover:text-[#C8A15A]"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 font-semibold text-xs text-[#3A080C]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="p-2 text-[#3A080C] hover:text-[#C8A15A]"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-6 bg-[#3A080C] text-[#E4C98A] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#5A1118] transition-all flex items-center justify-center gap-2 shadow-md"
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

                {/* Wishlist Heart */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3.5 rounded border transition-colors ${
                    isSaved
                      ? "border-[#3A080C] bg-[#3A080C] text-[#E4C98A]"
                      : "border-[#EFE3D2] bg-[#FAF6F0] text-[#3A080C] hover:border-[#C8A15A]"
                  }`}
                  aria-label="Save to Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isSaved ? "fill-[#E4C98A]" : ""}`} />
                </button>
              </div>

              {/* Buy Now Express Button */}
              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 px-6 bg-[#C8A15A] text-[#260407] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#E4C98A] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Buy Now • Express Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Direct Founder WhatsApp Consultation Button */}
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=Hi%20Duha!%20I'm%20looking%20at%20the%20${encodeURIComponent(product.name)}%20(₹${product.price})%20on%20MATILDA%20and%20had%20a%20question.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-xs rounded font-semibold hover:bg-[#25D366] hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Ask Duha on WhatsApp</span>
              </a>
            </div>

            {/* Delivery & Trust Strip */}
            <div className="p-4 rounded bg-[#FAF6F0] border border-[#EFE3D2] space-y-2 text-xs text-[#7A7373]">
              <div className="flex items-center gap-2 text-[#3A080C] font-semibold">
                <Truck className="w-4 h-4 text-[#C8A15A]" />
                <span>Delivery Across India • 3 to 6 Business Days</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#C8A15A]" />
                <span>Packed in signature velvet protective pouch</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C8A15A]" />
                <span>Insured transit with live SMS/WhatsApp updates</span>
              </div>
            </div>

            {/* Accordions (Details, Sizing, Care, Shipping) */}
            <div className="border-t border-[#EFE3D2] pt-4 space-y-3">
              
              {/* Product Details Accordion */}
              <div className="border-b border-[#EFE3D2] pb-3">
                <button
                  onClick={() => toggleAccordion("details")}
                  className="w-full flex items-center justify-between text-xs uppercase tracking-wider font-semibold text-[#3A080C] py-1"
                >
                  <span>Product Specifications</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#C8A15A] transition-transform duration-200 ${
                      activeAccordion === "details" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {activeAccordion === "details" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="text-xs text-[#4A4545] pt-2 space-y-2 overflow-hidden"
                    >
                      <p className="italic text-[#7A7373]">{product.materials}</p>
                      <ul className="space-y-1.5 list-disc pl-4 text-xs">
                        {product.details.map((det, i) => (
                          <li key={i}>{det}</li>
                        ))}
                      </ul>
                      <p className="text-[11px] text-[#7A7373] pt-1">SKU: {product.sku}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Care Instructions Accordion */}
              <div className="border-b border-[#EFE3D2] pb-3">
                <button
                  onClick={() => toggleAccordion("care")}
                  className="w-full flex items-center justify-between text-xs uppercase tracking-wider font-semibold text-[#3A080C] py-1"
                >
                  <span>Jewellery Care Guide</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#C8A15A] transition-transform duration-200 ${
                      activeAccordion === "care" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {activeAccordion === "care" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="text-xs text-[#4A4545] pt-2 space-y-1.5 overflow-hidden"
                    >
                      <p>• Avoid direct contact with harsh perfumes, body lotions, and sanitizers.</p>
                      <p>• Store inside your MATILDA velvet pouch when not in use.</p>
                      <p>• Wipe gently with a soft microfibre cloth after daily wear.</p>
                      <p>• Remove before swimming or rigorous workouts.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Shipping Policy Accordion */}
              <div className="border-b border-[#EFE3D2] pb-3">
                <button
                  onClick={() => toggleAccordion("shipping")}
                  className="w-full flex items-center justify-between text-xs uppercase tracking-wider font-semibold text-[#3A080C] py-1"
                >
                  <span>Shipping & Returns</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#C8A15A] transition-transform duration-200 ${
                      activeAccordion === "shipping" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {activeAccordion === "shipping" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="text-xs text-[#4A4545] pt-2 space-y-1.5 overflow-hidden"
                    >
                      <p>• Complimentary shipping on all India orders above ₹499.</p>
                      <p>• Orders dispatched within 24 hours of confirmation.</p>
                      <p>• Easy 7-day exchange assistance for any damaged transit items.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Star Reviews Section */}
        <ReviewSection
          productId={product.id}
          productName={product.name}
          reviews={product.reviews}
          averageRating={product.rating}
        />

        {/* Recommended / Matching Pieces */}
        {relatedProducts.length > 0 && (
          <div className="py-16 border-t border-[#EFE3D2]">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-[0.25em] text-[#C8A15A] font-semibold">
                  Complete The Stack
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#3A080C]">
                  You May Also Adore
                </h3>
              </div>
              <Link
                href="/shop"
                className="text-xs uppercase tracking-wider font-semibold text-[#3A080C] hover:text-[#C8A15A] transition-colors"
              >
                View Collection →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
