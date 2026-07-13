import type { Metadata } from "next";
import ShopFilters from "@/components/ShopFilters";
import ProductGrid from "@/components/ProductGrid";
import { getCategories, getProducts, type ProductSort } from "@/lib/data";

export const metadata: Metadata = {
  title: "Tienda",
  description:
    "Explora todos los productos de SAMVERO: tecnología, hogar, iluminación, organización y regalos con envíos a todo Colombia.",
  alternates: { canonical: "/tienda" },
};

type SearchParams = {
  categoria?: string;
  search?: string;
  sort?: string;
};

const VALID_SORTS: ProductSort[] = ["recientes", "precio-asc", "precio-desc"];

export const dynamic = "force-dynamic";

export default async function TiendaPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sort = VALID_SORTS.includes(searchParams.sort as ProductSort)
    ? (searchParams.sort as ProductSort)
    : "recientes";

  const [categories, products] = await Promise.all([
    getCategories().catch(() => []),
    getProducts({
      categorySlug: searchParams.categoria,
      search: searchParams.search,
      sort,
    }).catch(() => []),
  ]);

  const activeCat = categories.find((c) => c.slug === searchParams.categoria);

  return (
    <div className="container-page py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-navy">
          {activeCat ? activeCat.name : "Tienda"}
        </h1>
        <p className="mt-1 text-slatebrand">
          {searchParams.search
            ? `Resultados para "${searchParams.search}"`
            : "Todos nuestros productos en un solo lugar."}
        </p>
      </header>

      <div className="mb-8">
        <ShopFilters
          categories={categories.map((c) => ({ name: c.name, slug: c.slug }))}
          activeCategory={searchParams.categoria}
        />
      </div>

      <p className="mb-4 text-sm text-slatebrand">
        {products.length}{" "}
        {products.length === 1 ? "producto" : "productos"}
      </p>

      <ProductGrid products={products} />
    </div>
  );
}
