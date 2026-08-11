"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/context/StoreContext";
import { formatINR } from "@/lib/utils";
import { Search, X, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const SearchModal = () => {
  const { isSearchOpen, setIsSearchOpen, products, categories } = useStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [isSearchOpen]);

  // Keyboard shortcut: ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  // Filtered products
  const filteredProducts = query.trim() === ""
    ? []
    : products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 bg-[#260407]/95 backdrop-blur-md flex flex-col justify-start items-center px-4 pt-16 sm:pt-24 pb-12 overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="absolute top-6 right-6 p-3 text-[#E4C98A] hover:text-white transition-colors"
            aria-label="Close search"
          >
            <X className="w-7 h-7" />
          </button>

          <div className="w-full max-w-3xl">
            {/* Search Input Bar */}
            <div className="relative border-b-2 border-[#C8A15A] pb-3 mb-8">
              <div className="flex items-center">
                <Search className="w-7 h-7 text-[#C8A15A] mr-3 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search waist chains, gothic stars, bangles, pendants..."
                  className="w-full bg-transparent text-xl sm:text-2xl text-[#FFFDF9] placeholder-[#EFE3D2]/40 font-serif tracking-wide focus:outline-none"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="p-1 text-[#EFE3D2]/60 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* If no query yet: Suggest Popular Categories */}
            {query.trim() === "" ? (
              <div className="space-y-6 text-[#FFFDF9]">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#E4C98A] font-semibold">
                  <Sparkles className="w-4 h-4 text-[#C8A15A]" />
                  <span>Popular Searches & Categories</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setQuery(cat.name)}
                      className="px-4 py-2 rounded-full border border-[#5A1118] bg-[#3A080C]/70 text-xs text-[#EFE3D2] hover:border-[#C8A15A] hover:text-[#E4C98A] transition-all"
                    >
                      {cat.name}
                    </button>
                  ))}
                  <button
                    onClick={() => setQuery("Star")}
                    className="px-4 py-2 rounded-full border border-[#5A1118] bg-[#3A080C]/70 text-xs text-[#EFE3D2] hover:border-[#C8A15A] hover:text-[#E4C98A] transition-all"
                  >
                    Gothic Star
                  </button>
                  <button
                    onClick={() => setQuery("Waist")}
                    className="px-4 py-2 rounded-full border border-[#5A1118] bg-[#3A080C]/70 text-xs text-[#EFE3D2] hover:border-[#C8A15A] hover:text-[#E4C98A] transition-all"
                  >
                    Waist Chains
                  </button>
                </div>
              </div>
            ) : (
              /* Search Results */
              <div className="space-y-6">
                <div className="flex justify-between items-center text-xs uppercase tracking-wider text-[#E4C98A]/80 border-b border-[#5A1118] pb-2">
                  <span>Found {filteredProducts.length} results for &quot;{query}&quot;</span>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12 text-[#EFE3D2]/70 space-y-2">
                    <p className="font-serif text-lg text-[#F7F1E8]">No pieces found matching &quot;{query}&quot;</p>
                    <p className="text-xs">Try searching for &quot;bangle&quot;, &quot;waist chain&quot;, &quot;star&quot; or &quot;pendant&quot;</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
                    {filteredProducts.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="group flex items-center gap-4 p-3 rounded-lg bg-[#3A080C]/50 border border-[#5A1118] hover:border-[#C8A15A] transition-all"
                      >
                        <div className="relative w-16 h-16 rounded overflow-hidden shrink-0 bg-[#260407]">
                          <Image
                            src={product.images[0] || "/images/golden-waist-chain.png"}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] uppercase tracking-widest text-[#E4C98A]/70">
                            {product.category}
                          </p>
                          <h4 className="font-serif text-sm font-medium text-[#FFFDF9] truncate group-hover:text-[#E4C98A] transition-colors">
                            {product.name}
                          </h4>
                          <p className="text-xs font-semibold text-[#E4C98A] mt-0.5">
                            {formatINR(product.price)}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#C8A15A] opacity-0 group-hover:opacity-100 transition-opacity mr-1 shrink-0" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
