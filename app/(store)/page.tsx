import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/Hero";
import TrustBadges from "@/components/TrustBadges";
import CategoryCard from "@/components/CategoryCard";
import ProductGrid from "@/components/ProductGrid";
import SloganStrip from "@/components/SloganStrip";
import type { Metadata } from "next";
import { getCategories, getFeaturedProducts } from "@/lib/data";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, featured] = await Promise.all([
    getCategories().catch(() => []),
    getFeaturedProducts(8).catch(() => []),
  ]);

  return (
    <>
      <Hero />
      <TrustBadges />

      {/* Categorías */}
      <section className="container-page py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-navy">Categorías principales</h2>
            <p className="mt-1 text-slatebrand">
              Encuentra justo lo que buscas, organizado para ti.
            </p>
          </div>
          <Link
            href="/tienda"
            className="hidden items-center gap-1 text-sm font-semibold text-brand hover:underline sm:inline-flex"
          >
            Ver todo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </div>
      </section>

      {/* Destacados */}
      <section className="bg-light py-16">
        <div className="container-page">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-navy">Productos destacados</h2>
              <p className="mt-1 text-slatebrand">
                Lo más querido por nuestros clientes.
              </p>
            </div>
            <Link
              href="/tienda"
              className="hidden items-center gap-1 text-sm font-semibold text-brand hover:underline sm:inline-flex"
            >
              Ver todo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ProductGrid products={featured} />
        </div>
      </section>

      <SloganStrip />

      {/* CTA */}
      <section className="container-page py-16">
        <div className="relative overflow-hidden rounded-3xl bg-navy px-8 py-14 text-center text-white">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand/20 blur-3xl"
            aria-hidden
          />
          <h2 className="relative text-3xl font-bold sm:text-4xl">
            SAMVERO es el comienzo de algo grande
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-white/75">
            Descubre productos que transforman tu día a día. Calidad, innovación y
            tendencia en un solo lugar.
          </p>
          <Link
            href="/tienda"
            className="btn-primary relative mt-7"
          >
            Explorar la tienda <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
