import React from "react";
import Link from "next/link";
import { Truck, ShieldCheck, Clock } from "lucide-react";

export default function ShippingPolicyPage() {
  return (
    <div className="bg-[#FFFDF9] min-h-screen py-12 sm:py-20 text-[#191414]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="border-b border-[#EFE3D2] pb-6 space-y-2 text-center sm:text-left">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C8A15A] font-semibold">
            Customer Information
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3A080C]">
            Shipping & Delivery Policy
          </h1>
          <p className="text-xs text-[#7A7373]">
            MATILDA by Duha Ajaz Pandith • Last updated: August 2026
          </p>
        </div>

        <div className="prose prose-sm text-xs sm:text-sm text-[#4A4545] leading-relaxed space-y-6">
          <section className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-[#3A080C]">1. Delivery Across India</h3>
            <p>
              MATILDA delivers across all serviceable postal pin codes in India through trusted express courier partners (Delhivery, BlueDart, DTDC, and India Post).
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-[#3A080C]">2. Processing & Dispatch Timelines</h3>
            <p>
              • All confirmed orders are carefully checked, cushioned in protective velvet packaging, and dispatched within <strong>24 to 48 hours</strong>.
            </p>
            <p>
              • Standard estimated delivery timeline across India is <strong>3 to 6 business days</strong> from dispatch, depending on destination metro or regional location.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-[#3A080C]">3. Shipping Charges</h3>
            <p>
              • <strong>Complimentary Free Shipping:</strong> Applicable on all prepaid and online orders above ₹499.
            </p>
            <p>
              • <strong>Standard Shipping:</strong> A flat delivery fee of ₹49 applies on orders under ₹499.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-[#3A080C]">4. Order Tracking</h3>
            <p>
              Once your parcel is dispatched, a live tracking link with courier waybill number is sent via SMS and WhatsApp to the phone number provided at checkout.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-[#3A080C]">5. Contact for Transit Assistance</h3>
            <p>
              For urgent delivery requests or pin-code inquiries, please message founder Duha Ajaz Pandith on WhatsApp at <strong>+91 95411 98330</strong> or on Instagram <strong>@matilldaaa._</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
