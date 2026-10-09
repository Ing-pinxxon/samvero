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

export default function SloganStrip({ halloween = false }: { halloween?: boolean }) {
  const items = halloween ? halloweenSlogans : slogans;
  return (
    <section className={halloween ? "bg-gradient-to-r from-navy to-witch py-4 text-white" : "bg-navy py-4 text-white"}>
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
