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
  MapPin,
  MessageCircle,
  Printer,
  ArrowRight,
  ShieldCheck,
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
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 },
        colors: ["#C8A15A", "#1A0205", "#E4C98A", "#FAF6F0"],
      });
    } catch (e) {
      // ignore
    }
  }, []);

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20 bg-[#FFFDF9] font-sans">
        <h2 className="font-serif text-3xl text-[#1A0205] mb-2 font-normal">Order Not Found</h2>
        <p className="text-xs text-[#7A7373] max-w-sm mb-6 font-light">
          We could not locate order details for &quot;{orderId}&quot;.
        </p>
        <Link
          href="/shop"
          className="px-6 py-3 bg-[#1A0205] text-[#E4C98A] text-xs uppercase tracking-[0.14em] font-medium hover:bg-[#3A080C] transition-colors"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const steps = [
    { label: "Order Confirmed", date: "Today", completed: true },
    { label: "Hand-Packed in Pouch", date: "Within 24 Hours", completed: true },
    { label: "Dispatched (Insured Courier)", date: "Next Business Day", completed: order.status === "Shipped" || order.status === "Delivered" },
    { label: "Delivered Across India", date: order.estimatedDelivery, completed: order.status === "Delivered" },
  ];

  return (
    <div className="bg-[#FFFDF9] min-h-screen py-10 sm:py-16 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#FAF6F0] rounded-sm border border-[#EFE3D2] p-8 sm:p-12 text-center space-y-4 mb-10 shadow-xs"
        >
          <div className="w-12 h-12 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center mx-auto">
            <CheckCircle className="w-7 h-7" />
          </div>

          <span className="text-[9.5px] uppercase tracking-[0.18em] text-[#C8A15A] font-medium block">
            Thank You For Your Order
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#1A0205]">
            Order #{order.id} Confirmed
          </h1>

          <p className="text-xs sm:text-sm text-[#7A7373] max-w-lg mx-auto leading-relaxed font-light">
            A confirmation receipt has been sent to <strong>{order.customer.email}</strong>. Your pieces will be packaged in signature protective pouches and dispatched across India.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=Hi%20Duha,%20I%20just%20placed%20order%20${order.id}%20for%20₹${order.total}!`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white rounded text-xs uppercase tracking-[0.14em] font-medium hover:bg-[#1EBE5D] transition-colors shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Share Order on WhatsApp</span>
            </a>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-[#EFE3D2] text-[#1A0205] rounded text-xs uppercase tracking-[0.14em] font-medium hover:bg-[#FAF6F0] transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice Receipt</span>
            </button>
          </div>
        </motion.div>

        {/* Live Delivery Tracker */}
        <div className="bg-[#FAF6F0] rounded-sm border border-[#EFE3D2] p-6 sm:p-8 mb-10 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#EFE3D2] pb-3 gap-2">
            <div>
              <span className="text-[9.5px] uppercase tracking-[0.18em] text-[#C8A15A] font-medium">
                Tracking & Transit
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-normal text-[#1A0205]">
                Estimated Delivery: {order.estimatedDelivery}
              </h3>
            </div>
            <div className="text-xs text-[#7A7373] font-light">
              Courier Waybill: <strong className="text-[#1A0205] font-medium">{order.trackingNumber || "Pending Dispatch"}</strong>
            </div>
          </div>

          {/* Step Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
            {steps.map((st, i) => (
              <div key={i} className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-medium shrink-0 ${
                    st.completed
                      ? "bg-[#1A0205] text-[#E4C98A]"
                      : "bg-[#EFE3D2] text-[#7A7373]"
                  }`}
                >
                  {st.completed ? "✓" : i + 1}
                </div>
                <div>
                  <h4 className="font-medium text-xs text-[#1A0205]">{st.label}</h4>
                  <p className="text-[10px] text-[#7A7373] font-light">{st.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          
          {/* Shipping Address */}
          <div className="p-6 bg-[#FAF6F0] rounded-sm border border-[#EFE3D2] space-y-2 text-xs font-light">
            <h4 className="font-serif text-base font-normal text-[#1A0205] border-b border-[#EFE3D2] pb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C8A15A]" />
              <span>Shipping Destination</span>
            </h4>
            <p className="font-medium text-[#1A0205]">{order.shippingAddress.fullName}</p>
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
          <div className="p-6 bg-[#FAF6F0] rounded-sm border border-[#EFE3D2] space-y-2 text-xs font-light">
            <h4 className="font-serif text-base font-normal text-[#1A0205] border-b border-[#EFE3D2] pb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C8A15A]" />
              <span>Payment Details</span>
            </h4>
            <div className="flex justify-between text-[#4A4545]">
              <span>Payment Method:</span>
              <strong className="text-[#1A0205] font-medium">{order.paymentMethod}</strong>
            </div>
            <div className="flex justify-between text-[#4A4545]">
              <span>Payment Status:</span>
              <span className="text-[#25D366] font-medium bg-[#25D366]/10 px-2 py-0.5 rounded text-[10px]">
                {order.paymentStatus}
              </span>
            </div>
            <div className="flex justify-between text-[#4A4545]">
              <span>Transaction Ref:</span>
              <span className="font-mono text-[10px] text-[#7A7373]">{order.paymentTransactionId}</span>
            </div>
            <div className="flex justify-between font-sans text-sm font-medium text-[#1A0205] pt-2 border-t border-[#EFE3D2]">
              <span>Total Paid:</span>
              <span>{formatINR(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Ordered Items List */}
        <div className="p-6 sm:p-8 bg-[#FAF6F0] rounded-sm border border-[#EFE3D2] space-y-3 mb-10">
          <h3 className="font-serif text-lg font-normal text-[#1A0205] border-b border-[#EFE3D2] pb-2.5">
            Ordered Pieces ({order.items.length})
          </h3>

          <div className="divide-y divide-[#EFE3D2]">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-14 rounded bg-white overflow-hidden border border-[#EFE3D2] shrink-0">
                    <Image
                      src={item.productImage || "/images/golden-waist-chain.png"}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h5 className="font-serif text-sm font-medium text-[#1A0205]">{item.productName}</h5>
                    {item.selectedVariant && (
                      <p className="text-[11px] text-[#7A7373] font-light">
                        {Object.entries(item.selectedVariant).map(([k, v]) => `${k}: ${v}`).join(", ")}
                      </p>
                    )}
                    <p className="text-xs text-[#7A7373] font-light">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-[#1A0205]">
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
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#1A0205] text-[#E4C98A] text-xs uppercase tracking-[0.14em] font-medium hover:bg-[#3A080C] transition-colors shadow-luxury"
          >
            <span>Continue Exploring MATILDA</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
