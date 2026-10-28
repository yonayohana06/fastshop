import React from "react";
import { Truck, ShieldCheck, CreditCard, Headphones } from "lucide-react";

const BADGES = [
  {
    icon: Truck,
    title: "Pengiriman Cepat",
    description: "Kirim ke seluruh pelosok Indonesia dengan kurir andal & terpercaya",
  },
  {
    icon: ShieldCheck,
    title: "100% Produk Original",
    description: "Jaminan mutu barang asli dengan standar kualitas premium",
  },
  {
    icon: CreditCard,
    title: "Pembayaran Aman",
    description: "Dukungan transfer bank & QRIS dengan konfirmasi instan",
  },
  {
    icon: Headphones,
    title: "Layanan Pelanggan",
    description: "Bantuan ramah & responsif untuk kenyamanan belanja Anda",
  },
];

export function TrustBadges() {
  return (
    <section className="border-y border-zinc-200/80 bg-zinc-50/70 py-10 dark:border-zinc-800/80 dark:bg-zinc-900/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BADGES.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-3.5 rounded-xl border border-zinc-200/60 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {badge.title}
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
