"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, FolderTree, LogOut } from "lucide-react";
import { clsx } from "clsx";
import SamveroLogo from "@/components/SamveroLogo";

const links = [
  { href: "/admin", label: "Inicio", icon: LayoutDashboard },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/categorias", label: "Categorías", icon: FolderTree },
];

export default function AdminMobileBar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="sticky top-0 z-30 border-b border-navy/10 bg-navy text-white lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <SamveroLogo variant="light" />
        <button
          onClick={logout}
          aria-label="Cerrar sesión"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
      <nav className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium",
              isActive(href) ? "bg-brand text-white" : "bg-white/10 text-white/80"
            )}
          >
            <Icon className="h-4 w-4" /> {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
