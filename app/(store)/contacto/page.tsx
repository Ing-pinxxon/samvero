import type { Metadata } from "next";
import { MessageCircle, Mail, MapPin, Clock, Instagram } from "lucide-react";
import { buildWhatsappUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contáctanos por WhatsApp. Atención al cliente de SAMVERO, siempre disponibles para ayudarte con envíos a todo Colombia.",
  alternates: { canonical: "/contacto" },
};

const info = [
  { icon: Mail, title: "Correo", value: "hola@samvero.co" },
  { icon: MapPin, title: "Ubicación", value: "Colombia — Envíos a todo el país" },
  { icon: Clock, title: "Horario", value: "Lun a Sáb · 8:00 a.m. – 6:00 p.m." },
  { icon: Instagram, title: "Instagram", value: "@samvero.co" },
];

export default function ContactoPage() {
  const whatsapp = buildWhatsappUrl(
    "¡Hola SAMVERO! 👋 Quiero más información."
  );

  return (
    <div className="container-page py-14">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-navy sm:text-4xl">
          Estamos para ayudarte
        </h1>
        <p className="mt-3 text-slatebrand">
          Escríbenos por WhatsApp y te responderemos lo antes posible. Atención
          cercana y confiable, siempre contigo.
        </p>
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mx-auto mt-6"
        >
          <MessageCircle className="h-5 w-5" /> Escribir por WhatsApp
        </a>
      </div>

      <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2">
        {info.map(({ icon: Icon, title, value }) => (
          <div
            key={title}
            className="flex items-center gap-4 rounded-2xl border border-navy/5 bg-white p-5 shadow-card"
          >
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Icon className="h-6 w-6" />
            </span>
            <div>
              <p className="text-sm font-semibold text-navy">{title}</p>
              <p className="text-sm text-slatebrand">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
