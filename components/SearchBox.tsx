"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { clsx } from "clsx";
import ProductImage from "./ProductImage";
import { formatCop } from "@/lib/format";

type Result = {
  slug: string;
  name: string;
  priceCop: number;
  compareAtPriceCop: number | null;
  image: string | null;
};

export default function SearchBox({
  className,
  placeholder = "Busca productos, categorías...",
  onNavigate,
}: {
  className?: string;
  placeholder?: string;
  /** Se llama tras navegar (útil para cerrar el menú móvil). */
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const boxRef = useRef<HTMLDivElement>(null);

  const trimmed = query.trim();

  // Busca mientras se escribe, con "debounce" y cancelando peticiones viejas.
  useEffect(() => {
    if (trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
      } catch {
        // Ignora aborto o error de red: no rompemos la escritura del usuario.
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmed]);

  // Cierra el desplegable al hacer clic fuera.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const goToShop = () => {
    setOpen(false);
    router.push(trimmed ? `/tienda?search=${encodeURIComponent(trimmed)}` : "/tienda");
    onNavigate?.();
  };

  const goToProduct = (slug: string) => {
    setOpen(false);
    setQuery("");
    router.push(`/producto/${slug}`);
    onNavigate?.();
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (highlight >= 0 && results[highlight]) {
      goToProduct(results[highlight].slug);
    } else {
      goToShop();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, -1));
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const showDropdown = open && trimmed.length >= 2;

  return (
    <div ref={boxRef} className={clsx("relative", className)}>
      <form onSubmit={onSubmit} className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slatebrand" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setHighlight(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          type="search"
          placeholder={placeholder}
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls="search-suggestions"
          aria-autocomplete="list"
          className="w-full rounded-xl border border-navy/10 bg-light py-2.5 pl-10 pr-9 text-sm text-navy outline-none transition focus:border-brand focus:bg-white"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slatebrand" />
        )}
      </form>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-navy/10 bg-white shadow-lg">
          {results.length > 0 ? (
            <ul
              id="search-suggestions"
              role="listbox"
              className="max-h-80 overflow-auto py-1"
            >
              {results.map((r, i) => (
                <li key={r.slug} role="option" aria-selected={i === highlight}>
                  <button
                    type="button"
                    onMouseEnter={() => setHighlight(i)}
                    onClick={() => goToProduct(r.slug)}
                    className={clsx(
                      "flex w-full items-center gap-3 px-3 py-2 text-left transition-colors",
                      i === highlight ? "bg-light" : "hover:bg-light"
                    )}
                  >
                    <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-light">
                      <ProductImage
                        src={r.image}
                        alt={r.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-navy">
                        {r.name}
                      </span>
                      <span className="block text-xs font-semibold text-brand">
                        {formatCop(r.priceCop)}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={goToShop}
                  className="w-full border-t border-navy/5 px-3 py-2.5 text-center text-sm font-medium text-navy hover:bg-light"
                >
                  Ver todos los resultados para &quot;{trimmed}&quot;
                </button>
              </li>
            </ul>
          ) : loading ? (
            <p className="px-3 py-4 text-sm text-slatebrand">Buscando...</p>
          ) : (
            <p className="px-3 py-4 text-sm text-slatebrand">
              Sin resultados para &quot;{trimmed}&quot;
            </p>
          )}
        </div>
      )}
    </div>
  );
}
