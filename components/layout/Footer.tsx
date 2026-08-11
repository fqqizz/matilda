"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/lib/context/StoreContext";
import { Instagram, MessageCircle, ShieldCheck, Truck, RefreshCw, ArrowUpRight } from "lucide-react";

export const Footer = () => {
  const { settings, categories } = useStore();

  return (
    <footer className="bg-[#260407] text-[#FFFDF9] border-t border-[#5A1118] pt-16 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pb-12 border-b border-[#5A1118]/60">
          {[
            {
              icon: <Truck className="w-5 h-5" />,
              title: "Delivery Across India",
              desc: "Safe, express courier to all pin codes",
            },
            {
              icon: <ShieldCheck className="w-5 h-5" />,
              title: "Authentic Craftsmanship",
              desc: "The look of fine jewellery at a fraction of the cost",
            },
            {
              icon: <RefreshCw className="w-5 h-5" />,
              title: "Direct Founder Care",
              desc: "Personal WhatsApp assistance with Duha",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 rounded bg-[#3A080C]/40 border border-[#5A1118]"
            >
              <div className="p-2.5 bg-[#5A1118]/80 text-[#E4C98A] rounded-full shrink-0">
                {item.icon}
              </div>
              <div>
                <h4 className="text-sm font-serif font-medium text-[#F7F1E8]">{item.title}</h4>
                <p className="text-[11px] text-[#EFE3D2]/65 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 py-12">

          {/* Brand Column */}
          <div className="sm:col-span-2 space-y-4">
            <div className="relative h-12 w-36">
              <Image
                src="/images/matilda-logo-cream-transparent.png"
                alt="MATILDA"
                fill
                className="object-contain object-left"
              />
            </div>
            <p className="font-serif italic text-base text-[#E4C98A]/90">
              by Duha Ajaz Pandith
            </p>
            <p className="text-[12px] text-[#EFE3D2]/75 leading-relaxed max-w-xs">
              {settings.bio}
            </p>
            <div className="pt-1 flex items-center gap-2.5">
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#5A1118] text-[#E4C98A] hover:bg-[#C8A15A] hover:text-[#260407] transition-all text-[11px] font-medium"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>{settings.instagramHandle}</span>
              </a>
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=Hi%20Duha,%20I'm%20exploring%20MATILDA%20jewellery!`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all text-[11px] font-medium"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Catalogue */}
          <div>
            <h3 className="text-[9px] uppercase tracking-[0.3em] text-[#E4C98A] font-semibold mb-4">
              Catalogue
            </h3>
            <ul className="space-y-2.5 text-[12px] text-[#EFE3D2]/75">
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
              <li>
                <Link href="/shop" className="text-[#E4C98A] font-medium hover:opacity-80 transition-opacity">
                  View All →
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-[9px] uppercase tracking-[0.3em] text-[#E4C98A] font-semibold mb-4">
              Information
            </h3>
            <ul className="space-y-2.5 text-[12px] text-[#EFE3D2]/75">
              {[
                { href: "/about", label: "Brand Story" },
                { href: "/contact", label: "Contact" },
                { href: "/wishlist", label: "Saved Pieces" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-[#E4C98A] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/admin" className="hover:text-[#E4C98A] transition-colors inline-flex items-center gap-1">
                  Admin <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-[9px] uppercase tracking-[0.3em] text-[#E4C98A] font-semibold mb-4">
              Policies
            </h3>
            <ul className="space-y-2.5 text-[12px] text-[#EFE3D2]/75">
              {[
                { href: "/policies/shipping", label: "Shipping" },
                { href: "/policies/returns", label: "Returns & Exchange" },
                { href: "/policies/cancellation", label: "Cancellation" },
                { href: "/policies/privacy", label: "Privacy Policy" },
                { href: "/policies/terms", label: "Terms & Conditions" },
              ].map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className="hover:text-[#E4C98A] transition-colors">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#5A1118]/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#EFE3D2]/50 gap-3">
          <p>© {new Date().getFullYear()} MATILDA by Duha Ajaz Pandith. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Delivery across India</span>
            <span>·</span>
            <span>Prices in INR (₹)</span>
            <span>·</span>
            <span className="font-serif italic text-[#E4C98A]/60">Timeless Silhouettes</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
