"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/context/StoreContext";
import { formatINR } from "@/lib/utils";
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck, Plus, Minus, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    cartSubtotal,
    shippingFee,
    cartTotal,
    settings,
  } = useStore();

  const freeShippingLeft = Math.max(0, settings.freeShippingThreshold - cartSubtotal);

  return (
    <div className="bg-[#FFFDF9] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C8A15A] font-semibold">
            Your Selection
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3A080C]">
            Shopping Bag ({cartCount})
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-16 bg-[#FAF6F0] rounded-sm border border-[#EFE3D2] p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#C8A15A] mx-auto">
              <ShoppingBag className="w-8 h-8 stroke-1" />
            </div>
            <h2 className="font-serif text-2xl text-[#3A080C]">Your bag is currently empty</h2>
            <p className="text-xs text-[#7A7373] leading-relaxed">
              Explore our fine silhouettes, waist chains, and vintage enamel bangles designed for your everyday expression.
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Items Column */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Free Shipping Alert */}
              <div className="p-4 bg-[#FAF6F0] border border-[#EFE3D2] rounded text-xs flex items-center justify-between">
                {freeShippingLeft > 0 ? (
                  <span>
                    Add <strong>{formatINR(freeShippingLeft)}</strong> more to unlock <strong>FREE Delivery across India</strong>.
                  </span>
                ) : (
                  <span className="text-[#25D366] font-semibold">
                    ✓ You have unlocked FREE Express Delivery across India!
                  </span>
                )}
                <Link href="/shop" className="text-[#3A080C] underline font-semibold hover:text-[#C8A15A]">
                  Add more pieces
                </Link>
              </div>

              {/* Items Table */}
              <div className="bg-[#FAF6F0] rounded-sm border border-[#EFE3D2] divide-y divide-[#EFE3D2]">
                {cart.map((item, index) => (
                  <div key={`${item.productId}-${index}`} className="p-4 sm:p-6 flex gap-4 sm:gap-6 items-center">
                    
                    {/* Thumbnail */}
                    <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded bg-white overflow-hidden shrink-0 border border-[#EFE3D2]">
                      <Image
                        src={item.product.images[0] || "/images/golden-waist-chain.png"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <span className="text-[10px] uppercase tracking-widest text-[#C8A15A] font-semibold">
                        {item.product.category}
                      </span>
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="block font-serif text-base sm:text-lg font-bold text-[#3A080C] hover:text-[#C8A15A] transition-colors truncate"
                      >
                        {item.product.name}
                      </Link>

                      {item.selectedVariant && (
                        <p className="text-xs text-[#7A7373]">
                          {Object.entries(item.selectedVariant).map(([k, v]) => `${k}: ${v}`).join(" | ")}
                        </p>
                      )}

                      <p className="text-sm font-semibold text-[#3A080C]">
                        {formatINR(item.unitPrice)}
                      </p>
                    </div>

                    {/* Stepper */}
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <div className="flex items-center border border-[#EFE3D2] rounded bg-white">
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity - 1, item.selectedVariant)}
                          className="p-1.5 text-xs text-[#3A080C] hover:bg-[#FAF6F0]"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-[#3A080C]">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1, item.selectedVariant)}
                          className="p-1.5 text-xs text-[#3A080C] hover:bg-[#FAF6F0]"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-bold text-[#3A080C]">
                          {formatINR(item.unitPrice * item.quantity)}
                        </p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.productId, item.selectedVariant)}
                        className="p-2 text-[#7A7373] hover:text-[#5A1118] transition-colors"
                        aria-label="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#3A080C] hover:text-[#C8A15A]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Continue Shopping</span>
                </Link>
                <button
                  onClick={clearCart}
                  className="text-xs text-[#7A7373] hover:text-[#5A1118] underline"
                >
                  Clear Bag
                </button>
              </div>
            </div>

            {/* Summary Column */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 bg-[#FAF6F0] rounded-sm border border-[#EFE3D2] space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#3A080C] border-b border-[#EFE3D2] pb-3">
                  Order Summary
                </h3>

                <div className="space-y-2.5 text-xs text-[#4A4545]">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartCount} items)</span>
                    <span className="font-semibold text-[#3A080C]">{formatINR(cartSubtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Across India</span>
                    <span>
                      {shippingFee === 0 ? (
                        <strong className="text-[#25D366]">FREE</strong>
                      ) : (
                        formatINR(shippingFee)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-serif font-bold text-[#3A080C] pt-3 border-t border-[#EFE3D2]">
                    <span>Total Amount</span>
                    <span>{formatINR(cartTotal)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full py-4 bg-[#3A080C] text-[#E4C98A] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#5A1118] transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-[#7A7373]">
                  <ShieldCheck className="w-4 h-4 text-[#C8A15A]" />
                  <span>Safe & Encrypted 256-bit Checkout</span>
                </div>
              </div>

              {/* Delivery info */}
              <div className="p-4 bg-[#FAF6F0] rounded border border-[#EFE3D2] text-xs text-[#7A7373] space-y-1.5">
                <div className="flex items-center gap-2 text-[#3A080C] font-semibold">
                  <Truck className="w-4 h-4 text-[#C8A15A]" />
                  <span>Pan-India Dispatch</span>
                </div>
                <p>Orders dispatched within 24 hours via premium insured air courier.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
