import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[78vh] flex flex-col items-center justify-center text-center px-4 py-20 bg-[#FFFDF9] text-[#191414]">
      <div className="max-w-md space-y-5">
        <span className="text-[10px] uppercase tracking-[0.35em] text-[#C8A15A] font-medium block">
          404 • Not Found
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#1A0205] leading-tight">
          Lost a little? <br />
          <span className="italic font-light text-[#3A080C]">The piece you&apos;re looking for isn&apos;t here.</span>
        </h1>
        <p className="text-xs text-[#7A7373] font-light leading-relaxed max-w-xs mx-auto">
          Explore our complete collection of everyday silhouettes and signature pieces.
        </p>
        <div className="pt-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#1A0205] text-[#E4C98A] text-xs uppercase tracking-[0.22em] font-semibold hover:bg-[#3A080C] transition-all shadow-luxury"
          >
            <span>Back to MATILDA</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
