"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  Loader2,
  Upload,
  X,
  Link2,
  ImagePlus,
  Plus,
  Trash2,
  ListChecks,
} from "lucide-react";
import ProductImage from "@/components/ProductImage";

type Category = { id: number; name: string };

export type ProductSpecInput = { label: string; value: string };

export type ProductFormData = {
  id?: number;
  name: string;
  description: string;
  priceCop: number | "";
  compareAtPriceCop: number | "";
  stock: number | "";
  categoryId: number | "";
  featured: boolean;
  active: boolean;
  images: string[];
  specs: ProductSpecInput[];
};

// Tope de subida alineado con el límite de cuerpo de las funciones de Vercel
// (~4.5 MB). Con la compresión de abajo casi nunca se alcanza.
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // 4 MB
// Lado máximo de la imagen tras redimensionar. Suficiente para una ficha de
// producto y mantiene el archivo liviano.
const MAX_DIMENSION = 1600;
// Solo re-codificamos formatos estáticos; gif (animado) y avif se suben tal cual.
const COMPRESSIBLE = ["image/jpeg", "image/png", "image/webp"];

/**
 * Redimensiona y comprime la imagen en el navegador antes de subirla. Las fotos
 * de celular suelen pesar varios MB y en producción (Vercel) el servidor rechaza
 * cuerpos grandes; al reducirlas aquí, la subida siempre cabe. Ante cualquier
 * fallo, devuelve el archivo original para no bloquear la subida.
 */
async function compressImage(file: File): Promise<File> {
  if (!COMPRESSIBLE.includes(file.type)) return file;
  try {
    // "from-image" respeta la orientación EXIF para que la foto no salga girada.
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.85)
    );
    // Si no se pudo codificar o quedó más pesado que el original, usa el original.
    if (!blob || blob.size >= file.size) return file;

    const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
    return new File([blob], name, { type: "image/webp" });
  } catch {
    return file;
  }
}

const empty: ProductFormData = {
  name: "",
  description: "",
  priceCop: "",
  compareAtPriceCop: "",
  stock: 0,
  categoryId: "",
  featured: false,
  active: true,
  images: [],
  specs: [],
};

export default function ProductForm({
  categories,
  initial,
}: {
  categories: Category[];
  initial?: ProductFormData;
}) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [form, setForm] = useState<ProductFormData>(initial ?? empty);
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const update = <K extends keyof ProductFormData>(
    key: K,
    value: ProductFormData[K]
  ) => setForm((f) => ({ ...f, [key]: value }));

  const addImageUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    update("images", [...form.images, url]);
    setUrlInput("");
  };

  const removeImage = (i: number) =>
    update(
      "images",
      form.images.filter((_, idx) => idx !== i)
    );

  // --- Ficha técnica (specs) ---
  const addSpec = () => update("specs", [...form.specs, { label: "", value: "" }]);
  const updateSpec = (i: number, key: keyof ProductSpecInput, val: string) =>
    update(
      "specs",
      form.specs.map((s, idx) => (idx === i ? { ...s, [key]: val } : s))
    );
  const removeSpec = (i: number) =>
    update(
      "specs",
      form.specs.filter((_, idx) => idx !== i)
    );

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setUploading(true);
    setError(null);
    try {
      const file = await compressImage(selected);
      // Aviso claro en el cliente antes de enviar (evita un 413 opaco del servidor).
      if (file.size > MAX_UPLOAD_BYTES) {
        setError(
          "La imagen es muy pesada. Usa una de menos de 4 MB o reduce su resolución."
        );
        return;
      }
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) {
        // La respuesta de error puede no ser JSON (p. ej. un 413 de Vercel).
        const data = await res.json().catch(() => null);
        setError(
          data?.error ??
            (res.status === 413
              ? "La imagen es demasiado pesada para el servidor. Prueba con una más liviana."
              : "No se pudo subir la imagen.")
        );
        return;
      }
      const data = await res.json();
      update("images", [...form.images, data.url]);
    } catch {
      setError("Error al subir la imagen.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name || form.categoryId === "" || form.priceCop === "") {
      setError("Nombre, categoría y precio son obligatorios.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(
        isEdit ? `/api/admin/products/${initial!.id}` : "/api/admin/products",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "No se pudo guardar el producto.");
        return;
      }
      router.push("/admin/productos");
      router.refresh();
    } catch {
      setError("Error de conexión al guardar.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-navy/10 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand";

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-3">
      {/* Columna principal */}
      <div className="space-y-5 lg:col-span-2">
        <div className="rounded-2xl border border-navy/5 bg-white p-6 shadow-card">
          <h2 className="mb-4 font-bold text-navy">Información</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy">
                Nombre *
              </label>
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Ej: Audífonos Inalámbricos Pro"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy">
                Descripción
              </label>
              <textarea
                className={`${inputClass} min-h-28`}
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Describe el producto, sus beneficios y características."
              />
            </div>
          </div>
        </div>

        {/* Imágenes */}
        <div className="rounded-2xl border border-navy/5 bg-white p-6 shadow-card">
          <h2 className="mb-1 font-bold text-navy">Imágenes</h2>
          <p className="mb-4 text-xs text-slatebrand">
            La primera imagen será la principal. Sube archivos o pega una URL.
          </p>

          {form.images.length > 0 && (
            <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {form.images.map((url, i) => (
                <div
                  key={`${url}-${i}`}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-navy/10 bg-light"
                >
                  <ProductImage
                    src={url}
                    alt={`Imagen ${i + 1}`}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                  {i === 0 && (
                    <span className="absolute left-1 top-1 rounded bg-brand px-1.5 py-0.5 text-[10px] font-bold text-white">
                      Principal
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    aria-label="Quitar imagen"
                    className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-navy/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="btn-outline flex-1"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Subiendo...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" /> Subir imagen
                </>
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={onUpload}
              className="hidden"
            />
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1">
                <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slatebrand" />
                <input
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addImageUrl();
                    }
                  }}
                  placeholder="Pega una URL de imagen"
                  className="w-full rounded-xl border border-navy/10 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand"
                />
              </div>
              <button type="button" onClick={addImageUrl} className="btn-dark px-3">
                <ImagePlus className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Ficha técnica */}
        <div className="rounded-2xl border border-navy/5 bg-white p-6 shadow-card">
          <h2 className="mb-1 flex items-center gap-2 font-bold text-navy">
            <ListChecks className="h-5 w-5 text-brand" /> Ficha técnica
          </h2>
          <p className="mb-4 text-xs text-slatebrand">
            Características que se muestran en el detalle del producto (ej.
            Material → Aluminio). Deja vacío si no aplica.
          </p>

          {form.specs.length > 0 && (
            <div className="mb-3 space-y-2">
              {form.specs.map((spec, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={spec.label}
                    onChange={(e) => updateSpec(i, "label", e.target.value)}
                    placeholder="Característica (ej. Material)"
                    className="w-2/5 rounded-xl border border-navy/10 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand"
                  />
                  <input
                    value={spec.value}
                    onChange={(e) => updateSpec(i, "value", e.target.value)}
                    placeholder="Valor (ej. Aluminio anodizado)"
                    className="flex-1 rounded-xl border border-navy/10 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpec(i)}
                    aria-label="Quitar característica"
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-navy hover:bg-brand/10 hover:text-brand"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={addSpec}
            className="btn-outline w-full sm:w-auto"
          >
            <Plus className="h-5 w-5" /> Agregar característica
          </button>
        </div>
      </div>

      {/* Columna lateral */}
      <div className="space-y-5">
        <div className="rounded-2xl border border-navy/5 bg-white p-6 shadow-card">
          <h2 className="mb-4 font-bold text-navy">Precio e inventario</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy">
                Precio (COP) *
              </label>
              <input
                type="number"
                min={0}
                className={inputClass}
                value={form.priceCop}
                onChange={(e) =>
                  update("priceCop", e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="129900"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy">
                Precio antes (opcional)
              </label>
              <input
                type="number"
                min={0}
                className={inputClass}
                value={form.compareAtPriceCop}
                onChange={(e) =>
                  update(
                    "compareAtPriceCop",
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                placeholder="Para mostrar descuento"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy">
                Stock
              </label>
              <input
                type="number"
                min={0}
                className={inputClass}
                value={form.stock}
                onChange={(e) =>
                  update("stock", e.target.value === "" ? "" : Number(e.target.value))
                }
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-navy/5 bg-white p-6 shadow-card">
          <h2 className="mb-4 font-bold text-navy">Organización</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy">
                Categoría *
              </label>
              <select
                className={inputClass}
                value={form.categoryId}
                onChange={(e) =>
                  update(
                    "categoryId",
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-navy">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => update("featured", e.target.checked)}
                className="h-4 w-4 rounded border-navy/30 text-brand focus:ring-brand"
              />
              Destacado en la página principal
            </label>
            <label className="flex items-center gap-2 text-sm text-navy">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => update("active", e.target.checked)}
                className="h-4 w-4 rounded border-navy/30 text-brand focus:ring-brand"
              />
              Activo (visible en la tienda)
            </label>
          </div>
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
            "Crear producto"
          )}
        </button>
      </div>
    </form>
  );
}
