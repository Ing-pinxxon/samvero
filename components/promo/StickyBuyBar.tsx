"use client";

import { MessageCircle, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import { formatCop } from "@/lib/format";
import type { CartProductInput } from "../AddToCartButton";

/**
 * Barra fija abajo en la ficha de producto (solo móvil), como el botón de
 * compra siempre visible de Temu: precio + agregar al carrito + WhatsApp.
 */
export default function StickyBuyBar({
  product,
  compareAtPriceCop,
}: {
  product: CartProductInput;
  compareAtPriceCop: number | null;
}) {
  const addItem = useCart((s) => s.addItem);
  const soldOut = product.maxStock <= 0;
  const consultUrl = buildWhatsappUrl(
    `¡Hola SAMVERO! 👋 Quiero más información sobre *${product.name}* (${formatCop(product.priceCop)}).`
  );
  const onSale = compareAtPriceCop !== null && compareAtPriceCop > product.priceCop;

  return (
    <div className="sticky-buy-bar fixed inset-x-0 bottom-0 z-30 border-t border-navy/10 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_-12px_rgba(13,27,42,0.25)] backdrop-blur lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] text-slatebrand">{soldOut ? "Agotado" : "Precio"}</p>
          <p className="truncate font-extrabold text-navy">
            <span className={onSale ? "text-brand" : undefined}>{formatCop(product.priceCop)}</span>
            {onSale && (
              <span className="ml-1.5 text-xs font-medium text-slatebrand line-through">
                {formatCop(compareAtPriceCop)}
              </span>
            )}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <a
            href={consultUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Consultar por WhatsApp"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#25D366] text-white"
          >
            <MessageCircle className="h-5 w-5" />
          </a>
          {!soldOut && (
            <button
              onClick={() => addItem(product, 1)}
              className="btn-primary h-11 px-4"
            >
              <ShoppingCart className="h-5 w-5" /> Agregar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
