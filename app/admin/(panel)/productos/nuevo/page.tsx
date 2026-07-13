import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductForm from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NuevoProductoPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div>
      <Link
        href="/admin/productos"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-slatebrand hover:text-brand"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a productos
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-navy">Nuevo producto</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
