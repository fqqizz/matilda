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
  CheckCircle,
  CreditCard,
  Smartphone,
  Building,
  Lock,
  ArrowRight,
  ArrowLeft,
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
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20 bg-[#FFFDF9]">
        <h2 className="font-serif text-3xl text-[#3A080C] mb-2">Your Bag is Empty</h2>
        <p className="text-xs text-[#7A7373] max-w-sm mb-6">
          Please add items to your shopping bag before proceeding to checkout.
        </p>
        <Link
          href="/shop"
          className="px-8 py-3 bg-[#3A080C] text-[#E4C98A] text-xs uppercase tracking-widest font-semibold hover:bg-[#5A1118] transition-colors"
        >
          Explore Collection
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
    <div className="bg-[#FFFDF9] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Step Progress Header */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#7A7373]">
            <span className={step >= 1 ? "text-[#3A080C]" : ""}>1. Contact</span>
            <span>—</span>
            <span className={step >= 2 ? "text-[#3A080C]" : ""}>2. Address</span>
            <span>—</span>
            <span className={step >= 3 ? "text-[#3A080C]" : ""}>3. Summary</span>
            <span>—</span>
            <span className={step >= 4 ? "text-[#3A080C]" : ""}>4. Payment</span>
          </div>
          <div className="w-full h-1 bg-[#EFE3D2] rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-[#3A080C] transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Form Area */}
          <div className="lg:col-span-7 space-y-6">
            
            {errorMsg && (
              <div className="p-4 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
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
                  <span className="text-[10px] uppercase tracking-widest text-[#C8A15A] font-bold">
                    Step 01
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#3A080C]">
                    Customer Information
                  </h2>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Full Name — full width */}
                  <div>
                    <label className="uppercase tracking-wider font-semibold text-[#3A080C] block mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.fullName}
                      onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                      placeholder="e.g. Ayesha Khan"
                      className="w-full px-3.5 py-3 bg-white border border-[#EFE3D2] rounded text-xs text-[#191414] focus:outline-none focus:border-[#C8A15A] focus:ring-1 focus:ring-[#C8A15A]/20"
                    />
                  </div>

                  {/* Email + Phone — perfectly identical 2-column grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="uppercase tracking-wider font-semibold text-[#3A080C] block mb-1.5">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={customer.email}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full px-3.5 py-3 bg-white border border-[#EFE3D2] rounded text-xs text-[#191414] focus:outline-none focus:border-[#C8A15A] focus:ring-1 focus:ring-[#C8A15A]/20"
                      />
                    </div>

                    <div>
                      <label className="uppercase tracking-wider font-semibold text-[#3A080C] block mb-1.5">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-3 bg-white border border-[#EFE3D2] rounded text-xs text-[#191414] focus:outline-none focus:border-[#C8A15A] focus:ring-1 focus:ring-[#C8A15A]/20"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#3A080C] text-[#E4C98A] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#5A1118] transition-all flex items-center justify-center gap-2 shadow-md mt-4"
                >
                  <span>Continue to Shipping Address</span>
                  <ArrowRight className="w-4 h-4" />
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
                    <span className="text-[10px] uppercase tracking-widest text-[#C8A15A] font-bold">
                      Step 02
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-[#3A080C]">
                      Shipping Address (India)
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-[#7A7373] hover:text-[#3A080C] underline"
                  >
                    Edit Contact
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="uppercase tracking-wider font-semibold text-[#3A080C] block mb-1">
                      Street Address & Flat / House / Apt No. *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.addressLine1}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })
                      }
                      placeholder="e.g. Flat 402, Rosewood Heights, Linking Road"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#EFE3D2] rounded text-xs text-[#191414] focus:outline-none focus:border-[#C8A15A]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="uppercase tracking-wider font-semibold text-[#3A080C] block mb-1">
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
                        className="w-full px-3.5 py-2.5 bg-white border border-[#EFE3D2] rounded text-xs text-[#191414] focus:outline-none focus:border-[#C8A15A]"
                      />
                    </div>

                    <div>
                      <label className="uppercase tracking-wider font-semibold text-[#3A080C] block mb-1">
                        State / Union Territory *
                      </label>
                      <select
                        value={shippingAddress.state}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, state: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-white border border-[#EFE3D2] rounded text-xs text-[#191414] focus:outline-none focus:border-[#C8A15A]"
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
                      <label className="uppercase tracking-wider font-semibold text-[#3A080C] block mb-1">
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
                        className="w-full px-3.5 py-2.5 bg-white border border-[#EFE3D2] rounded text-xs text-[#191414] focus:outline-none focus:border-[#C8A15A]"
                      />
                    </div>

                    <div>
                      <label className="uppercase tracking-wider font-semibold text-[#3A080C] block mb-1">
                        Nearby Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.landmark}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, landmark: e.target.value })
                        }
                        placeholder="Near Bandra Post Office"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#EFE3D2] rounded text-xs text-[#191414] focus:outline-none focus:border-[#C8A15A]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-3.5 border border-[#EFE3D2] text-[#3A080C] text-xs uppercase tracking-wider font-semibold hover:bg-white"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 bg-[#3A080C] text-[#E4C98A] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#5A1118] transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    <span>Review Order Summary</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.form>
            )}

            {/* STEP 3: Order Summary & Review */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 sm:p-8 bg-[#FAF6F0] rounded-sm border border-[#EFE3D2] space-y-6"
              >
                <div className="border-b border-[#EFE3D2] pb-3">
                  <span className="text-[10px] uppercase tracking-widest text-[#C8A15A] font-bold">
                    Step 03
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#3A080C]">
                    Review Your Order
                  </h2>
                </div>

                {/* Recipient info summary */}
                <div className="p-4 bg-white rounded border border-[#EFE3D2] space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-[#3A080C]">{customer.fullName}</h4>
                      <p className="text-[#7A7373]">{customer.phone} • {customer.email}</p>
                      <p className="text-[#4A4545] mt-1">
                        {shippingAddress.addressLine1}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pinCode}
                      </p>
                    </div>
                    <button
                      onClick={() => setStep(2)}
                      className="text-[#C8A15A] hover:underline font-semibold text-[11px]"
                    >
                      Change
                    </button>
                  </div>
                </div>

                {/* Items in order */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-[#3A080C]">
                    Selected Pieces ({cart.length})
                  </h4>
                  <div className="divide-y divide-[#EFE3D2] bg-white rounded border border-[#EFE3D2] p-4">
                    {cart.map((item, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded bg-[#FAF6F0] overflow-hidden border border-[#EFE3D2] shrink-0">
                            <Image
                              src={item.product.images[0] || "/images/golden-waist-chain.png"}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-serif text-xs font-bold text-[#3A080C]">{item.product.name}</p>
                            <p className="text-[11px] text-[#7A7373]">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-[#3A080C]">
                          {formatINR(item.unitPrice * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-3.5 border border-[#EFE3D2] text-[#3A080C] text-xs uppercase tracking-wider font-semibold hover:bg-white"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    className="flex-1 py-3.5 bg-[#3A080C] text-[#E4C98A] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#5A1118] transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Razorpay Isolated Payment Gate */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 sm:p-8 bg-[#FAF6F0] rounded-sm border border-[#EFE3D2] space-y-6"
              >
                <div className="border-b border-[#EFE3D2] pb-3">
                  <span className="text-[10px] uppercase tracking-widest text-[#C8A15A] font-bold">
                    Step 04
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#3A080C]">
                    Payment Gateway
                  </h2>
                </div>

                {/* Razorpay Integration Notice */}
                <div className="p-4 bg-[#3A080C] text-[#FFFDF9] rounded space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-semibold text-[#E4C98A]">
                    <Lock className="w-4 h-4" />
                    <span>Isolated Razorpay Architecture (Test Mode Active)</span>
                  </div>
                  <p className="text-[#EFE3D2]/80 leading-relaxed text-[11px]">
                    This checkout is connected to the isolated Razorpay architecture. In test mode, you can simulate instantaneous card, UPI, or NetBanking verification without real charges.
                  </p>
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#3A080C] block">
                    Choose Payment Option:
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("Razorpay (Cards / UPI / NetBanking)")}
                      className={`p-4 rounded border text-left flex items-start gap-3 transition-all ${
                        paymentMethod.includes("Razorpay")
                          ? "border-[#3A080C] bg-white shadow-sm"
                          : "border-[#EFE3D2] bg-white/50 text-[#7A7373]"
                      }`}
                    >
                      <Smartphone className="w-5 h-5 text-[#C8A15A] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-xs text-[#3A080C]">
                          Razorpay (UPI / Cards)
                        </p>
                        <p className="text-[11px] text-[#7A7373]">
                          GPay, PhonePe, Paytm, Visa, Mastercard, RuPay
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("Cash on Delivery (COD)")}
                      className={`p-4 rounded border text-left flex items-start gap-3 transition-all ${
                        paymentMethod.includes("COD")
                          ? "border-[#3A080C] bg-white shadow-sm"
                          : "border-[#EFE3D2] bg-white/50 text-[#7A7373]"
                      }`}
                    >
                      <Truck className="w-5 h-5 text-[#C8A15A] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-xs text-[#3A080C]">
                          Cash on Delivery (COD)
                        </p>
                        <p className="text-[11px] text-[#7A7373]">
                          Pay cash to courier upon doorstep delivery
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* If Razorpay selected: show mock tabs */}
                {paymentMethod.includes("Razorpay") && (
                  <div className="p-4 bg-white rounded border border-[#EFE3D2] space-y-4">
                    <div className="flex border-b border-[#EFE3D2] text-xs">
                      <button
                        type="button"
                        onClick={() => setPaymentTab("upi")}
                        className={`pb-2 px-3 font-semibold ${
                          paymentTab === "upi"
                            ? "border-b-2 border-[#3A080C] text-[#3A080C]"
                            : "text-[#7A7373]"
                        }`}
                      >
                        UPI QR / App
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentTab("card")}
                        className={`pb-2 px-3 font-semibold ${
                          paymentTab === "card"
                            ? "border-b-2 border-[#3A080C] text-[#3A080C]"
                            : "text-[#7A7373]"
                        }`}
                      >
                        Debit / Credit Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentTab("netbanking")}
                        className={`pb-2 px-3 font-semibold ${
                          paymentTab === "netbanking"
                            ? "border-b-2 border-[#3A080C] text-[#3A080C]"
                            : "text-[#7A7373]"
                        }`}
                      >
                        NetBanking
                      </button>
                    </div>

                    {paymentTab === "upi" && (
                      <div className="space-y-2 text-xs">
                        <label className="text-[11px] text-[#7A7373] block">
                          Enter UPI ID (e.g. name@okhdfcbank or 9876543210@paytm):
                        </label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="matilda@upi"
                          className="w-full px-3 py-2 border border-[#EFE3D2] rounded text-xs focus:outline-none focus:border-[#C8A15A]"
                        />
                      </div>
                    )}

                    {paymentTab === "card" && (
                      <div className="space-y-2 text-xs">
                        <input
                          type="text"
                          disabled
                          value="•••• •••• •••• 4242 (Simulated Test Card)"
                          className="w-full px-3 py-2 bg-gray-50 border border-[#EFE3D2] rounded text-xs text-[#7A7373]"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            disabled
                            value="12/28"
                            className="w-1/2 px-3 py-2 bg-gray-50 border border-[#EFE3D2] rounded text-xs text-[#7A7373]"
                          />
                          <input
                            type="text"
                            disabled
                            value="•••"
                            className="w-1/2 px-3 py-2 bg-gray-50 border border-[#EFE3D2] rounded text-xs text-[#7A7373]"
                          />
                        </div>
                      </div>
                    )}

                    {paymentTab === "netbanking" && (
                      <div className="text-xs text-[#7A7373]">
                        Simulated direct gateway integration with HDFC, ICICI, SBI, Axis, Kotak.
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-6 py-3.5 border border-[#EFE3D2] text-[#3A080C] text-xs uppercase tracking-wider font-semibold hover:bg-white"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleProcessPayment}
                    disabled={isProcessing}
                    className="flex-1 py-4 bg-[#3A080C] text-[#E4C98A] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#5A1118] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#E4C98A] border-t-transparent rounded-full animate-spin" />
                        <span>Verifying & Generating Order...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Pay {formatINR(cartTotal)} & Confirm Order</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-[#FAF6F0] rounded-sm border border-[#EFE3D2] space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#3A080C] border-b border-[#EFE3D2] pb-3">
                Order Breakdown
              </h3>

              <div className="space-y-2.5 text-xs text-[#4A4545]">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-[#3A080C]">{formatINR(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery across India</span>
                  <span>
                    {shippingFee === 0 ? (
                      <strong className="text-[#25D366]">FREE</strong>
                    ) : (
                      formatINR(shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-serif font-bold text-[#3A080C] pt-3 border-t border-[#EFE3D2]">
                  <span>Total Amount</span>
                  <span>{formatINR(cartTotal)}</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-[#7A7373] space-y-2 border-t border-[#EFE3D2]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#C8A15A]" />
                  <span>GST & Pan-India taxes included</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#C8A15A]" />
                  <span>Delivery in 3–6 business days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
