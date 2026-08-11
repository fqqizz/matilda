"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useStore } from "@/lib/context/StoreContext";
import { MessageCircle, Instagram, Phone, Mail, CheckCircle, Send, Sparkles } from "lucide-react";

export default function ContactPage() {
  const { settings } = useStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    }, 2500);
  };

  return (
    <div className="bg-[#FFFDF9] text-[#191414] min-h-screen py-12 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C8A15A] font-semibold">
            We Are Here To Assist
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#3A080C]">
            Get In Touch
          </h1>
          <p className="font-serif italic text-2xl text-[#5A1118]">
            MATILDA by Duha Ajaz Pandith
          </p>
          <p className="text-xs sm:text-sm text-[#7A7373] max-w-md mx-auto leading-relaxed">
            Have a question about custom sizing, styling advice, or shipping across India? Reach out directly via WhatsApp or send us a message below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Direct Contact Methods */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* WhatsApp Quick Action Box */}
            <div className="p-6 bg-[#25D366]/10 border border-[#25D366]/30 rounded-lg space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#25D366] text-white rounded-full">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#191414]">
                    Direct WhatsApp
                  </h3>
                  <p className="text-xs text-[#7A7373]">Chat directly with founder Duha</p>
                </div>
              </div>

              <p className="text-xs text-[#4A4545] leading-relaxed">
                For rapid assistance with order inquiries, product dimensions, or delivery tracking:
              </p>

              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=Hi%20Duha,%20I'm%20reaching%20out%20from%20the%20MATILDA%20website!`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#25D366] text-white rounded text-xs uppercase tracking-wider font-bold hover:bg-[#1EBE5D] transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp (+91 95411 98330)</span>
              </a>
            </div>

            {/* Instagram Profile Box */}
            <div className="p-6 bg-[#FAF6F0] border border-[#EFE3D2] rounded-lg space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#3A080C] text-[#E4C98A] rounded-full">
                  <Instagram className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#3A080C]">
                    Instagram
                  </h3>
                  <p className="text-xs text-[#7A7373]">@matilldaaa._</p>
                </div>
              </div>

              <p className="text-xs text-[#4A4545] leading-relaxed">
                Follow our official channel for real customer stacks, new capsule releases, and styling inspiration.
              </p>

              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#3A080C] text-[#E4C98A] rounded text-xs uppercase tracking-wider font-semibold hover:bg-[#5A1118] transition-colors flex items-center justify-center gap-2"
              >
                <Instagram className="w-4 h-4" />
                <span>Visit @matilldaaa._</span>
              </a>
            </div>

            {/* Phone & Delivery Info */}
            <div className="p-5 bg-white rounded border border-[#EFE3D2] text-xs text-[#7A7373] space-y-2">
              <p className="flex items-center gap-2 text-[#3A080C] font-semibold">
                <Phone className="w-4 h-4 text-[#C8A15A]" />
                <span>Phone: +91 95411 98330</span>
              </p>
              <p className="text-[11px]">
                Operating hours: 10:00 AM – 8:00 PM IST (Mon–Sat)
              </p>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 bg-[#FAF6F0] rounded-lg border border-[#EFE3D2] shadow-sm">
              <h3 className="font-serif text-2xl font-bold text-[#3A080C] mb-2">
                Send an Inquiry
              </h3>
              <p className="text-xs text-[#7A7373] mb-6">
                Fill out the form below and we will respond via email or WhatsApp within 24 hours.
              </p>

              {sent ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center mx-auto">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <h4 className="font-serif text-xl text-[#3A080C] font-bold">Message Sent Gracefully</h4>
                  <p className="text-xs text-[#7A7373]">Thank you for writing to us. Duha will be in touch shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="uppercase tracking-wider font-semibold text-[#3A080C] block mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Meera Sharma"
                      className="w-full p-3 bg-white border border-[#EFE3D2] rounded focus:outline-none focus:border-[#C8A15A]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="uppercase tracking-wider font-semibold text-[#3A080C] block mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="meera@example.com"
                        className="w-full p-3 bg-white border border-[#EFE3D2] rounded focus:outline-none focus:border-[#C8A15A]"
                      />
                    </div>

                    <div>
                      <label className="uppercase tracking-wider font-semibold text-[#3A080C] block mb-1">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full p-3 bg-white border border-[#EFE3D2] rounded focus:outline-none focus:border-[#C8A15A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="uppercase tracking-wider font-semibold text-[#3A080C] block mb-1">
                      Message / Question *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Inquire about waist chain sizing, pendant chains, delivery timelines, or bulk orders..."
                      className="w-full p-3 bg-white border border-[#EFE3D2] rounded focus:outline-none focus:border-[#C8A15A]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#3A080C] text-[#E4C98A] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#5A1118] transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message to MATILDA</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
