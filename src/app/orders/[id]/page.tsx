"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AccountGuard from "@/src/components/account-guard";
import { endpoints, one } from "@/src/lib/api";
import type { Order } from "@/src/lib/types";
import { errorMessage, money } from "@/src/lib/utils";
function OrderDetailContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function load() {
    try {
      const r = await endpoints.order(params.id);
      setOrder(one<Order>(r, "order"));
    } catch (e) {
      setError(errorMessage(e));
    }
  }
  useEffect(() => {
    load();
  }, [params.id]);
  async function cancel() {
    if (!confirm("Энэ захиалгыг цуцлах уу?")) return;
    setBusy(true);
    setError("");
    try {
      await endpoints.cancelOrder(params.id);
      await load();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="container-shell py-8">
      <Link href="/orders" className="text-sm font-bold text-indigo-600">
        ← Миний захиалгууд
      </Link>
      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-700"
        >
          {error}
        </p>
      )}
      {!order ? (
        <p className="py-12 text-slate-500">
          Захиалгын мэдээлэл ачааллаж байна...
        </p>
      ) : (
        <div className="mx-auto mt-5 max-w-3xl">
          <div className="card p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Захиалгын дэлгэрэнгүй
            </p>
            <h1 className="mt-2 text-2xl font-black">Захиалга #{order.id}</h1>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-bold text-indigo-700">
                {String(order.status || "Төлөв тодорхойгүй")}
              </span>
              <strong className="text-xl">
                {money(order.total_amount ?? order.total)}
              </strong>
            </div>
            <div className="my-6 border-t border-slate-100" />
            <h2 className="font-extrabold">Захиалгын мэдээлэл</h2>
            <pre className="mt-3 overflow-auto rounded-xl bg-slate-50 p-4 text-xs leading-5 text-slate-600">
              {JSON.stringify(order, null, 2)}
            </pre>
            <p className="mt-2 text-xs text-slate-400">
              Энэ дэлгэрэнгүй хэсэг нь API-ийн бүх талбарыг алдалгүй харуулахын
              тулд raw response-ийг үзүүлж байна. Response schema баталгаажсаны
              дараа тусгайлан форматлаж болно.
            </p>
            {!["cancelled", "canceled", "completed", "delivered"].includes(
              String(order.status || "").toLowerCase()
            ) && (
              <button
                disabled={busy}
                onClick={cancel}
                className="btn-secondary mt-5 text-rose-600"
              >
                {busy ? "Цуцалж байна..." : "Захиалга цуцлах"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default function OrderDetailPage() {
  return (
    <AccountGuard>
      <OrderDetailContent />
    </AccountGuard>
  );
}
