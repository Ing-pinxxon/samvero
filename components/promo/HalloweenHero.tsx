import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck } from "lucide-react";
import ProductImage from "../ProductImage";
import Countdown from "./Countdown";
import { Bat, Cobweb, Moon, Pumpkin } from "./HalloweenDecor";

/** Banner principal en temporada de Halloween (estilo "Noche de Calabazas"). */
export default function HalloweenHero({ promoEndsAt }: { promoEndsAt: string | null }) {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(120%_90%_at_85%_10%,#1f2f55_0%,#0D1B2A_55%)] text-white">
      <Cobweb className="left-0 top-0 h-40 w-40 text-white/20" />
      <div
        className="pointer-events-none absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-witch/25 blur-3xl"
        aria-hidden
      />

      <div className="container-page relative grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
        <div className="animate-fade-in">
          <span className="chip bg-white/10 text-white">🎃 Halloween SAMVERO</span>
          <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Precios de <span className="text-brand">miedo</span> para tu casa.
          </h1>
          <p className="mt-5 max-w-lg text-lg text-white/75">
            Tecnología, hogar e iluminación con descuentos de temporada y envíos a
            todo Colombia.
          </p>

          {/* En móvil la cinta superior ya muestra el contador: aquí solo en pantallas anchas. */}
          {promoEndsAt && (
            <div className="mt-6 hidden flex-wrap items-center gap-3 sm:flex">
              <span className="text-sm font-semibold text-white/80">Terminan en</span>
              <Countdown endsAt={promoEndsAt} />
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/ofertas" className="btn-primary">
              Ver ofertas de Halloween <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/tienda"
              className="btn-outline border-white/20 bg-white/5 text-white hover:border-white/40 hover:bg-white/10"
            >
              Comprar ahora
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-6 text-sm text-white/70">
            <span className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-brand" /> Envíos a todo Colombia
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-brand" /> Compra 100% segura
            </span>
          </div>
        </div>

        <div className="relative animate-fade-in">
          <Moon className="-right-6 -top-10 h-40 w-40 sm:h-52 sm:w-52" />
          <Bat className="right-10 top-6 z-10 w-14 text-navy" />
          <Bat className="right-48 -top-4 w-9 text-witch/80" delay={0.5} />
          <Bat className="left-4 top-1/3 w-7 text-witch/60" delay={1.1} />
          <div className="relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
            <ProductImage
              src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1000&q=80"
              alt="Productos SAMVERO"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <Pumpkin className="-bottom-6 left-2 z-10 w-20 drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)] sm:-left-6 sm:w-24" />
          <Pumpkin className="-bottom-4 left-20 z-10 w-12 drop-shadow-[0_6px_12px_rgba(0,0,0,0.45)] sm:left-16" />
        </div>
      </div>
    </section>
  );
}
