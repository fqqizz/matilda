import React from "react";

export default function ReturnsPolicyPage() {
  return (
    <div className="bg-[#FFFDF9] min-h-screen py-12 sm:py-20 text-[#191414]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="border-b border-[#EFE3D2] pb-6 space-y-2 text-center sm:text-left">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C8A15A] font-semibold">
            Customer Care
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3A080C]">
            Returns & Refund Policy
          </h1>
          <p className="text-xs text-[#7A7373]">
            MATILDA by Duha Ajaz Pandith • Last updated: August 2026
          </p>
        </div>

        <div className="prose prose-sm text-xs sm:text-sm text-[#4A4545] leading-relaxed space-y-6">
          <section className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-[#3A080C]">1. Damaged or Defective Items on Transit</h3>
            <p>
              Every MATILDA piece is quality-checked before packing. In the rare event that an item arrives broken or damaged during transit, please notify us within <strong>48 hours</strong> of delivery with clear parcel unboxing photos/video.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-[#3A080C]">2. Replacement & Exchange Window</h3>
            <p>
              We offer a <strong>7-day replacement or store credit</strong> for verified damaged transit pieces or sizing discrepancies on adjustable waist chains and bangles.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-[#3A080C]">3. Hygiene Considerations</h3>
            <p>
              Due to strict hygiene standards, clip-on nose rings (naths) that have been used or unsealed cannot be returned unless verified damaged upon arrival.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-[#3A080C]">4. How to Request an Exchange</h3>
            <p>
              Reach out directly on WhatsApp at <strong>+91 95411 98330</strong> with your Order ID and photo evidence. Founder Duha Ajaz Pandith will review and facilitate your exchange immediately.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
