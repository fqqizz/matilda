"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/lib/context/StoreContext";
import { formatINR } from "@/lib/utils";
import {
  Package,
  ShoppingBag,
  IndianRupee,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Truck,
  Star,
  CheckCircle,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { products, orders, categories } = useStore();

  // Purely real computed metrics (zero fake numbers)
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const totalProductsCount = products.length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  const pendingOrders = orders.filter((o) => o.status === "Pending" || o.status === "Processing");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE3D2] pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C8A15A] font-bold">
            Live Analytics
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#3A080C]">
            Admin Dashboard
          </h1>
        </div>

        <div className="flex gap-3">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#3A080C] text-[#E4C98A] text-xs uppercase tracking-wider font-semibold rounded hover:bg-[#5A1118] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Piece</span>
          </Link>
        </div>
      </div>

      {/* Real Computed KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Real Revenue */}
        <div className="p-5 bg-white rounded border border-[#EFE3D2] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#7A7373] text-xs">
            <span>Verified Revenue</span>
            <div className="p-2 rounded bg-[#FAF6F0] text-[#3A080C]">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#3A080C]">
            {totalOrdersCount > 0 ? formatINR(totalRevenue) : "₹0"}
          </div>
          <p className="text-[11px] text-[#7A7373]">
            {totalOrdersCount > 0
              ? `From ${totalOrdersCount} verified ${totalOrdersCount === 1 ? "order" : "orders"}`
              : "No orders yet"}
          </p>
        </div>

        {/* Total Orders */}
        <div className="p-5 bg-white rounded border border-[#EFE3D2] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#7A7373] text-xs">
            <span>Total Orders</span>
            <div className="p-2 rounded bg-[#FAF6F0] text-[#3A080C]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#3A080C]">
            {totalOrdersCount}
          </div>
          <p className="text-[11px] text-[#7A7373]">
            {pendingOrders.length} pending fulfillment
          </p>
        </div>

        {/* Active Products */}
        <div className="p-5 bg-white rounded border border-[#EFE3D2] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#7A7373] text-xs">
            <span>Catalogue Items</span>
            <div className="p-2 rounded bg-[#FAF6F0] text-[#3A080C]">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#3A080C]">
            {totalProductsCount}
          </div>
          <p className="text-[11px] text-[#7A7373]">
            Across {categories.length} verified categories
          </p>
        </div>

        {/* Low Stock Alerts */}
        <div className="p-5 bg-white rounded border border-[#EFE3D2] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#7A7373] text-xs">
            <span>Inventory Status</span>
            <div className="p-2 rounded bg-amber-50 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#3A080C]">
            {lowStockCount + outOfStockCount}
          </div>
          <p className="text-[11px] text-amber-700 font-medium">
            {lowStockCount} low stock, {outOfStockCount} out of stock
          </p>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="p-6 bg-white rounded border border-[#EFE3D2] space-y-4">
        <div className="flex items-center justify-between border-b border-[#EFE3D2] pb-3">
          <h2 className="font-serif text-lg font-bold text-[#3A080C]">
            Recent Customer Orders
          </h2>
          <Link
            href="/admin/orders"
            className="text-xs uppercase tracking-wider font-semibold text-[#3A080C] hover:text-[#C8A15A] flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="py-12 text-center text-[#7A7373] space-y-2">
            <ShoppingBag className="w-8 h-8 text-[#C8A15A] mx-auto" />
            <p className="font-serif text-base text-[#3A080C]">No orders placed yet</p>
            <p className="text-xs">
              When a customer completes checkout, their order details and shipping address will appear here instantly.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EFE3D2] text-[#7A7373] uppercase tracking-wider text-[10px]">
                  <th className="pb-2">Order ID</th>
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Items</th>
                  <th className="pb-2">Total Amount</th>
                  <th className="pb-2">Payment</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F7F1E8]">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF6F0]">
                    <td className="py-3 font-semibold text-[#3A080C]">{order.id}</td>
                    <td className="py-3">
                      <div>
                        <p className="font-medium text-[#191414]">{order.customer.fullName}</p>
                        <p className="text-[10px] text-[#7A7373]">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                      </div>
                    </td>
                    <td className="py-3">{order.items.length} pieces</td>
                    <td className="py-3 font-bold text-[#3A080C]">{formatINR(order.total)}</td>
                    <td className="py-3">
                      <span className="bg-[#25D366]/10 text-[#25D366] px-2 py-0.5 rounded text-[10px] font-semibold">
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="bg-[#3A080C]/10 text-[#3A080C] px-2 py-0.5 rounded text-[10px] font-semibold">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href="/admin/orders"
                        className="text-[#C8A15A] hover:underline font-semibold"
                      >
                        Manage →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
