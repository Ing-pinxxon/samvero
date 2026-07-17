"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";
import { clsx } from "clsx";
import SamveroLogo from "./SamveroLogo";
import SearchBox from "./SearchBox";
import { useCart, selectCount } from "@/lib/cart-store";

type NavCategory = { name: string; slug: string };

const links = [
  { href: "/", label: "Inicio" },
  { href: "/tienda", label: "Tienda" },
  { href: "/ofertas", label: "Ofertas" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navbar({ categories }: { categories: NavCategory[] }) {
  const pathname = usePathname();
  const openCart = useCart((s) => s.openCart);
  const count = useCart(selectCount);
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-navy/5 bg-white/95 backdrop-blur">
      <div className="container-page">
        <div className="flex h-16 items-center gap-4">
          <Link href="/" aria-label="SAMVERO inicio">
            <SamveroLogo />
          </Link>

          {/* Buscador (desktop) */}
          <SearchBox className="ml-2 hidden flex-1 md:block" />

          {/* Links (desktop) */}
          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={clsx(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === l.href
                    ? "text-brand"
                    : "text-navy hover:text-brand"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Carrito */}
          <button
            type="button"
            onClick={openCart}
            aria-label="Abrir carrito"
            className="relative ml-auto inline-flex h-11 w-11 items-center justify-center rounded-xl bg-light text-navy transition-colors hover:bg-brand hover:text-white lg:ml-0"
          >
            <ShoppingCart className="h-5 w-5" />
            {mounted && count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </button>

          {/* Toggle móvil */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menú"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-light text-navy lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Categorías (desktop, segunda fila) */}
        <nav className="hidden items-center gap-6 border-t border-navy/5 py-2.5 lg:flex">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/categoria/${c.slug}`}
              className="text-sm font-medium text-slatebrand transition-colors hover:text-brand"
            >
              {c.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Menú móvil */}
      {mobileOpen && (
        <div className="border-t border-navy/5 bg-white lg:hidden">
          <div className="container-page space-y-4 py-4">
            <SearchBox
              placeholder="Buscar productos..."
              onNavigate={() => setMobileOpen(false)}
            />
            <div className="flex flex-col">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-lg px-2 py-2.5 text-sm font-medium text-navy hover:bg-light"
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <div>
              <p className="px-2 text-xs font-semibold uppercase tracking-wide text-slatebrand">
                Categorías
              </p>
              <div className="mt-1 flex flex-col">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/categoria/${c.slug}`}
                    className="rounded-lg px-2 py-2.5 text-sm text-navy hover:bg-light"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
