import { unstable_noStore as noStore } from "next/cache";

/**
 * Calendario de temporadas de la tienda (hora de Colombia, UTC-5 todo el año).
 *
 * - Halloween: decoración del 1 al 31 de octubre; ofertas hasta el 31.
 * - Navidad (estilo colombiano): decoración del 15 de noviembre al 6 de
 *   enero; ofertas hasta el 31 de diciembre a las 11:59:59 p. m.
 * - Black Friday: del viernes después del cuarto jueves de noviembre hasta
 *   el martes siguiente (Cyber Monday + 1), por encima del tema navideño.
 *
 * Todo se enciende y apaga solo por fecha, sin otro deploy. Variables de
 * servidor para forzarlo (pruebas o apagado anticipado):
 *   SEASON=halloween | navidad | blackfriday | off
 *   SEASON_DATE=2026-12-18   (simula esa fecha; útil para revisar la novena)
 */

export type Theme = "halloween" | "navidad";

export type Campaign = {
  id: "halloween" | "navidad" | "blackfriday";
  /** Nombre visible: "Halloween", "Navidad", "Black Friday". */
  name: string;
  emoji: string;
  /** Cierre en ISO 8601. */
  endsAt: string;
  /** Cierre en palabras: "31 de diciembre". */
  endsLabel: string;
};

/** Fechas especiales del diciembre colombiano. */
export type Moment =
  | { kind: "velitas" }
  | { kind: "novena"; day: number }
  | { kind: "navidad" }
  | { kind: "anoviejo" }
  | { kind: "anonuevo"; year: number };

export type Season = {
  theme: Theme | null;
  campaign: Campaign | null;
  moment: Moment | null;
  /** Mensajes de temporada para la barra superior. */
  messages: string[];
  /** Fecha "de hoy" en Colombia (año, mes 1-12, día), ya con SEASON_DATE aplicado. */
  today: { y: number; m: number; d: number };
};

const CO = "-05:00";
const MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/** Medianoche (u otra hora) de un día en Colombia. Date.UTC normaliza días fuera de rango (31 nov → 1 dic). */
const at = (y: number, m: number, d: number, time = "00:00:00") => {
  const [hh, mm, ss] = time.split(":").map(Number);
  return new Date(Date.UTC(y, m - 1, d, hh + 5, mm, ss));
};

/** Viernes negro y el martes en que termina la semana (Cyber Monday + 1). */
export function blackFridayDates(year: number) {
  const firstDow = new Date(Date.UTC(year, 10, 1)).getUTCDay(); // 0 = domingo
  const firstThursday = 1 + ((4 - firstDow + 7) % 7);
  const friday = firstThursday + 21 + 1;
  return {
    start: at(year, 11, friday),
    end: at(year, 11, friday + 4, "23:59:59"), // puede caer en diciembre: Date lo normaliza
  };
}

function colombiaToday(now: Date) {
  const local = new Date(now.getTime() - 5 * 60 * 60 * 1000);
  return { y: local.getUTCFullYear(), m: local.getUTCMonth() + 1, d: local.getUTCDate() };
}

function campaign(id: Campaign["id"], end: Date): Campaign {
  const local = colombiaToday(end);
  const meta = {
    halloween: { name: "Halloween", emoji: "🎃" },
    navidad: { name: "Navidad", emoji: "🎄" },
    blackfriday: { name: "Black Friday", emoji: "⚡" },
  }[id];
  return { id, ...meta, endsAt: end.toISOString(), endsLabel: `${local.d} de ${MONTHS[local.m - 1]}` };
}

export function getSeason(now: Date = new Date()): Season {
  // La temporada depende de la fecha de cada visita: ninguna página que la
  // use puede quedar congelada en caché con la fecha del build.
  noStore();

  const simulated = process.env.SEASON_DATE?.trim();
  if (simulated) now = new Date(`${simulated.slice(0, 10)}T12:00:00${CO}`);

  const today = colombiaToday(now);
  const { y, m, d } = today;
  const override = process.env.SEASON?.trim().toLowerCase();

  // --- Tema por fecha (o forzado) ---
  let theme: Theme | null = null;
  if (m === 10) theme = "halloween";
  else if ((m === 11 && d >= 15) || m === 12 || (m === 1 && d <= 6)) theme = "navidad";
  if (override === "off") theme = null;
  else if (override === "halloween") theme = "halloween";
  else if (override === "navidad" || override === "blackfriday") theme = "navidad";

  // --- Campaña con cuenta regresiva ---
  let active: Campaign | null = null;
  if (theme === "halloween") {
    const end = at(m === 10 || m < 10 ? y : y + 1, 10, 31, "23:59:59");
    if (now <= end) active = campaign("halloween", end);
  } else if (theme === "navidad") {
    const seasonYear = m === 1 ? y - 1 : y;
    const bf = blackFridayDates(seasonYear);
    const xmasEnd = at(seasonYear, 12, 31, "23:59:59");
    const forcedBf = override === "blackfriday";
    if (forcedBf || (now >= bf.start && now <= bf.end)) {
      active = campaign("blackfriday", now <= bf.end ? bf.end : blackFridayDates(seasonYear + 1).end);
    } else if (now <= xmasEnd) {
      active = campaign("navidad", xmasEnd);
    }
  }

  // --- Fechas decembrinas ---
  let moment: Moment | null = null;
  if (theme === "navidad") {
    if (m === 12 && (d === 7 || d === 8)) moment = { kind: "velitas" };
    else if (m === 12 && d >= 16 && d <= 24) moment = { kind: "novena", day: d - 15 };
    else if (m === 12 && d === 25) moment = { kind: "navidad" };
    else if (m === 12 && d === 31) moment = { kind: "anoviejo" };
    else if (m === 1) moment = { kind: "anonuevo", year: y };
  }

  const messages: string[] = [];
  if (moment?.kind === "velitas") messages.push("🕯️ ¡Feliz noche de velitas!");
  if (moment?.kind === "novena")
    messages.push(moment.day === 9 ? "⭐ Hoy es Nochebuena: último día de novena" : `🙏 Novena de aguinaldos: hoy es el día ${moment.day}`);
  if (moment?.kind === "navidad") messages.push("🎁 ¡Feliz Navidad de parte de SAMVERO!");
  if (moment?.kind === "anoviejo") messages.push("🎆 ¡Feliz Año Viejo! Hoy es el último día de ofertas");
  if (moment?.kind === "anonuevo") messages.push(`🎉 ¡Feliz ${moment.year}! Gracias por comprar en SAMVERO`);
  if (active) messages.push(`${active.emoji} Ofertas de ${active.name} hasta el ${active.endsLabel}`);

  return { theme, campaign: active, moment, messages, today };
}

/** Días que un producto se considera "Nuevo" desde que se crea. */
export const NEW_PRODUCT_DAYS = 15;

/** A partir de este stock (o menos) se muestra "¡Solo quedan X!". */
export const LOW_STOCK_THRESHOLD = 5;

export function isNewProduct(createdAt: Date, now: Date = new Date()): boolean {
  return now.getTime() - createdAt.getTime() < NEW_PRODUCT_DAYS * 24 * 60 * 60 * 1000;
}
