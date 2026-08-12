"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useStore } from "@/lib/context/StoreContext";
import { Product } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Sparkles,
  Search,
  Star,
  Camera,
  Link as LinkIcon,
  Upload,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageSlot {
  id: string;
  url: string;
  storagePath?: string;
  previewSrc?: string;
  isUploading?: boolean;
  error?: string;
}

export default function AdminProductsPage() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // File & URL inputs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [pendingUrl, setPendingUrl] = useState("");
  
  // Deletion confirm modal
  const [deleteTargetProduct, setDeleteTargetProduct] = useState<Product | null>(null);
  const [deleteTargetImageIndex, setDeleteTargetImageIndex] = useState<number | null>(null);

  // Product Form State
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState("Necklaces & Pendants");
  const [price, setPrice] = useState<number>(199);
  const [originalPrice, setOriginalPrice] = useState<number>(299);
  const [description, setDescription] = useState("");
  const [materials, setMaterials] = useState("");
  const [stock, setStock] = useState<number>(20);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [sku, setSku] = useState("");
  const [imageSlots, setImageSlots] = useState<ImageSlot[]>([]);

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategoryFilter === "all" || p.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const resetForm = () => {
    setName("");
    setSubtitle("");
    setCategory(categories[0]?.name || "Necklaces & Pendants");
    setPrice(199);
    setOriginalPrice(299);
    setDescription("");
    setMaterials("Polished fashion alloy with protective coating");
    setStock(20);
    setImageSlots([]);
    setIsFeatured(false);
    setIsNewArrival(true);
    setIsBestSeller(false);
    setIsPublished(true);
    setSku(`MTL-${Date.now().toString().slice(-4)}`);
    setShowUrlInput(false);
    setPendingUrl("");
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setSubtitle(p.subtitle || "");
    setCategory(p.category);
    setPrice(p.price);
    setOriginalPrice(p.originalPrice || p.price);
    setDescription(p.description);
    setMaterials(p.materials);
    setStock(p.stock);
    setImageSlots(
      p.images.map((url, i) => ({
        id: `existing-${i}-${Date.now()}`,
        url,
        storagePath: url.includes("/product-images/") ? url.split("/product-images/")[1] : undefined,
      }))
    );
    setIsFeatured(Boolean(p.isFeatured));
    setIsNewArrival(Boolean(p.isNewArrival));
    setIsBestSeller(Boolean(p.isBestSeller));
    setIsPublished(p.isPublished);
    setSku(p.sku);
    setShowUrlInput(false);
    setPendingUrl("");
    setIsModalOpen(true);
  };

  // ── REAL IMAGE UPLOAD HANDLER ────────────────────────
  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);

    for (const file of newFiles) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 15 * 1024 * 1024) {
        alert(`${file.name} exceeds 15MB. Please choose a smaller image.`);
        continue;
      }

      const tempId = `upload-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const previewUrl = URL.createObjectURL(file);

      // 1. Add placeholder slot with loading spinner
      setImageSlots((prev) => [
        ...prev,
        {
          id: tempId,
          url: "",
          previewSrc: previewUrl,
          isUploading: true,
        },
      ]);

      // 2. Perform real upload to Supabase Storage API
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "products");

        const res = await fetch("/api/admin/upload-image", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (res.ok && data.url) {
          setImageSlots((prev) =>
            prev.map((slot) =>
              slot.id === tempId
                ? {
                    ...slot,
                    url: data.url,
                    storagePath: data.storage_path,
                    isUploading: false,
                  }
                : slot
            )
          );
        } else {
          setImageSlots((prev) =>
            prev.map((slot) =>
              slot.id === tempId
                ? { ...slot, isUploading: false, error: data.error || "Upload failed" }
                : slot
            )
          );
        }
      } catch (err: any) {
        setImageSlots((prev) =>
          prev.map((slot) =>
            slot.id === tempId
              ? { ...slot, isUploading: false, error: "Network upload error" }
              : slot
          )
        );
      }
    }
  }, []);

  /** Add an image by external URL */
  const handleAddUrl = () => {
    const trimmed = pendingUrl.trim();
    if (!trimmed) return;
    setImageSlots((prev) => [
      ...prev,
      {
        id: `url-${Date.now()}`,
        url: trimmed,
      },
    ]);
    setPendingUrl("");
    setShowUrlInput(false);
  };

  /** Set cover image (moves to slot 0) */
  const setCoverImage = (index: number) => {
    if (index === 0) return;
    setImageSlots((prev) => {
      const arr = [...prev];
      const [item] = arr.splice(index, 1);
      arr.unshift(item);
      return arr;
    });
  };

  /** Move image left/right */
  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= imageSlots.length) return;
    setImageSlots((prev) => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  };

  /** Confirm and delete single image */
  const executeDeleteImage = async (index: number) => {
    const targetSlot = imageSlots[index];
    if (!targetSlot) return;

    // Delete remote storage object if applicable
    if (targetSlot.storagePath || targetSlot.url) {
      try {
        await fetch("/api/admin/delete-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            storage_path: targetSlot.storagePath,
            image_url: targetSlot.url,
          }),
        });
      } catch (err) {
        console.warn("Storage deletion error:", err);
      }
    }

    setImageSlots((prev) => prev.filter((_, i) => i !== index));
    setDeleteTargetImageIndex(null);
  };

  /** Delete all images */
  const handleDeleteAllImages = async () => {
    if (!window.confirm("Are you sure you want to remove all images for this piece?")) return;

    for (const slot of imageSlots) {
      if (slot.storagePath || slot.url) {
        try {
          await fetch("/api/admin/delete-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              storage_path: slot.storagePath,
              image_url: slot.url,
            }),
          });
        } catch {
          // ignore
        }
      }
    }

    setImageSlots([]);
  };

  // ── SAVE PRODUCT ────────────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    // Extract valid URLs from slots (never base64)
    const finalImages = imageSlots
      .map((slot) => slot.url)
      .filter((u) => Boolean(u) && !u.startsWith("data:"));

    if (finalImages.length === 0) {
      finalImages.push("/images/golden-waist-chain.png");
    }

    try {
      if (editingProduct) {
        await updateProduct({
          ...editingProduct,
          name,
          slug,
          subtitle,
          category,
          price: Number(price),
          originalPrice: Number(originalPrice),
          description,
          materials,
          stock: Number(stock),
          images: finalImages,
          isFeatured,
          isNewArrival,
          isBestSeller,
          isPublished,
          sku,
        });
      } else {
        await addProduct({
          name,
          slug,
          subtitle,
          category,
          price: Number(price),
          originalPrice: Number(originalPrice),
          description,
          longDescription: description,
          details: [
            "Crafted with signature MATILDA finish",
            "Comfort-tested for daily wear",
            "Dispatches within 24 hours across India",
          ],
          materials,
          images: finalImages,
          stock: Number(stock),
          isFeatured,
          isNewArrival,
          isBestSeller,
          isPublished,
          sku,
        });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert("Failed to save product: " + (err?.message || "Unknown error"));
    } finally {
      setIsSaving(false);
    }
  };

  /** Toggle publish status directly from list */
  const togglePublishStatus = async (p: Product) => {
    await updateProduct({
      ...p,
      isPublished: !p.isPublished,
    });
  };

  /** Delete product */
  const confirmDeleteProduct = async () => {
    if (!deleteTargetProduct) return;
    await deleteProduct(deleteTargetProduct.id);
    setDeleteTargetProduct(null);
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E8E0D5] pb-6">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1A0205] font-normal">
            Products & Catalogue
          </h1>
          <p className="text-xs text-[#7A7373] mt-1">
            Manage jewellery pieces, real-time inventory stock, pricing, and high-resolution product imagery.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#1A0205] text-[#E4C98A] text-xs uppercase tracking-[0.16em] font-medium hover:bg-[#260407] transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Piece</span>
        </button>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A7373]" />
          <input
            type="text"
            placeholder="Search by name, SKU, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8E0D5] rounded-xs text-xs text-[#191414] placeholder-[#7A7373] focus:outline-none focus:border-[#C8A15A]"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategoryFilter("all")}
            className={`px-3 py-1.5 text-[11px] uppercase tracking-wider rounded-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategoryFilter === "all"
                ? "bg-[#1A0205] text-[#E4C98A]"
                : "bg-white border border-[#E8E0D5] text-[#7A7373] hover:text-[#191414]"
            }`}
          >
            All Categories ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryFilter(cat.name)}
              className={`px-3 py-1.5 text-[11px] uppercase tracking-wider rounded-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategoryFilter === cat.name
                  ? "bg-[#1A0205] text-[#E4C98A]"
                  : "bg-white border border-[#E8E0D5] text-[#7A7373] hover:text-[#191414]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#E8E0D5] rounded-xs shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF6F0] border-b border-[#E8E0D5] text-[10px] uppercase tracking-[0.16em] text-[#7A7373]">
              <tr>
                <th className="py-3.5 px-4 font-medium">Piece</th>
                <th className="py-3.5 px-4 font-medium">Category</th>
                <th className="py-3.5 px-4 font-medium">Price</th>
                <th className="py-3.5 px-4 font-medium">Stock</th>
                <th className="py-3.5 px-4 font-medium">Status</th>
                <th className="py-3.5 px-4 font-medium">Featured</th>
                <th className="py-3.5 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E0D5]/70">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#7A7373]">
                    No jewellery pieces match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAF6F0]/60 transition-colors">
                    {/* Piece Thumbnail & Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 bg-[#FAF6F0] rounded-xs overflow-hidden shrink-0 border border-[#E8E0D5]">
                          <Image
                            src={p.images[0] || "/images/golden-waist-chain.png"}
                            alt={p.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-serif text-sm text-[#1A0205] font-normal line-clamp-1">
                            {p.name}
                          </p>
                          <p className="text-[10px] text-[#7A7373] font-mono tracking-wider">
                            {p.sku}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-[#7A7373]">{p.category}</td>

                    {/* Price */}
                    <td className="py-3 px-4">
                      <span className="font-serif text-sm text-[#1A0205] font-normal">
                        {formatINR(p.price)}
                      </span>
                      {p.originalPrice && p.originalPrice > p.price && (
                        <span className="ml-2 text-[10px] text-[#7A7373] line-through">
                          {formatINR(p.originalPrice)}
                        </span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          p.stock > 5
                            ? "bg-emerald-50 text-emerald-700"
                            : p.stock > 0
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {p.stock > 0 ? `${p.stock} in stock` : "Sold Out"}
                      </span>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => togglePublishStatus(p)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-[10px] uppercase tracking-wider font-medium transition-colors ${
                          p.isPublished
                            ? "bg-emerald-900/10 text-emerald-800 hover:bg-emerald-900/20"
                            : "bg-zinc-200 text-zinc-600 hover:bg-zinc-300"
                        }`}
                      >
                        {p.isPublished ? (
                          <>
                            <Eye className="w-3 h-3 text-emerald-600" />
                            <span>Live</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 text-zinc-500" />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Featured */}
                    <td className="py-3 px-4">
                      {p.isFeatured ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-[#C8A15A] font-medium uppercase tracking-wider">
                          <Star className="w-3 h-3 fill-[#C8A15A]" />
                          <span>Featured</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#7A7373]">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-[#7A7373] hover:text-[#1A0205] transition-colors rounded-xs hover:bg-[#FAF6F0]"
                          title="Edit product & images"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTargetProduct(p)}
                          className="p-1.5 text-[#7A7373] hover:text-red-600 transition-colors rounded-xs hover:bg-red-50"
                          title="Delete piece"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── CREATE / EDIT MODAL ───────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white border border-[#E8E0D5] w-full max-w-4xl max-h-[92vh] flex flex-col rounded-xs shadow-2xl overflow-hidden font-sans"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E0D5] bg-[#FAF6F0]">
                <div>
                  <h2 className="font-serif text-2xl text-[#1A0205]">
                    {editingProduct ? `Edit Piece: ${editingProduct.name}` : "Add New Jewellery Piece"}
                  </h2>
                  <p className="text-[11px] text-[#7A7373]">
                    {editingProduct
                      ? "Update imagery, specifications, stock, and pricing for this piece."
                      : "Create a new jewellery listing in the MATILDA catalogue."}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-[#7A7373] hover:text-[#1A0205] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-8">
                
                {/* ── SECTION: PRODUCT IMAGES (REAL CMS MANAGER) ── */}
                <div className="space-y-3 bg-[#FAF6F0]/80 border border-[#E8E0D5] p-5 rounded-xs">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div>
                      <h3 className="text-xs uppercase tracking-[0.18em] text-[#1A0205] font-semibold">
                        Product Photography ({imageSlots.length} images)
                      </h3>
                      <p className="text-[11px] text-[#7A7373]">
                        The first image is the <strong>Cover / Primary Image</strong>. Click <em>Set as Cover</em> or use arrows to reorder.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Hidden File Input supporting mobile picker & desktop */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/jpg"
                        multiple
                        className="hidden"
                        onChange={(e) => handleFileSelect(e.target.files)}
                      />

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1A0205] text-[#E4C98A] text-[11px] uppercase tracking-wider font-medium hover:bg-[#260407] transition-all"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Upload Images</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowUrlInput(!showUrlInput)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E8E0D5] text-[#1A0205] text-[11px] uppercase tracking-wider font-medium hover:bg-[#FAF6F0] transition-all"
                      >
                        <LinkIcon className="w-3.5 h-3.5 text-[#C8A15A]" />
                        <span>Add URL</span>
                      </button>

                      {imageSlots.length > 0 && (
                        <button
                          type="button"
                          onClick={handleDeleteAllImages}
                          className="text-[10px] uppercase tracking-wider text-red-600 hover:text-red-700 font-medium px-2 py-1"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                  </div>

                  {/* URL Input Bar */}
                  {showUrlInput && (
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="url"
                        placeholder="https://example.com/jewellery-image.webp"
                        value={pendingUrl}
                        onChange={(e) => setPendingUrl(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white border border-[#E8E0D5] text-xs text-[#191414] focus:outline-none focus:border-[#C8A15A]"
                      />
                      <button
                        type="button"
                        onClick={handleAddUrl}
                        className="px-4 py-2 bg-[#C8A15A] text-[#1A0205] text-xs font-semibold uppercase tracking-wider hover:bg-[#E4C98A]"
                      >
                        Insert
                      </button>
                    </div>
                  )}

                  {/* Image Grid / Strip */}
                  {imageSlots.length === 0 ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-[#E8E0D5] hover:border-[#C8A15A] rounded-xs p-8 text-center cursor-pointer transition-colors"
                    >
                      <Upload className="w-8 h-8 text-[#C8A15A] mx-auto mb-2" />
                      <p className="font-serif text-sm text-[#1A0205]">
                        Click to upload photos from your device or mobile gallery
                      </p>
                      <p className="text-[11px] text-[#7A7373] mt-1">
                        High-resolution JPG, PNG or WEBP recommended.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                      {imageSlots.map((slot, index) => {
                        const displayUrl = slot.url || slot.previewSrc || "/images/golden-waist-chain.png";
                        const isPrimary = index === 0;

                        return (
                          <div
                            key={slot.id}
                            className={`relative group bg-white border ${
                              isPrimary ? "border-[#C8A15A] ring-1 ring-[#C8A15A]" : "border-[#E8E0D5]"
                            } rounded-xs overflow-hidden flex flex-col`}
                          >
                            {/* Primary Badge */}
                            {isPrimary && (
                              <span className="absolute top-2 left-2 z-10 bg-[#1A0205] text-[#E4C98A] text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 shadow-xs">
                                Cover Photo
                              </span>
                            )}

                            {/* Image Thumbnail */}
                            <div className="relative aspect-square w-full bg-[#FAF6F0]">
                              <Image
                                src={displayUrl}
                                alt={`Product slot ${index + 1}`}
                                fill
                                className="object-cover"
                              />

                              {/* Uploading Spinner */}
                              {slot.isUploading && (
                                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                                  <Loader2 className="w-5 h-5 animate-spin text-[#E4C98A] mb-1" />
                                  <span className="text-[10px] tracking-wider">Uploading...</span>
                                </div>
                              )}

                              {/* Error banner */}
                              {slot.error && (
                                <div className="absolute inset-0 bg-red-900/80 p-2 flex items-center justify-center text-center text-white text-[10px]">
                                  {slot.error}
                                </div>
                              )}
                            </div>

                            {/* Image Controls */}
                            <div className="p-2 bg-white flex items-center justify-between border-t border-[#E8E0D5] text-xs">
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  disabled={index === 0}
                                  onClick={() => moveImage(index, index - 1)}
                                  className="p-1 text-[#7A7373] hover:text-[#1A0205] disabled:opacity-30"
                                  title="Move Left"
                                >
                                  <ArrowLeft className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={index === imageSlots.length - 1}
                                  onClick={() => moveImage(index, index + 1)}
                                  className="p-1 text-[#7A7373] hover:text-[#1A0205] disabled:opacity-30"
                                  title="Move Right"
                                >
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {!isPrimary && (
                                <button
                                  type="button"
                                  onClick={() => setCoverImage(index)}
                                  className="text-[9.5px] uppercase tracking-wider text-[#C8A15A] hover:text-[#1A0205] font-semibold"
                                >
                                  Make Cover
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => setDeleteTargetImageIndex(index)}
                                className="p-1 text-[#7A7373] hover:text-red-600 transition-colors"
                                title="Remove photo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* ── SECTION: GENERAL INFORMATION ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="sm:col-span-2">
                    <label className="text-xs uppercase tracking-[0.14em] text-[#191414] font-semibold block mb-1">
                      Piece Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Celestial Crescent Pendant"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E8E0D5] text-sm text-[#191414] focus:outline-none focus:border-[#C8A15A]"
                    />
                  </div>

                  {/* Subtitle */}
                  <div>
                    <label className="text-xs uppercase tracking-[0.14em] text-[#191414] font-semibold block mb-1">
                      Subtitle / Editorial Note
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Hand-finished silver with micro-pave detailing"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-[#E8E0D5] text-xs text-[#191414] focus:outline-none focus:border-[#C8A15A]"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="text-xs uppercase tracking-[0.14em] text-[#191414] font-semibold block mb-1">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-[#E8E0D5] text-xs text-[#191414] focus:outline-none focus:border-[#C8A15A]"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="text-xs uppercase tracking-[0.14em] text-[#191414] font-semibold block mb-1">
                      Selling Price (₹ INR) *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2 bg-white border border-[#E8E0D5] text-sm text-[#191414] focus:outline-none focus:border-[#C8A15A]"
                    />
                  </div>

                  {/* Original / Compare At Price */}
                  <div>
                    <label className="text-xs uppercase tracking-[0.14em] text-[#191414] font-semibold block mb-1">
                      Original Price (₹ INR)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2 bg-white border border-[#E8E0D5] text-sm text-[#191414] focus:outline-none focus:border-[#C8A15A]"
                    />
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="text-xs uppercase tracking-[0.14em] text-[#191414] font-semibold block mb-1">
                      Available Stock Quantity *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={stock}
                      onChange={(e) => setStock(Number(e.target.value))}
                      className="w-full px-3.5 py-2 bg-white border border-[#E8E0D5] text-sm text-[#191414] focus:outline-none focus:border-[#C8A15A]"
                    />
                  </div>

                  {/* SKU */}
                  <div>
                    <label className="text-xs uppercase tracking-[0.14em] text-[#191414] font-semibold block mb-1">
                      SKU Code
                    </label>
                    <input
                      type="text"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-[#E8E0D5] text-xs font-mono text-[#191414] focus:outline-none focus:border-[#C8A15A]"
                    />
                  </div>

                  {/* Materials */}
                  <div className="sm:col-span-2">
                    <label className="text-xs uppercase tracking-[0.14em] text-[#191414] font-semibold block mb-1">
                      Materials & Craft
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 18K Gold Finish, High-grade brass alloy, Anti-tarnish seal"
                      value={materials}
                      onChange={(e) => setMaterials(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-[#E8E0D5] text-xs text-[#191414] focus:outline-none focus:border-[#C8A15A]"
                    />
                  </div>

                  {/* Description */}
                  <div className="sm:col-span-2">
                    <label className="text-xs uppercase tracking-[0.14em] text-[#191414] font-semibold block mb-1">
                      Product Description
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the piece, the story behind it, and recommended styling..."
                      className="w-full px-3.5 py-2 bg-white border border-[#E8E0D5] text-xs text-[#191414] focus:outline-none focus:border-[#C8A15A]"
                    />
                  </div>
                </div>

                {/* ── SECTION: VISIBILITY & BADGES ── */}
                <div className="border-t border-[#E8E0D5] pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="w-4 h-4 text-[#1A0205] focus:ring-[#C8A15A] rounded-xs"
                    />
                    <span className="text-xs text-[#191414] font-medium">Publish to Store</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-4 h-4 text-[#1A0205] focus:ring-[#C8A15A] rounded-xs"
                    />
                    <span className="text-xs text-[#191414] font-medium">Homepage Featured</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isNewArrival}
                      onChange={(e) => setIsNewArrival(e.target.checked)}
                      className="w-4 h-4 text-[#1A0205] focus:ring-[#C8A15A] rounded-xs"
                    />
                    <span className="text-xs text-[#191414] font-medium">New Arrival</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isBestSeller}
                      onChange={(e) => setIsBestSeller(e.target.checked)}
                      className="w-4 h-4 text-[#1A0205] focus:ring-[#C8A15A] rounded-xs"
                    />
                    <span className="text-xs text-[#191414] font-medium">Best Seller</span>
                  </label>
                </div>

                {/* Modal Actions */}
                <div className="border-t border-[#E8E0D5] pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 border border-[#E8E0D5] text-xs uppercase tracking-wider text-[#7A7373] hover:text-[#191414]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-7 py-2.5 bg-[#1A0205] text-[#E4C98A] text-xs uppercase tracking-[0.16em] font-medium hover:bg-[#260407] transition-all shadow-sm disabled:opacity-50"
                  >
                    {isSaving ? "Saving Piece..." : editingProduct ? "Save Changes" : "Create Piece"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── DELETE IMAGE CONFIRMATION MODAL ── */}
      <AnimatePresence>
        {deleteTargetImageIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white border border-[#E8E0D5] w-full max-w-md p-6 rounded-xs shadow-2xl space-y-4 font-sans"
            >
              <div className="flex items-center gap-3 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-serif text-xl text-[#1A0205]">Delete Photo</h3>
              </div>
              <p className="text-xs text-[#7A7373]">
                Are you sure you want to permanently delete this photo from the product listing and Supabase Storage?
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteTargetImageIndex(null)}
                  className="px-4 py-2 text-xs uppercase tracking-wider text-[#7A7373] hover:text-[#191414]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => executeDeleteImage(deleteTargetImageIndex)}
                  className="px-5 py-2 bg-red-600 text-white text-xs uppercase tracking-wider font-semibold hover:bg-red-700"
                >
                  Delete Photo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── DELETE PRODUCT CONFIRMATION MODAL ── */}
      <AnimatePresence>
        {deleteTargetProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white border border-[#E8E0D5] w-full max-w-md p-6 rounded-xs shadow-2xl space-y-4 font-sans"
            >
              <div className="flex items-center gap-3 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-serif text-xl text-[#1A0205]">Delete Jewellery Piece</h3>
              </div>
              <p className="text-xs text-[#7A7373]">
                Are you sure you want to permanently delete <strong>{deleteTargetProduct.name}</strong> ({deleteTargetProduct.sku})?
                Historical orders containing this piece will remain intact.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteTargetProduct(null)}
                  className="px-4 py-2 text-xs uppercase tracking-wider text-[#7A7373] hover:text-[#191414]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteProduct}
                  className="px-5 py-2 bg-red-600 text-white text-xs uppercase tracking-wider font-semibold hover:bg-red-700"
                >
                  Delete Piece
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
