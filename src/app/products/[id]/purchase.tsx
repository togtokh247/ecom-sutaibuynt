"use client";
import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import type { Product } from "@/src/lib/types";
import { useCart } from "@/src/stores/cart";
export default function ProductPurchase({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const add = useCart((s) => s.add);
  return (
    <div className="mt-7">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-sm font-bold">Тоо ширхэг</span>
        <div className="flex items-center rounded-xl border border-slate-200 bg-white">
          <button
            className="icon-button"
            aria-label="Тоо хасах"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
          >
            <Minus size={16} />
          </button>
          <span className="w-8 text-center font-bold">{qty}</span>
          <button
            className="icon-button"
            aria-label="Тоо нэмэх"
            onClick={() => setQty((q) => Math.min(99, q + 1))}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
      <button
        className="btn-primary w-full sm:w-auto"
        onClick={() => {
          add(product, qty);
          setAdded(true);
        }}
      >
        <ShoppingCart size={18} />
        {added ? "Сагсанд нэмэгдлээ ✓" : "Сагсанд нэмэх"}
      </button>
    </div>
  );
}
