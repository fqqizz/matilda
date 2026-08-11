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
  const { cartCount, wishlist, setIsCartOpen, setIsSearchOpen, categories } = useStore();
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
    `text-[12px] uppercase tracking-[0.18em] font-medium transition-colors duration-200 ${
      pathname === href ? "text-[#C8A15A]" : "text-[#3A080C] hover:text-[#C8A15A]"
    }`;

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Announcement Bar */}
      <div className="bg-[#260407] text-[#E4C98A] text-[10px] font-medium tracking-[0.22em] uppercase py-2 px-4 text-center">
        Free Shipping on orders above ₹499 &nbsp;•&nbsp; Pan-India Delivery in 3–6 Days
      </div>

      {/* Main Navbar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? "bg-[#FFFDF9]/96 backdrop-blur-md shadow-sm border-b border-[#EFE3D2]"
            : "bg-[#FFFDF9] border-b border-[#F7F1E8]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] lg:h-[80px] flex items-center gap-8">
          
          {/* ── LOGO (far left) ── */}
          <Link href="/" className="flex-none group" aria-label="MATILDA — Home">
            <div className="relative h-11 w-32 sm:h-13 sm:w-40 lg:h-14 lg:w-44">
              <Image
                src="/images/matilda-logo-leopard-transparent.png"
                alt="MATILDA"
                fill
                className="object-contain transition-opacity duration-300 group-hover:opacity-80"
                priority
              />
            </div>
          </Link>

          {/* ── DESKTOP NAV LINKS (centre) ── */}
          <div className="hidden lg:flex items-center gap-8 flex-1">
            <Link href="/shop" className={navLinkClass("/shop")}>
              All Jewellery
            </Link>

            {/* Collections dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsCollectionsOpen(true)}
              onMouseLeave={() => setIsCollectionsOpen(false)}
            >
              <button className="flex items-center gap-1 text-[12px] uppercase tracking-[0.18em] font-medium text-[#3A080C] hover:text-[#C8A15A] transition-colors duration-200 py-2">
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
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 top-full mt-0 w-64 bg-[#FFFDF9] border border-[#EFE3D2] shadow-lg z-50"
                  >
                    <div className="py-3 px-4 border-b border-[#F7F1E8]">
                      <span className="text-[9px] uppercase tracking-[0.3em] text-[#C8A15A] font-semibold">
                        Shop By Category
                      </span>
                    </div>
                    <div className="py-2">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/shop?category=${encodeURIComponent(cat.name)}`}
                          className="flex items-center justify-between px-4 py-2.5 text-[11px] tracking-wide text-[#3A080C] hover:text-[#C8A15A] hover:bg-[#FAF6F0] transition-colors"
                        >
                          <span>{cat.name}</span>
                          <span className="text-[#C8A15A]/50 font-serif italic text-[10px]">→</span>
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

          {/* ── RIGHT ICONS ── */}
          <div className="flex items-center gap-1 ml-auto lg:ml-0">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 text-[#3A080C] hover:text-[#C8A15A] transition-colors"
              aria-label="Search"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>

            {/* Wishlist — hidden on mobile */}
            <Link
              href="/wishlist"
              className="relative p-2.5 text-[#3A080C] hover:text-[#C8A15A] transition-colors hidden sm:flex"
              aria-label="Wishlist"
            >
              <Heart className="w-[18px] h-[18px]" />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-[#3A080C] text-[#E4C98A] text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-[#3A080C] hover:text-[#C8A15A] transition-colors"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-[18px] h-[18px]" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-[#C8A15A] text-[#260407] text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2.5 text-[#3A080C] hover:text-[#C8A15A] transition-colors lg:hidden ml-1"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 left-0 bottom-0 w-[82%] max-w-[320px] bg-[#260407] text-[#FFFDF9] z-50 flex flex-col overflow-y-auto"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#5A1118]">
                <div className="relative h-9 w-24">
                  <Image
                    src="/images/matilda-logo-cream-transparent.png"
                    alt="MATILDA"
                    fill
                    className="object-contain"
                  />
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-[#E4C98A] hover:text-white"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer links */}
              <nav className="flex-1 px-6 py-6 space-y-1">
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
                    className={`block py-3 border-b border-[#5A1118]/50 text-sm font-sans tracking-wide transition-colors ${
                      pathname === link.href ? "text-[#E4C98A]" : "text-[#F7F1E8] hover:text-[#E4C98A]"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Category accordion */}
                <div className="py-3 border-b border-[#5A1118]/50">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-[#E4C98A]/60 font-semibold block mb-3">
                    Shop by Category
                  </span>
                  <div className="space-y-2 pl-2">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/shop?category=${encodeURIComponent(cat.name)}`}
                        className="block text-[11px] uppercase tracking-widest text-[#EFE3D2]/70 hover:text-[#E4C98A] py-1"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <Link
                  href="/admin"
                  className="block pt-4 text-[10px] uppercase tracking-widest text-[#E4C98A]/40 hover:text-[#E4C98A]/80"
                >
                  Admin Portal →
                </Link>
              </nav>

              {/* Drawer footer */}
              <div className="px-6 py-5 border-t border-[#5A1118] space-y-1.5 text-xs text-[#EFE3D2]/60">
                <p>WhatsApp: +91 95411 98330</p>
                <p>@matilldaaa._</p>
                <p className="text-[#E4C98A]/50 text-[10px]">Delivery Across India</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
