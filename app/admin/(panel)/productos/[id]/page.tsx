import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ProductForm, { type ProductFormData } from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EditarProductoPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (Number.isNaN(id)) notFound();

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        specs: { orderBy: { sortOrder: "asc" } },
      },
    }),
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!product) notFound();

  const initial: ProductFormData = {
    id: product.id,
    name: product.name,
    description: product.description,
    priceCop: product.priceCop,
    compareAtPriceCop: product.compareAtPriceCop ?? "",
    stock: product.stock,
    categoryId: product.categoryId,
    featured: product.featured,
    active: product.active,
    images: product.images.map((i) => i.url),
    specs: product.specs.map((s) => ({ label: s.label, value: s.value })),
  };

  return (
    <div>
      <Link
        href="/admin/productos"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-slatebrand hover:text-brand"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a productos
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-navy">Editar producto</h1>
      <ProductForm categories={categories} initial={initial} />
    </div>
  );
}
