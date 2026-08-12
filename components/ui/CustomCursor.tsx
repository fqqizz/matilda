"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  useEffect(() => {
    // Detect touch device or reduced motion preference
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setIsTouchDevice(true);
      return;
    }
    setIsTouchDevice(false);

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check if hovering an element with a data-cursor attribute
      const target = e.target as HTMLElement | null;
      const cursorElem = target?.closest("[data-cursor]") as HTMLElement | null;
      if (cursorElem) {
        setCursorText(cursorElem.getAttribute("data-cursor") || "");
      } else {
        setCursorText("");
      }
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", updateMousePosition, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible]);

  if (isTouchDevice || !isVisible || !cursorText) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed pointer-events-none z-[9998] flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
      }}
      transition={{
        type: "spring",
        damping: 28,
        stiffness: 350,
        mass: 0.5,
      }}
    >
      <div className="px-3 py-1.5 rounded-full bg-[#1A0205]/90 text-[#E4C98A] text-[9px] uppercase tracking-[0.25em] font-semibold backdrop-blur-md border border-[#C8A15A]/30 shadow-luxury flex items-center gap-1">
        {cursorText}
      </div>
    </motion.div>
  );
};
