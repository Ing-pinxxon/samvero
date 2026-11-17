import { Sparkles } from "lucide-react";

const slogans = [
  "Todo lo que necesitas, en un solo lugar.",
  "De todo, para todos, en un solo clic.",
  "Tecnología y hogar que transforman tu vida.",
  "Lo que necesitas, cuando lo necesitas.",
];

const halloweenSlogans = [
  "🎃 Precios de miedo en tecnología y hogar.",
  "🦇 Ofertas de Halloween hasta el 31 de octubre.",
  "Todo lo que necesitas, en un solo lugar.",
  "👻 ¿Dulce o truco? Mejor una oferta.",
];

const navidadSlogans = [
  "🎄 Alumbra tu diciembre con SAMVERO.",
  "🎶 Llegó diciembre con su alegría.",
  "🎁 Lo que el Niño Dios trae este año, a precio de diciembre.",
  "🕯️ Regalos para toda la familia, en un solo lugar.",
  "⭐ Ofertas navideñas hasta el 31 de diciembre.",
];

const THEMES = {
  halloween: { items: halloweenSlogans, className: "slogan-strip bg-gradient-to-r from-navy to-witch" },
  navidad: { items: navidadSlogans, className: "slogan-strip bg-gradient-to-r from-[#7a1020] via-[#0b2a1a] to-[#7a1020]" },
};

export default function SloganStrip({ theme = null }: { theme?: "halloween" | "navidad" | null }) {
  const t = theme ? THEMES[theme] : null;
  const items = t?.items ?? slogans;
  return (
    <section className={`${t?.className ?? "bg-navy"} py-4 text-white`}>
      <div className="flex gap-10 overflow-hidden">
        <div className="flex shrink-0 animate-[marquee_28s_linear_infinite] gap-10">
          {[...items, ...items].map((s, i) => (
            <span
              key={i}
              className="flex shrink-0 items-center gap-2 text-sm font-medium text-white/90"
            >
              <Sparkles className="h-4 w-4 text-brand" />
              {s}
            </span>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
