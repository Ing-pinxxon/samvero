"use client";

import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { clsx } from "clsx";
import { useCart } from "@/lib/cart-store";

export type CartProductInput = {
  id: number;
  name: string;
  slug: string;
  priceCop: number;
  image: string | null;
  maxStock: number;
};

type Props = {
  product: CartProductInput;
  quantity?: number;
  variant?: "full" | "icon";
  className?: string;
};

export default function AddToCartButton({
  product,
  quantity = 1,
  variant = "full",
  className,
}: Props) {
  const addItem = useCart((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const soldOut = product.maxStock <= 0;

  const handleAdd = () => {
    if (soldOut) return;
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleAdd}
        disabled={soldOut}
        aria-label={`Agregar ${product.name} al carrito`}
        className={clsx(
          "inline-flex h-10 w-10 items-center justify-center rounded-xl bg-navy text-white transition-colors hover:bg-brand disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        {added ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={soldOut}
      className={clsx("btn-primary w-full", className)}
    >
      {soldOut ? (
        "Agotado"
      ) : added ? (
        <>
          <Check className="h-5 w-5" /> Agregado
        </>
      ) : (
        <>
          <ShoppingCart className="h-5 w-5" /> Agregar al carrito
        </>
      )}
    </button>
  );
}
