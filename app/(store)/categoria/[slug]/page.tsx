import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ShopFilters from "@/components/ShopFilters";
import ProductGrid from "@/components/ProductGrid";
import {
  getCategories,
  getCategoryBySlug,
  getProducts,
  type ProductSort,
} from "@/lib/data";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

const VALID_SORTS: ProductSort[] = ["recientes", "precio-asc", "precio-desc"];

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug).catch(() => null);
  if (!category) return { title: "Categoría" };
  const description =
    category.tagline ??
    `Compra productos de ${category.name} en SAMVERO con envíos a todo Colombia.`;
  return {
    title: category.name,
    description,
    alternates: { canonical: `/categoria/${category.slug}` },
    openGraph: {
      type: "website",
      title: `${category.name} | SAMVERO`,
      description,
      url: `/categoria/${category.slug}`,
      images: category.imageUrl ? [category.imageUrl] : [],
    },
  };
}

export default async function CategoriaPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { sort?: string; search?: string };
}) {
  const category = await getCategoryBySlug(params.slug).catch(() => null);
  if (!category) notFound();

  const sort = VALID_SORTS.includes(searchParams.sort as ProductSort)
    ? (searchParams.sort as ProductSort)
    : "recientes";

  const [categories, products] = await Promise.all([
    getCategories().catch(() => []),
    getProducts({
      categorySlug: params.slug,
      search: searchParams.search,
      sort,
    }).catch(() => []),
  ]);

  return (
    <div className="container-page py-10">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", url: "/" },
          { name: category.name, url: `/categoria/${category.slug}` },
        ])}
      />
      <header className="mb-6">
        <p className="text-sm font-medium uppercase tracking-wide text-brand">
          Categoría
        </p>
        <h1 className="mt-1 text-3xl font-bold text-navy">{category.name}</h1>
        {category.tagline && (
          <p className="mt-1 text-slatebrand">{category.tagline}</p>
        )}
      </header>

      <div className="mb-8">
        <ShopFilters
          categories={categories.map((c) => ({ name: c.name, slug: c.slug }))}
          activeCategory={category.slug}
          basePath={`/categoria/${category.slug}`}
        />
      </div>

      <p className="mb-4 text-sm text-slatebrand">
        {products.length} {products.length === 1 ? "producto" : "productos"}
      </p>

      <ProductGrid products={products} />
    </div>
  );
}
