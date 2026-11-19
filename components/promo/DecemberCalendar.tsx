import { clsx } from "clsx";
import { blackFridayDates, type Season } from "@/lib/season";

type Item = { emoji: string; title: string; when: string; detail: string; from: number; to: number };

const dayNumber = (y: number, m: number, d: number) => Math.floor(Date.UTC(y, m - 1, d) / 864e5);

/**
 * "Agenda decembrina": las fechas de la Navidad colombiana con su estado
 * (ya pasó, es hoy o cuántos días faltan), calculado con la fecha real.
 */
export default function DecemberCalendar({ season }: { season: Season }) {
  const { y, m, d } = season.today;
  const year = m === 1 ? y - 1 : y;
  const today = dayNumber(y, m, d);

  const bf = blackFridayDates(year);
  const bfDay = bf.start.getUTCDate();

  const items: Item[] = [
    { emoji: "⚡", title: "Black Friday", when: `${bfDay} nov – 1 dic`, detail: "La semana de descuentos más grande del año.", from: dayNumber(year, 11, bfDay), to: dayNumber(year, 11, bfDay + 4) },
    { emoji: "🕯️", title: "Noche de velitas", when: "7 de diciembre", detail: "Faroles y velas encendidas en cada casa.", from: dayNumber(year, 12, 7), to: dayNumber(year, 12, 8) },
    { emoji: "🙏", title: "Novena de aguinaldos", when: "16 – 24 dic", detail: "Nueve noches de villancicos, natilla y buñuelos.", from: dayNumber(year, 12, 16), to: dayNumber(year, 12, 24) },
    { emoji: "⭐", title: "Nochebuena", when: "24 de diciembre", detail: "Llega el Niño Dios con los regalos.", from: dayNumber(year, 12, 24), to: dayNumber(year, 12, 24) },
    { emoji: "🎆", title: "Año Viejo", when: "31 de diciembre", detail: "Último día de ofertas del año.", from: dayNumber(year, 12, 31), to: dayNumber(year, 12, 31) },
    { emoji: "👑", title: "Día de Reyes", when: "6 de enero", detail: "Cierra la temporada decembrina.", from: dayNumber(year + 1, 1, 6), to: dayNumber(year + 1, 1, 6) },
  ];

  return (
    <section className="container-page pt-16">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-navy">Agenda decembrina</h2>
        <p className="mt-1 text-slatebrand">Las fechas que hacen especial la Navidad en Colombia.</p>
      </div>
      <ol className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        {items.map((it) => {
          const state = today > it.to ? "past" : today >= it.from ? "now" : "next";
          const left = it.from - today;
          return (
            <li
              key={it.title}
              className={clsx(
                "nv-date relative flex flex-col gap-1 rounded-2xl border p-3 sm:p-4",
                state === "now" && "nv-date--now",
                state === "past" && "opacity-55"
              )}
            >
              <span className="text-2xl sm:text-3xl" aria-hidden>
                {it.emoji}
              </span>
              <span className="font-bold">{it.title}</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-[#FFD23F]">{it.when}</span>
              <span className="hidden text-sm text-slatebrand sm:block">{it.detail}</span>
              <span
                className={clsx(
                  "mt-2 self-start rounded-full px-2.5 py-0.5 text-xs font-bold",
                  state === "now" && "bg-[#FFD23F] text-black",
                  state === "next" && "bg-white/10 text-white",
                  state === "past" && "bg-white/5 text-white/70"
                )}
              >
                {state === "now" ? "¡Es hoy!" : state === "past" ? "Ya pasó" : left === 1 ? "Mañana" : `Faltan ${left} días`}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
