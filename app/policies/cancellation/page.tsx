import React from "react";

export default function CancellationPolicyPage() {
  return (
    <div className="bg-[#FFFDF9] min-h-screen py-12 sm:py-20 text-[#191414]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-[#EFE3D2] pb-6 space-y-2 text-center sm:text-left">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C8A15A] font-semibold">
            Order Terms
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3A080C]">
            Cancellation Policy
          </h1>
          <p className="text-xs text-[#7A7373]">
            MATILDA by Duha Ajaz Pandith • Last updated: August 2026
          </p>
        </div>

        <div className="prose prose-sm text-xs sm:text-sm text-[#4A4545] leading-relaxed space-y-6">
          <section className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-[#3A080C]">1. Pre-Dispatch Cancellation</h3>
            <p>
              Orders can be cancelled free of charge if requested before dispatch (within 12 hours of placing the order). Please notify us immediately via WhatsApp at +91 95411 98330 with your Order ID.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-[#3A080C]">2. Post-Dispatch Cancellation</h3>
            <p>
              Once a parcel has been handed over to the courier partner and a waybill number generated, orders cannot be cancelled mid-transit.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
