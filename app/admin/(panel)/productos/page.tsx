import Link from "next/link";
import { Plus } from "lucide-react";
import ProductsTable from "@/components/admin/ProductsTable";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  const rows = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    priceCop: p.priceCop,
    stock: p.stock,
    featured: p.featured,
    active: p.active,
    categoryName: p.category.name,
    image: p.images[0]?.url ?? null,
  }));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy">Productos</h1>
          <p className="text-sm text-slatebrand">
            {rows.length} {rows.length === 1 ? "producto" : "productos"} en total.
          </p>
        </div>
        <Link href="/admin/productos/nuevo" className="btn-primary">
          <Plus className="h-5 w-5" /> Nuevo producto
        </Link>
      </div>

      <ProductsTable products={rows} />
    </div>
  );
}
