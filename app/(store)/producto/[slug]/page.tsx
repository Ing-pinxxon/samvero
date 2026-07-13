import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ShieldCheck, Truck, BadgeCheck } from "lucide-react";
import ProductGallery from "@/components/ProductGallery";
import ProductBuyBox from "@/components/ProductBuyBox";
import PriceTag from "@/components/PriceTag";
import ProductGrid from "@/components/ProductGrid";
import {
  getProductBySlug,
  getRelatedProducts,
  primaryImage,
} from "@/lib/data";
import JsonLd from "@/components/seo/JsonLd";
import { productJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug).catch(() => null);
  if (!product) return { title: "Producto" };
  const image = primaryImage(product);
  return {
    title: product.name,
    description: product.description.slice(0, 160),
    alternates: { canonical: `/producto/${product.slug}` },
    openGraph: {
      type: "website",
      title: product.name,
      description: product.description.slice(0, 160),
      url: `/producto/${product.slug}`,
      images: image ? [image] : [],
    },
  };
}

export default async function ProductoPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug).catch(() => null);
  if (!product) notFound();

  const related = await getRelatedProducts(
    product.categoryId,
    product.id,
    4
  ).catch(() => []);

  return (
    <div className="container-page py-8">
      <JsonLd
        data={[
          productJsonLd({
            name: product.name,
            slug: product.slug,
            description: product.description,
            priceCop: product.priceCop,
            stock: product.stock,
            images: product.images.map((i) => i.url),
            categoryName: product.category.name,
          }),
          breadcrumbJsonLd([
            { name: "Inicio", url: "/" },
            {
              name: product.category.name,
              url: `/categoria/${product.category.slug}`,
            },
            { name: product.name, url: `/producto/${product.slug}` },
          ]),
        ]}
      />

      {/* Migas de pan */}
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-slatebrand">
        <Link href="/" className="hover:text-brand">
          Inicio
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href={`/categoria/${product.category.slug}`}
          className="hover:text-brand"
        >
          {product.category.name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-navy">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery
          images={product.images.map((i) => ({ url: i.url, alt: i.alt }))}
          name={product.name}
        />

        <div>
          <Link
            href={`/categoria/${product.category.slug}`}
            className="text-sm font-medium uppercase tracking-wide text-brand"
          >
            {product.category.name}
          </Link>
          <h1 className="mt-2 text-3xl font-bold text-navy">{product.name}</h1>

          <div className="mt-4">
            <PriceTag
              priceCop={product.priceCop}
              compareAtPriceCop={product.compareAtPriceCop}
              size="lg"
            />
          </div>

          <p className="mt-6 whitespace-pre-line leading-relaxed text-slatebrand">
            {product.description}
          </p>

          <div className="mt-8">
            <ProductBuyBox
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                priceCop: product.priceCop,
                image: primaryImage(product),
                maxStock: product.stock,
              }}
            />
          </div>

          {/* Garantías */}
          <ul className="mt-8 grid grid-cols-1 gap-3 rounded-2xl border border-navy/5 bg-light p-5 sm:grid-cols-3">
            <li className="flex items-center gap-2 text-sm text-navy">
              <Truck className="h-5 w-5 text-brand" /> Envío a todo Colombia
            </li>
            <li className="flex items-center gap-2 text-sm text-navy">
              <ShieldCheck className="h-5 w-5 text-brand" /> Compra segura
            </li>
            <li className="flex items-center gap-2 text-sm text-navy">
              <BadgeCheck className="h-5 w-5 text-brand" /> Garantía incluida
            </li>
          </ul>
        </div>
      </div>

      {/* Ficha técnica */}
      {product.specs.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-5 text-2xl font-bold text-navy">Ficha técnica</h2>
          <div className="overflow-hidden rounded-2xl border border-navy/5 bg-white shadow-card">
            <dl className="divide-y divide-navy/5">
              {product.specs.map((spec) => (
                <div
                  key={spec.id}
                  className="grid grid-cols-1 gap-1 px-5 py-3.5 sm:grid-cols-3 sm:gap-4"
                >
                  <dt className="text-sm font-semibold text-navy">{spec.label}</dt>
                  <dd className="text-sm text-slatebrand sm:col-span-2">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* Relacionados */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-navy">
            También te puede gustar
          </h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
