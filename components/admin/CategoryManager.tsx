"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Pencil, Trash2, Plus, X } from "lucide-react";
import ProductImage from "@/components/ProductImage";
import { getCategoryIcon, ICON_OPTIONS } from "@/lib/categories";

type Category = {
  id: number;
  name: string;
  slug: string;
  tagline: string | null;
  iconKey: string;
  imageUrl: string | null;
  sortOrder: number;
  productCount: number;
};

type FormState = {
  id?: number;
  name: string;
  tagline: string;
  iconKey: string;
  imageUrl: string;
  sortOrder: number | "";
};

const emptyForm: FormState = {
  name: "",
  tagline: "",
  iconKey: "box",
  imageUrl: "",
  sortOrder: 0,
};

export default function CategoryManager({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = Boolean(form.id);
  const inputClass =
    "w-full rounded-xl border border-navy/10 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand";

  const startEdit = (c: Category) =>
    setForm({
      id: c.id,
      name: c.name,
      tagline: c.tagline ?? "",
      iconKey: c.iconKey,
      imageUrl: c.imageUrl ?? "",
      sortOrder: c.sortOrder,
    });

  const reset = () => {
    setForm(emptyForm);
    setError(null);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(
        isEdit ? `/api/admin/categories/${form.id}` : "/api/admin/categories",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "No se pudo guardar.");
        return;
      }
      reset();
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (c: Category) => {
    if (!confirm(`¿Eliminar la categoría "${c.name}"?`)) return;
    const res = await fetch(`/api/admin/categories/${c.id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "No se pudo eliminar.");
      return;
    }
    if (form.id === c.id) reset();
    router.refresh();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* Lista */}
      <div className="space-y-3">
        {categories.length === 0 && (
          <div className="rounded-2xl border border-dashed border-navy/15 bg-white p-8 text-center text-sm text-slatebrand">
            No hay categorías todavía. Crea la primera con el formulario.
          </div>
        )}
        {categories.map((c) => {
          const Icon = getCategoryIcon(c.iconKey);
          return (
            <div
              key={c.id}
              className="flex items-center gap-4 rounded-2xl border border-navy/5 bg-white p-4 shadow-card"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-light">
                {c.imageUrl ? (
                  <ProductImage
                    src={c.imageUrl}
                    alt={c.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-brand">
                    <Icon className="h-6 w-6" />
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-navy">{c.name}</p>
                <p className="truncate text-xs text-slatebrand">
                  {c.tagline || `/${c.slug}`}
                </p>
                <p className="text-xs text-slatebrand">
                  {c.productCount} producto(s)
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => startEdit(c)}
                  aria-label="Editar"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-navy hover:bg-light hover:text-brand"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => remove(c)}
                  aria-label="Eliminar"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-navy hover:bg-brand/10 hover:text-brand"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Formulario */}
      <form
        onSubmit={save}
        className="h-fit space-y-4 rounded-2xl border border-navy/5 bg-white p-6 shadow-card lg:sticky lg:top-8"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-navy">
            {isEdit ? "Editar categoría" : "Nueva categoría"}
          </h2>
          {isEdit && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1 text-xs font-medium text-slatebrand hover:text-brand"
            >
              <X className="h-4 w-4" /> Cancelar
            </button>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">
            Nombre *
          </label>
          <input
            className={inputClass}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ej: Tecnología"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">
            Eslogan
          </label>
          <input
            className={inputClass}
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            placeholder="Conectividad y entretenimiento para ti."
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">Ícono</label>
          <select
            className={inputClass}
            value={form.iconKey}
            onChange={(e) => setForm({ ...form, iconKey: e.target.value })}
          >
            {ICON_OPTIONS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">
            URL de imagen
          </label>
          <input
            className={inputClass}
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">
            Orden
          </label>
          <input
            type="number"
            className={inputClass}
            value={form.sortOrder}
            onChange={(e) =>
              setForm({
                ...form,
                sortOrder: e.target.value === "" ? "" : Number(e.target.value),
              })
            }
          />
        </div>

        {error && (
          <p className="rounded-lg bg-brand/10 px-3 py-2 text-sm font-medium text-brand">
            {error}
          </p>
        )}

        <button type="submit" disabled={saving} className="btn-primary w-full">
          {saving ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Guardando...
            </>
          ) : isEdit ? (
            "Guardar cambios"
          ) : (
            <>
              <Plus className="h-5 w-5" /> Crear categoría
            </>
          )}
        </button>
      </form>
    </div>
  );
}
