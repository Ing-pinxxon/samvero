import { unstable_noStore as noStore } from "next/cache";

/**
 * Temporadas de la tienda (decoración y avisos de campaña).
 *
 * Halloween se enciende solo del 1 de octubre al 1 de noviembre (hora de
 * Colombia) y la promoción cierra el 31 de octubre a las 11:59:59 p. m.
 * Así la tienda vuelve sola a su estilo normal sin otro deploy.
 *
 * Para forzarla (probar en local o apagarla antes de tiempo) define la
 * variable de servidor SEASON: "halloween" la enciende, "off" la apaga.
 */

export type Season = {
  halloween: boolean;
  /** Cierre de la promoción en ISO 8601, o null si no hay campaña activa. */
  promoEndsAt: string | null;
};

// Colombia no tiene horario de verano: siempre UTC-5.
const CO = "-05:00";

function halloweenDates(now: Date) {
  const year = now.getUTCFullYear();
  return {
    start: new Date(`${year}-10-01T00:00:00${CO}`),
    end: new Date(`${year}-11-01T00:00:00${CO}`),
    promoEnd: new Date(`${year}-10-31T23:59:59${CO}`),
  };
}

export function getSeason(now: Date = new Date()): Season {
  // La temporada depende de la fecha de cada visita: ninguna página que la
  // use puede quedar congelada en caché con la fecha del build.
  noStore();

  const override = process.env.SEASON?.trim().toLowerCase();
  const { start, end, promoEnd } = halloweenDates(now);

  const halloween =
    override === "halloween" ? true : override === "off" ? false : now >= start && now < end;

  if (!halloween) return { halloween: false, promoEndsAt: null };

  // Forzada fuera de octubre, la cuenta apunta al próximo 31 de octubre.
  const endsAt =
    now < promoEnd ? promoEnd : halloweenDates(new Date(`${now.getUTCFullYear() + 1}-06-01`)).promoEnd;
  return { halloween: true, promoEndsAt: endsAt.toISOString() };
}

/** Días que un producto se considera "Nuevo" desde que se crea. */
export const NEW_PRODUCT_DAYS = 15;

/** A partir de este stock (o menos) se muestra "¡Solo quedan X!". */
export const LOW_STOCK_THRESHOLD = 5;

export function isNewProduct(createdAt: Date, now: Date = new Date()): boolean {
  return now.getTime() - createdAt.getTime() < NEW_PRODUCT_DAYS * 24 * 60 * 60 * 1000;
}
