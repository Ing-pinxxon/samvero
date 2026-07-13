import CategoryManager from "@/components/admin/CategoryManager";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCategoriasPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  const data = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    tagline: c.tagline,
    iconKey: c.iconKey,
    imageUrl: c.imageUrl,
    sortOrder: c.sortOrder,
    productCount: c._count.products,
  }));

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-navy">Categorías</h1>
      <CategoryManager categories={data} />
    </div>
  );
}
