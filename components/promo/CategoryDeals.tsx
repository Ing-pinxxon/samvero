import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ProductWithRelations } from "@/lib/data";
import { Ghost } from "./HalloweenDecor";

type Deal = { product: ProductWithRelations; discount: number };

/**
 * Carteles "Hasta -X% en {categoría}". El porcentaje es el mayor descuento
 * real de los productos de esa categoría, así que nunca promete de más.
 */
export default function CategoryDeals({ deals, halloween }: { deals: Deal[]; halloween: boolean }) {
  const best = new Map<string, { name: string; slug: string; discount: number; count: number }>();
  for (const { product, discount } of deals) {
    const c = product.category;
    const current = best.get(c.slug);
    if (current) {
      current.count++;
      current.discount = Math.max(current.discount, discount);
    } else {
      best.set(c.slug, { name: c.name.trim(), slug: c.slug, discount, count: 1 });
    }
  }
  const banners = [...best.values()].sort((a, b) => b.discount - a.discount).slice(0, 4);
  if (banners.length === 0) return null;

  return (
    <section className="category-deals container-page pt-8">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {banners.map((b, i) => (
          <li key={b.slug}>
            <Link
              href={`/categoria/${b.slug}`}
              className={
                "group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-5 text-white shadow-card transition-transform hover:-translate-y-0.5 " +
                (i % 2 === 0
                  ? "bg-gradient-to-br from-witch to-brand"
                  : "bg-gradient-to-br from-navy to-witch-600")
              }
            >
              {halloween && (
                <Ghost
                  className="hw-float absolute -right-2 -top-1 w-14 opacity-90"
                  style={{ animationDelay: `${i * 0.8}s` }}
                />
              )}
              <span className="text-xs font-semibold uppercase tracking-wide text-white/80">
                {halloween ? "🦇 Halloween" : "Ofertas"}
              </span>
              <span className="mt-2 text-2xl font-extrabold leading-tight">
                Hasta -{b.discount}%
                <span className="block text-base font-semibold text-white/90">en {b.name}</span>
              </span>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold">
                {b.count} {b.count === 1 ? "producto" : "productos"} en oferta
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
