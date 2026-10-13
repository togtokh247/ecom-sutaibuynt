"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import AccountGuard from "@/src/components/account-guard";
import { endpoints, unwrap } from "@/src/lib/api";
import type { Order } from "@/src/lib/types";
import { errorMessage, money } from "@/src/lib/utils";
function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    endpoints
      .orders()
      .then((r) => setOrders(unwrap<Order>(r)))
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className="container-shell py-8">
      <h1 className="text-3xl font-black">Миний захиалгууд</h1>
      <p className="mt-2 text-sm text-slate-500">
        Өмнөх захиалгын мэдээлэл болон төлөв.
      </p>
      {loading ? (
        <p className="py-12 text-slate-500">Захиалга ачааллаж байна...</p>
      ) : error ? (
        <p
          role="alert"
          className="mt-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-700"
        >
          {error}
        </p>
      ) : !orders.length ? (
        <div className="card mt-6 p-10 text-center">
          <h2 className="font-bold">Одоогоор захиалга алга</h2>
          <Link href="/products" className="btn-primary mt-4">
            Бараа үзэх
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-3">
          {orders.map((o) => (
            <Link
              key={o.id}
              href={`/orders/${o.id}`}
              className="card flex flex-wrap items-center justify-between gap-4 p-5 hover:border-indigo-200"
            >
              <div>
                <p className="text-xs text-slate-400">Захиалгын дугаар</p>
                <p className="font-extrabold">#{o.id}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {o.created_at
                    ? new Date(o.created_at).toLocaleDateString("mn-MN")
                    : ""}
                </p>
              </div>
              <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
                {String(o.status || "Төлөв тодорхойгүй")}
              </span>
              <strong>{money(o.total_amount ?? o.total)}</strong>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
export default function OrdersPage() {
  return (
    <AccountGuard>
      <OrdersContent />
    </AccountGuard>
  );
}
