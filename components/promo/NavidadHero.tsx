import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck } from "lucide-react";
import ProductImage from "../ProductImage";
import Countdown from "./Countdown";
import GiftSurprise from "./GiftSurprise";
import type { HeroSpotlight } from "./HalloweenHero";
import { AlumbradoArcs, BethlehemStar, Bow, FarolesRow, LightGarland, PuebloSkyline } from "./NavidadDecor";
import { formatCop } from "@/lib/format";
import { primaryImage } from "@/lib/data";
import { LOW_STOCK_THRESHOLD, type Season } from "@/lib/season";

function momentLabel(season: Season): string | null {
  const m = season.moment;
  if (!m) return null;
  switch (m.kind) {
    case "velitas":
      return "🕯️ Hoy es la noche de velitas";
    case "novena":
      return m.day === 9 ? "⭐ Nochebuena · último día de novena" : `🙏 Novena de aguinaldos · día ${m.day} de 9`;
    case "navidad":
      return "🎁 ¡Feliz Navidad de parte de SAMVERO!";
    case "anoviejo":
      return "🎆 Último día de ofertas del año";
    case "anonuevo":
      return null;
  }
}

/**
 * Banner principal en Navidad (estilo colombiano): cielo de alumbrados,
 * estrella de Belén, pueblo con iglesia y palmas de cera, faroles de velitas,
 * la oferta más rebajada envuelta como regalo y un regalo que se abre.
 */
export default function NavidadHero({
  season,
  spotlight,
}: {
  season: Season;
  spotlight: HeroSpotlight;
}) {
  const { campaign, moment } = season;
  const newYear = moment?.kind === "anonuevo" ? moment.year : null;
  const isBf = campaign?.id === "blackfriday";
  const pill = momentLabel(season);

  return (
    <>
      <section className="hw-hero nv-hero relative isolate overflow-hidden text-white">
        <div className="nv-sky absolute inset-0 -z-20" aria-hidden />
        <div className="hw-stars absolute inset-0 -z-10 opacity-80" aria-hidden />
        <AlumbradoArcs className="nv-arcs absolute inset-x-0 top-0 -z-10 h-[70%] w-full opacity-90" />
        <BethlehemStar className="absolute -right-16 -top-16 -z-10 h-56 w-56 sm:right-[4%] sm:top-2 sm:h-72 sm:w-72" />

        <div className="container-page relative grid items-center gap-12 pb-44 pt-14 sm:pb-56 lg:grid-cols-[1.1fr_0.9fr] lg:pt-20">
          <div className="animate-fade-in">
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip border border-white/20 bg-white/10 font-semibold text-white">
                {isBf ? "⚡ Black Friday + Navidad" : newYear ? `🎉 ¡Feliz ${newYear}!` : "🎄 Navidad SAMVERO"}
              </span>
              {pill && (
                <span className="chip border border-[#FFD23F]/50 bg-[#FFD23F]/15 font-semibold text-[#FFE9A3]">
                  {pill}
                </span>
              )}
            </div>
            <h1 className="nv-title mt-5 text-6xl leading-[0.95] sm:text-7xl lg:text-8xl">
              {newYear ? (
                <>
                  Feliz <span className="nv-lights-text block">Año Nuevo</span>
                </>
              ) : (
                <>
                  Alumbra tu <span className="nv-lights-text block">Navidad</span>
                </>
              )}
            </h1>
            <p className="mt-5 max-w-lg text-lg text-white/85">
              {newYear
                ? "Gracias por alumbrar la Navidad con nosotros. Arranca el año con tecnología, hogar e iluminación y envíos a todo Colombia."
                : isBf
                  ? `Black Friday hasta el ${campaign?.endsLabel} y regalos de tecnología, hogar e iluminación con envíos a todo Colombia.`
                  : "Regalos de tecnología, hogar e iluminación con precios de diciembre y envíos a todo Colombia. Ofertas hasta el 31 de diciembre."}
            </p>

            {campaign && (
              <div className="mt-7">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                  {isBf ? "El Black Friday termina en" : "Las ofertas navideñas terminan en"}
                </p>
                <Countdown endsAt={campaign.endsAt} variant="glow" />
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/ofertas" className="btn-primary hw-btn-glow px-6 py-3.5 text-base">
                {isBf ? "Ver ofertas Black Friday" : campaign ? "Ver ofertas navideñas" : "Ver ofertas"} <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/tienda"
                className="btn-outline border-white/25 bg-white/5 px-6 py-3.5 text-base text-white backdrop-blur hover:border-white/50 hover:bg-white/10"
              >
                Buscar regalos
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-6 text-sm text-white/75">
              <span className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-[#FFD23F]" /> Envíos a todo Colombia
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#FFD23F]" /> Compra 100% segura
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
            <SpotlightGift spotlight={spotlight} isBf={isBf} promo={Boolean(campaign)} />
            <GiftSurprise
              className="-bottom-12 -left-4 z-20 sm:-left-14"
              message="🎄 ¡El Niño Dios trajo ofertas!"
            />
          </div>
        </div>

        <PuebloSkyline className="absolute inset-x-0 bottom-0 -z-10 h-44 sm:h-60" />
        <FarolesRow className="absolute inset-x-0 bottom-1 -z-[5] px-4 sm:px-16" />
      </section>
      <LightGarland className="nv-divider -mt-1" />
    </>
  );
}

function SpotlightGift({ spotlight, isBf, promo }: { spotlight: HeroSpotlight; isBf: boolean; promo: boolean }) {
  if (!spotlight) {
    return (
      <div className="hw-levitate hw-light nv-spotlight relative aspect-[4/3] overflow-hidden rounded-3xl">
        <ProductImage
          src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1000&q=80"
          alt="Productos SAMVERO"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 40vw"
          className="object-cover"
        />
      </div>
    );
  }

  const { product, discount } = spotlight;
  const low = product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD;

  return (
    <div className="hw-levitate relative">
      <Bow className="absolute -top-8 left-1/2 z-20 w-24 -translate-x-1/2 drop-shadow-lg" />
      <Link
        href={`/producto/${product.slug}`}
        className="hw-light nv-spotlight group relative block overflow-hidden rounded-3xl bg-white text-navy"
      >
        {/* Cinta del regalo */}
        <span aria-hidden className="absolute inset-y-0 left-1/2 z-[1] w-5 -translate-x-1/2 bg-gradient-to-r from-[#C81D2E] via-[#E63946] to-[#C81D2E] opacity-90" />
        <span className="absolute left-4 top-4 z-10 rounded-full bg-navy px-3 py-1 text-xs font-bold text-white shadow">
          {isBf
            ? "⚡ La mejor oferta del Black Friday"
            : !promo
              ? "⭐ Destacado de la tienda"
              : discount
                ? "🎁 El regalo más rebajado"
                : "🎄 Destacado de Navidad"}
        </span>
        {discount && (
          <span
            className={
              "nv-badge-burst absolute right-4 top-3 z-10 grid h-16 w-16 place-items-center rounded-full text-lg font-extrabold " +
              (isBf ? "bg-black text-[#FFD23F]" : "bg-[#E63946] text-white")
            }
          >
            -{discount}%
          </span>
        )}
        <div className="relative aspect-[4/3] overflow-hidden bg-light">
          <ProductImage
            src={primaryImage(product)}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="relative z-[2] space-y-2 bg-white p-5">
          <p className="line-clamp-2 font-semibold">{product.name}</p>
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#D62839]">{formatCop(product.priceCop)}</span>
            {discount && product.compareAtPriceCop && (
              <span className="text-sm text-slatebrand line-through">{formatCop(product.compareAtPriceCop)}</span>
            )}
          </div>
          <div className="flex items-center justify-between gap-3">
            {low ? (
              <span className="text-sm font-bold text-red-600">¡Solo quedan {product.stock}!</span>
            ) : (
              <span className="text-sm text-slatebrand">Envío a todo Colombia</span>
            )}
            <span className="inline-flex items-center gap-1 rounded-xl bg-[#1E8E4E] px-4 py-2 text-sm font-bold text-white transition-colors group-hover:bg-[#177540]">
              Lo quiero <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
