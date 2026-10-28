"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  CreditCard,
  ShoppingBag,
  ShieldCheck,
  Truck,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  QrCode,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { checkoutOrderApi } from "@/lib/api/orders";
import { formatRupiah } from "@/lib/utils";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { items, grandTotal, clearCart } = useCart();

  const [recipientName, setRecipientName] = useState(user?.name || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || "");
  const [cityZip, setCityZip] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"bank_transfer" | "qris">(
    "bank_transfer"
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auth guard
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/checkout");
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || (!isAuthenticated && authLoading)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Guard for empty cart
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Beranda", href: "/" },
            { label: "Keranjang", href: "/cart" },
            { label: "Checkout" },
          ]}
        />
        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-12 text-center shadow-sm max-w-xl mx-auto">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 mb-4">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h1 className="text-xl font-bold text-neutral-900">
            Keranjang Belanja Anda Kosong
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            Tidak ada produk yang dapat dicheckout. Silakan pilih produk terlebih
            dahulu dari katalog kami.
          </p>
          <div className="mt-6">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#1f5c4e] transition-colors"
            >
              <span>Jelajahi Produk</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form validations
    if (!recipientName.trim()) {
      setErrorMessage("Nama penerima wajib diisi.");
      return;
    }
    if (!phoneNumber.trim()) {
      setErrorMessage("Nomor telepon penerima wajib diisi.");
      return;
    }
    if (!fullAddress.trim()) {
      setErrorMessage("Alamat lengkap pengiriman wajib diisi.");
      return;
    }

    // Combine into complete shipping address
    const completeShippingAddress = [
      `Penerima: ${recipientName.trim()} (${phoneNumber.trim()})`,
      fullAddress.trim(),
      cityZip.trim() ? `Kota/Kode Pos: ${cityZip.trim()}` : "",
      deliveryNote.trim() ? `Catatan: ${deliveryNote.trim()}` : "",
    ]
      .filter(Boolean)
      .join(", ");

    try {
      setIsSubmitting(true);
      const res = await checkoutOrderApi({
        shipping_address: completeShippingAddress,
      });

      // Clear cart on success
      clearCart();

      const createdOrder = res.data;
      const orderId = createdOrder?.id || createdOrder?.order_id || "";

      // Redirect to orders page with parameter
      if (orderId) {
        router.push(`/orders?new_order_id=${orderId}&checkout_success=1`);
      } else {
        router.push("/orders?checkout_success=1");
      }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Gagal memproses pesanan. Silakan periksa kembali koneksi Anda.";
      setErrorMessage(errorMsg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Beranda", href: "/" },
          { label: "Keranjang", href: "/cart" },
          { label: "Checkout" },
        ]}
      />

      {/* Header */}
      <div className="mt-6 mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
          Checkout Pembayaran
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Lengkapi data pengiriman dan pilih metode pembayaran untuk menyelesaikan
          pesanan Anda.
        </p>
      </div>

      <form onSubmit={handleCheckoutSubmit}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Form Alamat & Metode Pembayaran */}
          <div className="space-y-6 lg:col-span-7">
            {/* Error Message */}
            {errorMessage && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                <div>
                  <p className="font-semibold">Perhatian</p>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            {/* 1. Alamat Pengiriman */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 pb-4 border-b border-neutral-200">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-neutral-900">
                    Alamat Pengiriman
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Pastikan alamat dan nomor kontak yang Anda masukkan akurat.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="recipientName"
                      className="block text-xs font-semibold uppercase tracking-wider text-neutral-700"
                    >
                      Nama Penerima <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="recipientName"
                      type="text"
                      required
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Contoh: Agus Sumanto"
                      className="mt-1.5 w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-xs font-semibold uppercase tracking-wider text-neutral-700"
                    >
                      Nomor Telepon / WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phoneNumber"
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Contoh: 081234567890"
                      className="mt-1.5 w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="fullAddress"
                    className="block text-xs font-semibold uppercase tracking-wider text-neutral-700"
                  >
                    Alamat Lengkap <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="fullAddress"
                    rows={3}
                    required
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                    placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan"
                    className="mt-1.5 w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="cityZip"
                      className="block text-xs font-semibold uppercase tracking-wider text-neutral-700"
                    >
                      Kota / Kabupaten & Kode Pos
                    </label>
                    <input
                      id="cityZip"
                      type="text"
                      value={cityZip}
                      onChange={(e) => setCityZip(e.target.value)}
                      placeholder="Contoh: Yogyakarta, 55281"
                      className="mt-1.5 w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="deliveryNote"
                      className="block text-xs font-semibold uppercase tracking-wider text-neutral-700"
                    >
                      Catatan Pengiriman (Opsional)
                    </label>
                    <input
                      id="deliveryNote"
                      type="text"
                      value={deliveryNote}
                      onChange={(e) => setDeliveryNote(e.target.value)}
                      placeholder="Contoh: Titipkan di pos satpam jika tidak ada orang"
                      className="mt-1.5 w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Metode Pembayaran */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 pb-4 border-b border-neutral-200">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-neutral-900">
                    Metode Pembayaran
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Pilih metode transfer manual atau pembayaran QRIS instan.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {/* Option 1: Transfer Bank Manual */}
                <label
                  className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-all ${
                    paymentMethod === "bank_transfer"
                      ? "border-primary bg-primary/5"
                      : "border-neutral-200 bg-neutral-50 hover:bg-neutral-100/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={paymentMethod === "bank_transfer"}
                    onChange={() => setPaymentMethod("bank_transfer")}
                    className="mt-1 h-4 w-4 text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-neutral-900">
                        Transfer Bank Manual (BCA, Mandiri, BRI)
                      </span>
                      <span className="rounded bg-neutral-200 px-2 py-0.5 text-[11px] font-medium text-neutral-700">
                        Verifikasi Cepat
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-neutral-600">
                      Transfer tepat sesuai total nominal belanja, lalu unggah foto
                      bukti transfer di halaman pesanan Anda.
                    </p>
                    <div className="mt-2.5 flex items-center gap-2 text-xs font-semibold text-neutral-700">
                      <span className="rounded border border-neutral-300 bg-white px-2 py-1">
                        BCA
                      </span>
                      <span className="rounded border border-neutral-300 bg-white px-2 py-1">
                        MANDIRI
                      </span>
                      <span className="rounded border border-neutral-300 bg-white px-2 py-1">
                        BRI
                      </span>
                    </div>
                  </div>
                </label>

                {/* Option 2: QRIS */}
                <label
                  className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-all ${
                    paymentMethod === "qris"
                      ? "border-primary bg-primary/5"
                      : "border-neutral-200 bg-neutral-50 hover:bg-neutral-100/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="qris"
                    checked={paymentMethod === "qris"}
                    onChange={() => setPaymentMethod("qris")}
                    className="mt-1 h-4 w-4 text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-neutral-900">
                        QRIS FastShop (Gopay, OVO, ShopeePay, Dana, dll)
                      </span>
                      <QrCode className="h-4 w-4 text-neutral-600" />
                    </div>
                    <p className="mt-1 text-xs text-neutral-600">
                      Pindai QR code standar nasional menggunakan aplikasi e-wallet
                      atau mobile banking favorit Anda.
                    </p>
                  </div>
                </label>
              </div>

              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-800">
                <p className="font-semibold">Informasi Verifikasi Pembayaran:</p>
                <p className="mt-0.5">
                  Setelah pesanan dibuat, Anda dapat langsung mengunggah foto atau
                  tangkapan layar struk transfer melalui tombol &quot;Unggah Bukti Bayar&quot; di
                  halaman Riwayat Pesanan.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Ringkasan Pesanan & Tombol Buat Pesanan */}
          <div className="space-y-6 lg:col-span-5">
            <div className="sticky top-24 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-neutral-900 pb-3 border-b border-neutral-200">
                Ringkasan Pesanan ({items.length} Barang)
              </h2>

              {/* Items List Preview */}
              <div className="mt-4 max-h-60 overflow-y-auto space-y-3 pr-1 divide-y divide-neutral-100">
                {items.map((item) => (
                  <div
                    key={item.product_id}
                    className="flex items-center gap-3 pt-3 first:pt-0"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.product_name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-neutral-400">
                          <ShoppingBag className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-neutral-900">
                        {item.product_name}
                      </p>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {item.quantity} x {formatRupiah(item.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-neutral-900">
                        {formatRupiah(item.subtotal)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Calculation Breakdown */}
              <div className="mt-6 space-y-2.5 border-t border-neutral-200 pt-4 text-sm">
                <div className="flex justify-between text-neutral-600">
                  <span>Total Harga ({items.reduce((acc, i) => acc + i.quantity, 0)} barang)</span>
                  <span className="font-medium text-neutral-900">
                    {formatRupiah(grandTotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-neutral-600">
                  <span className="flex items-center gap-1.5">
                    <Truck className="h-4 w-4 text-primary" />
                    Biaya Pengiriman
                  </span>
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-300">
                    GRATIS
                  </span>
                </div>

                <div className="flex justify-between border-t border-neutral-200 pt-3 text-base">
                  <span className="font-bold text-neutral-900">
                    Total Pembayaran
                  </span>
                  <span className="font-bold text-primary text-lg">
                    {formatRupiah(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-[#1f5c4e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Memproses Pesanan...</span>
                    </>
                  ) : (
                    <>
                      <span>Buat Pesanan Sekarang</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-5 space-y-2 border-t border-neutral-200 pt-4">
                <div className="flex items-center gap-2 text-xs text-neutral-600">
                  <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                  <span>Jaminan keamanan data & transaksi 100% terlindungi</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-600">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span>Garansi retur & pengembalian dana jika pesanan tidak sesuai</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
