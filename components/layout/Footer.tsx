"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/lib/context/StoreContext";
import { Instagram, MessageCircle, ArrowUpRight, Truck, Sparkles } from "lucide-react";

export const Footer = () => {
  const { settings, categories } = useStore();

  return (
    <footer className="bg-[#1A0205] text-[#FFFDF9] border-t border-[#3A080C] pt-20 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* ── TRUST & CRAFTSMANSHIP PILLARS ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-[#3A080C]/80">
          {[
            {
              icon: <Truck className="w-4 h-4 text-[#E4C98A]" />,
              title: "Pan-India Express Courier",
              desc: "Doorstep delivery across all Indian pin codes in 3–6 business days.",
            },
            {
              icon: <Sparkles className="w-4 h-4 text-[#E4C98A]" />,
              title: "Fine Aesthetic • Honest Value",
              desc: "The luster, weight, and presence of fine jewellery at everyday prices.",
            },
            {
              icon: <MessageCircle className="w-4 h-4 text-[#E4C98A]" />,
              title: "Founder WhatsApp Care",
              desc: "Personal sizing and styling guidance directly with Duha.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3.5 p-4 rounded-sm bg-[#260407]/40 border border-[#3A080C]/80"
            >
              <div className="p-2 bg-[#3A080C] rounded-full shrink-0">
                {item.icon}
              </div>
              <div className="space-y-0.5 font-sans">
                <h4 className="text-xs uppercase tracking-[0.14em] font-medium text-[#F7F1E8]">
                  {item.title}
                </h4>
                <p className="text-[11.5px] text-[#EFE3D2]/60 font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── MAIN COLUMNS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 font-sans">
          
          {/* Brand Anchor (2 Cols) */}
          <div className="sm:col-span-2 space-y-4">
            <div className="relative h-10 w-36">
              <Image
                src="/images/matilda-logo-cream-transparent.png"
                alt="MATILDA"
                fill
                className="object-contain object-left"
              />
            </div>
            
            <p className="font-serif italic text-base text-[#E4C98A]/85">
              by Duha Ajaz Pandith
            </p>
            
            <p className="text-xs text-[#EFE3D2]/65 leading-relaxed max-w-sm font-light">
              {settings.bio || "Timeless silhouettes offering the look of fine jewellery at a fraction of the cost. Delivery across India."}
            </p>
            
            {/* Direct Connect Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <a
                href={settings.instagramUrl || "https://www.instagram.com/matilldaaa._/"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#260407] border border-[#3A080C] text-[#E4C98A] hover:bg-[#C8A15A] hover:text-[#1A0205] transition-all text-[11px] uppercase tracking-[0.12em] font-medium"
              >
                <Instagram className="w-3 h-3" />
                <span>{settings.instagramHandle || "@matilldaaa._"}</span>
              </a>
              
              <a
                href={`https://wa.me/${settings.whatsappNumber || "919541198330"}?text=Hi%20Duha,%20I'm%20exploring%20MATILDA%20jewellery!`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all text-[11px] uppercase tracking-[0.12em] font-medium"
              >
                <MessageCircle className="w-3 h-3" />
                <span>WhatsApp Concierge</span>
              </a>
            </div>
          </div>

          {/* Catalogue Links */}
          <div className="space-y-3.5">
            <h3 className="text-[10px] uppercase tracking-[0.18em] text-[#E4C98A] font-medium">
              Catalogue
            </h3>
            <ul className="space-y-2 text-xs text-[#EFE3D2]/65 font-light">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/shop?category=${encodeURIComponent(cat.name)}`}
                    className="hover:text-[#E4C98A] transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link href="/shop" className="text-[#E4C98A] font-medium hover:underline">
                  All Pieces →
                </Link>
              </li>
            </ul>
          </div>

          {/* Brand & Information */}
          <div className="space-y-3.5">
            <h3 className="text-[10px] uppercase tracking-[0.18em] text-[#E4C98A] font-medium">
              Information
            </h3>
            <ul className="space-y-2 text-xs text-[#EFE3D2]/65 font-light">
              {[
                { href: "/about", label: "About MATILDA" },
                { href: "/contact", label: "Contact & Inquiries" },
                { href: "/wishlist", label: "Saved Pieces" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-[#E4C98A] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div className="space-y-3.5">
            <h3 className="text-[10px] uppercase tracking-[0.18em] text-[#E4C98A] font-medium">
              Client Care
            </h3>
            <ul className="space-y-2 text-xs text-[#EFE3D2]/65 font-light">
              {[
                { href: "/policies/shipping", label: "Shipping Policy" },
                { href: "/policies/returns", label: "Returns & Exchange" },
                { href: "/policies/cancellation", label: "Cancellation" },
                { href: "/policies/privacy", label: "Privacy Policy" },
                { href: "/policies/terms", label: "Terms of Service" },
              ].map((policy) => (
                <li key={policy.href}>
                  <Link href={policy.href} className="hover:text-[#E4C98A] transition-colors">
                    {policy.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── CLOSING EDITORIAL LINE & COPYRIGHT ── */}
        <div className="pt-8 border-t border-[#3A080C]/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#EFE3D2]/50 font-sans">
          <p>© {new Date().getFullYear()} MATILDA by Duha Ajaz Pandith. All rights reserved.</p>
          <p className="font-serif italic text-sm text-[#E4C98A]/75">
            See you in the next chapter.
          </p>
        </div>
      </div>
    </footer>
  );
};
