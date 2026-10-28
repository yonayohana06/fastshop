"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Package,
  Calendar,
  MapPin,
  CreditCard,
  Upload,
  ExternalLink,
  ChevronLeft,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { getOrderByIdApi } from "@/lib/api/orders";
import { Order } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { PaymentUploadModal } from "@/components/orders/payment-upload-modal";

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

const BANK_ACCOUNTS = [
  { bank: "BCA", number: "8730123456", name: "PT FastShop Indonesia" },
  { bank: "Mandiri", number: "1370098765432", name: "PT FastShop Indonesia" },
  { bank: "BRI", number: "020601000123300", name: "PT FastShop Indonesia" },
];

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = (params?.id as string) || "";

  const { token, isAuthenticated, isLoading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  const fetchOrderDetail = useCallback(() => {
    if (!token || !orderId) return;

    getOrderByIdApi(orderId, token)
      .then((res) => {
        if (res.data) {
          setOrder(res.data);
        }
      })
      .catch((err: unknown) => {
        const msg =
          err instanceof Error
            ? err.message
            : "Gagal memuat rincian pesanan.";
        setErrorMessage(msg);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [token, orderId]);

  // Auth guard
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/login?redirect=/orders/${orderId}`);
    }
  }, [authLoading, isAuthenticated, router, orderId]);

  useEffect(() => {
    if (isAuthenticated && token && orderId) {
      fetchOrderDetail();
    }
  }, [isAuthenticated, token, orderId, fetchOrderDetail]);

  const handleCopyAccount = (bank: string, number: string) => {
    navigator.clipboard.writeText(number);
    setCopiedBank(bank);
    setTimeout(() => {
      setCopiedBank(null);
    }, 2000);
  };

  if (authLoading || (!isAuthenticated && authLoading)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Beranda", href: "/" },
          { label: "Riwayat Pesanan", href: "/orders" },
          { label: `Pesanan #${orderId}` },
        ]}
      />

      {/* Back button */}
      <div className="mt-4">
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Kembali ke Riwayat Pesanan</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="mt-6 space-y-6">
          <div className="h-28 w-full animate-pulse rounded-2xl border border-neutral-200 bg-neutral-100" />
          <div className="h-64 w-full animate-pulse rounded-2xl border border-neutral-200 bg-neutral-100" />
        </div>
      ) : errorMessage || !order ? (
        /* Error / Not Found State */
        <div className="mt-8 rounded-2xl border border-red-200 bg-white p-12 text-center shadow-sm max-w-xl mx-auto">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600 mb-4">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h2 className="text-lg font-bold text-neutral-900">
            Pesanan Tidak Ditemukan
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            {errorMessage ||
              "Data pesanan tidak dapat ditemukan atau Anda tidak memiliki akses ke pesanan ini."}
          </p>
          <div className="mt-6">
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1f5c4e] transition-colors"
            >
              <span>Kembali ke Pesanan Saya</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Order Detail Content */
        <div className="mt-6 space-y-8">
          {/* Header Card */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">
                    Pesanan #{orderId}
                  </h1>
                  <OrderStatusBadge status={order.status} size="md" />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Dipesan: {formatDate(order.created_at)}</span>
                  </div>
                  {order.updated_at && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Diperbarui: {formatDate(order.updated_at)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Proof Action if PENDING */}
              {(order.status || "").toUpperCase() === "PENDING" && (
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#1f5c4e] transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  <span>Unggah Bukti Bayar</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left Column: Produk, Alamat & Bukti Bayar */}
            <div className="space-y-6 lg:col-span-8">
              {/* 1. Item Produk yang Dibeli */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <h2 className="text-base font-bold text-neutral-900 pb-4 border-b border-neutral-200 flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  <span>Rincian Produk ({order.items?.length || 0})</span>
                </h2>

                <div className="mt-4 divide-y divide-neutral-100">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item) => (
                      <div
                        key={item.order_item_id}
                        className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                      >
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
                          {item.product_image ? (
                            <Image
                              src={item.product_image}
                              alt={item.product_name}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-neutral-400">
                              <Package className="h-8 w-8" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-bold text-neutral-900">
                            {item.product_name}
                          </h3>
                          <p className="mt-1 text-xs text-neutral-500">
                            {item.quantity} barang x{" "}
                            {formatRupiah(item.price_at_purchase)}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-neutral-900">
                            {formatRupiah(item.subtotal)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-neutral-500 py-4">
                      Rincian produk tidak tersedia.
                    </p>
                  )}
                </div>
              </div>

              {/* 2. Informasi Alamat Pengiriman */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <h2 className="text-base font-bold text-neutral-900 pb-4 border-b border-neutral-200 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>Alamat Pengiriman</span>
                </h2>
                <div className="mt-4 rounded-xl bg-neutral-50 p-4 border border-neutral-200">
                  <p className="text-sm text-neutral-800 leading-relaxed font-medium">
                    {order.shipping_address || "Alamat tidak tercatat."}
                  </p>
                </div>
              </div>

              {/* 3. Bukti Pembayaran Card */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <h2 className="text-base font-bold text-neutral-900 pb-4 border-b border-neutral-200 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <span>Bukti Pembayaran</span>
                </h2>

                <div className="mt-4">
                  {order.payment_proof_url ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-300 p-3 rounded-xl font-medium">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>
                          Bukti pembayaran telah diunggah pada{" "}
                          {order.payment_submitted_at
                            ? formatDate(order.payment_submitted_at)
                            : "baru-baru ini"}
                          .
                        </span>
                      </div>

                      <div className="relative h-64 w-full max-w-md rounded-xl overflow-hidden border border-neutral-300 bg-neutral-900">
                        <Image
                          src={order.payment_proof_url}
                          alt="Bukti Transfer"
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>

                      <div>
                        <a
                          href={order.payment_proof_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>Buka Gambar Ukuran Penuh</span>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-200 text-neutral-500 mb-2">
                        <Upload className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-semibold text-neutral-800">
                        Belum Ada Bukti Pembayaran
                      </p>
                      <p className="mt-1 text-xs text-neutral-500 max-w-sm mx-auto">
                        Pesanan ini belum memiliki bukti pembayaran yang diunggah.
                        Silakan transfer dan unggah bukti untuk mempercepat proses
                        pesanan Anda.
                      </p>
                      {(order.status || "").toUpperCase() === "PENDING" && (
                        <button
                          type="button"
                          onClick={() => setIsUploadModalOpen(true)}
                          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#1f5c4e] transition-colors"
                        >
                          <Upload className="h-3.5 w-3.5" />
                          <span>Unggah Sekarang</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Ringkasan Tagihan & Rekening Pembayaran */}
            <div className="space-y-6 lg:col-span-4">
              {/* Ringkasan Pembayaran */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <h2 className="text-base font-bold text-neutral-900 pb-3 border-b border-neutral-200">
                  Ringkasan Pembayaran
                </h2>

                <div className="mt-4 space-y-2.5 text-sm">
                  <div className="flex justify-between text-neutral-600">
                    <span>Total Harga Barang</span>
                    <span className="font-medium text-neutral-900">
                      {formatRupiah(order.total_amount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Biaya Pengiriman</span>
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-300">
                      GRATIS
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-neutral-200 pt-3 text-base">
                    <span className="font-bold text-neutral-900">
                      Total Tagihan
                    </span>
                    <span className="font-bold text-primary text-lg">
                      {formatRupiah(order.total_amount)}
                    </span>
                  </div>
                </div>

                {(order.status || "").toUpperCase() === "PENDING" && (
                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={() => setIsUploadModalOpen(true)}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#1f5c4e] transition-colors"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Unggah Bukti Bayar</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Rekening Tujuan Transfer */}
              {(order.status || "").toUpperCase() === "PENDING" && (
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
                    Rekening Tujuan Transfer
                  </h3>
                  <div className="space-y-2">
                    {BANK_ACCOUNTS.map((acc) => (
                      <div
                        key={acc.bank}
                        className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-neutral-900">
                            Bank {acc.bank}
                          </p>
                          <p className="text-sm font-mono font-medium text-neutral-800">
                            {acc.number}
                          </p>
                          <p className="text-[11px] text-neutral-500">
                            a.n. {acc.name}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyAccount(acc.bank, acc.number)}
                          className="px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/10 rounded border border-primary/20 transition-colors inline-flex items-center gap-1"
                        >
                          {copiedBank === acc.bank ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-600" />
                              <span className="text-emerald-700 font-semibold">
                                Tersalin
                              </span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Salin</span>
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Jaminan FastShop */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-neutral-600">
                  <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                  <span>Transaksi 100% aman dan dilindungi garansi FastShop</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Upload Modal */}
          {isUploadModalOpen && (
            <PaymentUploadModal
              isOpen={isUploadModalOpen}
              orderId={orderId}
              orderTotal={order.total_amount}
              onClose={() => setIsUploadModalOpen(false)}
              onSuccess={() => {
                setIsUploadModalOpen(false);
                fetchOrderDetail();
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
