"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "@/src/lib/types";
import { productName, productPrice, productImage } from "@/src/lib/utils";

export type CartLine = {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};
type CartState = {
  items: CartLine[];
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
  add: (product: Product, quantity?: number) => void;
  setQuantity: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
};
export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      hydrated: false,
      setHydrated: (value) => set({ hydrated: value }),
      add: (p, quantity = 1) =>
        set((state) => {
          const id = String(p.id);
          const found = state.items.find((i) => i.productId === id);
          return {
            items: found
              ? state.items.map((i) =>
                  i.productId === id
                    ? { ...i, quantity: i.quantity + quantity }
                    : i
                )
              : [
                  ...state.items,
                  {
                    productId: id,
                    name: productName(p),
                    price: productPrice(p),
                    image: productImage(p),
                    quantity: Math.max(1, quantity),
                  },
                ],
          };
        }),
      setQuantity: (id, quantity) =>
        set((s) => ({
          items:
            quantity <= 0
              ? s.items.filter((i) => i.productId !== id)
              : s.items.map((i) =>
                  i.productId === id
                    ? { ...i, quantity: Math.min(99, Math.floor(quantity)) }
                    : i
                ),
        })),
      remove: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.productId !== id) })),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: "sutainbuyant-cart",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    }
  )
);
