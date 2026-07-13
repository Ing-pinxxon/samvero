import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck } from "lucide-react";
import ProductImage from "./ProductImage";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-brand/10 blur-3xl"
        aria-hidden
      />
      <div className="container-page relative grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
        <div className="animate-fade-in">
          <span className="chip bg-white/10 text-white">
            Tecnología · Hogar · Innovación
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Innovación para <span className="text-brand">tu día a día</span>.
          </h1>
          <p className="mt-5 max-w-lg text-lg text-white/75">
            Todo lo que necesitas, en un solo lugar. Descubre productos
            seleccionados de tecnología, hogar e iluminación con envíos a todo
            Colombia.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/tienda" className="btn-primary">
              Comprar ahora <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/ofertas"
              className="btn-outline border-white/20 bg-white/5 text-white hover:border-white/40 hover:bg-white/10"
            >
              Ver ofertas
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
        </div>
      </div>
    </section>
  );
}
