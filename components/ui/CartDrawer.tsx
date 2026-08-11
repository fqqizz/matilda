"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/context/StoreContext";
import { formatINR } from "@/lib/utils";
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Sparkles, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    cartCount,
    cartSubtotal,
    shippingFee,
    cartTotal,
    settings,
  } = useStore();

  const freeShippingLeft = Math.max(0, settings.freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(
    100,
    (cartSubtotal / settings.freeShippingThreshold) * 100
  );

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs"
          />

          {/* Slide-out Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-[#FFFDF9] text-[#191414] shadow-2xl flex flex-col justify-between overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b border-[#EFE3D2] flex items-center justify-between bg-[#FAF6F0]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#3A080C]" />
                <h3 className="font-serif text-lg font-semibold text-[#3A080C] tracking-wide">
                  Your Jewellery Bag ({cartCount})
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-full text-[#3A080C] hover:bg-[#EFE3D2] transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="bg-[#FAF6F0] px-5 py-3 border-b border-[#EFE3D2] text-xs">
              {freeShippingLeft > 0 ? (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-[#3A080C] font-medium">
                    <span>
                      Add <strong className="text-[#3A080C]">{formatINR(freeShippingLeft)}</strong> more for <strong>FREE India Shipping</strong>
                    </span>
                    <span className="text-[#C8A15A] font-bold">{Math.round(freeShippingProgress)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#EFE3D2] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C8A15A] transition-all duration-500 rounded-full"
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[#3A080C] font-medium">
                  <Sparkles className="w-4 h-4 text-[#C8A15A]" />
                  <span>You have unlocked <strong>FREE Delivery across India!</strong></span>
                </div>
              )}
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                  <div className="w-16 h-16 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#C8A15A]">
                    <ShoppingBag className="w-8 h-8 stroke-1" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-serif text-lg text-[#3A080C]">Your bag is currently empty</h4>
                    <p className="text-xs text-[#7A7373] max-w-xs">
                      Discover our timeless silhouettes offering the look of fine jewellery at a fraction of the cost.
                    </p>
                  </div>
                  <Link
                    href="/shop"
                    onClick={() => setIsCartOpen(false)}
                    className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 bg-[#3A080C] text-[#E4C98A] text-xs uppercase tracking-widest font-semibold hover:bg-[#5A1118] transition-colors"
                  >
                    <span>Explore Jewellery</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                cart.map((item, index) => (
                  <div
                    key={`${item.productId}-${index}-${JSON.stringify(item.selectedVariant)}`}
                    className="flex gap-4 pb-4 border-b border-[#F7F1E8] last:border-b-0"
                  >
                    {/* Item Thumbnail */}
                    <div className="relative w-20 h-20 rounded bg-[#FAF6F0] overflow-hidden shrink-0 border border-[#EFE3D2]">
                      <Image
                        src={item.product.images[0] || "/images/golden-waist-chain.png"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <Link
                            href={`/product/${item.product.slug}`}
                            onClick={() => setIsCartOpen(false)}
                            className="font-serif text-sm font-medium text-[#3A080C] hover:text-[#C8A15A] transition-colors truncate"
                          >
                            {item.product.name}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.productId, item.selectedVariant)}
                            className="text-[#7A7373] hover:text-[#5A1118] transition-colors p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Variant label if any */}
                        {item.selectedVariant && (
                          <p className="text-[11px] text-[#7A7373]">
                            {Object.entries(item.selectedVariant).map(([k, v]) => `${k}: ${v}`).join(", ")}
                          </p>
                        )}

                        <p className="text-xs font-semibold text-[#3A080C] mt-0.5">
                          {formatINR(item.unitPrice)}
                        </p>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-[#EFE3D2] rounded bg-[#FAF6F0]">
                          <button
                            onClick={() =>
                              updateCartQuantity(item.productId, item.quantity - 1, item.selectedVariant)
                            }
                            className="px-2 py-0.5 text-xs text-[#3A080C] hover:bg-[#EFE3D2] transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 py-0.5 text-xs font-semibold text-[#3A080C]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(item.productId, item.quantity + 1, item.selectedVariant)
                            }
                            className="px-2 py-0.5 text-xs text-[#3A080C] hover:bg-[#EFE3D2] transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-medium text-[#3A080C]">
                          Subtotal: {formatINR(item.unitPrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {cart.length > 0 && (
              <div className="p-5 bg-[#FAF6F0] border-t border-[#EFE3D2] space-y-4">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#7A7373]">
                    <span>Bag Subtotal</span>
                    <span>{formatINR(cartSubtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#7A7373]">
                    <span>Delivery Across India</span>
                    <span>
                      {shippingFee === 0 ? (
                        <strong className="text-[#25D366]">FREE</strong>
                      ) : (
                        formatINR(shippingFee)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between font-serif text-base font-bold text-[#3A080C] pt-2 border-t border-[#EFE3D2]">
                    <span>Total Amount</span>
                    <span>{formatINR(cartTotal)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#3A080C] text-[#E4C98A] font-semibold text-xs uppercase tracking-[0.2em] hover:bg-[#5A1118] transition-all shadow-md active:scale-[0.99]"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#7A7373]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C8A15A]" />
                    <span>Safe & Verified Indian Payment Gateway</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
