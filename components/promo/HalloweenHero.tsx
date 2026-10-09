import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck } from "lucide-react";
import ProductImage from "../ProductImage";
import Countdown from "./Countdown";
import BooPumpkin from "./BooPumpkin";
import { BatSwarm, Cobweb, HauntedSkyline, Moon, Pumpkin, SlimeDrip } from "./HalloweenDecor";
import { formatCop } from "@/lib/format";
import { primaryImage, type ProductWithRelations } from "@/lib/data";
import { LOW_STOCK_THRESHOLD } from "@/lib/season";

export type HeroSpotlight = { product: ProductWithRelations; discount: number | null } | null;

/**
 * Banner principal en temporada de Halloween: escena nocturna con luna,
 * murciélagos, casa embrujada y cementerio, y al lado la "oferta más
 * embrujada" (el producto con mayor descuento real) flotando.
 */
export default function HalloweenHero({
  promoEndsAt,
  spotlight,
}: {
  promoEndsAt: string | null;
  spotlight: HeroSpotlight;
}) {
  return (
    <>
      <section className="hw-hero relative isolate overflow-hidden text-white">
        {/* Cielo */}
        <div className="hw-sky absolute inset-0 -z-20" aria-hidden />
        <div className="hw-stars absolute inset-0 -z-10 opacity-80" aria-hidden />
        <Moon className="-right-20 -top-20 -z-10 h-48 w-48 sm:-right-10 sm:-top-16 sm:h-80 sm:w-80 lg:right-[6%] lg:top-10" />
        <div className="hw-cloud hw-cloud--a -z-10" aria-hidden />
        <div className="hw-cloud hw-cloud--b -z-10" aria-hidden />
        <BatSwarm className="right-[18%] top-36 -z-10 hidden sm:block" />
        <Cobweb className="left-0 top-0 -z-10 h-44 w-44 text-white/25" />

        <div className="container-page relative grid items-center gap-12 pb-36 pt-14 sm:pb-48 lg:grid-cols-[1.1fr_0.9fr] lg:pb-56 lg:pt-20">
          <div className="animate-fade-in">
            <span className="chip border border-brand/40 bg-brand/15 font-semibold text-white">
              🎃 Temporada de Halloween SAMVERO
            </span>
            <h1 className="hw-title mt-5 text-6xl leading-[0.95] sm:text-7xl lg:text-8xl">
              Precios de <span className="hw-glow-text block text-brand">miedo</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-white/80">
              Tecnología, hogar e iluminación con descuentos embrujados y envíos a
              todo Colombia. Solo hasta el 31 de octubre.
            </p>

            {promoEndsAt && (
              <div className="mt-7">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-white/60">
                  El hechizo termina en
                </p>
                <Countdown endsAt={promoEndsAt} variant="glow" />
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/ofertas" className="btn-primary hw-btn-glow px-6 py-3.5 text-base">
                Ver ofertas de Halloween <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/tienda"
                className="btn-outline border-white/20 bg-white/5 px-6 py-3.5 text-base text-white backdrop-blur hover:border-white/40 hover:bg-white/10"
              >
                Explorar la tienda
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-6 text-sm text-white/70">
              <span className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-brand" /> Envíos a todo Colombia
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-brand" /> Compra 100% segura
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
            <SpotlightCard spotlight={spotlight} />
            <BooPumpkin className="-bottom-10 -left-6 z-20 sm:-left-14" />
            <Pumpkin className="absolute -bottom-6 left-20 z-10 w-14 drop-shadow-[0_0_18px_rgba(255,140,40,0.5)] sm:left-12" />
          </div>
        </div>

        {/* Horizonte y niebla */}
        <HauntedSkyline className="absolute inset-x-0 bottom-0 -z-10 h-44 sm:h-56" />
        <div className="hw-fog hw-fog--hero" aria-hidden />
      </section>
      <SlimeDrip />
    </>
  );
}

function SpotlightCard({ spotlight }: { spotlight: HeroSpotlight }) {
  if (!spotlight) {
    return (
      <div className="hw-levitate hw-light relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
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
    <Link
      href={`/producto/${product.slug}`}
      className="hw-levitate hw-light hw-spotlight group relative block overflow-hidden rounded-3xl bg-white text-navy"
    >
      <span className="absolute left-4 top-4 z-10 rounded-full bg-navy px-3 py-1 text-xs font-bold text-white shadow">
        {discount ? "👻 La oferta más embrujada" : "🎃 Destacado de Halloween"}
      </span>
      {discount && (
        <span className="hw-badge-burst absolute right-4 top-3 z-10 grid h-16 w-16 place-items-center rounded-full bg-brand text-lg font-extrabold text-white">
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
      <div className="space-y-2 p-5">
        <p className="line-clamp-2 font-semibold">{product.name}</p>
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-3xl font-extrabold text-brand">{formatCop(product.priceCop)}</span>
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
          <span className="inline-flex items-center gap-1 rounded-xl bg-brand px-4 py-2 text-sm font-bold text-white transition-colors group-hover:bg-brand-600">
            Lo quiero <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
