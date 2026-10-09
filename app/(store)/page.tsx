import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/Hero";
import TrustBadges from "@/components/TrustBadges";
import CategoryCard from "@/components/CategoryCard";
import ProductGrid from "@/components/ProductGrid";
import SloganStrip from "@/components/SloganStrip";
import HalloweenHero from "@/components/promo/HalloweenHero";
import { Moon, Witch } from "@/components/promo/HalloweenDecor";
import FlashDeals from "@/components/promo/FlashDeals";
import CategoryDeals from "@/components/promo/CategoryDeals";
import type { Metadata } from "next";
import { getCategories, getDiscountedProducts, getFeaturedProducts } from "@/lib/data";
import { getSeason } from "@/lib/season";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const season = getSeason();
  const [categories, featured, deals] = await Promise.all([
    getCategories().catch(() => []),
    getFeaturedProducts(8).catch(() => []),
    getDiscountedProducts().catch(() => []),
  ]);

  return (
    <>
      {season.halloween ? (
        <HalloweenHero
          promoEndsAt={season.promoEndsAt}
          spotlight={
            deals[0] ?? (featured[0] ? { product: featured[0], discount: null } : null)
          }
        />
      ) : (
        <Hero />
      )}
      <TrustBadges />

      {/* Avisos de ofertas (estilo Temu): solo aparecen si hay descuentos reales */}
      <FlashDeals deals={deals.slice(0, 12)} promoEndsAt={season.promoEndsAt} />
      <CategoryDeals deals={deals} halloween={season.halloween} />

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

      <SloganStrip halloween={season.halloween} />

      {/* CTA */}
      <section className="container-page py-16">
        <div className="hw-cta relative overflow-hidden rounded-3xl bg-navy px-8 py-14 text-center text-white">
          {season.halloween && (
            <>
              <Moon className="left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 opacity-30" />
              <Witch className="hw-witch-fly absolute left-0 top-6 w-28" />
            </>
          )}
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
