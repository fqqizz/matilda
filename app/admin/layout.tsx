"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Layers,
  Settings,
  ExternalLink,
  Lock,
  LogOut,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check auth session via secure server endpoint
  useEffect(() => {
    let mounted = true;
    fetch("/api/admin/verify")
      .then((res) => res.json())
      .then((data) => {
        if (mounted) {
          setIsAuthenticated(Boolean(data.authenticated));
          setIsCheckingAuth(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setIsAuthenticated(false);
          setIsCheckingAuth(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setPassword("");
        setAuthError("");
      } else {
        setAuthError(data.error || "Invalid authentication credential.");
      }
    } catch {
      setAuthError("Failed to connect to authentication server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#1A0205] text-[#FFFDF9] flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#E4C98A] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-sm text-[#E4C98A]">Verifying Admin Authorization...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, render the secure Admin Auth Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1A0205] text-[#FFFDF9] flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-[#260407] border border-[#3A080C] rounded-sm p-8 shadow-2xl space-y-6">
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
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#E4C98A] font-medium">
              Administrative Portal
            </p>
            <p className="text-xs text-[#EFE3D2]/70 font-light">
              Enter your founder authentication key to access store management.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded text-center font-light">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[11px] uppercase tracking-[0.14em] text-[#EFE3D2] font-medium block mb-1.5">
                Authentication Key *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter secret key"
                className="w-full px-4 py-3 bg-[#1A0205] border border-[#3A080C] focus:border-[#C8A15A] rounded text-xs text-white placeholder-[#7A7373] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#C8A15A] text-[#1A0205] font-medium text-xs uppercase tracking-[0.16em] hover:bg-[#E4C98A] transition-all shadow-luxury flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Authenticating..." : "Authorize Access"}</span>
            </button>
          </form>
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
    <div className="min-h-screen bg-[#FAF6F0] text-[#191414] flex flex-col md:flex-row font-sans">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#1A0205] text-[#FFFDF9] border-r border-[#3A080C] shrink-0 flex flex-col justify-between p-5">
        <div className="space-y-6">
          
          {/* Brand Header */}
          <div className="border-b border-[#3A080C] pb-4">
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
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#E4C98A] font-medium">
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
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded text-xs uppercase tracking-[0.14em] font-medium transition-all ${
                    isActive
                      ? "bg-[#C8A15A] text-[#1A0205] shadow-xs font-semibold"
                      : "text-[#EFE3D2]/75 hover:bg-[#260407] hover:text-[#E4C98A]"
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
        <div className="pt-6 border-t border-[#3A080C] space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between text-xs text-[#EFE3D2]/80 hover:text-[#E4C98A] px-2 py-1.5 transition-colors font-light"
          >
            <span>View Live Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-xs text-red-300 hover:text-red-100 px-2 py-1.5 transition-colors font-light"
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
