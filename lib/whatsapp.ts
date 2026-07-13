import type { CartItem } from "./cart-store";
import { formatCop } from "./format";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "573000000000";

/** Construye el mensaje de pedido y devuelve el enlace wa.me listo para abrir. */
export function buildWhatsappOrderUrl(items: CartItem[], subtotal: number): string {
  const lines: string[] = [];
  lines.push("¡Hola SAMVERO! 👋 Quiero hacer este pedido:");
  lines.push("");

  items.forEach((item, index) => {
    lines.push(
      `${index + 1}. ${item.name} x${item.quantity} — ${formatCop(
        item.priceCop * item.quantity
      )}`
    );
  });

  lines.push("");
  lines.push(`*Total: ${formatCop(subtotal)}*`);
  lines.push("");
  lines.push("¿Me confirmas disponibilidad y envío? 🙌");

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

/** Enlace de WhatsApp para una consulta general o de un producto puntual. */
export function buildWhatsappUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
