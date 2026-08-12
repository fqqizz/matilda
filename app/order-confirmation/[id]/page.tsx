"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useStore } from "@/lib/context/StoreContext";
import { formatINR } from "@/lib/utils";
import confetti from "canvas-confetti";
import {
  CheckCircle,
  Package,
  Truck,
  MapPin,
  MessageCircle,
  Printer,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const { orders, settings } = useStore();

  const order = orders.find((o) => o.id === orderId);

  useEffect(() => {
    // Fire subtle celebration confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#C8A15A", "#3A080C", "#E4C98A", "#FAF6F0"],
      });
    } catch (e) {
      // ignore
    }
  }, []);

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20 bg-[#FFFDF9]">
        <h2 className="font-serif text-3xl text-[#3A080C] mb-2">Order Not Found</h2>
        <p className="text-xs text-[#7A7373] max-w-sm mb-6">
          We could not locate order details for &quot;{orderId}&quot;.
        </p>
        <Link
          href="/shop"
          className="px-8 py-3 bg-[#3A080C] text-[#E4C98A] text-xs uppercase tracking-widest font-semibold hover:bg-[#5A1118] transition-colors"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const steps = [
    { label: "Order Confirmed", date: "Today", completed: true },
    { label: "Hand-Packed in Velvet", date: "Within 24 Hours", completed: true },
    { label: "Dispatched (Insured Courier)", date: "Next Business Day", completed: order.status === "Shipped" || order.status === "Delivered" },
    { label: "Delivered Across India", date: order.estimatedDelivery, completed: order.status === "Delivered" },
  ];

  return (
    <div className="bg-[#FFFDF9] min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#FAF6F0] rounded-lg border border-[#EFE3D2] p-8 sm:p-12 text-center space-y-4 mb-10 shadow-sm"
        >
          <div className="w-16 h-16 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center mx-auto">
            <CheckCircle className="w-9 h-9" />
          </div>

          <span className="text-xs uppercase tracking-[0.3em] text-[#C8A15A] font-bold block">
            Thank You For Your Order
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#3A080C]">
            Order #{order.id} Confirmed
          </h1>

          <p className="text-xs sm:text-sm text-[#7A7373] max-w-lg mx-auto leading-relaxed">
            A confirmation receipt has been generated for <strong>{order.customer.email}</strong>. Your pieces will be carefully packaged in signature MATILDA velvet pouches and dispatched across India.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=Hi%20Duha,%20I%20just%20placed%20order%20${order.id}%20for%20₹${order.total}!`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded text-xs uppercase tracking-wider font-semibold hover:bg-[#1EBE5D] transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Share Order on WhatsApp</span>
            </a>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-[#EFE3D2] text-[#3A080C] rounded text-xs uppercase tracking-wider font-semibold hover:bg-[#FAF6F0] transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice Receipt</span>
            </button>
          </div>
        </motion.div>

        {/* Live Delivery Tracker */}
        <div className="bg-[#FAF6F0] rounded-sm border border-[#EFE3D2] p-6 sm:p-8 mb-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#EFE3D2] pb-4 gap-2">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#C8A15A] font-bold">
                Tracking & Transit
              </span>
              <h3 className="font-serif text-xl font-bold text-[#3A080C]">
                Estimated Delivery: {order.estimatedDelivery}
              </h3>
            </div>
            <div className="text-xs text-[#7A7373]">
              Courier Waybill: <strong className="text-[#3A080C]">{order.trackingNumber}</strong>
            </div>
          </div>

          {/* Step Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
            {steps.map((st, i) => (
              <div key={i} className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    st.completed
                      ? "bg-[#3A080C] text-[#E4C98A]"
                      : "bg-[#EFE3D2] text-[#7A7373]"
                  }`}
                >
                  {st.completed ? "✓" : i + 1}
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-[#3A080C]">{st.label}</h4>
                  <p className="text-[10px] text-[#7A7373]">{st.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          
          {/* Shipping Address */}
          <div className="p-6 bg-[#FAF6F0] rounded-sm border border-[#EFE3D2] space-y-3 text-xs">
            <h4 className="font-serif text-base font-bold text-[#3A080C] border-b border-[#EFE3D2] pb-2 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#C8A15A]" />
              <span>Shipping Destination</span>
            </h4>
            <p className="font-bold text-[#3A080C]">{order.shippingAddress.fullName}</p>
            <p className="text-[#4A4545]">{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.landmark && (
              <p className="text-[#7A7373]">Landmark: {order.shippingAddress.landmark}</p>
            )}
            <p className="text-[#4A4545]">
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}
            </p>
            <p className="text-[#7A7373] pt-1">Phone: {order.shippingAddress.phone}</p>
          </div>

          {/* Payment Info */}
          <div className="p-6 bg-[#FAF6F0] rounded-sm border border-[#EFE3D2] space-y-3 text-xs">
            <h4 className="font-serif text-base font-bold text-[#3A080C] border-b border-[#EFE3D2] pb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#C8A15A]" />
              <span>Payment Details</span>
            </h4>
            <div className="flex justify-between text-[#4A4545]">
              <span>Payment Method:</span>
              <strong className="text-[#3A080C]">{order.paymentMethod}</strong>
            </div>
            <div className="flex justify-between text-[#4A4545]">
              <span>Payment Status:</span>
              <span className="text-[#25D366] font-bold bg-[#25D366]/10 px-2 py-0.5 rounded">
                {order.paymentStatus}
              </span>
            </div>
            <div className="flex justify-between text-[#4A4545]">
              <span>Transaction Ref:</span>
              <span className="font-mono text-[11px] text-[#7A7373]">{order.paymentTransactionId}</span>
            </div>
            <div className="flex justify-between font-serif text-sm font-bold text-[#3A080C] pt-2 border-t border-[#EFE3D2]">
              <span>Total Paid:</span>
              <span>{formatINR(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Ordered Items List */}
        <div className="p-6 sm:p-8 bg-[#FAF6F0] rounded-sm border border-[#EFE3D2] space-y-4 mb-12">
          <h3 className="font-serif text-lg font-bold text-[#3A080C] border-b border-[#EFE3D2] pb-3">
            Ordered Pieces ({order.items.length})
          </h3>

          <div className="divide-y divide-[#EFE3D2]">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded bg-white overflow-hidden border border-[#EFE3D2] shrink-0">
                    <Image
                      src={item.productImage || "/images/golden-waist-chain.png"}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h5 className="font-serif text-sm font-bold text-[#3A080C]">{item.productName}</h5>
                    {item.selectedVariant && (
                      <p className="text-[11px] text-[#7A7373]">
                        {Object.entries(item.selectedVariant).map(([k, v]) => `${k}: ${v}`).join(", ")}
                      </p>
                    )}
                    <p className="text-xs text-[#7A7373]">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#3A080C]">
                  {formatINR(item.totalPrice)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Return to Shop CTA */}
        <div className="text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#3A080C] text-[#E4C98A] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#5A1118] transition-colors shadow-md"
          >
            <span>Continue Exploring MATILDA</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
