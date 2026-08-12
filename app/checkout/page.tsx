"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/context/StoreContext";
import { ShippingAddress } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Smartphone,
  Building,
  Lock,
  ArrowRight,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi NCR", "Jammu and Kashmir",
  "Ladakh", "Chandigarh", "Puducherry"
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSubtotal, shippingFee, cartTotal, createOrder, settings } = useStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [customer, setCustomer] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "Delhi NCR",
    pinCode: "",
    landmark: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<
    "Razorpay (Cards / UPI / NetBanking)" | "Cash on Delivery (COD)"
  >("Razorpay (Cards / UPI / NetBanking)");

  const [paymentTab, setPaymentTab] = useState<"upi" | "card" | "netbanking">("upi");
  const [upiId, setUpiId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20 bg-[#FFFDF9] font-sans">
        <h2 className="font-serif text-3xl text-[#1A0205] mb-2 font-normal">Your Bag is Empty</h2>
        <p className="text-xs text-[#7A7373] max-w-sm mb-6 font-light">
          Please add items to your shopping bag before proceeding to checkout.
        </p>
        <Link
          href="/shop"
          className="px-6 py-3 bg-[#1A0205] text-[#E4C98A] text-xs uppercase tracking-[0.14em] font-medium hover:bg-[#3A080C] transition-colors"
        >
          Explore Pieces
        </Link>
      </div>
    );
  }

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.fullName || !customer.email || !customer.phone) {
      setErrorMsg("Please fill in all contact fields.");
      return;
    }
    setShippingAddress((prev) => ({
      ...prev,
      fullName: customer.fullName,
      email: customer.email,
      phone: customer.phone,
    }));
    setErrorMsg("");
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !shippingAddress.addressLine1 ||
      !shippingAddress.city ||
      !shippingAddress.pinCode ||
      shippingAddress.pinCode.length < 6
    ) {
      setErrorMsg("Please enter a valid street address, city, and 6-digit Indian PIN code.");
      return;
    }
    setErrorMsg("");
    setStep(3);
  };

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    setErrorMsg("");

    // Simulate isolated gateway verification latency
    setTimeout(() => {
      try {
        const order = createOrder({
          customer,
          shippingAddress,
          paymentMethod,
          paymentTransactionId: `rzp_pay_${Date.now()}`,
        });

        setIsProcessing(false);
        router.push(`/order-confirmation/${order.id}`);
      } catch (e) {
        setIsProcessing(false);
        setErrorMsg("Failed to place order. Please check details and try again.");
      }
    }, 1400);
  };

  return (
    <div className="bg-[#FFFDF9] min-h-screen py-10 sm:py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Step Progress Header */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.14em] text-[#7A7373]">
            <span className={step >= 1 ? "text-[#1A0205]" : ""}>1. Contact</span>
            <span>—</span>
            <span className={step >= 2 ? "text-[#1A0205]" : ""}>2. Address</span>
            <span>—</span>
            <span className={step >= 3 ? "text-[#1A0205]" : ""}>3. Summary</span>
            <span>—</span>
            <span className={step >= 4 ? "text-[#1A0205]" : ""}>4. Payment</span>
          </div>
          <div className="w-full h-1 bg-[#EFE3D2] rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-[#1A0205] transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Form Area */}
          <div className="lg:col-span-7 space-y-6">
            
            {errorMsg && (
              <div className="p-3.5 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* STEP 1: Customer Details */}
            {step === 1 && (
              <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleStep1Submit}
                className="p-6 sm:p-8 bg-[#FAF6F0] rounded-sm border border-[#EFE3D2] space-y-4"
              >
                <div className="border-b border-[#EFE3D2] pb-3">
                  <span className="text-[9.5px] uppercase tracking-[0.18em] text-[#C8A15A] font-medium">
                    Step 01
                  </span>
                  <h2 className="font-serif text-2xl font-normal text-[#1A0205]">
                    Customer Information
                  </h2>
                </div>

                <div className="space-y-3.5 text-xs">
                  {/* Full Name */}
                  <div>
                    <label className="uppercase tracking-[0.12em] font-medium text-[#1A0205] block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.fullName}
                      onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                      placeholder="e.g. Ayesha Khan"
                      className="w-full px-3 py-2.5 bg-white border border-[#EFE3D2] rounded text-xs text-[#191414] focus:outline-none focus:border-[#C8A15A]"
                    />
                  </div>

                  {/* Email + Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="uppercase tracking-[0.12em] font-medium text-[#1A0205] block mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={customer.email}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full px-3 py-2.5 bg-white border border-[#EFE3D2] rounded text-xs text-[#191414] focus:outline-none focus:border-[#C8A15A]"
                      />
                    </div>

                    <div>
                      <label className="uppercase tracking-[0.12em] font-medium text-[#1A0205] block mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2.5 bg-white border border-[#EFE3D2] rounded text-xs text-[#191414] focus:outline-none focus:border-[#C8A15A]"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#1A0205] text-[#E4C98A] text-xs uppercase tracking-[0.16em] font-medium hover:bg-[#3A080C] transition-all flex items-center justify-center gap-2 shadow-luxury mt-4"
                >
                  <span>Continue to Shipping Address</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.form>
            )}

            {/* STEP 2: Shipping Address */}
            {step === 2 && (
              <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleStep2Submit}
                className="p-6 sm:p-8 bg-[#FAF6F0] rounded-sm border border-[#EFE3D2] space-y-4"
              >
                <div className="border-b border-[#EFE3D2] pb-3 flex justify-between items-center">
                  <div>
                    <span className="text-[9.5px] uppercase tracking-[0.18em] text-[#C8A15A] font-medium">
                      Step 02
                    </span>
                    <h2 className="font-serif text-2xl font-normal text-[#1A0205]">
                      Shipping Address (India)
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-[#7A7373] hover:text-[#1A0205] underline font-light"
                  >
                    Edit Contact
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="uppercase tracking-[0.12em] font-medium text-[#1A0205] block mb-1">
                      Street Address & Flat / House No. *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.addressLine1}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })
                      }
                      placeholder="e.g. Flat 402, Rosewood Heights, Linking Road"
                      className="w-full px-3 py-2 bg-white border border-[#EFE3D2] rounded text-xs text-[#191414] focus:outline-none focus:border-[#C8A15A]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="uppercase tracking-[0.12em] font-medium text-[#1A0205] block mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.city}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, city: e.target.value })
                        }
                        placeholder="e.g. Mumbai"
                        className="w-full px-3 py-2 bg-white border border-[#EFE3D2] rounded text-xs text-[#191414] focus:outline-none focus:border-[#C8A15A]"
                      />
                    </div>

                    <div>
                      <label className="uppercase tracking-[0.12em] font-medium text-[#1A0205] block mb-1">
                        State / Union Territory *
                      </label>
                      <select
                        value={shippingAddress.state}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, state: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-white border border-[#EFE3D2] rounded text-xs text-[#191414] focus:outline-none focus:border-[#C8A15A]"
                      >
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="uppercase tracking-[0.12em] font-medium text-[#1A0205] block mb-1">
                        6-Digit PIN Code *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={shippingAddress.pinCode}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            pinCode: e.target.value.replace(/\D/g, ""),
                          })
                        }
                        placeholder="e.g. 400050"
                        className="w-full px-3 py-2 bg-white border border-[#EFE3D2] rounded text-xs text-[#191414] focus:outline-none focus:border-[#C8A15A]"
                      />
                    </div>

                    <div>
                      <label className="uppercase tracking-[0.12em] font-medium text-[#1A0205] block mb-1">
                        Nearby Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.landmark}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, landmark: e.target.value })
                        }
                        placeholder="Near Bandra Post Office"
                        className="w-full px-3 py-2 bg-white border border-[#EFE3D2] rounded text-xs text-[#191414] focus:outline-none focus:border-[#C8A15A]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2.5 pt-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-3 border border-[#EFE3D2] text-[#1A0205] text-xs uppercase tracking-[0.12em] font-medium hover:bg-white"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#1A0205] text-[#E4C98A] text-xs uppercase tracking-[0.16em] font-medium hover:bg-[#3A080C] transition-all flex items-center justify-center gap-2 shadow-luxury"
                  >
                    <span>Review Order</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.form>
            )}

            {/* STEP 3: Order Summary & Review */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 sm:p-8 bg-[#FAF6F0] rounded-sm border border-[#EFE3D2] space-y-5"
              >
                <div className="border-b border-[#EFE3D2] pb-3">
                  <span className="text-[9.5px] uppercase tracking-[0.18em] text-[#C8A15A] font-medium">
                    Step 03
                  </span>
                  <h2 className="font-serif text-2xl font-normal text-[#1A0205]">
                    Review Your Order
                  </h2>
                </div>

                {/* Recipient info summary */}
                <div className="p-4 bg-white rounded border border-[#EFE3D2] space-y-1.5 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-[#1A0205]">{customer.fullName}</h4>
                      <p className="text-[#7A7373]">{customer.phone} • {customer.email}</p>
                      <p className="text-[#4A4545] mt-0.5">
                        {shippingAddress.addressLine1}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pinCode}
                      </p>
                    </div>
                    <button
                      onClick={() => setStep(2)}
                      className="text-[#C8A15A] hover:underline font-medium text-[11px]"
                    >
                      Change
                    </button>
                  </div>
                </div>

                {/* Items in order */}
                <div className="space-y-2">
                  <h4 className="text-xs uppercase tracking-[0.12em] font-medium text-[#1A0205]">
                    Selected Pieces ({cart.length})
                  </h4>
                  <div className="divide-y divide-[#EFE3D2] bg-white rounded border border-[#EFE3D2] p-4">
                    {cart.map((item, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-14 rounded bg-[#FAF6F0] overflow-hidden border border-[#EFE3D2] shrink-0">
                            <Image
                              src={item.product.images[0] || "/images/golden-waist-chain.png"}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-serif text-sm font-medium text-[#1A0205]">{item.product.name}</p>
                            <p className="text-[11px] text-[#7A7373] font-light">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="text-xs font-medium text-[#1A0205]">
                          {formatINR(item.unitPrice * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-5 py-3 border border-[#EFE3D2] text-[#1A0205] text-xs uppercase tracking-[0.12em] font-medium hover:bg-white"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="flex-1 py-3 bg-[#1A0205] text-[#E4C98A] text-xs uppercase tracking-[0.16em] font-medium hover:bg-[#3A080C] transition-all flex items-center justify-center gap-2 shadow-luxury"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Payment Method Selection */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 sm:p-8 bg-[#FAF6F0] rounded-sm border border-[#EFE3D2] space-y-5"
              >
                <div className="border-b border-[#EFE3D2] pb-3 flex justify-between items-center">
                  <div>
                    <span className="text-[9.5px] uppercase tracking-[0.18em] text-[#C8A15A] font-medium">
                      Step 04
                    </span>
                    <h2 className="font-serif text-2xl font-normal text-[#1A0205]">
                      Payment & Authorization
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="text-xs text-[#7A7373] hover:text-[#1A0205] underline font-light"
                  >
                    Back
                  </button>
                </div>

                {/* Payment Options */}
                <div className="space-y-3">
                  <label
                    onClick={() => setPaymentMethod("Razorpay (Cards / UPI / NetBanking)")}
                    className={`flex items-start gap-3 p-4 rounded border cursor-pointer transition-all ${
                      paymentMethod.includes("Razorpay")
                        ? "border-[#1A0205] bg-white shadow-xs"
                        : "border-[#EFE3D2] bg-white/60 hover:bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod.includes("Razorpay")}
                      onChange={() => {}}
                      className="mt-1 accent-[#1A0205]"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-xs text-[#1A0205]">
                          Online Payment (UPI, Cards, NetBanking)
                        </span>
                        <span className="bg-[#25D366]/10 text-[#25D366] text-[9.5px] font-medium px-2 py-0.5 rounded">
                          Recommended
                        </span>
                      </div>
                      <p className="text-[11px] text-[#7A7373] font-light">
                        Instant confirmation with UPI (GPay, PhonePe, Paytm), Visa, Mastercard, RuPay.
                      </p>
                    </div>
                  </label>

                  <label
                    onClick={() => setPaymentMethod("Cash on Delivery (COD)")}
                    className={`flex items-start gap-3 p-4 rounded border cursor-pointer transition-all ${
                      paymentMethod.includes("COD")
                        ? "border-[#1A0205] bg-white shadow-xs"
                        : "border-[#EFE3D2] bg-white/60 hover:bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod.includes("COD")}
                      onChange={() => {}}
                      className="mt-1 accent-[#1A0205]"
                    />
                    <div className="space-y-1">
                      <span className="font-medium text-xs text-[#1A0205]">
                        Cash on Delivery (COD)
                      </span>
                      <p className="text-[11px] text-[#7A7373] font-light">
                        Pay cash or scan QR at the time of doorstep delivery.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleProcessPayment}
                    disabled={isProcessing}
                    className="w-full py-4 bg-[#C8A15A] text-[#1A0205] text-xs uppercase tracking-[0.18em] font-semibold hover:bg-[#E4C98A] transition-all flex items-center justify-center gap-2 shadow-luxury disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <span>Verifying & Securing Order...</span>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Place Order • {formatINR(cartTotal)}</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column: Order Summary Sidebar */}
          <div className="lg:col-span-5">
            <div className="p-6 bg-[#FAF6F0] rounded-sm border border-[#EFE3D2] space-y-4 sticky top-28">
              <h3 className="font-serif text-xl font-normal text-[#1A0205] border-b border-[#EFE3D2] pb-3">
                Order Breakdown
              </h3>

              <div className="space-y-3">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-10 h-12 rounded bg-white overflow-hidden border border-[#EFE3D2] shrink-0">
                        <Image
                          src={item.product.images[0] || "/images/golden-waist-chain.png"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-serif font-medium text-xs text-[#1A0205] line-clamp-1">{item.product.name}</p>
                        <p className="text-[10px] text-[#7A7373] font-light">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-medium text-[#1A0205]">
                      {formatINR(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#EFE3D2] pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-[#7A7373] font-light">
                  <span>Subtotal</span>
                  <span>{formatINR(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-[#7A7373] font-light">
                  <span>Shipping Fee</span>
                  <span>
                    {shippingFee === 0 ? (
                      <strong className="text-[#25D366] font-medium">Free</strong>
                    ) : (
                      formatINR(shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between font-sans text-base font-medium text-[#1A0205] pt-2 border-t border-[#EFE3D2]">
                  <span>Total Amount</span>
                  <span>{formatINR(cartTotal)}</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-[#7A7373] space-y-1.5 font-light">
                <div className="flex items-center gap-1.5 text-[#1A0205]">
                  <Truck className="w-3.5 h-3.5 text-[#C8A15A]" />
                  <span>Pan-India Courier (3–6 Days)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#1A0205]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C8A15A]" />
                  <span>Signature protective packaging included</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
