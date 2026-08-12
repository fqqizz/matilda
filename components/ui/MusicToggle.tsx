"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const MusicToggle = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setIsMounted(true);
    // Restore session preference if user explicitly enabled it previously in session
    const saved = sessionStorage.getItem("matilda_sound_enabled");
    if (saved === "true" && audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Browser prevented autoplay before user interaction
          setIsPlaying(false);
        });
    }
  }, []);

  const toggleSound = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      sessionStorage.setItem("matilda_sound_enabled", "false");
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          sessionStorage.setItem("matilda_sound_enabled", "true");
        })
        .catch((err) => {
          console.error("Audio playback error:", err);
          setIsPlaying(false);
        });
    }
  };

  if (!isMounted) return null;

  return (
    <>
      {/* Hidden Loop Audio Element */}
      <audio
        ref={audioRef}
        src="/audio/music.mp3"
        loop
        preload="metadata"
      />

      {/* Floating Subtle Sound Button (Bottom-Left Corner) */}
      <div className="fixed bottom-6 left-6 z-40 font-sans select-none">
        <button
          onClick={toggleSound}
          aria-label={isPlaying ? "Mute ambient background music" : "Play ambient MATILDA music"}
          className={`group flex items-center gap-2.5 px-3.5 py-2 rounded-full border transition-all duration-300 shadow-luxury backdrop-blur-md ${
            isPlaying
              ? "bg-[#1A0205]/95 border-[#C8A15A]/60 text-[#E4C98A]"
              : "bg-[#1A0205]/85 border-[#3A080C] text-[#EFE3D2]/70 hover:text-[#E4C98A] hover:border-[#C8A15A]/40"
          }`}
        >
          {/* Animated Equalizer Waveform Bars or Muted Speaker */}
          <div className="flex items-center gap-[2.5px] h-3.5 w-3.5 justify-center">
            {isPlaying ? (
              <>
                <motion.span
                  animate={{ height: ["4px", "14px", "6px", "12px", "4px"] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                  className="w-[2px] bg-[#E4C98A] rounded-full"
                />
                <motion.span
                  animate={{ height: ["8px", "4px", "14px", "6px", "8px"] }}
                  transition={{ repeat: Infinity, duration: 1.0, ease: "easeInOut", delay: 0.15 }}
                  className="w-[2px] bg-[#E4C98A] rounded-full"
                />
                <motion.span
                  animate={{ height: ["12px", "6px", "4px", "14px", "12px"] }}
                  transition={{ repeat: Infinity, duration: 1.3, ease: "easeInOut", delay: 0.3 }}
                  className="w-[2px] bg-[#E4C98A] rounded-full"
                />
              </>
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-[#EFE3D2]/60 group-hover:text-[#E4C98A] transition-colors" />
            )}
          </div>

          {/* Quiet Luxury Text Label */}
          <span className="text-[9.5px] uppercase tracking-[0.18em] font-medium transition-colors">
            {isPlaying ? "Sound • ON" : "Sound • OFF"}
          </span>
        </button>
      </div>
    </>
  );
};
