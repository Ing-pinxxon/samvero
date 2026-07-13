import { Sparkles } from "lucide-react";

const slogans = [
  "Todo lo que necesitas, en un solo lugar.",
  "De todo, para todos, en un solo clic.",
  "Tecnología y hogar que transforman tu vida.",
  "Lo que necesitas, cuando lo necesitas.",
];

export default function SloganStrip() {
  return (
    <section className="bg-navy py-4 text-white">
      <div className="flex gap-10 overflow-hidden">
        <div className="flex shrink-0 animate-[marquee_28s_linear_infinite] gap-10">
          {[...slogans, ...slogans].map((s, i) => (
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
