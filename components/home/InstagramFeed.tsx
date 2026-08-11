"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useStore } from "@/lib/context/StoreContext";
import { Instagram, ExternalLink, Heart, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InstaPost {
  id: string;
  image: string;
  caption: string;
  priceTag?: string;
  likes: number;
}

export const InstagramFeed = () => {
  const { settings } = useStore();
  const [selectedPost, setSelectedPost] = useState<InstaPost | null>(null);

  const posts: InstaPost[] = [
    {
      id: "post-1",
      image: "/images/instagram-enamel-bangles.png",
      caption: "Broad enamel bangles. 229/- each. Crafted with fine, lustrous enamel detailing & gold leaf floral patterns.",
      priceTag: "₹229",
      likes: 184,
    },
    {
      id: "post-2",
      image: "/images/instagram-men-bracelet.png",
      caption: "MATILDA MEN. Bracelet. 159/- Distinctive floral cross motifs, polished silver finish, durable chain construction.",
      priceTag: "₹159",
      likes: 142,
    },
    {
      id: "post-3",
      image: "/images/gothic-star-pendant.png",
      caption: "Gothic star pendant on detachable cord. The staple neckpiece for your everyday era. 159/-",
      priceTag: "₹159",
      likes: 219,
    },
    {
      id: "post-4",
      image: "/images/golden-waist-chain.png",
      caption: "Golden waist chain with XXS–XXL full length extender. 199/- Delivery across India.",
      priceTag: "₹199",
      likes: 310,
    },
    {
      id: "post-5",
      image: "/images/keepsake-heart-pendant.png",
      caption: "Keepsake heart pendant. Small 149/- Large 179/-. Vintage romance in fine silver tone.",
      priceTag: "₹149",
      likes: 267,
    },
    {
      id: "post-6",
      image: "/images/tulip-gemstone-bracelet.png",
      caption: "Tulip gemstone vine bracelet with U-clasp & pastel crystals. 259/-",
      priceTag: "₹259",
      likes: 195,
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#FAF6F0] text-[#191414] border-b border-[#EFE3D2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFDF9] border border-[#C8A15A]/30 text-[#3A080C] text-[11px] uppercase tracking-[0.2em] font-semibold">
            <Instagram className="w-3.5 h-3.5 text-[#C8A15A]" />
            <span>As Seen on Instagram</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3A080C]">
            Follow <span className="text-[#5A1118]">@matilldaaa._</span>
          </h2>

          <p className="text-xs sm:text-sm text-[#7A7373] leading-relaxed">
            Tag us in your everyday silhouettes to be featured on our editorial feed.
          </p>

          <a
            href={settings.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#3A080C] hover:text-[#C8A15A] tracking-wider uppercase pt-1 transition-colors"
          >
            <span>Visit Instagram Profile</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Instagram Visual Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {posts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              onClick={() => setSelectedPost(post)}
              className="group relative aspect-square bg-[#260407] rounded-sm overflow-hidden border border-[#EFE3D2] cursor-pointer shadow-sm hover:border-[#C8A15A] transition-all"
            >
              <Image
                src={post.image}
                alt="Instagram post"
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover transition-transform duration-500 group-hover:scale-108"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-[#260407]/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 text-[#FFFDF9]">
                <div className="flex justify-between items-center text-[10px] text-[#E4C98A]">
                  <span className="font-semibold">{post.priceTag}</span>
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-[#E4C98A]" />
                    <span>{post.likes}</span>
                  </div>
                </div>

                <div className="text-center">
                  <Instagram className="w-5 h-5 text-[#E4C98A] mx-auto mb-1" />
                  <span className="text-[9px] uppercase tracking-widest text-[#EFE3D2]">View Post</span>
                </div>

                <div className="text-[8px] tracking-wider text-[#E4C98A]/70 truncate">
                  @matilldaaa._
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Instagram Post Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPost(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-xl bg-[#FFFDF9] rounded shadow-2xl border border-[#EFE3D2] overflow-hidden grid grid-cols-1 sm:grid-cols-2"
            >
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-white/80 text-[#3A080C] hover:bg-[#3A080C] hover:text-[#E4C98A]"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative aspect-square sm:aspect-auto bg-[#260407]">
                <Image
                  src={selectedPost.image}
                  alt="Post preview"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-[#EFE3D2] pb-3">
                    <div className="w-8 h-8 rounded-full bg-[#3A080C] text-[#E4C98A] flex items-center justify-center font-serif font-bold text-xs">
                      M
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs text-[#3A080C]">@matilldaaa._</h4>
                      <p className="text-[10px] text-[#7A7373]">MATILDA by Duha</p>
                    </div>
                  </div>

                  <p className="text-xs text-[#4A4545] leading-relaxed">
                    {selectedPost.caption}
                  </p>

                  {selectedPost.priceTag && (
                    <div className="inline-block px-2.5 py-1 bg-[#FAF6F0] border border-[#C8A15A]/30 rounded text-xs font-bold text-[#3A080C]">
                      Price: {selectedPost.priceTag}
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-3 border-t border-[#EFE3D2]">
                  <a
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-[#3A080C] text-[#E4C98A] text-xs uppercase tracking-wider font-semibold hover:bg-[#5A1118] transition-colors flex items-center justify-center gap-2"
                  >
                    <Instagram className="w-4 h-4" />
                    <span>Open on Instagram</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
