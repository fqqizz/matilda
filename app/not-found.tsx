import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 py-20 bg-[#FFFDF9] text-[#191414]">
      <div className="max-w-md space-y-4">
        <span className="text-xs uppercase tracking-[0.3em] text-[#C8A15A] font-bold">
          404 • Page Not Found
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#3A080C]">
          Lost in Our Silhouettes?
        </h1>
        <p className="text-xs sm:text-sm text-[#7A7373] leading-relaxed">
          The page you are looking for might have been moved or does not exist. Discover our full collection of timeless jewellery.
        </p>
        <div className="pt-2">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#3A080C] text-[#E4C98A] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#5A1118] transition-colors shadow-md"
          >
            <span>Return to Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
