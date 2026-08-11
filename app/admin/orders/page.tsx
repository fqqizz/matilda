"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useStore } from "@/lib/context/StoreContext";
import { Order } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import {
  ShoppingBag,
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  Search,
  ChevronDown,
  X,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, settings } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.shippingAddress.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    updateOrderStatus(orderId, newStatus);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handleTrackingUpdate = (orderId: string, tracking: string) => {
    updateOrderStatus(orderId, selectedOrder?.status || "Processing", tracking);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, trackingNumber: tracking });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE3D2] pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C8A15A] font-bold">
            Fulfillment & Shipping
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#3A080C]">
            Customer Orders ({orders.length})
          </h1>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#7A7373] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, name, city..."
            className="pl-8 pr-3 py-2 bg-white border border-[#EFE3D2] rounded text-xs text-[#191414] focus:outline-none focus:border-[#C8A15A] w-64"
          />
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="py-16 text-center bg-white rounded border border-[#EFE3D2] p-8 space-y-3">
          <ShoppingBag className="w-10 h-10 text-[#C8A15A] mx-auto stroke-1" />
          <h3 className="font-serif text-xl text-[#3A080C]">No customer orders yet</h3>
          <p className="text-xs text-[#7A7373] max-w-sm mx-auto">
            When customer orders are confirmed on the website, they will appear here with full shipping details, phone numbers, and payment status.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded border border-[#EFE3D2] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EFE3D2] bg-[#FAF6F0] text-[#7A7373] uppercase tracking-wider text-[10px]">
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Destination</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F7F1E8]">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF6F0]">
                    <td className="p-3 font-semibold text-[#3A080C]">{order.id}</td>
                    <td className="p-3">
                      <div>
                        <p className="font-semibold text-[#191414]">{order.customer.fullName}</p>
                        <p className="text-[10px] text-[#7A7373]">{order.customer.phone}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-[#4A4545]">{order.shippingAddress.city}, {order.shippingAddress.state}</span>
                    </td>
                    <td className="p-3 font-bold text-[#3A080C]">{formatINR(order.total)}</td>
                    <td className="p-3">
                      <span className="bg-[#25D366]/10 text-[#25D366] px-2 py-0.5 rounded text-[10px] font-semibold">
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order["status"])}
                        className="bg-[#FAF6F0] border border-[#EFE3D2] rounded text-xs font-medium text-[#3A080C] px-2 py-1 focus:outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1 bg-[#3A080C] text-[#E4C98A] text-[11px] font-semibold rounded hover:bg-[#5A1118] transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-2xl bg-[#FFFDF9] rounded shadow-2xl border border-[#EFE3D2] p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6"
            >
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-4 right-4 p-1.5 text-[#3A080C] hover:text-[#5A1118]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="border-b border-[#EFE3D2] pb-4 flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#C8A15A] font-bold">
                    Order Details
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#3A080C]">
                    #{selectedOrder.id}
                  </h2>
                  <p className="text-xs text-[#7A7373]">
                    Placed on {new Date(selectedOrder.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-serif text-2xl font-bold text-[#3A080C] block">
                    {formatINR(selectedOrder.total)}
                  </span>
                  <span className="bg-[#25D366]/10 text-[#25D366] text-[10px] font-bold px-2 py-0.5 rounded">
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Customer & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-[#FAF6F0] rounded border border-[#EFE3D2] space-y-1.5">
                  <h4 className="font-bold text-[#3A080C]">Customer Details</h4>
                  <p className="font-medium text-[#191414]">{selectedOrder.customer.fullName}</p>
                  <p className="text-[#7A7373]">Email: {selectedOrder.customer.email}</p>
                  <p className="text-[#7A7373]">Phone: {selectedOrder.customer.phone}</p>
                  <div className="pt-2">
                    <a
                      href={`https://wa.me/${selectedOrder.customer.phone.replace(/\D/g, "")}?text=Hi%20${encodeURIComponent(selectedOrder.customer.fullName)},%20this%20is%20Duha%20from%20MATILDA%20regarding%20order%20${selectedOrder.id}!`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] text-[#25D366] font-semibold hover:underline"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Customer</span>
                    </a>
                  </div>
                </div>

                <div className="p-4 bg-[#FAF6F0] rounded border border-[#EFE3D2] space-y-1.5">
                  <h4 className="font-bold text-[#3A080C]">Shipping Address</h4>
                  <p className="text-[#4A4545]">{selectedOrder.shippingAddress.addressLine1}</p>
                  {selectedOrder.shippingAddress.landmark && (
                    <p className="text-[#7A7373]">Near: {selectedOrder.shippingAddress.landmark}</p>
                  )}
                  <p className="text-[#4A4545]">
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pinCode}
                  </p>
                </div>
              </div>

              {/* Status and Tracking Number Updater */}
              <div className="p-4 bg-white rounded border border-[#EFE3D2] space-y-3 text-xs">
                <h4 className="font-bold text-[#3A080C]">Courier & Status Updates</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-semibold text-[#7A7373] block mb-1">
                      Fulfillment Status
                    </label>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as Order["status"])}
                      className="w-full p-2 bg-[#FAF6F0] border border-[#EFE3D2] rounded text-xs text-[#3A080C] font-semibold"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-semibold text-[#7A7373] block mb-1">
                      Tracking / Waybill No.
                    </label>
                    <input
                      type="text"
                      value={selectedOrder.trackingNumber || ""}
                      onChange={(e) => handleTrackingUpdate(selectedOrder.id, e.target.value)}
                      placeholder="e.g. EXP84920IN"
                      className="w-full p-2 bg-[#FAF6F0] border border-[#EFE3D2] rounded text-xs text-[#3A080C]"
                    />
                  </div>
                </div>
              </div>

              {/* Itemized list */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#3A080C]">
                  Ordered Items ({selectedOrder.items.length})
                </h4>
                <div className="divide-y divide-[#EFE3D2] border border-[#EFE3D2] rounded p-4 bg-[#FAF6F0]">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="py-2.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded bg-white overflow-hidden shrink-0 border border-[#EFE3D2]">
                          <Image
                            src={item.productImage}
                            alt={item.productName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-[#3A080C]">{item.productName}</p>
                          {item.selectedVariant && (
                            <p className="text-[11px] text-[#7A7373]">
                              {Object.entries(item.selectedVariant).map(([k, v]) => `${k}: ${v}`).join(", ")}
                            </p>
                          )}
                          <p className="text-[11px] text-[#7A7373]">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-[#3A080C]">{formatINR(item.totalPrice)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
