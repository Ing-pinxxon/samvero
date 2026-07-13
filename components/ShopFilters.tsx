"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { clsx } from "clsx";

type Cat = { name: string; slug: string };

type Props = {
  categories: Cat[];
  activeCategory?: string;
  basePath?: string;
};

const sorts = [
  { value: "recientes", label: "Más recientes" },
  { value: "precio-asc", label: "Precio: menor a mayor" },
  { value: "precio-desc", label: "Precio: mayor a menor" },
];

export default function ShopFilters({
  categories,
  activeCategory,
  basePath = "/tienda",
}: Props) {
  const router = useRouter();
  const params = useSearchParams();

  // Conserva búsqueda y orden al cambiar de categoría, pero la categoría
  // vive en la ruta (/categoria/<slug>), no como query param.
  const preservedQuery = () => {
    const p = new URLSearchParams();
    const search = params.get("search");
    const sort = params.get("sort");
    if (search) p.set("search", search);
    if (sort) p.set("sort", sort);
    return p.toString();
  };

  const buildHref = (categoria?: string) => {
    const qs = preservedQuery();
    const path = categoria ? `/categoria/${categoria}` : "/tienda";
    return qs ? `${path}?${qs}` : path;
  };

  const onSortChange = (value: string) => {
    const p = new URLSearchParams(params.toString());
    p.set("sort", value);
    router.push(`${basePath}?${p.toString()}`);
  };

  const currentSort = params.get("sort") ?? "recientes";

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        <Link
          href={buildHref(undefined)}
          className={clsx(
            "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
            !activeCategory
              ? "bg-navy text-white"
              : "bg-light text-navy hover:bg-navy/10"
          )}
        >
          Todas
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={buildHref(c.slug)}
            className={clsx(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              activeCategory === c.slug
                ? "bg-navy text-white"
                : "bg-light text-navy hover:bg-navy/10"
            )}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <label htmlFor="sort" className="text-sm text-slatebrand">
          Ordenar:
        </label>
        <select
          id="sort"
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded-xl border border-navy/10 bg-white px-3 py-2 text-sm font-medium text-navy outline-none focus:border-brand"
        >
          {sorts.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
