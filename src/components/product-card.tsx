"use client";
import Link from "next/link";
import { ShoppingCart, ImageOff } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/src/lib/types";
import { money, productImage, productName, productPrice } from "@/src/lib/utils";
import { useCart } from "@/src/stores/cart";
export default function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);
  const image = productImage(product);
  return (
    <article className="product-card group">
      <Link
        href={`/products/${product.id}`}
        className="relative block aspect-[4/3] overflow-hidden bg-slate-100"
      >
        {image ? (
          <img
            src={image}
            alt={productName(product)}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="grid h-full place-items-center text-slate-300">
            <ImageOff size={34} />
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-slate-600">
          Дэлгүүр
        </span>
      </Link>
      <div className="p-3.5 sm:p-4">
        <Link
          href={`/products/${product.id}`}
          className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-slate-800 hover:text-indigo-600"
        >
          {productName(product)}
        </Link>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-base font-extrabold tracking-tight text-slate-950">
            {money(productPrice(product))}
          </span>
          <button
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-700 transition hover:bg-indigo-600 hover:text-white"
            aria-label={`${productName(product)} сагсанд нэмэх`}
            onClick={() => {
              add(product);
              setAdded(true);
              window.setTimeout(() => setAdded(false), 1400);
            }}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
        {added && (
          <p
            role="status"
            className="mt-2 text-xs font-semibold text-emerald-600"
          >
            Сагсанд нэмэгдлээ ✓
          </p>
        )}
      </div>
    </article>
  );
}
