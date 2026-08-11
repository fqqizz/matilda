"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/context/StoreContext";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Layers,
  Settings,
  Star,
  ExternalLink,
  Lock,
  LogOut,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");

  // Check auth session
  useEffect(() => {
    const isAuth = sessionStorage.getItem("matilda_admin_auth");
    if (isAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default master PIN for founder Duha: "1234" or "matilda2026"
    if (pin === "1234" || pin.toLowerCase() === "matilda2026" || pin === "admin") {
      sessionStorage.setItem("matilda_admin_auth", "true");
      setIsAuthenticated(true);
      setPinError("");
    } else {
      setPinError("Invalid Admin Passcode. Try default passcode: 1234");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("matilda_admin_auth");
    setIsAuthenticated(false);
  };

  // If not authenticated, render the secure Admin Auth Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#260407] text-[#FFFDF9] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#3A080C] border border-[#C8A15A]/40 rounded p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-36 mx-auto mb-2">
              <Image
                src="/images/matilda-logo-cream-transparent.png"
                alt="MATILDA"
                width={140}
                height={50}
                className="object-contain"
              />
            </div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#E4C98A] font-semibold">
              Owner Administration Portal
            </p>
            <p className="text-xs text-[#EFE3D2]/70">
              Welcome Duha Ajaz Pandith. Enter your passkey to manage catalogue, orders & inventory.
            </p>
          </div>

          {pinError && (
            <div className="p-3 bg-red-900/50 border border-red-500/50 text-red-200 text-xs rounded text-center">
              {pinError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-[#EFE3D2] font-semibold block mb-1">
                Admin Passcode *
              </label>
              <input
                type="password"
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter passcode (default: 1234)"
                className="w-full px-4 py-3 bg-[#260407] border border-[#5A1118] focus:border-[#C8A15A] rounded text-sm text-white placeholder-[#7A7373] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#C8A15A] text-[#260407] font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#E4C98A] transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Enter Admin Dashboard</span>
            </button>
          </form>

          <div className="pt-2 text-center text-[11px] text-[#EFE3D2]/50 border-t border-[#5A1118]">
            Default Founder Passcode: <strong className="text-[#E4C98A]">1234</strong>
          </div>
        </div>
      </div>
    );
  }

  const navLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products & Catalogue", icon: Package },
    { href: "/admin/orders", label: "Customer Orders", icon: ShoppingBag },
    { href: "/admin/inventory", label: "Stock & Inventory", icon: Layers },
    { href: "/admin/settings", label: "Store Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#191414] flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#260407] text-[#FFFDF9] border-r border-[#5A1118] shrink-0 flex flex-col justify-between p-5">
        <div className="space-y-6">
          
          {/* Brand Header */}
          <div className="border-b border-[#5A1118] pb-4">
            <Link href="/" className="block">
              <div className="w-32 mb-1">
                <Image
                  src="/images/matilda-logo-cream-transparent.png"
                  alt="MATILDA"
                  width={120}
                  height={45}
                  className="object-contain"
                />
              </div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#E4C98A] font-semibold">
                Admin Management
              </span>
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded text-xs uppercase tracking-wider font-semibold transition-all ${
                    isActive
                      ? "bg-[#C8A15A] text-[#260407] shadow-sm font-bold"
                      : "text-[#EFE3D2]/80 hover:bg-[#3A080C] hover:text-[#E4C98A]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-[#5A1118] space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between text-xs text-[#EFE3D2]/80 hover:text-[#E4C98A] px-2 py-1.5 transition-colors"
          >
            <span>View Live Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-xs text-red-300 hover:text-red-100 px-2 py-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Container */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
}
