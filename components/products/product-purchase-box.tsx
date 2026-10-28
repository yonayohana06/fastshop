"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Minus,
  Plus,
  ShoppingCart,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";
import { Product } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { AddToCartToast } from "./add-to-cart-toast";

interface ProductPurchaseBoxProps {
  product: Product;
}

export function ProductPurchaseBox({ product }: ProductPurchaseBoxProps) {
  const router = useRouter();
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [isToastOpen, setIsToastOpen] = useState(false);

  const isOutOfStock = product.stock <= 0;
  const maxStock = Math.max(1, product.stock);

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => Math.min(maxStock, prev + 1));
  };

  const handleQuantityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) {
      setQuantity(1);
    } else {
      setQuantity(Math.min(maxStock, Math.max(1, val)));
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addItem({
      cart_item_id: `temp_${product.id}_${Date.now()}`,
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity,
    });

    setIsToastOpen(true);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;

    addItem({
      cart_item_id: `temp_${product.id}_${Date.now()}`,
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity,
    });

    router.push("/cart");
  };

  const unitPrice = typeof product.price === "string" ? parseFloat(product.price) : product.price;
  const subtotal = unitPrice * quantity;

  return (
    <>
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        {/* Price & Stock status */}
        <div className="flex items-baseline justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
          <div>
            <span className="text-xs text-zinc-400 block font-medium">Harga Satuan</span>
            <span className="text-2xl font-black text-zinc-950 sm:text-3xl dark:text-white">
              {formatRupiah(product.price)}
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs text-zinc-400 block font-medium">Status Stok</span>
            <span
              className={`inline-flex items-center text-xs font-bold ${
                isOutOfStock
                  ? "text-red-500"
                  : "text-primary"
              }`}
            >
              {isOutOfStock ? "Stok Habis" : `Tersedia (${product.stock} pcs)`}
            </span>
          </div>
        </div>

        {/* Quantity Controls & Subtotal */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <label
              htmlFor="product-quantity-input"
              className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block"
            >
              Jumlah Pembelian
            </label>
            <div className="mt-1.5 flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleDecrease}
                disabled={isOutOfStock || quantity <= 1}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 transition-colors"
                aria-label="Kurangi jumlah"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <input
                id="product-quantity-input"
                type="number"
                min={1}
                max={maxStock}
                value={quantity}
                onChange={handleQuantityInput}
                disabled={isOutOfStock}
                className="h-9 w-16 rounded-lg border border-zinc-200 text-center text-sm font-bold text-zinc-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
                aria-label="Kuantitas produk"
              />
              <button
                type="button"
                onClick={handleIncrease}
                disabled={isOutOfStock || quantity >= maxStock}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 transition-colors"
                aria-label="Tambah jumlah"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="sm:text-right">
            <span className="text-xs text-zinc-400 block font-medium">Subtotal</span>
            <span className="text-xl font-extrabold text-primary">
              {formatRupiah(subtotal)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 px-5 text-sm font-bold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40 shadow-xs transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Tambah ke Keranjang</span>
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-secondary py-3.5 px-5 text-sm font-bold text-white hover:bg-secondary-hover disabled:cursor-not-allowed disabled:opacity-40 shadow-xs transition-colors"
          >
            <Zap className="h-4 w-4" />
            <span>Beli Sekarang</span>
          </button>
        </div>

        {/* Trust & Guarantee Notes */}
        <div className="mt-6 rounded-xl border border-zinc-100 bg-zinc-50/80 p-3.5 text-xs text-zinc-600 dark:border-zinc-800/80 dark:bg-zinc-800/50 dark:text-zinc-300 space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
            <span>Jaminan 100% Produk Asli &amp; Kualitas Teruji</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-primary shrink-0" />
            <span>Gratis Ongkir &amp; Pengiriman Cepat ke Seluruh Indonesia</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4 text-secondary shrink-0" />
            <span>Bisa Retur Jika Produk Mengalami Cacat Pabrik</span>
          </div>
        </div>
      </div>

      {/* Floating Add To Cart Notification */}
      <AddToCartToast
        isOpen={isToastOpen}
        onClose={() => setIsToastOpen(false)}
        product={product}
        quantity={quantity}
      />
    </>
  );
}
