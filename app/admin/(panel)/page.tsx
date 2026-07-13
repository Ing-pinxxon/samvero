import Link from "next/link";
import { Package, FolderTree, Star, CheckCircle2, Plus } from "lucide-react";
import { getAdminCounts } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { formatCop } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const counts = await getAdminCounts();
  const recent = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const cards = [
    { label: "Productos", value: counts.products, icon: Package },
    { label: "Categorías", value: counts.categories, icon: FolderTree },
    { label: "Destacados", value: counts.featured, icon: Star },
    { label: "Activos", value: counts.active, icon: CheckCircle2 },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
          <p className="text-sm text-slatebrand">Resumen de tu tienda SAMVERO.</p>
        </div>
        <Link href="/admin/productos/nuevo" className="btn-primary">
          <Plus className="h-5 w-5" /> Nuevo producto
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-navy/5 bg-white p-5 shadow-card"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-3 text-3xl font-bold text-navy">{value}</p>
            <p className="text-sm text-slatebrand">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-navy/5 bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-navy/5 p-5">
          <h2 className="font-bold text-navy">Productos recientes</h2>
          <Link
            href="/admin/productos"
            className="text-sm font-semibold text-brand hover:underline"
          >
            Ver todos
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="p-5 text-sm text-slatebrand">
            Aún no hay productos. Crea el primero.
          </p>
        ) : (
          <ul className="divide-y divide-navy/5">
            {recent.map((p) => (
              <li key={p.id} className="flex items-center justify-between p-5">
                <div>
                  <Link
                    href={`/admin/productos/${p.id}`}
                    className="font-medium text-navy hover:text-brand"
                  >
                    {p.name}
                  </Link>
                  <p className="text-xs text-slatebrand">{p.category.name}</p>
                </div>
                <span className="font-semibold text-navy">
                  {formatCop(p.priceCop)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
