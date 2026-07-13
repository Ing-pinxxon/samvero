import Link from "next/link";
import { Instagram, Facebook, Youtube, MapPin, Mail } from "lucide-react";
import SamveroLogo from "./SamveroLogo";

type FooterCategory = { name: string; slug: string };

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M16.5 3c.3 2.1 1.5 3.4 3.5 3.6v2.4c-1.2.1-2.4-.2-3.5-.8v5.5c0 4-3.3 6.6-6.9 5.7-2.6-.6-4.2-3-3.9-5.6.3-2.6 2.7-4.6 5.3-4.4v2.5c-.5-.1-1-.1-1.5.1-1 .4-1.5 1.4-1.3 2.4.2 1 1.1 1.7 2.2 1.6 1.1-.1 1.9-1 1.9-2.2V3h2.7z" />
    </svg>
  );
}

const socials = [
  { icon: Instagram, href: "https://instagram.com/samvero.co", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com/samveroco", label: "Facebook" },
  { icon: TikTokIcon, href: "https://tiktok.com/@samvero.co", label: "TikTok" },
  { icon: Youtube, href: "https://youtube.com/@samveroco", label: "YouTube" },
];

export default function Footer({ categories }: { categories: FooterCategory[] }) {
  return (
    <footer className="mt-20 bg-navy text-white">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <SamveroLogo variant="light" />
          <p className="mt-4 max-w-xs text-sm text-white/70">
            Todo lo que necesitas, en un solo lugar. Tecnología · Hogar · Innovación.
          </p>
          <div className="mt-5 flex gap-2">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-brand"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/90">
            Categorías
          </h3>
          <ul className="space-y-2 text-sm text-white/70">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/categoria/${c.slug}`}
                  className="transition-colors hover:text-brand"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/90">
            Tienda
          </h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li>
              <Link href="/tienda" className="transition-colors hover:text-brand">
                Todos los productos
              </Link>
            </li>
            <li>
              <Link href="/ofertas" className="transition-colors hover:text-brand">
                Ofertas
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="transition-colors hover:text-brand">
                Contacto
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/90">
            Contacto
          </h3>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand" /> Colombia
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-brand" /> hola@samvero.co
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/60 sm:flex-row">
          <p>© {new Date().getFullYear()} SAMVERO. Todos los derechos reservados.</p>
          <p>samvero.co</p>
        </div>
      </div>
    </footer>
  );
}
