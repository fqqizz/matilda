"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useStore } from "@/lib/context/StoreContext";
import { formatINR } from "@/lib/utils";
import { Layers, AlertTriangle, CheckCircle, Plus, Minus, Search } from "lucide-react";

export default function AdminInventoryPage() {
  const { products, updateProduct } = useStore();
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStockChange = (productId: string, delta: number) => {
    const p = products.find((prod) => prod.id === productId);
    if (p) {
      const newStock = Math.max(0, p.stock + delta);
      updateProduct({ ...p, stock: newStock });
    }
  };

  const setExactStock = (productId: string, stockVal: number) => {
    const p = products.find((prod) => prod.id === productId);
    if (p) {
      updateProduct({ ...p, stock: Math.max(0, stockVal) });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE3D2] pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C8A15A] font-bold">
            Live Inventory
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#3A080C]">
            Stock & Inventory Matrix
          </h1>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#7A7373] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search piece or SKU..."
            className="pl-8 pr-3 py-2 bg-white border border-[#EFE3D2] rounded text-xs text-[#191414] focus:outline-none focus:border-[#C8A15A] w-64"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded border border-[#EFE3D2] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EFE3D2] bg-[#FAF6F0] text-[#7A7373] uppercase tracking-wider text-[10px]">
                <th className="p-3">Jewellery Piece</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Unit Price</th>
                <th className="p-3">Stock Status</th>
                <th className="p-3">Current Units</th>
                <th className="p-3 text-right">Quick Stock Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F7F1E8]">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-[#FAF6F0]">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded bg-[#FAF6F0] overflow-hidden border border-[#EFE3D2] shrink-0">
                        <Image
                          src={p.images[0] || "/images/golden-waist-chain.png"}
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-[#3A080C]">{p.name}</p>
                        <p className="text-[10px] text-[#7A7373]">{p.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-mono text-[11px] text-[#7A7373]">{p.sku}</td>
                  <td className="p-3 font-bold text-[#3A080C]">{formatINR(p.price)}</td>
                  <td className="p-3">
                    {p.stock === 0 ? (
                      <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-0.5 rounded text-[10px] font-bold">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Out of Stock</span>
                      </span>
                    ) : p.stock <= 5 ? (
                      <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[10px] font-bold">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Low Stock ({p.stock} left)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[#25D366] bg-[#25D366]/10 px-2 py-0.5 rounded text-[10px] font-bold">
                        <CheckCircle className="w-3 h-3" />
                        <span>Healthy Stock</span>
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      min={0}
                      value={p.stock}
                      onChange={(e) => setExactStock(p.id, Number(e.target.value))}
                      className="w-16 px-2 py-1 bg-[#FAF6F0] border border-[#EFE3D2] rounded text-xs font-bold text-[#3A080C] text-center focus:outline-none"
                    />
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleStockChange(p.id, -1)}
                        className="p-1.5 rounded border border-[#EFE3D2] bg-white hover:bg-[#FAF6F0] text-[#3A080C]"
                        title="Reduce stock by 1"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleStockChange(p.id, 1)}
                        className="p-1.5 rounded border border-[#EFE3D2] bg-white hover:bg-[#FAF6F0] text-[#3A080C]"
                        title="Add stock by 1"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleStockChange(p.id, 10)}
                        className="px-2 py-1 rounded bg-[#3A080C] text-[#E4C98A] text-[10px] font-bold hover:bg-[#5A1118]"
                        title="Add batch of 10"
                      >
                        +10
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
