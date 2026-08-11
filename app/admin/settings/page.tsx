"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/context/StoreContext";
import { Save, CheckCircle, Sparkles, ShieldCheck } from "lucide-react";

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useStore();

  const [brandName, setBrandName] = useState(settings.brandName);
  const [founderName, setFounderName] = useState(settings.founderName);
  const [bio, setBio] = useState(settings.bio);
  const [phone, setPhone] = useState(settings.phone);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [instagramHandle, setInstagramHandle] = useState(settings.instagramHandle);
  const [instagramUrl, setInstagramUrl] = useState(settings.instagramUrl);
  const [announcementText, setAnnouncementText] = useState(settings.announcementText);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(settings.freeShippingThreshold);
  const [standardShippingFee, setStandardShippingFee] = useState(settings.standardShippingFee);
  const [razorpayKeyId, setRazorpayKeyId] = useState(settings.razorpayKeyId);
  const [isTestMode, setIsTestMode] = useState(settings.isTestMode);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      brandName,
      founderName,
      bio,
      phone,
      whatsappNumber,
      instagramHandle,
      instagramUrl,
      announcementText,
      freeShippingThreshold: Number(freeShippingThreshold),
      standardShippingFee: Number(standardShippingFee),
      razorpayKeyId,
      isTestMode,
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE3D2] pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C8A15A] font-bold">
            Store Configuration
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#3A080C]">
            Brand & Gateway Settings
          </h1>
        </div>

        {saved && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] text-xs font-semibold rounded">
            <CheckCircle className="w-4 h-4" />
            <span>Settings saved successfully</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        {/* Brand Information */}
        <div className="p-6 bg-white rounded border border-[#EFE3D2] space-y-4 text-xs">
          <h3 className="font-serif text-base font-bold text-[#3A080C] border-b border-[#EFE3D2] pb-2">
            Brand Identity & Positioning
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="uppercase tracking-wider font-semibold text-[#3A080C] block mb-1">
                Brand Name
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full p-2.5 bg-[#FAF6F0] border border-[#EFE3D2] rounded text-xs text-[#191414]"
              />
            </div>

            <div>
              <label className="uppercase tracking-wider font-semibold text-[#3A080C] block mb-1">
                Founder Name
              </label>
              <input
                type="text"
                value={founderName}
                onChange={(e) => setFounderName(e.target.value)}
                className="w-full p-2.5 bg-[#FAF6F0] border border-[#EFE3D2] rounded text-xs text-[#191414]"
              />
            </div>
          </div>

          <div>
            <label className="uppercase tracking-wider font-semibold text-[#3A080C] block mb-1">
              Brand Positioning Statement
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-2.5 bg-[#FAF6F0] border border-[#EFE3D2] rounded text-xs text-[#191414]"
            />
          </div>

          <div>
            <label className="uppercase tracking-wider font-semibold text-[#3A080C] block mb-1">
              Top Announcement Banner Text
            </label>
            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className="w-full p-2.5 bg-[#FAF6F0] border border-[#EFE3D2] rounded text-xs text-[#191414]"
            />
          </div>
        </div>

        {/* Social & Contact */}
        <div className="p-6 bg-white rounded border border-[#EFE3D2] space-y-4 text-xs">
          <h3 className="font-serif text-base font-bold text-[#3A080C] border-b border-[#EFE3D2] pb-2">
            Contact & Social Channels
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="uppercase tracking-wider font-semibold text-[#3A080C] block mb-1">
                Display Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 bg-[#FAF6F0] border border-[#EFE3D2] rounded text-xs text-[#191414]"
              />
            </div>

            <div>
              <label className="uppercase tracking-wider font-semibold text-[#3A080C] block mb-1">
                WhatsApp Phone (Country code without +)
              </label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full p-2.5 bg-[#FAF6F0] border border-[#EFE3D2] rounded text-xs text-[#191414]"
              />
            </div>

            <div>
              <label className="uppercase tracking-wider font-semibold text-[#3A080C] block mb-1">
                Instagram Handle
              </label>
              <input
                type="text"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                className="w-full p-2.5 bg-[#FAF6F0] border border-[#EFE3D2] rounded text-xs text-[#191414]"
              />
            </div>

            <div>
              <label className="uppercase tracking-wider font-semibold text-[#3A080C] block mb-1">
                Instagram Profile URL
              </label>
              <input
                type="text"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                className="w-full p-2.5 bg-[#FAF6F0] border border-[#EFE3D2] rounded text-xs text-[#191414]"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Payment Gateway */}
        <div className="p-6 bg-white rounded border border-[#EFE3D2] space-y-4 text-xs">
          <h3 className="font-serif text-base font-bold text-[#3A080C] border-b border-[#EFE3D2] pb-2">
            Shipping & Razorpay Payment Settings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="uppercase tracking-wider font-semibold text-[#3A080C] block mb-1">
                Free Shipping Threshold (INR ₹)
              </label>
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                className="w-full p-2.5 bg-[#FAF6F0] border border-[#EFE3D2] rounded text-xs text-[#191414]"
              />
            </div>

            <div>
              <label className="uppercase tracking-wider font-semibold text-[#3A080C] block mb-1">
                Standard Shipping Fee (INR ₹)
              </label>
              <input
                type="number"
                value={standardShippingFee}
                onChange={(e) => setStandardShippingFee(Number(e.target.value))}
                className="w-full p-2.5 bg-[#FAF6F0] border border-[#EFE3D2] rounded text-xs text-[#191414]"
              />
            </div>
          </div>

          <div>
            <label className="uppercase tracking-wider font-semibold text-[#3A080C] block mb-1">
              Razorpay Key ID (Test or Live)
            </label>
            <input
              type="text"
              value={razorpayKeyId}
              onChange={(e) => setRazorpayKeyId(e.target.value)}
              className="w-full p-2.5 bg-[#FAF6F0] border border-[#EFE3D2] rounded text-xs font-mono text-[#191414]"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isTestMode}
                onChange={(e) => setIsTestMode(e.target.checked)}
                className="rounded text-[#3A080C]"
              />
              <span className="font-semibold text-[#3A080C]">
                Enable Test Mode (Simulates instant approvals for test testing)
              </span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="px-8 py-3.5 bg-[#3A080C] text-[#E4C98A] text-xs uppercase tracking-[0.2em] font-semibold rounded hover:bg-[#5A1118] transition-all shadow-md flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Store Settings</span>
        </button>
      </form>
    </div>
  );
}
