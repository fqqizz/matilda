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
  GripVertical,
  Upload,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ──────────────────────────────────────────────────────
// Image upload state per-slot
// Base64 is ONLY used for local preview.
// In production: upload to Supabase Storage → save URL.
// ──────────────────────────────────────────────────────
interface ImageSlot {
  /** URL stored in the product (Supabase Storage path or public URL) */
  url: string;
  /** Temporary base64 preview — never persisted to DB */
  previewSrc?: string;
  /** Whether currently uploading to Supabase */
  uploading?: boolean;
  /** Upload error message */
  error?: string;
}

export default function AdminProductsPage() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [pendingUrl, setPendingUrl] = useState("");

  // Form State
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

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    setImageSlots(p.images.map((url) => ({ url })));
    setIsFeatured(!!p.isFeatured);
    setIsNewArrival(!!p.isNewArrival);
    setIsBestSeller(!!p.isBestSeller);
    setIsPublished(p.isPublished);
    setSku(p.sku);
    setShowUrlInput(false);
    setPendingUrl("");
    setIsModalOpen(true);
  };

  // ── IMAGE HANDLERS ──────────────────────────────────

  /** Handle file picker selection — creates base64 preview, marks as needs-upload */
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} exceeds 10MB. Please compress before uploading.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const previewSrc = e.target?.result as string;
        const tempSlot: ImageSlot = {
          url: "", // Will be set after Supabase Storage upload
          previewSrc,
          uploading: false,
          error: undefined,
        };

        setImageSlots((prev) => {
          if (prev.length >= 6) return prev;
          return [...prev, tempSlot];
        });

        // TODO (Supabase integration): After connecting Supabase Storage,
        // upload the file here and set slot.url to the returned storage path.
        // setImageSlots(prev => prev.map(s =>
        //   s.previewSrc === previewSrc
        //     ? { ...s, uploading: true }
        //     : s
        // ));
        // const { data, error } = await supabase.storage
        //   .from('product-images').upload(`${productId}/${file.name}`, file);
        // if (data) { setImageSlots(prev => prev.map(s =>
        //   s.previewSrc === previewSrc ? { ...s, url: data.path, uploading: false } : s
        // )); }
      };
      reader.readAsDataURL(file);
    });
  }, []);

  /** Add an image by URL */
  const handleAddUrl = () => {
    const trimmed = pendingUrl.trim();
    if (!trimmed) return;
    if (imageSlots.length >= 6) return;
    setImageSlots((prev) => [...prev, { url: trimmed }]);
    setPendingUrl("");
    setShowUrlInput(false);
  };

  /** Remove image at index */
  const removeImage = (index: number) => {
    // TODO (Supabase): If slot.url is a Supabase Storage path, delete it here.
    // await supabase.storage.from('product-images').remove([slot.url]);
    setImageSlots((prev) => prev.filter((_, i) => i !== index));
  };

  /** Move image left (reorder) */
  const moveImage = (from: number, to: number) => {
    setImageSlots((prev) => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  };

  // ── SAVE ────────────────────────────────────────────

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    // Build final images array.
    // previewSrc (base64) is ONLY used for local display — not persisted.
    // In production, imageSlots with no url (only previewSrc) should have been
    // uploaded to Supabase Storage before reaching this point, and url set.
    const finalImages = imageSlots
      .map((slot) => slot.url || slot.previewSrc || "")
      .filter(Boolean);

    if (finalImages.length === 0) {
      finalImages.push("/images/golden-waist-chain.png");
    }

    if (editingProduct) {
      updateProduct({
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
      addProduct({
        name,
        slug,
        subtitle,
        category,
        price: Number(price),
        originalPrice: Number(originalPrice),
        description,
        longDescription: description,
        details: [
          "Comfort-tested for daily wear",
          "Delivery across India in MATILDA packaging",
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
  };

  const handleDelete = (id: string, prodName: string) => {
    if (window.confirm(`Delete "${prodName}" from the catalogue?`)) {
      deleteProduct(id);
    }
  };

  // ── RENDER ───────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE3D2] pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C8A15A] font-bold">
            Catalogue Management
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#3A080C]">
            Products ({products.length})
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#7A7373] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="pl-8 pr-3 py-2 bg-white border border-[#EFE3D2] rounded text-xs text-[#191414] focus:outline-none focus:border-[#C8A15A]"
            />
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#3A080C] text-[#E4C98A] text-xs uppercase tracking-wider font-semibold rounded hover:bg-[#5A1118] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded border border-[#EFE3D2] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EFE3D2] bg-[#FAF6F0] text-[#7A7373] uppercase tracking-wider text-[10px]">
                <th className="p-3">Piece</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Reviews</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F7F1E8]">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-[#FAF6F0]">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded bg-[#FAF6F0] overflow-hidden border border-[#EFE3D2] shrink-0">
                        <Image
                          src={p.images[0] || "/images/golden-waist-chain.png"}
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-serif font-bold text-sm text-[#3A080C]">{p.name}</p>
                        <p className="text-[10px] text-[#7A7373]">SKU: {p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-[#191414]">{p.category}</td>
                  <td className="p-3">
                    <span className="font-bold text-[#3A080C]">{formatINR(p.price)}</span>
                    {p.originalPrice && p.originalPrice > p.price && (
                      <span className="text-[10px] text-[#7A7373] line-through ml-1.5">
                        {formatINR(p.originalPrice)}
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        p.stock > 5
                          ? "bg-emerald-50 text-emerald-700"
                          : p.stock > 0
                          ? "bg-amber-50 text-amber-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {p.stock > 0 ? `${p.stock} units` : "Out of stock"}
                    </span>
                  </td>
                  <td className="p-3">
                    {p.reviewCount > 0 ? (
                      <div className="flex items-center gap-1 text-[#C8A15A]">
                        <Star className="w-3.5 h-3.5 fill-[#C8A15A]" />
                        <span className="font-bold text-[#191414]">{p.rating.toFixed(1)}</span>
                        <span className="text-[10px] text-[#7A7373]">({p.reviewCount})</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-[#7A7373]">No reviews</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        p.isPublished ? "bg-[#3A080C]/10 text-[#3A080C]" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {p.isPublished ? "Live" : "Draft"}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 rounded text-[#3A080C] hover:bg-[#FAF6F0] transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-1.5 rounded text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#7A7373] text-xs">
                    <Sparkles className="w-5 h-5 mx-auto mb-2 text-[#C8A15A]" />
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Create / Edit Modal ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-2xl bg-[#FFFDF9] rounded shadow-2xl border border-[#EFE3D2] p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 text-[#3A080C] hover:text-[#5A1118]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6 space-y-1">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C8A15A] font-bold">
                  {editingProduct ? "Update Piece" : "New Catalogue Entry"}
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#3A080C]">
                  {editingProduct ? `Edit "${editingProduct.name}"` : "Add New Jewellery Piece"}
                </h2>
              </div>

              <form onSubmit={handleSave} className="space-y-5 text-xs">
                
                {/* ── PRODUCT IMAGES ── */}
                <div>
                  <label className="uppercase tracking-wider font-semibold text-[#3A080C] block mb-2">
                    Product Images
                    <span className="text-[10px] text-[#7A7373] normal-case tracking-normal ml-2">
                      (First image = primary · drag to reorder · max 6)
                    </span>
                  </label>

                  {/* Image slots preview strip */}
                  <div className="flex flex-wrap gap-3 mb-3">
                    {imageSlots.map((slot, index) => (
                      <div key={index} className="relative group">
                        <div className="relative w-20 h-20 rounded bg-[#FAF6F0] border-2 overflow-hidden shrink-0 border-[#EFE3D2] group-first:border-[#C8A15A]">
                          {(slot.previewSrc || slot.url) && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={slot.previewSrc || slot.url}
                              alt={`Image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          )}
                          {slot.uploading && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Upload className="w-4 h-4 text-white animate-pulse" />
                            </div>
                          )}
                          {index === 0 && (
                            <div className="absolute bottom-0 inset-x-0 text-[8px] text-center bg-[#C8A15A] text-[#260407] font-bold py-0.5">
                              PRIMARY
                            </div>
                          )}
                        </div>

                        {/* Controls */}
                        <div className="absolute -top-2 -right-2 hidden group-hover:flex items-center gap-0.5">
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => moveImage(index, index - 1)}
                              className="w-5 h-5 rounded-full bg-[#3A080C] text-white flex items-center justify-center text-[9px] hover:bg-[#5A1118]"
                              title="Move left"
                            >
                              ←
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700"
                            title="Remove"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Add slot */}
                    {imageSlots.length < 6 && (
                      <div className="flex flex-col gap-1.5">
                        {/* Camera / file picker (works on mobile too — opens camera or photo gallery) */}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-20 h-20 rounded border-2 border-dashed border-[#C8A15A]/50 bg-[#FAF6F0] text-[#C8A15A] flex flex-col items-center justify-center gap-1 hover:border-[#C8A15A] hover:bg-[#F7F1E8] transition-colors"
                          title="Upload from camera or photo library"
                        >
                          <Camera className="w-4 h-4" />
                          <span className="text-[8px] text-center leading-tight text-[#7A7373]">
                            Camera / Gallery
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowUrlInput(!showUrlInput)}
                          className="w-20 h-6 rounded border border-[#EFE3D2] text-[#7A7373] flex items-center justify-center gap-1 text-[9px] hover:border-[#C8A15A] hover:text-[#C8A15A] transition-colors"
                          title="Add by URL"
                        >
                          <LinkIcon className="w-3 h-3" />
                          URL
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Hidden file input — accept image/* triggers camera on mobile */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    capture="environment"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files)}
                  />

                  {/* URL input row */}
                  {showUrlInput && (
                    <div className="flex gap-2 mb-2">
                      <input
                        ref={urlInputRef}
                        type="text"
                        value={pendingUrl}
                        onChange={(e) => setPendingUrl(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddUrl())}
                        placeholder="/images/my-product.png or https://..."
                        className="flex-1 px-3 py-2 bg-[#FAF6F0] border border-[#EFE3D2] rounded focus:outline-none focus:border-[#C8A15A] text-[11px]"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={handleAddUrl}
                        className="px-3 py-1.5 bg-[#3A080C] text-[#E4C98A] rounded text-[10px] font-semibold hover:bg-[#5A1118]"
                      >
                        Add
                      </button>
                    </div>
                  )}

                  {imageSlots.some((s) => s.previewSrc && !s.url) && (
                    <p className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200 rounded px-2 py-1.5 mt-1">
                      ⚠ Images with a camera icon preview are locally selected but not yet uploaded to Supabase Storage. Connect Supabase to enable permanent cloud storage.
                    </p>
                  )}
                </div>

                {/* Title & Subtitle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="uppercase tracking-wider font-semibold text-[#3A080C] block mb-1">
                      Product Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Golden Waist Chain"
                      className="w-full px-3.5 py-2.5 bg-[#FAF6F0] border border-[#EFE3D2] rounded focus:outline-none focus:border-[#C8A15A]"
                    />
                  </div>
                  <div>
                    <label className="uppercase tracking-wider font-semibold text-[#3A080C] block mb-1">
                      Subtitle / Tagline
                    </label>
                    <input
                      type="text"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      placeholder="e.g. Dainty link silhouette"
                      className="w-full px-3.5 py-2.5 bg-[#FAF6F0] border border-[#EFE3D2] rounded focus:outline-none focus:border-[#C8A15A]"
                    />
                  </div>
                </div>

                {/* Category & SKU */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="uppercase tracking-wider font-semibold text-[#3A080C] block mb-1">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FAF6F0] border border-[#EFE3D2] rounded focus:outline-none focus:border-[#C8A15A]"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="uppercase tracking-wider font-semibold text-[#3A080C] block mb-1">
                      SKU *
                    </label>
                    <input
                      type="text"
                      required
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FAF6F0] border border-[#EFE3D2] rounded focus:outline-none focus:border-[#C8A15A]"
                    />
                  </div>
                </div>

                {/* Pricing & Stock */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="uppercase tracking-wider font-semibold text-[#3A080C] block mb-1">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-[#FAF6F0] border border-[#EFE3D2] rounded focus:outline-none focus:border-[#C8A15A]"
                    />
                  </div>
                  <div>
                    <label className="uppercase tracking-wider font-semibold text-[#3A080C] block mb-1">
                      Original Price (₹)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-[#FAF6F0] border border-[#EFE3D2] rounded focus:outline-none focus:border-[#C8A15A]"
                    />
                  </div>
                  <div>
                    <label className="uppercase tracking-wider font-semibold text-[#3A080C] block mb-1">
                      Stock *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={stock}
                      onChange={(e) => setStock(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-[#FAF6F0] border border-[#EFE3D2] rounded focus:outline-none focus:border-[#C8A15A]"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="uppercase tracking-wider font-semibold text-[#3A080C] block mb-1">
                    Product Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the silhouette, finish, and everyday appeal..."
                    className="w-full px-3.5 py-2.5 bg-[#FAF6F0] border border-[#EFE3D2] rounded focus:outline-none focus:border-[#C8A15A]"
                  />
                </div>

                {/* Materials */}
                <div>
                  <label className="uppercase tracking-wider font-semibold text-[#3A080C] block mb-1">
                    Materials
                  </label>
                  <input
                    type="text"
                    value={materials}
                    onChange={(e) => setMaterials(e.target.value)}
                    placeholder="e.g. Polished gold-tone alloy with anti-tarnish coating"
                    className="w-full px-3.5 py-2.5 bg-[#FAF6F0] border border-[#EFE3D2] rounded focus:outline-none focus:border-[#C8A15A]"
                  />
                </div>

                {/* Flags */}
                <div className="pt-2 border-t border-[#EFE3D2] flex flex-wrap gap-4">
                  {[
                    { label: "Featured Piece", state: isFeatured, set: setIsFeatured },
                    { label: "New Arrival", state: isNewArrival, set: setIsNewArrival },
                    { label: "Best Seller", state: isBestSeller, set: setIsBestSeller },
                    { label: "Publish Live", state: isPublished, set: setIsPublished },
                  ].map((flag) => (
                    <label key={flag.label} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={flag.state}
                        onChange={(e) => flag.set(e.target.checked)}
                        className="rounded text-[#3A080C]"
                      />
                      <span className="font-semibold text-[#3A080C]">{flag.label}</span>
                    </label>
                  ))}
                </div>

                {/* Submit */}
                <div className="pt-4 border-t border-[#EFE3D2] flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 border border-[#EFE3D2] rounded text-xs font-semibold hover:bg-[#FAF6F0] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#3A080C] text-[#E4C98A] text-xs uppercase tracking-wider font-semibold rounded hover:bg-[#5A1118] transition-colors shadow-sm"
                  >
                    {editingProduct ? "Save Changes" : "Create Piece"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
