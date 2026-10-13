import type { Product } from "@/src/lib/types";

export const productName = (p: Product) =>
  String(p.name ?? p.title ?? "Бүтээгдэхүүн");

export const productPrice = (p: Product) =>
  Number(p.sale_price ?? p.price ?? 0);

export const productImage = (p: Product): string => {
  const image = p.image;
  const first = Array.isArray(p.images) ? p.images[0] : undefined;

  if (typeof image === "string" && image) {
    return image;
  }

  if (image && typeof image === "object") {
    if (image.url) return image.url;
    if (image.thumbnail) return image.thumbnail;
    if (image.preview) return image.preview;
  }

  if (typeof first === "string") return first;

  if (first && typeof first === "object") {
    return first.url || first.image_url || "";
  }

  return p.image_url || "";
};

export const money = (value: unknown) =>
  `${new Intl.NumberFormat("mn-MN", {
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)} ₮`;

export const errorMessage = (e: unknown) =>
  e instanceof Error ? e.message : "Алдаа гарлаа. Дахин оролдоно уу.";

export const safeString = (v: unknown) =>
  typeof v === "string" ? v : "";