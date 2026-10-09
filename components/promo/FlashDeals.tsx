import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import ProductImage from "../ProductImage";
import Countdown from "./Countdown";
import { formatCop } from "@/lib/format";
import { primaryImage, type ProductWithRelations } from "@/lib/data";
import { LOW_STOCK_THRESHOLD } from "@/lib/season";

// La barra de disponibilidad se dibuja sobre esta escala: con 20 o menos
// unidades muestra cuánto queda; por encima basta con "En stock".
const STOCK_SCALE = 20;

type Deal = { product: ProductWithRelations; discount: number };

/**
 * Carrusel de ofertas al estilo Temu. Todo sale de datos reales: el descuento
 * del precio anterior cargado en el panel y el stock del inventario.
 */
export default function FlashDeals({
  deals,
  promoEndsAt,
}: {
  deals: Deal[];
  promoEndsAt: string | null;
}) {
  if (deals.length === 0) return null;

  return (
    <section className="container-page pt-12">
      <div className="flash-deals relative rounded-3xl bg-gradient-to-br from-brand-50 to-white p-5 ring-1 ring-brand/15 sm:p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white">
              <Zap className="h-5 w-5 fill-current" />
            </span>
            <h2 className="text-2xl font-bold text-navy sm:text-3xl">
              {promoEndsAt ? "Ofertas relámpago" : "Ofertas del momento"}
            </h2>
            {promoEndsAt && (
              <span className="flex items-center gap-2 text-sm font-semibold text-navy/70">
                Terminan en <Countdown endsAt={promoEndsAt} variant="dark" />
              </span>
            )}
          </div>
          <Link
            href="/ofertas"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
          >
            Ver todas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <ul className="no-scrollbar -mx-1 flex snap-x gap-4 overflow-x-auto px-1 pb-1">
          {deals.map(({ product, discount }) => {
            const low = product.stock <= LOW_STOCK_THRESHOLD;
            const scaled = product.stock <= STOCK_SCALE;
            return (
              <li key={product.id} className="w-44 shrink-0 snap-start sm:w-52">
                <Link
                  href={`/producto/${product.slug}`}
                  className="hw-light group flex h-full flex-col overflow-hidden rounded-2xl border border-navy/5 bg-white shadow-card transition-shadow hover:shadow-cardHover"
                >
                  <div className="relative aspect-square overflow-hidden bg-light">
                    <ProductImage
                      src={primaryImage(product)}
                      alt={product.name}
                      fill
                      sizes="208px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="discount-badge absolute left-2 top-2 rounded-full bg-brand px-2.5 py-1 text-xs font-extrabold text-white shadow">
                      -{discount}%
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-1 p-3">
                    <h3 className="line-clamp-2 text-xs font-semibold text-navy">{product.name}</h3>
                    <div className="mt-auto flex flex-wrap items-baseline gap-x-1.5">
                      <span className="text-lg font-extrabold text-brand">{formatCop(product.priceCop)}</span>
                      {product.compareAtPriceCop && (
                        <span className="text-xs text-slatebrand line-through">
                          {formatCop(product.compareAtPriceCop)}
                        </span>
                      )}
                    </div>
                    <p className={low ? "text-[11px] font-bold text-red-600" : "text-[11px] font-semibold text-slatebrand"}>
                      {low
                        ? `¡Solo quedan ${product.stock}!`
                        : scaled
                          ? `Quedan ${product.stock}`
                          : "En stock"}
                    </p>
                    {scaled && (
                      <div className="h-1.5 overflow-hidden rounded-full bg-brand-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-brand to-red-500"
                          style={{ width: `${Math.max(8, (product.stock / STOCK_SCALE) * 100)}%` }}
                        />
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
