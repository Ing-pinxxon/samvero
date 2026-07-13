"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: number;
  name: string;
  slug: string;
  priceCop: number;
  image: string | null;
  quantity: number;
  maxStock: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: number) => void;
  setQuantity: (id: number, quantity: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      addItem: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            const max = item.maxStock > 0 ? item.maxStock : Infinity;
            const nextQty = Math.min(existing.quantity + quantity, max);
            return {
              isOpen: true,
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: nextQty } : i
              ),
            };
          }
          return {
            isOpen: true,
            items: [...state.items, { ...item, quantity }],
          };
        }),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      setQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.id === id
                ? {
                    ...i,
                    quantity: Math.max(
                      1,
                      i.maxStock > 0 ? Math.min(quantity, i.maxStock) : quantity
                    ),
                  }
                : i
            )
            .filter((i) => i.quantity > 0),
        })),
      clear: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: "samvero-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);

/** Selectores derivados (usar con useCart(selectCount) para evitar renders extra) */
export const selectCount = (state: CartState) =>
  state.items.reduce((acc, i) => acc + i.quantity, 0);

export const selectSubtotal = (state: CartState) =>
  state.items.reduce((acc, i) => acc + i.priceCop * i.quantity, 0);
