"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { X, Plus, Minus, Trash2, ShoppingBag, MessageCircle } from "lucide-react";
import ProductImage from "./ProductImage";
import { useCart, selectSubtotal } from "@/lib/cart-store";
import { formatCop } from "@/lib/format";
import { buildWhatsappOrderUrl } from "@/lib/whatsapp";

export default function CartDrawer() {
  const { items, isOpen, closeCart, setQuantity, removeItem, clear } = useCart();
  const subtotal = useCart(selectSubtotal);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Bloquea el scroll del body cuando el drawer está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted) return null;

  const checkout = () => {
    if (items.length === 0) return;
    window.open(buildWhatsappOrderUrl(items, subtotal), "_blank");
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-50 bg-navy/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isOpen}
      />

      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Carrito de compras"
      >
        <div className="flex items-center justify-between border-b border-navy/5 px-5 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-navy">
            <ShoppingBag className="h-5 w-5 text-brand" /> Tu carrito
          </h2>
          <button
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-navy hover:bg-light"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="h-12 w-12 text-navy/20" />
            <p className="text-lg font-semibold text-navy">Tu carrito está vacío</p>
            <p className="text-sm text-slatebrand">
              Explora nuestros productos y agrégalos aquí.
            </p>
            <Link href="/tienda" onClick={closeCart} className="btn-primary mt-2">
              Ir a la tienda
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-3">
                    <Link
                      href={`/producto/${item.slug}`}
                      onClick={closeCart}
                      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-light"
                    >
                      <ProductImage
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <p className="line-clamp-2 text-sm font-semibold text-navy">
                          {item.name}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          aria-label="Eliminar"
                          className="text-slatebrand hover:text-brand"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-sm font-bold text-navy">
                        {formatCop(item.priceCop)}
                      </p>
                      <div className="mt-auto flex items-center gap-2">
                        <div className="inline-flex items-center rounded-lg border border-navy/10">
                          <button
                            onClick={() => setQuantity(item.id, item.quantity - 1)}
                            aria-label="Restar"
                            className="inline-flex h-8 w-8 items-center justify-center text-navy hover:text-brand"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => setQuantity(item.id, item.quantity + 1)}
                            aria-label="Sumar"
                            className="inline-flex h-8 w-8 items-center justify-center text-navy hover:text-brand"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                onClick={clear}
                className="mt-4 text-xs font-medium text-slatebrand hover:text-brand"
              >
                Vaciar carrito
              </button>
            </div>

            <div className="border-t border-navy/5 px-5 py-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-slatebrand">Subtotal</span>
                <span className="text-xl font-bold text-navy">
                  {formatCop(subtotal)}
                </span>
              </div>
              <button onClick={checkout} className="btn-primary w-full">
                <MessageCircle className="h-5 w-5" /> Finalizar por WhatsApp
              </button>
              <Link
                href="/carrito"
                onClick={closeCart}
                className="mt-2 block text-center text-xs font-medium text-slatebrand hover:text-brand"
              >
                Ver carrito completo
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
