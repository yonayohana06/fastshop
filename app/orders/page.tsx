"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Package,
  ArrowRight,
  Upload,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { getOrdersApi } from "@/lib/api/orders";
import { Order } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { PaymentUploadModal } from "@/components/orders/payment-upload-modal";

const STATUS_TABS: { label: string; value: string }[] = [
  { label: "Semua", value: "ALL" },
  { label: "Menunggu Pembayaran", value: "PENDING" },
  { label: "Diproses", value: "PROCESSING" },
  { label: "Dikirim", value: "SHIPPED" },
  { label: "Selesai", value: "COMPLETED" },
  { label: "Dibatalkan", value: "CANCELLED" },
];

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return dateStr;
  }
}

function OrdersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token, isAuthenticated, isLoading: authLoading } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [manualUploadOrder, setManualUploadOrder] = useState<Order | null>(null);
  const [hasDismissedAutoUpload, setHasDismissedAutoUpload] = useState(false);

  const checkoutSuccess = searchParams.get("checkout_success") === "1";
  const newOrderId = searchParams.get("new_order_id");

  // Load orders
  const fetchOrders = useCallback(() => {
    if (!token) return;
    getOrdersApi(undefined, token)
      .then((res) => {
        if (res.data) {
          setOrders(res.data);
        }
      })
      .catch((err) => {
        console.warn("Gagal memuat daftar pesanan:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [token]);

  // Auth guard
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/orders");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchOrders();
    }
  }, [isAuthenticated, token, fetchOrders]);

  // Declarative target for payment upload (manual click or initial auto open)
  const autoUploadTarget =
    !hasDismissedAutoUpload && newOrderId
      ? orders.find(
          (o) =>
            String(o.order_id || o.id) === String(newOrderId) &&
            (o.status || "").toUpperCase() === "PENDING"
        ) || null
      : null;

  const selectedOrderForUpload = manualUploadOrder || autoUploadTarget;

  if (authLoading || (!isAuthenticated && authLoading)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Filter orders by active tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "ALL") return true;
    return (order.status || "").toUpperCase() === activeTab;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Beranda", href: "/" },
          { label: "Riwayat Pesanan" },
        ]}
      />

      {/* Success Notification if redirected from checkout */}
      {checkoutSuccess && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-900 shadow-sm animate-fadeIn">
          <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
          <div className="flex-1">
            <h3 className="font-bold text-sm">Pesanan Anda Berhasil Dibuat!</h3>
            <p className="mt-0.5 text-xs text-emerald-700">
              Silakan lakukan transfer sesuai total tagihan pesanan Anda dan unggah
              foto bukti transfer agar segera diproses.
            </p>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            Riwayat Pesanan
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Pantau status transaksi, unggah bukti bayar, dan cek riwayat belanja Anda.
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 self-start rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors shadow-sm"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Belanja Lagi</span>
        </Link>
      </div>

      {/* Status Filter Tabs */}
      <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {STATUS_TABS.map((tab) => {
          const isActive = activeTab === tab.value;
          const count =
            tab.value === "ALL"
              ? orders.length
              : orders.filter((o) => (o.status || "").toUpperCase() === tab.value).length;

          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`shrink-0 rounded-xl px-4 py-2 text-xs font-semibold transition-colors flex items-center gap-2 ${
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-neutral-100 text-neutral-700"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders List Container */}
      <div className="mt-6 space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 w-full animate-pulse rounded-2xl border border-neutral-200 bg-neutral-100"
              />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          /* Empty State */
          <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 mb-4">
              <Package className="h-8 w-8" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">
              Belum Ada Pesanan
            </h3>
            <p className="mt-1 text-sm text-neutral-500 max-w-sm mx-auto">
              {activeTab === "ALL"
                ? "Anda belum pernah melakukan pemesanan apapun. Temukan produk terbaik kami sekarang!"
                : `Tidak ada pesanan dengan status "${STATUS_TABS.find((t) => t.value === activeTab)?.label}".`}
            </p>
            <div className="mt-6">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1f5c4e] transition-colors"
              >
                <span>Mulai Belanja</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Orders Cards */
          filteredOrders.map((order) => {
            const orderId = order.order_id || order.id || "";
            const isPending = (order.status || "").toUpperCase() === "PENDING";
            const itemsList = order.items || [];
            const firstItem = itemsList[0];
            const remainingCount = itemsList.length - 1;

            return (
              <div
                key={orderId}
                className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Order Card Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-100">
                  <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-neutral-600">
                    <span className="font-bold text-neutral-900">
                      #{orderId}
                    </span>
                    <span className="text-neutral-300">•</span>
                    <span>{formatDate(order.created_at)}</span>
                  </div>
                  <OrderStatusBadge status={order.status} size="sm" />
                </div>

                {/* Order Item Preview */}
                <div className="py-4">
                  {firstItem ? (
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
                        {firstItem.product_image ? (
                          <Image
                            src={firstItem.product_image}
                            alt={firstItem.product_name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-neutral-400">
                            <Package className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-bold text-neutral-900">
                          {firstItem.product_name}
                        </h4>
                        <p className="mt-0.5 text-xs text-neutral-500">
                          {firstItem.quantity} barang x{" "}
                          {formatRupiah(firstItem.price_at_purchase)}
                        </p>
                        {remainingCount > 0 && (
                          <p className="mt-1 text-xs text-neutral-500 font-medium">
                            +{remainingCount} produk lainnya
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <Package className="h-4 w-4" />
                      <span>{order.total_items || 1} produk pesanan</span>
                    </div>
                  )}

                  {/* Shipping Address snippet */}
                  {order.shipping_address && (
                    <p className="mt-3 text-xs text-neutral-500 line-clamp-1 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-200">
                      <span className="font-semibold text-neutral-700">Tujuan: </span>
                      {order.shipping_address}
                    </p>
                  )}
                </div>

                {/* Order Card Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-neutral-100">
                  <div>
                    <span className="text-xs text-neutral-500">Total Belanja:</span>
                    <p className="text-base sm:text-lg font-bold text-neutral-900">
                      {formatRupiah(order.total_amount)}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* If PENDING, show Unggah Bukti Bayar */}
                    {isPending && (
                      <button
                        type="button"
                        onClick={() => setManualUploadOrder(order)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#1f5c4e] transition-colors"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Unggah Bukti Bayar</span>
                      </button>
                    )}

                    {/* If payment proof already exists */}
                    {order.payment_proof_url && (
                      <a
                        href={order.payment_proof_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>Lihat Bukti</span>
                      </a>
                    )}

                    {/* Detail Order Link */}
                    <Link
                      href={`/orders/${orderId}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      <span>Detail Pesanan</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Payment Upload Modal */}
      {selectedOrderForUpload && (
        <PaymentUploadModal
          isOpen={true}
          orderId={selectedOrderForUpload.order_id || selectedOrderForUpload.id || ""}
          orderTotal={selectedOrderForUpload.total_amount}
          onClose={() => {
            setManualUploadOrder(null);
            setHasDismissedAutoUpload(true);
          }}
          onSuccess={() => {
            setManualUploadOrder(null);
            setHasDismissedAutoUpload(true);
            fetchOrders();
          }}
        />
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <OrdersContent />
    </Suspense>
  );
}
