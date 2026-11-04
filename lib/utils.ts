/**
 * Format angka atau string ke mata uang Rupiah Indonesia
 * Contoh: 235000 -> "Rp 235.000"
 */
export function formatRupiah(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "Rp 0";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(num)
    .replace(/\s+/g, " ");
}

/**
 * Truncate teks panjang
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Buat slug ramah SEO dari teks
 * Contoh: "Kemeja Flanel Kotak-Kotak" -> "kemeja-flanel-kotak-kotak"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Ekstrak product ID dari parameter URL (mendukung "13" maupun "13-nama-produk")
 */
export function parseProductId(param: string): string {
  const match = param.match(/^(\d+)/);
  return match ? match[1] : param;
}
