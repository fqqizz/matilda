import React from "react";

export default function TermsConditionsPage() {
  return (
    <div className="bg-[#FFFDF9] min-h-screen py-12 sm:py-20 text-[#191414]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-[#EFE3D2] pb-6 space-y-2 text-center sm:text-left">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C8A15A] font-semibold">
            Terms of Service
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3A080C]">
            Terms & Conditions
          </h1>
          <p className="text-xs text-[#7A7373]">
            MATILDA by Duha Ajaz Pandith • Last updated: August 2026
          </p>
        </div>

        <div className="prose prose-sm text-xs sm:text-sm text-[#4A4545] leading-relaxed space-y-6">
          <section className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-[#3A080C]">1. Brand Positioning & Product Description</h3>
            <p>
              MATILDA provides fashion jewellery pieces offering the look of fine jewellery at an accessible price point. We do not claim certified hallmarking or solid fine metals unless explicitly stated per product.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-[#3A080C]">2. Pricing & Pan-India Taxes</h3>
            <p>
              All prices displayed on the website are listed in Indian Rupees (INR ₹) and are inclusive of applicable domestic taxes.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-[#3A080C]">3. Intellectual Property</h3>
            <p>
              The MATILDA brand mark, signature leopard treatments, photography, and editorial branding belong to Duha Ajaz Pandith.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
