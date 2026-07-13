"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";
import ProductImage from "@/components/ProductImage";
import { useCart, selectSubtotal } from "@/lib/cart-store";
import { formatCop } from "@/lib/format";
import { buildWhatsappOrderUrl } from "@/lib/whatsapp";

export default function CarritoPage() {
  const { items, setQuantity, removeItem, clear } = useCart();
  const subtotal = useCart(selectSubtotal);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const checkout = () => {
    if (items.length === 0) return;
    window.open(buildWhatsappOrderUrl(items, subtotal), "_blank");
  };

  if (!mounted) {
    return <div className="container-page py-20" />;
  }

  if (items.length === 0) {
    return (
      <div className="container-page flex flex-col items-center py-24 text-center">
        <ShoppingBag className="h-16 w-16 text-navy/20" />
        <h1 className="mt-4 text-2xl font-bold text-navy">Tu carrito está vacío</h1>
        <p className="mt-2 text-slatebrand">
          Descubre nuestros productos y encuentra justo lo que necesitas.
        </p>
        <Link href="/tienda" className="btn-primary mt-6">
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-bold text-navy">Tu carrito</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Lista */}
        <div className="divide-y divide-navy/5 rounded-2xl border border-navy/5 bg-white">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 sm:p-5">
              <Link
                href={`/producto/${item.slug}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-light"
              >
                <ProductImage
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/producto/${item.slug}`}
                    className="font-semibold text-navy hover:text-brand"
                  >
                    {item.name}
                  </Link>
                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label="Eliminar"
                    className="text-slatebrand hover:text-brand"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-sm text-slatebrand">
                  {formatCop(item.priceCop)} c/u
                </p>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="inline-flex items-center rounded-lg border border-navy/10">
                    <button
                      onClick={() => setQuantity(item.id, item.quantity - 1)}
                      aria-label="Restar"
                      className="inline-flex h-9 w-9 items-center justify-center text-navy hover:text-brand"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-9 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(item.id, item.quantity + 1)}
                      aria-label="Sumar"
                      className="inline-flex h-9 w-9 items-center justify-center text-navy hover:text-brand"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="font-bold text-navy">
                    {formatCop(item.priceCop * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between p-4 sm:p-5">
            <Link
              href="/tienda"
              className="inline-flex items-center gap-1 text-sm font-medium text-slatebrand hover:text-brand"
            >
              <ArrowLeft className="h-4 w-4" /> Seguir comprando
            </Link>
            <button
              onClick={clear}
              className="text-sm font-medium text-slatebrand hover:text-brand"
            >
              Vaciar carrito
            </button>
          </div>
        </div>

        {/* Resumen */}
        <aside className="h-fit rounded-2xl border border-navy/5 bg-white p-6 shadow-card lg:sticky lg:top-24">
          <h2 className="text-lg font-bold text-navy">Resumen del pedido</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-slatebrand">
              <span>Subtotal</span>
              <span className="font-medium text-navy">{formatCop(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slatebrand">
              <span>Envío</span>
              <span>Se coordina por WhatsApp</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-navy/5 pt-4">
            <span className="font-semibold text-navy">Total</span>
            <span className="text-xl font-bold text-navy">
              {formatCop(subtotal)}
            </span>
          </div>
          <button onClick={checkout} className="btn-primary mt-6 w-full">
            <MessageCircle className="h-5 w-5" /> Finalizar por WhatsApp
          </button>
          <p className="mt-3 text-center text-xs text-slatebrand">
            Te llevaremos a WhatsApp con el resumen de tu pedido para coordinar
            pago y envío.
          </p>
        </aside>
      </div>
    </div>
  );
}
