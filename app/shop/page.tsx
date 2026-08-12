"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/lib/context/StoreContext";
import { ProductCard } from "@/components/product/ProductCard";
import { formatINR } from "@/lib/utils";
import { Filter, SlidersHorizontal, X, Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const { products, categories } = useStore();

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<number>(400);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Sync category param if updated
  React.useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (!product.isPublished) return false;

        // Category filter
        if (selectedCategory !== "all" && product.category !== selectedCategory) {
          return false;
        }

        // Search query
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase();
          const matches =
            product.name.toLowerCase().includes(q) ||
            product.description.toLowerCase().includes(q) ||
            product.category.toLowerCase().includes(q) ||
            product.sku.toLowerCase().includes(q);
          if (!matches) return false;
        }

        // Price filter
        if (product.price > maxPrice) {
          return false;
        }

        // In stock
        if (inStockOnly && product.stock <= 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "newest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === "rating") return b.rating - a.rating;
        // Default: featured first
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, maxPrice, sortBy, inStockOnly]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setMaxPrice(400);
    setSortBy("featured");
    setInStockOnly(false);
  };

  const hasActiveFilters =
    selectedCategory !== "all" ||
    searchQuery.trim() !== "" ||
    maxPrice < 400 ||
    inStockOnly;

  return (
    <div className="bg-[#FFFDF9] min-h-screen py-12 sm:py-20 text-[#191414]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* ── MAGAZINE EDITORIAL HEADER ── */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#C8A15A] font-semibold block">
            The Complete Collection
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#1A0205] leading-tight">
            Jewels for every version of you.
          </h1>
          <p className="text-xs sm:text-sm text-[#7A7373] font-light max-w-lg mx-auto leading-relaxed">
            Delicate belly chains, gothic pendants, floral enamel bangles, and traditional Marathi nose rings—crafted for everyday wear.
          </p>
        </div>

        {/* ── CATEGORY FILTER STRIP ── */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-[0.18em] font-medium whitespace-nowrap transition-all duration-300 ${
              selectedCategory === "all"
                ? "bg-[#1A0205] text-[#E4C98A] shadow-luxury"
                : "bg-[#FAF6F0] text-[#7A7373] hover:text-[#1A0205] border border-[#EFE3D2]"
            }`}
          >
            All Pieces ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-[0.18em] font-medium whitespace-nowrap transition-all duration-300 ${
                selectedCategory === cat.name
                  ? "bg-[#1A0205] text-[#E4C98A] shadow-luxury"
                  : "bg-[#FAF6F0] text-[#7A7373] hover:text-[#1A0205] border border-[#EFE3D2]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* ── CONTROLS BAR (Search, Count, Sort) ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#FAF6F0] rounded-sm border border-[#EFE3D2]">
          
          {/* Search Input & Mobile Filter Trigger */}
          <div className="flex items-center gap-3 flex-1 min-w-[240px]">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-[#1A0205] text-[#E4C98A] text-xs font-semibold uppercase tracking-wider rounded-none"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            <div className="relative flex-1 max-w-xs">
              <Search className="w-3.5 h-3.5 text-[#7A7373] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or category..."
                className="w-full pl-8 pr-3 py-2 bg-[#FFFDF9] border border-[#EFE3D2] rounded text-xs text-[#191414] focus:outline-none focus:border-[#C8A15A]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7A7373]"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Results Count & Sorting */}
          <div className="flex items-center gap-4 text-xs">
            <span className="text-[#7A7373] font-light hidden sm:inline">
              Showing <strong className="text-[#1A0205] font-semibold">{filteredProducts.length}</strong> pieces
            </span>

            <div className="flex items-center gap-2">
              <span className="text-[#7A7373] font-light hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#FFFDF9] border border-[#EFE3D2] text-[#1A0205] font-medium text-xs px-3 py-2 rounded focus:outline-none focus:border-[#C8A15A]"
              >
                <option value="featured">Featured First</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── MAIN CATALOGUE LAYOUT: SIDEBAR + GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block space-y-6 bg-[#FAF6F0] p-6 rounded-sm border border-[#EFE3D2] h-fit">
            <div className="flex items-center justify-between border-b border-[#EFE3D2] pb-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#1A0205]">
                <SlidersHorizontal className="w-4 h-4 text-[#C8A15A]" />
                <span>Refine</span>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-[11px] text-[#5A1118] hover:underline font-semibold"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Price Filter Slider */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs text-[#1A0205] font-medium font-sans">
                <span>Maximum Price</span>
                <span className="text-[#C8A15A] font-semibold">{formatINR(maxPrice)}</span>
              </div>
              <input
                type="range"
                min={39}
                max={400}
                step={10}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#1A0205]"
              />
              <div className="flex justify-between text-[10px] text-[#7A7373] font-light">
                <span>₹39</span>
                <span>₹400</span>
              </div>
            </div>

            {/* In Stock Toggle */}
            <div className="pt-3 border-t border-[#EFE3D2]">
              <label className="flex items-center gap-2 text-xs text-[#1A0205] cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-[#1A0205] focus:ring-[#C8A15A]"
                />
                <span>In-Stock Only</span>
              </label>
            </div>

            {/* Trust Note */}
            <div className="pt-4 border-t border-[#EFE3D2] space-y-1 text-[11px] text-[#7A7373] font-light">
              <p className="font-semibold text-[#1A0205]">Delivery Across India</p>
              <p>All items packed cushioned in signature MATILDA packaging.</p>
            </div>
          </div>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-[#FAF6F0] rounded-sm border border-[#EFE3D2] space-y-4">
                <Sparkles className="w-8 h-8 text-[#C8A15A] mx-auto" />
                <h3 className="font-serif text-2xl text-[#1A0205]">No pieces match your filters</h3>
                <p className="text-xs text-[#7A7373] max-w-sm mx-auto font-light">
                  Try clearing your search query or expanding the price range to explore more pieces.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-7 py-3 bg-[#1A0205] text-[#E4C98A] text-xs uppercase tracking-widest font-semibold hover:bg-[#3A080C] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-8">
                {filteredProducts.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.04 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-serif text-lg text-[#1A0205]">Loading MATILDA Jewellery...</div>}>
      <ShopContent />
    </Suspense>
  );
}
