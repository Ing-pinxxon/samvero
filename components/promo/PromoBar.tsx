"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";

/**
 * Barra superior de beneficios al estilo Temu. En pantallas anchas muestra
 * todos los mensajes; en móvil los rota uno a uno.
 */
export default function PromoBar({ halloween }: { halloween: boolean }) {
  const messages = [
    ...(halloween ? ["🎃 Ofertas de Halloween hasta el 31 de octubre"] : []),
    "🚚 Envíos a todo Colombia",
    "🔒 Compra 100% segura",
    "💬 Pide fácil por WhatsApp",
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % messages.length), 3500);
    return () => clearInterval(id);
  }, [messages.length]);

  return (
    <div
      className={clsx(
        "promo-bar text-xs font-semibold text-white",
        halloween ? "bg-gradient-to-r from-brand via-brand-600 to-witch" : "bg-navy"
      )}
    >
      <div className="container-page flex h-9 items-center justify-center">
        {/* Móvil: un mensaje a la vez */}
        <p key={index} aria-live="off" className="truncate motion-safe:animate-fade-in md:hidden">
          {messages[index]}
        </p>
        {/* Escritorio: todos */}
        <ul className="hidden items-center gap-6 md:flex">
          {messages.map((m) => (
            <li key={m} className="whitespace-nowrap">
              {m}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
