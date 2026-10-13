import type { ApiList, Category, Order, Product, Tag, User } from "@/src/lib/types";

const BASE = (
  process.env.NEXT_PUBLIC_API_URL || "https://job.sutainbuyant.com/api/v1"
).replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[] | string>;
  constructor(
    message: string,
    status: number,
    errors?: Record<string, string[] | string>
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}
export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("sutainbuyant_token");
}
export function saveToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem("sutainbuyant_token", token);
  else localStorage.removeItem("sutainbuyant_token");
}
export async function api<T>(
  path: string,
  init: RequestInit = {},
  authenticated = false
): Promise<T> {
  const headers = new Headers(init.headers);
  if (!(init.body instanceof FormData))
    headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");
  if (authenticated) {
    const token = getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }
  let response: Response;
  try {
    response = await fetch(
      `${BASE}${path.startsWith("/") ? path : `/${path}`}`,
      { ...init, headers, cache: "no-store" }
    );
  } catch {
    throw new ApiError(
      "Сүлжээний алдаа. Интернэт холболтоо шалгаад дахин оролдоно уу.",
      0
    );
  }
  const text = await response.text();
  let payload: any = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = text;
  }
  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.error ||
      (response.status === 401
        ? "Нэвтрэх шаардлагатай."
        : "Хүсэлтийг гүйцэтгэж чадсангүй.");
    throw new ApiError(message, response.status, payload?.errors);
  }
  return payload as T;
}
export function unwrap<T>(
  payload: ApiList<T> | { data?: T; product?: T; order?: T; user?: T } | T
): T[] {
  if (Array.isArray(payload)) return payload;
  const p = payload as any;
  if (Array.isArray(p?.data)) return p.data;
  if (Array.isArray(p?.items)) return p.items;
  if (Array.isArray(p?.results)) return p.results;
  return [];
}
export function one<T>(payload: any, key?: string): T {
  return (payload?.data ?? (key ? payload?.[key] : undefined) ?? payload) as T;
}
export const endpoints = {
  categories: () => api<any>("/shop/categories"),
  category: (id: string) =>
    api<any>(`/shop/categories/${encodeURIComponent(id)}`),
  tags: () => api<any>("/shop/tags"),
  products: (query = "") =>
    api<any>(`/shop/products${query ? `?${query}` : ""}`),
  product: (id: string) => api<any>(`/shop/products/${encodeURIComponent(id)}`),
  register: (body: unknown) =>
    api<any>("/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body: unknown) =>
    api<any>("/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => api<any>("/me", {}, true),
  logout: () => api<any>("/logout", { method: "POST" }, true),
  profile: () => api<any>("/shop/profile", {}, true),
  updateProfile: (body: unknown) =>
    api<any>(
      "/shop/profile",
      { method: "PUT", body: JSON.stringify(body) },
      true
    ),
  changePassword: (body: unknown) =>
    api<any>(
      "/shop/profile/password",
      { method: "PUT", body: JSON.stringify(body) },
      true
    ),
  orders: () => api<any>("/shop/orders", {}, true),
  order: (id: string) =>
    api<any>(`/shop/orders/${encodeURIComponent(id)}`, {}, true),
  createOrder: (body: unknown) =>
    api<any>(
      "/shop/orders",
      { method: "POST", body: JSON.stringify(body) },
      true
    ),
  cancelOrder: (id: string) =>
    api<any>(
      `/shop/orders/${encodeURIComponent(id)}/cancel`,
      { method: "POST" },
      true
    ),
};
export type { Category, Tag, Product, Order, User };
