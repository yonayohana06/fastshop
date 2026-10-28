"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  X,
  Upload,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  CreditCard,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { uploadPaymentProofApi } from "@/lib/api/orders";
import { Order } from "@/types";

interface PaymentUploadModalProps {
  orderId: string | number;
  orderTotal?: number | string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (updatedOrder?: Order) => void;
}

const BANK_ACCOUNTS = [
  {
    bank: "BCA",
    accountNumber: "8730123456",
    accountName: "PT FastShop Indonesia",
  },
  {
    bank: "Mandiri",
    accountNumber: "1370098765432",
    accountName: "PT FastShop Indonesia",
  },
  {
    bank: "BRI",
    accountNumber: "020601000123300",
    accountName: "PT FastShop Indonesia",
  },
];

export function PaymentUploadModal({
  orderId,
  orderTotal,
  isOpen,
  onClose,
  onSuccess,
}: PaymentUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedBank, setCopiedBank] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up object URL when unmounting or changing file
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setErrorMessage(null);

    if (!file) {
      return;
    }

    // Validate type
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setErrorMessage("Format file harus berupa JPG, JPEG, atau PNG.");
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Ukuran file maksimal 5MB.");
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCopyAccount = (bank: string, number: string) => {
    navigator.clipboard.writeText(number);
    setCopiedBank(bank);
    setTimeout(() => {
      setCopiedBank(null);
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setErrorMessage("Silakan pilih file bukti pembayaran terlebih dahulu.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const res = await uploadPaymentProofApi(orderId, selectedFile);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        handleRemoveFile();
        onClose();
        onSuccess?.(res.data);
      }, 1500);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Gagal mengunggah bukti pembayaran. Silakan coba lagi.";
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-none animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <div>
            <h2 id="modal-title" className="text-lg font-bold text-neutral-900">
              Unggah Bukti Pembayaran
            </h2>
            <p className="text-xs text-neutral-500">
              Pesanan #{orderId}
              {orderTotal !== undefined && ` • ${formatRupiah(orderTotal)}`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Tutup modal"
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Success Notification */}
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">
                Bukti Pembayaran Terkirim!
              </h3>
              <p className="text-sm text-neutral-600 max-w-sm mx-auto">
                Terima kasih! Bukti transfer Anda berhasil diunggah dan sedang
                diverifikasi oleh admin.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Alert */}
              {errorMessage && (
                <div className="flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
                  <p>{errorMessage}</p>
                </div>
              )}

              {/* Bank Accounts Destination Info */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  <CreditCard className="w-4 h-4 text-primary" />
                  <span>Rekening Tujuan Transfer</span>
                </div>
                <div className="space-y-2">
                  {BANK_ACCOUNTS.map((acc) => (
                    <div
                      key={acc.bank}
                      className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-neutral-100/70 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-neutral-900">
                            Bank {acc.bank}
                          </span>
                          <span className="text-xs text-neutral-500">
                            a.n. {acc.accountName}
                          </span>
                        </div>
                        <p className="text-sm font-mono font-medium text-neutral-800 mt-0.5">
                          {acc.accountNumber}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyAccount(acc.bank, acc.accountNumber)
                        }
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/10 rounded border border-primary/20 transition-colors"
                      >
                        {copiedBank === acc.bank ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-semibold">
                              Tersalin
                            </span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* File Upload Box */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  Foto / Tangkapan Layar Bukti Transfer
                </label>

                {previewUrl ? (
                  <div className="relative border border-neutral-300 rounded-xl p-3 bg-neutral-50">
                    <div className="relative h-56 w-full rounded-lg overflow-hidden bg-neutral-900">
                      <Image
                        src={previewUrl}
                        alt="Preview Bukti Pembayaran"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-between px-1">
                      <div className="truncate text-xs text-neutral-600 max-w-[260px]">
                        <span className="font-medium text-neutral-800">
                          {selectedFile?.name}
                        </span>
                        <span className="text-neutral-500 ml-1">
                          (
                          {selectedFile
                            ? (selectedFile.size / 1024).toFixed(0) + " KB"
                            : ""}
                          )
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        disabled={isLoading}
                        className="text-xs text-red-600 hover:text-red-700 font-medium hover:underline disabled:opacity-50"
                      >
                        Ganti Foto
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-neutral-300 hover:border-primary rounded-xl p-6 text-center cursor-pointer bg-neutral-50 hover:bg-neutral-100/50 transition-colors"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <div className="w-12 h-12 bg-neutral-200 text-neutral-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Upload className="w-6 h-6 text-neutral-600" />
                    </div>
                    <p className="text-sm font-medium text-neutral-800">
                      Klik untuk memilih berkas gambar
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      Mendukung format JPG, JPEG, PNG (Maksimal 5MB)
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !selectedFile}
                  className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-primary hover:bg-[#1f5c4e] rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mengunggah...</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-4 h-4" />
                      <span>Kirim Bukti</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
