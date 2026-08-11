"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/lib/context/StoreContext";
import { ProductCard } from "@/components/product/ProductCard";
import { formatINR } from "@/lib/utils";
import { Filter, SlidersHorizontal, ArrowUpDown, X, Search, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
            product.category.toLowerCase().includes(q);
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
    <div className="bg-[#FFFDF9] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C8A15A] font-semibold">
            Fine Look • Fraction Of The Cost
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#3A080C] tracking-tight">
            {selectedCategory === "all" ? "All Jewellery" : selectedCategory}
          </h1>
          <p className="text-xs sm:text-sm text-[#7A7373] max-w-md mx-auto">
            Explore our curated range of delicate waist chains, gothic pendants, vintage enamel bangles, and traditional Marathi nose rings.
          </p>
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all ${
              selectedCategory === "all"
                ? "bg-[#3A080C] text-[#E4C98A] shadow-sm"
                : "bg-[#FAF6F0] text-[#7A7373] hover:text-[#3A080C] border border-[#EFE3D2]"
            }`}
          >
            All Pieces ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.name
                  ? "bg-[#3A080C] text-[#E4C98A] shadow-sm"
                  : "bg-[#FAF6F0] text-[#7A7373] hover:text-[#3A080C] border border-[#EFE3D2]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Controls Bar (Filter toggle, Search, Sorting) */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#FAF6F0] rounded-sm border border-[#EFE3D2] mb-8">
          
          {/* Left: Mobile Filter Button & Search Input */}
          <div className="flex items-center gap-3 flex-1 min-w-[240px]">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 bg-[#3A080C] text-[#E4C98A] rounded text-xs font-semibold uppercase tracking-wider"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>

            <div className="relative flex-1 max-w-xs">
              <Search className="w-3.5 h-3.5 text-[#7A7373] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pieces..."
                className="w-full pl-8 pr-3 py-1.5 bg-[#FFFDF9] border border-[#EFE3D2] rounded text-xs text-[#191414] focus:outline-none focus:border-[#C8A15A]"
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

          {/* Right: Results Count & Sort By */}
          <div className="flex items-center gap-4 text-xs">
            <span className="text-[#7A7373] hidden sm:inline">
              Showing <strong className="text-[#3A080C]">{filteredProducts.length}</strong> pieces
            </span>

            <div className="flex items-center gap-2">
              <span className="text-[#7A7373] font-medium hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#FFFDF9] border border-[#EFE3D2] text-[#3A080C] font-medium text-xs px-3 py-1.5 rounded focus:outline-none focus:border-[#C8A15A]"
              >
                <option value="featured">Featured First</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Catalogue Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block space-y-6 bg-[#FAF6F0] p-6 rounded-sm border border-[#EFE3D2] h-fit">
            <div className="flex items-center justify-between border-b border-[#EFE3D2] pb-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#3A080C]">
                <SlidersHorizontal className="w-4 h-4 text-[#C8A15A]" />
                <span>Refine Catalogue</span>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-[11px] text-[#5A1118] hover:underline font-semibold"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Price Filter Slider */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs text-[#3A080C] font-semibold">
                <span>Max Price</span>
                <span className="text-[#C8A15A]">{formatINR(maxPrice)}</span>
              </div>
              <input
                type="range"
                min={39}
                max={400}
                step={10}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#3A080C]"
              />
              <div className="flex justify-between text-[10px] text-[#7A7373]">
                <span>₹39</span>
                <span>₹400</span>
              </div>
            </div>

            {/* In Stock Toggle */}
            <div className="pt-2 border-t border-[#EFE3D2]">
              <label className="flex items-center gap-2 text-xs text-[#3A080C] cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-[#3A080C] focus:ring-[#C8A15A]"
                />
                <span>In-Stock Only</span>
              </label>
            </div>

            {/* Trust note */}
            <div className="pt-4 border-t border-[#EFE3D2] space-y-1 text-[11px] text-[#7A7373]">
              <p className="font-semibold text-[#3A080C]">Delivery across India</p>
              <p>All pieces packed in signature MATILDA protective pouches.</p>
            </div>
          </div>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-[#FAF6F0] rounded-sm border border-[#EFE3D2] space-y-4">
                <Sparkles className="w-8 h-8 text-[#C8A15A] mx-auto" />
                <h3 className="font-serif text-2xl text-[#3A080C]">No pieces match your filters</h3>
                <p className="text-xs text-[#7A7373] max-w-sm mx-auto">
                  Try adjusting your price range or search terms to discover more items in our collection.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-[#3A080C] text-[#E4C98A] text-xs uppercase tracking-widest font-semibold hover:bg-[#5A1118] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: idx * 0.04 }}
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-serif text-lg text-[#3A080C]">Loading MATILDA Jewellery...</div>}>
      <ShopContent />
    </Suspense>
  );
}
