"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/context/StoreContext";
import { Search, Heart, ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const pathname = usePathname();
  const { cartCount, wishlist, setIsCartOpen, setIsSearchOpen, categories, settings } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCollectionsOpen(false);
  }, [pathname]);

  const navLinkClass = (href: string) =>
    `text-[11px] sm:text-[12px] uppercase tracking-[0.22em] font-medium transition-colors duration-200 relative py-2 ${
      pathname === href ? "text-[#C8A15A]" : "text-[#3A080C] hover:text-[#C8A15A]"
    }`;

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Editorial Announcement Bar */}
      <div className="bg-[#1A0205] text-[#E4C98A] text-[9.5px] sm:text-[10px] font-medium tracking-[0.28em] uppercase py-2 px-4 text-center border-b border-[#3A080C]/40">
        {settings.announcementText || "Pan-India Express Delivery • Free Shipping on Orders Above ₹499"}
      </div>

      {/* Main Navbar */}
      <nav
        className={`w-full transition-all duration-400 ${
          isScrolled
            ? "bg-[#FFFDF9]/95 backdrop-blur-md shadow-luxury border-b border-[#EFE3D2]"
            : "bg-[#FFFDF9] border-b border-[#F7F1E8]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[74px] lg:h-[84px] flex items-center justify-between gap-6">
          
          {/* ── LOGO (Far Left Anchor) ── */}
          <Link href="/" className="flex-none group" aria-label="MATILDA — Home">
            <div className="relative h-12 w-36 sm:h-14 sm:w-44 lg:h-16 lg:w-48">
              <Image
                src="/images/matilda-logo-leopard-transparent.png"
                alt="MATILDA"
                fill
                priority
                className="object-contain object-left transition-opacity duration-300 group-hover:opacity-80"
              />
            </div>
          </Link>

          {/* ── DESKTOP NAVIGATION LINKS (Center) ── */}
          <div className="hidden lg:flex items-center gap-9">
            <Link href="/shop" className={navLinkClass("/shop")}>
              All Jewellery
            </Link>

            {/* Collections Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsCollectionsOpen(true)}
              onMouseLeave={() => setIsCollectionsOpen(false)}
            >
              <button
                className="flex items-center gap-1.5 text-[11px] sm:text-[12px] uppercase tracking-[0.22em] font-medium text-[#3A080C] hover:text-[#C8A15A] transition-colors duration-200 py-2"
                aria-expanded={isCollectionsOpen}
              >
                <span>Collections</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${
                    isCollectionsOpen ? "rotate-180 text-[#C8A15A]" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isCollectionsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute left-0 top-full w-64 bg-[#FFFDF9] border border-[#EFE3D2] shadow-luxury p-3 space-y-1 z-50 rounded-sm"
                  >
                    <div className="px-3 py-2 border-b border-[#F7F1E8]">
                      <span className="text-[9px] uppercase tracking-[0.3em] text-[#C8A15A] font-semibold">
                        Curated Capsules
                      </span>
                    </div>
                    <div className="pt-1.5">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/shop?category=${encodeURIComponent(cat.name)}`}
                          className="flex items-center justify-between px-3 py-2 text-[11.5px] tracking-wide text-[#3A080C] hover:text-[#C8A15A] hover:bg-[#FAF6F0] transition-colors rounded-sm"
                        >
                          <span>{cat.name}</span>
                          <span className="text-[#C8A15A]/40 font-serif italic text-xs">→</span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/about" className={navLinkClass("/about")}>
              The Brand
            </Link>

            <Link href="/contact" className={navLinkClass("/contact")}>
              Contact
            </Link>
          </div>

          {/* ── RIGHT ICONS (Search, Wishlist, Bag) ── */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-[#3A080C] hover:text-[#C8A15A] transition-colors"
              aria-label="Search catalogue"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 text-[#3A080C] hover:text-[#C8A15A] transition-colors hidden sm:flex"
              aria-label="Saved pieces"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-[#3A080C] text-[#E4C98A] text-[8.5px] font-semibold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Bag */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#3A080C] hover:text-[#C8A15A] transition-colors"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#C8A15A] text-[#1A0205] text-[8.5px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-[#3A080C] hover:text-[#C8A15A] transition-colors lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── MOBILE EDITORIAL CURTAIN DRAWER ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 left-0 bottom-0 w-[84%] max-w-[340px] bg-[#1A0205] text-[#FFFDF9] z-50 flex flex-col justify-between overflow-y-auto"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-6 border-b border-[#3A080C]">
                  <div className="relative h-11 w-32">
                    <Image
                      src="/images/matilda-logo-cream-transparent.png"
                      alt="MATILDA"
                      fill
                      className="object-contain object-left"
                    />
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-[#E4C98A] hover:text-white"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation Links */}
                <div className="px-6 py-6 space-y-1">
                  {[
                    { href: "/", label: "Home" },
                    { href: "/shop", label: "All Jewellery" },
                    { href: "/about", label: "The Brand" },
                    { href: "/contact", label: "Contact" },
                    { href: "/wishlist", label: "Saved Pieces" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block py-3.5 border-b border-[#3A080C]/60 text-sm font-sans tracking-[0.15em] uppercase transition-colors ${
                        pathname === link.href ? "text-[#E4C98A]" : "text-[#F7F1E8] hover:text-[#E4C98A]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}

                  {/* Category links */}
                  <div className="pt-5 pb-3">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-[#C8A15A]/70 font-semibold block mb-3">
                      Capsules
                    </span>
                    <div className="space-y-2.5 pl-1">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/shop?category=${encodeURIComponent(cat.name)}`}
                          className="block text-[11px] uppercase tracking-[0.2em] text-[#EFE3D2]/70 hover:text-[#E4C98A]"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer info in drawer */}
              <div className="px-6 py-6 border-t border-[#3A080C] space-y-2 text-xs text-[#EFE3D2]/60">
                <p className="font-serif italic text-sm text-[#E4C98A]">by Duha Ajaz Pandith</p>
                <div className="flex items-center gap-4 pt-1 text-[11px]">
                  <a
                    href="https://www.instagram.com/matilldaaa._/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#E4C98A]"
                  >
                    @matilldaaa._
                  </a>
                  <span>•</span>
                  <a
                    href="https://wa.me/919541198330"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#E4C98A]"
                  >
                    WhatsApp Concierge
                  </a>
                </div>
                <Link href="/admin" className="block pt-2 text-[10px] uppercase tracking-[0.2em] text-[#E4C98A]/40 hover:text-[#E4C98A]">
                  Admin Portal →
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
