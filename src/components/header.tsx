"use client";
import Link from "next/link";
import { Search, ShoppingBag, UserRound, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/src/stores/cart";
export default function Header() {
  const [open, setOpen] = useState(false);
  const count = useCart((s) => s.count());
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="container-shell flex h-[68px] items-center gap-4">
        <button
          aria-label="Цэс нээх"
          className="icon-button md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-black tracking-tight text-slate-900"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-lg text-white">
            S
          </span>
          <span className="text-lg">
            sutain<span className="text-indigo-600">buyant</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex">
          <Link className="hover:text-indigo-600" href="/products">
            Бүх бараа
          </Link>
          <Link className="hover:text-indigo-600" href="/products?sort=newest">
            Шинээр нэмэгдсэн
          </Link>
        </nav>
        <form
          action="/products"
          className="ml-auto hidden max-w-xl flex-1 md:flex"
        >
          <div className="relative w-full">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              name="search"
              className="field w-full !pl-10"
              placeholder="Юу хайж байна вэ?"
            />
          </div>
        </form>
        <Link
          href="/products"
          aria-label="Хайлт"
          className="icon-button md:hidden"
        >
          <Search size={20} />
        </Link>
        <Link
          href="/profile"
          aria-label="Миний бүртгэл"
          className="icon-button hidden sm:inline-flex"
        >
          <UserRound size={20} />
        </Link>
        <Link
          href="/cart"
          aria-label={`Сагс, ${count} бараа`}
          className="icon-button relative"
        >
          <ShoppingBag size={20} />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white">
              {count}
            </span>
          )}
        </Link>
      </div>
      {open && (
        <nav className="container-shell grid gap-1 border-t border-slate-100 py-3 md:hidden">
          <Link
            className="mobile-link"
            href="/products"
            onClick={() => setOpen(false)}
          >
            Бүх бараа
          </Link>
          <Link
            className="mobile-link"
            href="/products?sort=newest"
            onClick={() => setOpen(false)}
          >
            Шинээр нэмэгдсэн
          </Link>
          <Link
            className="mobile-link"
            href="/profile"
            onClick={() => setOpen(false)}
          >
            Миний бүртгэл
          </Link>
        </nav>
      )}
    </header>
  );
}
