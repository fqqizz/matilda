"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/context/StoreContext";
import { MessageCircle, Instagram, Phone, CheckCircle, Send } from "lucide-react";

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
    <div className="bg-[#FFFDF9] text-[#191414] min-h-screen py-16 sm:py-24 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#C8A15A] font-medium block">
            Client Concierge
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#1A0205]">
            Get In Touch
          </h1>
          <p className="font-serif italic text-lg sm:text-xl text-[#3A080C]">
            MATILDA by Duha Ajaz Pandith
          </p>
          <p className="text-xs sm:text-sm text-[#7A7373] max-w-md mx-auto leading-relaxed font-light pt-1">
            Questions about custom sizing, styling advice, or pan-India delivery? Reach out directly via WhatsApp or send us an inquiry below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Left Column: Direct Contact Channels */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* WhatsApp Quick Action Box */}
            <div className="p-6 bg-[#25D366]/10 border border-[#25D366]/30 rounded-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#25D366] text-white rounded-full">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium text-[#1A0205]">
                    Direct WhatsApp
                  </h3>
                  <p className="text-xs text-[#7A7373] font-light">Chat directly with founder Duha</p>
                </div>
              </div>

              <p className="text-xs text-[#4A4545] leading-relaxed font-light">
                For prompt styling guidance, sizing queries, or order tracking:
              </p>

              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=Hi%20Duha,%20I'm%20reaching%20out%20from%20the%20MATILDA%20website!`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#25D366] text-white text-xs uppercase tracking-[0.14em] font-medium hover:bg-[#1EBE5D] transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp (+91 95411 98330)</span>
              </a>
            </div>

            {/* Instagram Profile Box */}
            <div className="p-6 bg-[#FAF6F0] border border-[#EFE3D2] rounded-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#1A0205] text-[#E4C98A] rounded-full">
                  <Instagram className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium text-[#1A0205]">
                    Instagram
                  </h3>
                  <p className="text-xs text-[#7A7373] font-light">@matilldaaa._</p>
                </div>
              </div>

              <p className="text-xs text-[#4A4545] leading-relaxed font-light">
                Follow our official feed for customer stacks and new capsule announcements.
              </p>

              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#1A0205] text-[#E4C98A] text-xs uppercase tracking-[0.14em] font-medium hover:bg-[#3A080C] transition-colors flex items-center justify-center gap-2"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Visit @matilldaaa._</span>
              </a>
            </div>

            {/* Phone & Operating Hours */}
            <div className="p-4 bg-white rounded-sm border border-[#EFE3D2] text-xs text-[#7A7373] space-y-1 font-light">
              <p className="flex items-center gap-2 text-[#1A0205] font-medium">
                <Phone className="w-3.5 h-3.5 text-[#C8A15A]" />
                <span>Phone: +91 95411 98330</span>
              </p>
              <p className="text-[11px]">
                Operating hours: 10:00 AM – 8:00 PM IST (Mon–Sat)
              </p>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 bg-[#FAF6F0] rounded-sm border border-[#EFE3D2] shadow-xs">
              <h3 className="font-serif text-2xl font-normal text-[#1A0205] mb-1">
                Send an Inquiry
              </h3>
              <p className="text-xs text-[#7A7373] mb-6 font-light">
                Leave a message and we will respond via WhatsApp or email within 24 hours.
              </p>

              {sent ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-xl text-[#1A0205] font-normal">Message Received</h4>
                  <p className="text-xs text-[#7A7373] font-light">Thank you for writing to us. Duha will be in touch shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="uppercase tracking-[0.12em] font-medium text-[#1A0205] block mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Meera Sharma"
                      className="w-full p-3 bg-white border border-[#EFE3D2] rounded text-xs text-[#191414] focus:outline-none focus:border-[#C8A15A]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="uppercase tracking-[0.12em] font-medium text-[#1A0205] block mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="meera@example.com"
                        className="w-full p-3 bg-white border border-[#EFE3D2] rounded text-xs text-[#191414] focus:outline-none focus:border-[#C8A15A]"
                      />
                    </div>

                    <div>
                      <label className="uppercase tracking-[0.12em] font-medium text-[#1A0205] block mb-1.5">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full p-3 bg-white border border-[#EFE3D2] rounded text-xs text-[#191414] focus:outline-none focus:border-[#C8A15A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="uppercase tracking-[0.12em] font-medium text-[#1A0205] block mb-1.5">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Inquire about waist chain sizing, pendant chains, delivery timelines, or bulk orders..."
                      className="w-full p-3 bg-white border border-[#EFE3D2] rounded text-xs text-[#191414] focus:outline-none focus:border-[#C8A15A]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#1A0205] text-[#E4C98A] text-xs uppercase tracking-[0.16em] font-medium hover:bg-[#3A080C] transition-all shadow-luxury flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Inquiry to MATILDA</span>
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
