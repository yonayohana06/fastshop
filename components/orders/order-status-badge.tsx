import React from "react";
import { OrderStatus } from "@/types";
import {
  Clock,
  RefreshCw,
  Truck,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";

interface OrderStatusBadgeProps {
  status: OrderStatus | string;
  className?: string;
  size?: "sm" | "md";
}

export function OrderStatusBadge({
  status,
  className = "",
  size = "md",
}: OrderStatusBadgeProps) {
  const normalizedStatus = (status || "").toUpperCase();

  const getStatusConfig = () => {
    switch (normalizedStatus) {
      case "PENDING":
        return {
          label: "Menunggu Pembayaran",
          icon: Clock,
          styles: "bg-amber-100 text-amber-800 border-amber-300",
        };
      case "PROCESSING":
        return {
          label: "Menunggu Konfirmasi",
          icon: RefreshCw,
          styles: "bg-blue-100 text-blue-800 border-blue-300",
        };
      case "SHIPPED":
        return {
          label: "Sedang Dikirim",
          icon: Truck,
          styles: "bg-teal-100 text-teal-800 border-teal-300",
        };
      case "COMPLETED":
        return {
          label: "Pesanan Selesai",
          icon: CheckCircle2,
          styles: "bg-emerald-100 text-emerald-800 border-emerald-300",
        };
      case "CANCELLED":
        return {
          label: "Dibatalkan",
          icon: XCircle,
          styles: "bg-red-100 text-red-800 border-red-300",
        };
      default:
        return {
          label: status || "Tidak Diketahui",
          icon: HelpCircle,
          styles: "bg-neutral-100 text-neutral-800 border-neutral-300",
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeClasses =
    size === "sm"
      ? "text-xs px-2.5 py-1 gap-1.5"
      : "text-sm px-3.5 py-1.5 gap-2";

  const iconSizes = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${config.styles} ${sizeClasses} ${className}`}
    >
      <Icon className={iconSizes} />
      <span>{config.label}</span>
    </span>
  );
}
