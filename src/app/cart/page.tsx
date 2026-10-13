"use client";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/src/stores/cart";
import { money } from "@/src/lib/utils";
export default function CartPage() {
  const items = useCart((s) => s.items);
  const hydrated = useCart((s) => s.hydrated);
  const setQty = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const subtotal = useCart((s) => s.subtotal());
  if (!hydrated)
    return (
      <div className="container-shell py-20 text-center text-slate-500">
        Сагс ачааллаж байна...
      </div>
    );
  return (
    <div className="container-shell py-8">
      <div className="mb-7">
        <p className="text-xs font-extrabold uppercase tracking-[.18em] text-indigo-600">
          Таны сонголт
        </p>
        <h1 className="mt-1 text-3xl font-black">Сагс</h1>
      </div>
      {!items.length ? (
        <div className="card px-6 py-16 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
            <ShoppingBag size={28} />
          </span>
          <h2 className="mt-4 text-xl font-extrabold">
            Таны сагс хоосон байна
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Таалагдсан бараагаа сонгоод энд нэмээрэй.
          </p>
          <Link href="/products" className="btn-primary mt-6">
            Бараа үзэх
          </Link>
        </div>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
          <section className="grid gap-3">
            {items.map((item) => (
              <article
                key={item.productId}
                className="card flex gap-3 p-3 sm:gap-5 sm:p-5"
              >
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-28 sm:w-28">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/products/${item.productId}`}
                    className="line-clamp-2 font-bold hover:text-indigo-600"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm font-extrabold">
                    {money(item.price)}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      className="icon-button border border-slate-200"
                      aria-label="Тоо хасах"
                      onClick={() => setQty(item.productId, item.quantity - 1)}
                    >
                      <Minus size={15} />
                    </button>
                    <span className="min-w-5 text-center text-sm font-bold">
                      {item.quantity}
                    </span>
                    <button
                      className="icon-button border border-slate-200"
                      aria-label="Тоо нэмэх"
                      onClick={() => setQty(item.productId, item.quantity + 1)}
                    >
                      <Plus size={15} />
                    </button>
                    <button
                      className="ml-2 inline-flex min-h-10 items-center gap-1 rounded-lg px-2 text-xs font-bold text-rose-600 hover:bg-rose-50"
                      onClick={() => remove(item.productId)}
                    >
                      <Trash2 size={15} /> Устгах
                    </button>
                  </div>
                </div>
                <div className="hidden whitespace-nowrap font-extrabold sm:block">
                  {money(item.price * item.quantity)}
                </div>
              </article>
            ))}
          </section>
          <aside className="card p-5">
            <h2 className="text-lg font-extrabold">Захиалгын дүн</h2>
            <div className="mt-5 flex justify-between text-sm text-slate-500">
              <span>Барааны дүн</span>
              <span>{money(subtotal)}</span>
            </div>
            <div className="mt-3 flex justify-between text-sm text-slate-500">
              <span>Хүргэлт</span>
              <span>Checkout дээр тодорхойлно</span>
            </div>
            <div className="my-5 border-t border-slate-100" />
            <div className="flex justify-between text-base font-black">
              <span>Нийт дүн</span>
              <span>{money(subtotal)}</span>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-400">
              Эцсийн үнэ болон барааны боломжийг захиалга баталгаажуулах үед
              сервер шалгана.
            </p>
            <Link href="/checkout" className="btn-primary mt-5 w-full">
              Захиалга өгөх
            </Link>
            <Link href="/products" className="btn-secondary mt-2 w-full">
              Дэлгүүр үргэлжлүүлэх
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
