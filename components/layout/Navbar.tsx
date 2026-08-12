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
    `text-xs uppercase tracking-[0.14em] font-sans font-normal transition-colors duration-200 py-2 ${
      pathname === href ? "text-[#1A0205] font-medium" : "text-[#7A7373] hover:text-[#1A0205]"
    }`;

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Editorial Announcement Bar */}
      <div className="bg-[#1A0205] text-[#E4C98A] text-[9.5px] sm:text-[10px] font-sans font-light tracking-[0.2em] uppercase py-2 px-4 text-center border-b border-[#3A080C]/40">
        {settings.announcementText || "Pan-India Express Delivery • Free Shipping on Orders Above ₹499"}
      </div>

      {/* Main Navbar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? "bg-[#FFFDF9]/95 backdrop-blur-md shadow-card border-b border-[#EFE3D2]"
            : "bg-[#FFFDF9] border-b border-[#F7F1E8]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-6">
          
          {/* ── LOGO (Far Left Anchor) ── */}
          <Link href="/" className="flex-none group" aria-label="MATILDA — Home">
            <div className="relative h-10 w-32 sm:h-12 sm:w-40 lg:h-14 lg:w-44">
              <Image
                src="/images/matilda-logo-leopard-transparent.png"
                alt="MATILDA"
                fill
                priority
                className="object-contain object-left transition-opacity duration-300 group-hover:opacity-80"
              />
            </div>
          </Link>

          {/* ── DESKTOP NAVIGATION LINKS (Quiet, Manrope 400/500) ── */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/shop" className={navLinkClass("/shop")}>
              Shop
            </Link>

            {/* Collections Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsCollectionsOpen(true)}
              onMouseLeave={() => setIsCollectionsOpen(false)}
            >
              <button
                className="flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] font-sans font-normal text-[#7A7373] hover:text-[#1A0205] transition-colors duration-200 py-2"
                aria-expanded={isCollectionsOpen}
              >
                <span>Collections</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 text-[#C8A15A] ${
                    isCollectionsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isCollectionsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute left-0 top-full w-60 bg-[#FFFDF9] border border-[#EFE3D2] shadow-luxury p-2.5 space-y-1 z-50 rounded-sm"
                  >
                    <div className="px-3 py-1.5 border-b border-[#F7F1E8]">
                      <span className="text-[9px] uppercase tracking-[0.2em] text-[#C8A15A] font-medium font-sans">
                        Silhouettes
                      </span>
                    </div>
                    <div className="pt-1">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/shop?category=${encodeURIComponent(cat.name)}`}
                          className="flex items-center justify-between px-3 py-2 text-xs font-sans text-[#4A4545] hover:text-[#1A0205] hover:bg-[#FAF6F0] transition-colors rounded-sm"
                        >
                          <span>{cat.name}</span>
                          <span className="text-[#C8A15A]/50 font-serif italic text-xs">→</span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/about" className={navLinkClass("/about")}>
              About
            </Link>

            <Link href="/contact" className={navLinkClass("/contact")}>
              Contact
            </Link>
          </div>

          {/* ── RIGHT ICONS (Search, Wishlist, Bag) ── */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-[#1A0205] hover:text-[#C8A15A] transition-colors"
              aria-label="Search pieces"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 text-[#1A0205] hover:text-[#C8A15A] transition-colors hidden sm:flex"
              aria-label="Saved pieces"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-[#1A0205] text-[#E4C98A] text-[8px] font-medium w-3.5 h-3.5 rounded-full flex items-center justify-center font-sans">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Bag */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#1A0205] hover:text-[#C8A15A] transition-colors"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#C8A15A] text-[#1A0205] text-[8px] font-semibold w-3.5 h-3.5 rounded-full flex items-center justify-center font-sans">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-[#1A0205] hover:text-[#C8A15A] transition-colors lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── MOBILE EDITORIAL DRAWER ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 left-0 bottom-0 w-[82%] max-w-[320px] bg-[#1A0205] text-[#FFFDF9] z-50 flex flex-col justify-between overflow-y-auto"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-6 border-b border-[#3A080C]">
                  <div className="relative h-9 w-28">
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
                <div className="px-6 py-6 space-y-1 font-sans">
                  {[
                    { href: "/", label: "Home" },
                    { href: "/shop", label: "Shop All" },
                    { href: "/about", label: "About" },
                    { href: "/contact", label: "Contact" },
                    { href: "/wishlist", label: "Saved Pieces" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block py-3 border-b border-[#3A080C]/40 text-xs uppercase tracking-[0.14em] transition-colors ${
                        pathname === link.href ? "text-[#E4C98A] font-medium" : "text-[#EFE3D2]/80 hover:text-[#E4C98A]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}

                  {/* Category links */}
                  <div className="pt-6 pb-2">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#C8A15A] font-medium block mb-3">
                      Silhouettes
                    </span>
                    <div className="space-y-2.5">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/shop?category=${encodeURIComponent(cat.name)}`}
                          className="block text-xs font-sans text-[#EFE3D2]/65 hover:text-[#E4C98A]"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer info in drawer */}
              <div className="px-6 py-6 border-t border-[#3A080C] space-y-2 text-xs text-[#EFE3D2]/50 font-sans">
                <p className="font-serif italic text-sm text-[#E4C98A]">by Duha Ajaz Pandith</p>
                <div className="flex items-center gap-3 pt-1 text-[11px]">
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
                    WhatsApp
                  </a>
                </div>
                <Link href="/admin" className="block pt-2 text-[10px] uppercase tracking-[0.14em] text-[#E4C98A]/35 hover:text-[#E4C98A]">
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
