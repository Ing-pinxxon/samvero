import type { Metadata } from "next";
import { Tag } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";
import { getProducts } from "@/lib/data";
import { getSeason } from "@/lib/season";
import Countdown from "@/components/promo/Countdown";

export const metadata: Metadata = {
  title: "Ofertas y descuentos",
  description:
    "Aprovecha los mejores descuentos en SAMVERO. Ofertas especiales en tecnología, hogar e iluminación con envíos a todo Colombia.",
  alternates: { canonical: "/ofertas" },
};

export const dynamic = "force-dynamic";

export default async function OfertasPage() {
  const season = getSeason();
  const products = await getProducts({ onlyOffers: true, sort: "recientes" }).catch(
    () => []
  );

  return (
    <div className="container-page py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white">
            <Tag className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-3xl font-bold text-navy">
              {season.campaign ? `Ofertas de ${season.campaign.name} ${season.campaign.emoji}` : "Ofertas"}
            </h1>
            <p className="text-slatebrand">
              {season.campaign
                ? `Precios especiales hasta el ${season.campaign.endsLabel}.`
                : "Descuentos especiales por tiempo limitado."}
            </p>
          </div>
        </div>
        {season.campaign && (
          <div className="flex items-center gap-2 text-sm font-semibold text-navy/70">
            Terminan en <Countdown endsAt={season.campaign.endsAt} variant="dark" />
          </div>
        )}
      </div>

      <ProductGrid products={products} />
    </div>
  );
}
