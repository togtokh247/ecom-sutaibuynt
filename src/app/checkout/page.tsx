"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AccountGuard from "@/src/components/account-guard";
import { endpoints, ApiError } from "@/src/lib/api";
import { useCart } from "@/src/stores/cart";
import { errorMessage, money } from "@/src/lib/utils";
function CheckoutForm() {
  const items = useCart((s) => s.items);
  const hydrated = useCart((s) => s.hydrated);
  const clear = useCart((s) => s.clear);
  const subtotal = useCart((s) => s.subtotal());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  useEffect(() => {
    if (hydrated && items.length === 0) router.replace("/cart");
  }, [hydrated, items.length, router]);
  async function submit(form: FormData) {
    setBusy(true);
    setError("");
    setFieldErrors({});
    const body = {
      customer_name: String(form.get("customer_name") || "").trim(),
      customer_phone: String(form.get("customer_phone") || "").trim(),
      shipping_address: String(form.get("shipping_address") || "").trim(),
      note: String(form.get("note") || "").trim(),
      items: items.map((i) => ({
        product_id: Number(i.productId),
        quantity: i.quantity,
      })),
    };
    try {
      const response: any = await endpoints.createOrder(body);
      const order =
        response?.data?.order ??
        response?.order ??
        response?.data ??
        response?.order_data ??
        response;
      const id = order?.id ?? response?.order_id ?? response?.data?.order_id;
      if (id === undefined || id === null)
        throw new Error(
          "Захиалга API-д амжилттай илгээгдсэн байж болох ч хариунд захиалгын ID олдсонгүй. Давтан захиалахаас өмнө захиалгын жагсаалтаа шалгана уу."
        );
      clear();
      router.push(`/orders/${id}`);
    } catch (e) {
      if (e instanceof ApiError && e.status === 422 && e.errors) {
        const mapped: Record<string, string> = {};
        Object.entries(e.errors).forEach(([k, v]) => {
          mapped[k] = Array.isArray(v) ? v[0] : String(v);
        });
        setFieldErrors(mapped);
        setError("Оруулсан мэдээллээ шалгана уу.");
      } else setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  if (!hydrated || !items.length)
    return (
      <div className="container-shell py-20 text-center">
        Сагс шалгаж байна...
      </div>
    );
  return (
    <div className="container-shell py-8">
      <div className="mb-7">
        <p className="text-xs font-extrabold uppercase tracking-[.18em] text-indigo-600">
          Сүүлийн алхам
        </p>
        <h1 className="mt-1 text-3xl font-black">Захиалга баталгаажуулах</h1>
        <p className="mt-2 text-sm text-slate-500">
          Захиалга өгөхийн тулд нэвтэрсэн байх шаардлагатай.
        </p>
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void submit(new FormData(e.currentTarget));
          }}
          className="card p-5 sm:p-7"
        >
          <h2 className="mb-5 text-lg font-extrabold">Хүргэлтийн мэдээлэл</h2>
          <label className="form-label">
            Хүлээн авагчийн нэр *
            <input
              name="customer_name"
              required
              className="field mt-1"
              autoComplete="name"
            />
          </label>
          {fieldErrors.customer_name && (
            <p className="mt-1 text-xs text-rose-600">
              {fieldErrors.customer_name}
            </p>
          )}
          <label className="form-label mt-4">
            Утасны дугаар *
            <input
              name="customer_phone"
              required
              inputMode="tel"
              pattern="[0-9+() -]{8,20}"
              className="field mt-1"
              autoComplete="tel"
              placeholder="99112233"
            />
          </label>
          {fieldErrors.customer_phone && (
            <p className="mt-1 text-xs text-rose-600">
              {fieldErrors.customer_phone}
            </p>
          )}
          <label className="form-label mt-4">
            Хүргэлтийн хаяг *
            <textarea
              name="shipping_address"
              required
              rows={3}
              className="field mt-1"
              autoComplete="street-address"
              placeholder="Дүүрэг, хороо, байр, орц, тоот..."
            />
          </label>
          {fieldErrors.shipping_address && (
            <p className="mt-1 text-xs text-rose-600">
              {fieldErrors.shipping_address}
            </p>
          )}
          <label className="form-label mt-4">
            Тэмдэглэл (сонголтоор)
            <textarea
              name="note"
              rows={2}
              className="field mt-1"
              placeholder="Хүргэлтийн нэмэлт мэдээлэл"
            />
          </label>
          {fieldErrors.note && (
            <p className="mt-1 text-xs text-rose-600">{fieldErrors.note}</p>
          )}
          {error && (
            <p
              role="alert"
              className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700"
            >
              {error}
            </p>
          )}
          <button disabled={busy} className="btn-primary mt-6 w-full">
            {busy ? "Захиалга илгээж байна..." : "Захиалга баталгаажуулах"}
          </button>
          <p className="mt-3 text-xs leading-5 text-slate-400">
            Захиалга үүсэхэд бараа болон үнэ API серверээр баталгаажна.
          </p>
        </form>
        <aside className="card p-5">
          <h2 className="font-extrabold">
            Таны сагс ({items.reduce((s, i) => s + i.quantity, 0)} бараа)
          </h2>
          <div className="mt-4 grid gap-3">
            {items.map((i) => (
              <div
                key={i.productId}
                className="flex justify-between gap-3 text-sm"
              >
                <span className="min-w-0 text-slate-600">
                  {i.name} × {i.quantity}
                </span>
                <strong className="shrink-0">
                  {money(i.price * i.quantity)}
                </strong>
              </div>
            ))}
          </div>
          <div className="my-4 border-t border-slate-100" />
          <div className="flex justify-between font-black">
            <span>Нийт дүн</span>
            <span>{money(subtotal)}</span>
          </div>
          <Link
            href="/cart"
            className="mt-4 inline-block text-sm font-bold text-indigo-600"
          >
            ← Сагс засах
          </Link>
        </aside>
      </div>
    </div>
  );
}
export default function CheckoutPage() {
  return (
    <AccountGuard>
      <CheckoutForm />
    </AccountGuard>
  );
}
