import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import Countdown from "./Countdown";
import type { Campaign } from "@/lib/season";

/**
 * Franja de Black Friday (27 nov – 1 dic) sobre el tema navideño. El "hasta
 * -X%" es el mayor descuento real de la tienda; si no hay descuentos cargados
 * no se muestra porcentaje.
 */
export default function BlackFridayBanner({
  campaign,
  maxDiscount,
}: {
  campaign: Campaign;
  maxDiscount: number | null;
}) {
  return (
    <section className="container-page pt-10">
      <div className="nv-bf relative overflow-hidden rounded-3xl bg-black px-6 py-8 text-white sm:px-10 sm:py-10">
        <div className="nv-bf-shine pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-[#FFD23F]">
              <Zap className="h-4 w-4 fill-current" /> Solo hasta el {campaign.endsLabel}
            </p>
            <h2 className="nv-bf-title mt-2 text-5xl font-black uppercase leading-none sm:text-7xl">
              Black Friday
            </h2>
            <p className="mt-3 text-lg text-white/80">
              {maxDiscount
                ? `Hasta -${maxDiscount}% en productos seleccionados, y Cyber Monday incluido.`
                : "Precios especiales en productos seleccionados, y Cyber Monday incluido."}
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 lg:items-end">
            <Countdown endsAt={campaign.endsAt} variant="glow" />
            <Link
              href="/ofertas"
              className="inline-flex items-center gap-2 rounded-xl bg-[#FFD23F] px-6 py-3 text-base font-extrabold text-black transition-colors hover:bg-[#ffe066]"
            >
              Ver ofertas Black Friday <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
