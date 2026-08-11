"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/lib/context/StoreContext";
import { Truck, Package, Clock, MessageCircle, ArrowRight } from "lucide-react";

export const DeliveryTrust = () => {
  const { settings } = useStore();

  return (
    <section className="py-16 sm:py-20 bg-[#FFFDF9] text-[#191414] border-b border-[#F7F1E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF6F0] rounded-lg border border-[#EFE3D2] p-8 sm:p-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Col: Brand Promise */}
            <div className="lg:col-span-5 space-y-4 text-center lg:text-left">
              <span className="text-xs uppercase tracking-[0.25em] text-[#C8A15A] font-semibold">
                Seamless Order Experience
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3A080C] leading-tight">
                Delivery Across <br />All of India
              </h2>
              <p className="text-xs sm:text-sm text-[#7A7373] leading-relaxed">
                Every piece is hand-checked, cushioned in velvet packaging, and dispatched via insured courier partners straight to your doorstep.
              </p>
              
              <div className="pt-2">
                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=Hi%20Duha,%20I%20have%20a%20question%20about%20shipping!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white rounded-full text-xs font-semibold hover:bg-[#1EBE5D] transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Inquiries: +91 95411 98330</span>
                </a>
              </div>
            </div>

            {/* Right Col: 3 Pillars */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-[#FFFDF9] p-5 rounded border border-[#F3ECE0] space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#3A080C]/10 text-[#3A080C] flex items-center justify-center mb-3">
                  <Truck className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-sm text-[#3A080C]">
                  Pan-India Courier
                </h3>
                <p className="text-xs text-[#7A7373] leading-normal">
                  Express delivery across metros, tier-2, and tier-3 cities in 3–6 business days.
                </p>
              </div>

              <div className="bg-[#FFFDF9] p-5 rounded border border-[#F3ECE0] space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#3A080C]/10 text-[#3A080C] flex items-center justify-center mb-3">
                  <Package className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-sm text-[#3A080C]">
                  Signature Packaging
                </h3>
                <p className="text-xs text-[#7A7373] leading-normal">
                  Arrives in reusable protective pouches, perfect for personal storage or gifting.
                </p>
              </div>

              <div className="bg-[#FFFDF9] p-5 rounded border border-[#F3ECE0] space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#3A080C]/10 text-[#3A080C] flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-sm text-[#3A080C]">
                  24-Hour Dispatch
                </h3>
                <p className="text-xs text-[#7A7373] leading-normal">
                  Orders packed & dispatched swiftly with live tracking updates sent via SMS & WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
