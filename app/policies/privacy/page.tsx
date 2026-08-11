import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#FFFDF9] min-h-screen py-12 sm:py-20 text-[#191414]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-[#EFE3D2] pb-6 space-y-2 text-center sm:text-left">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C8A15A] font-semibold">
            Legal & Data Protection
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3A080C]">
            Privacy Policy
          </h1>
          <p className="text-xs text-[#7A7373]">
            MATILDA by Duha Ajaz Pandith • Last updated: August 2026
          </p>
        </div>

        <div className="prose prose-sm text-xs sm:text-sm text-[#4A4545] leading-relaxed space-y-6">
          <section className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-[#3A080C]">1. Data We Collect</h3>
            <p>
              We collect basic contact and shipping information (name, mobile phone number, delivery address, and email) solely to process, pack, dispatch, and track your jewellery orders across India.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-[#3A080C]">2. Payment Data Security</h3>
            <p>
              MATILDA does not store your credit card numbers, CVVs, UPI PINs, or banking credentials. All digital transactions are processed through 256-bit SSL encrypted PCI-DSS certified payment gateways (Razorpay).
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-[#3A080C]">3. Third-Party Courier Sharing</h3>
            <p>
              Your name, delivery address, and phone number are shared securely with our logistics partners (Delhivery, BlueDart, India Post) exclusively for parcel delivery and delivery SMS/call coordination.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
