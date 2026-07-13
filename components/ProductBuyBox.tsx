"use client";

import { useState } from "react";
import { Plus, Minus, ShoppingCart, Check, MessageCircle } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import { formatCop } from "@/lib/format";
import type { CartProductInput } from "./AddToCartButton";

export default function ProductBuyBox({ product }: { product: CartProductInput }) {
  const addItem = useCart((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const soldOut = product.maxStock <= 0;
  const max = product.maxStock > 0 ? product.maxStock : 99;

  const changeQty = (delta: number) =>
    setQty((q) => Math.min(Math.max(1, q + delta), max));

  const handleAdd = () => {
    if (soldOut) return;
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const consultUrl = buildWhatsappUrl(
    `¡Hola SAMVERO! 👋 Quiero más información sobre *${product.name}* (${formatCop(
      product.priceCop
    )}).`
  );

  if (soldOut) {
    return (
      <div className="rounded-2xl border border-navy/10 bg-light p-5">
        <p className="font-semibold text-navy">Producto agotado</p>
        <p className="mt-1 text-sm text-slatebrand">
          Escríbenos por WhatsApp para consultar disponibilidad.
        </p>
        <a
          href={consultUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-dark mt-4 w-full"
        >
          <MessageCircle className="h-5 w-5" /> Consultar por WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-navy">Cantidad</span>
        <div className="inline-flex items-center rounded-xl border border-navy/10">
          <button
            onClick={() => changeQty(-1)}
            aria-label="Restar"
            className="inline-flex h-10 w-10 items-center justify-center text-navy hover:text-brand"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center font-semibold">{qty}</span>
          <button
            onClick={() => changeQty(1)}
            aria-label="Sumar"
            className="inline-flex h-10 w-10 items-center justify-center text-navy hover:text-brand"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        {product.maxStock > 0 && product.maxStock <= 5 && (
          <span className="text-xs font-medium text-brand">
            ¡Solo quedan {product.maxStock}!
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button onClick={handleAdd} className="btn-primary flex-1">
          {added ? (
            <>
              <Check className="h-5 w-5" /> Agregado
            </>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5" /> Agregar al carrito
            </>
          )}
        </button>
        <a
          href={consultUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline flex-1"
        >
          <MessageCircle className="h-5 w-5" /> Consultar
        </a>
      </div>
    </div>
  );
}
