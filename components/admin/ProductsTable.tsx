"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, Trash2, Star } from "lucide-react";
import ProductImage from "@/components/ProductImage";
import { formatCop } from "@/lib/format";

type Row = {
  id: number;
  name: string;
  slug: string;
  priceCop: number;
  stock: number;
  featured: boolean;
  active: boolean;
  categoryName: string;
  image: string | null;
};

export default function ProductsTable({ products }: { products: Row[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "No se pudo eliminar el producto.");
        return;
      }
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  };

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-navy/15 bg-white p-10 text-center">
        <p className="font-semibold text-navy">Todavía no hay productos</p>
        <p className="mt-1 text-sm text-slatebrand">
          Crea tu primer producto para empezar a vender.
        </p>
        <Link href="/admin/productos/nuevo" className="btn-primary mt-4">
          Nuevo producto
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-navy/5 bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-navy/5 bg-light text-xs uppercase text-slatebrand">
            <tr>
              <th className="px-4 py-3 font-semibold">Producto</th>
              <th className="px-4 py-3 font-semibold">Categoría</th>
              <th className="px-4 py-3 font-semibold">Precio</th>
              <th className="px-4 py-3 font-semibold">Stock</th>
              <th className="px-4 py-3 font-semibold">Estado</th>
              <th className="px-4 py-3 text-right font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy/5">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-light/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-light">
                      <ProductImage
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-navy">{p.name}</span>
                      {p.featured && (
                        <Star className="h-4 w-4 fill-brand text-brand" />
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slatebrand">{p.categoryName}</td>
                <td className="px-4 py-3 font-semibold text-navy">
                  {formatCop(p.priceCop)}
                </td>
                <td className="px-4 py-3 text-slatebrand">{p.stock}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      p.active
                        ? "rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700"
                        : "rounded-full bg-navy/10 px-2.5 py-1 text-xs font-semibold text-slatebrand"
                    }
                  >
                    {p.active ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/admin/productos/${p.id}`}
                      aria-label="Editar"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-navy hover:bg-light hover:text-brand"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      disabled={deletingId === p.id}
                      aria-label="Eliminar"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-navy hover:bg-brand/10 hover:text-brand disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
