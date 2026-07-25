/**
 * URL base del sitio, en orden de prioridad:
 * 1. NEXT_PUBLIC_SITE_URL — la que defines tú (dominio propio en producción).
 * 2. VERCEL_PROJECT_PRODUCTION_URL — la URL de producción que Vercel provee
 *    automáticamente (ej. "samvero.vercel.app"), útil mientras no haya dominio.
 * 3. localhost para desarrollo.
 *
 * Antes había un dominio fijo ("samvero.co") como respaldo: si ese dominio no
 * existía, Google recibía canonicals y un sitemap apuntando a un sitio muerto y
 * no indexaba. siteConfig solo se usa en componentes de servidor (layout,
 * sitemap, robots, metadata y JSON-LD), por eso es seguro leer variables que
 * solo existen en el servidor como VERCEL_PROJECT_PRODUCTION_URL.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

const rawUrl = resolveSiteUrl();

export const siteConfig = {
  name: "SAMVERO",
  url: rawUrl.replace(/\/$/, ""),
  slogan: "Todo lo que necesitas, en un solo lugar.",
  description:
    "Tienda online SAMVERO: tecnología, hogar, iluminación, organización y regalos. Envíos a todo Colombia, compra segura y productos garantizados.",
  locale: "es_CO",
  country: "CO",
  currency: "COP",
  email: "hola@samvero.co",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  social: {
    instagram: "https://instagram.com/samvero.co",
    facebook: "https://facebook.com/samveroco",
    tiktok: "https://tiktok.com/@samvero.co",
    youtube: "https://youtube.com/@samveroco",
  },
};

/** Convierte una ruta (o URL relativa de imagen) en URL absoluta. */
export function absoluteUrl(path = ""): string {
  if (!path) return siteConfig.url;
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Corta un texto en el límite de palabra más cercano sin pasar de `max`. */
export function truncateAtWord(text: string, max = 160): string {
  const clean = text.trim().replace(/\s+/g, " ");
  if (clean.length <= max) return clean;
  const slice = clean.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > 40 ? slice.slice(0, lastSpace) : slice;
  return `${cut.trimEnd()}…`;
}

/**
 * Descripción para buscadores de un producto. Usa la descripción escrita si
 * tiene contenido suficiente; si no, arma un respaldo con el nombre, la
 * categoría y el gancho de envíos, para que ningún producto quede sin meta
 * description (Google penaliza las páginas sin descripción).
 */
export function productSeoDescription(p: {
  name: string;
  description?: string | null;
  categoryName?: string | null;
}): string {
  const base = (p.description ?? "").trim();
  if (base.length >= 50) return truncateAtWord(base, 160);
  const cat = p.categoryName ? ` de ${p.categoryName}` : "";
  return truncateAtWord(
    `${p.name}${cat} disponible en ${siteConfig.name}. Compra online con envíos a todo Colombia y pago seguro.`,
    160
  );
}

/** Datos estructurados de la organización/tienda. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    logo: absoluteUrl("/icon.svg"),
    image: absoluteUrl("/icon.svg"),
    email: siteConfig.email,
    slogan: siteConfig.slogan,
    areaServed: { "@type": "Country", name: "Colombia" },
    sameAs: Object.values(siteConfig.social),
  };
}

/** Datos estructurados del sitio + caja de búsqueda (sitelinks searchbox). */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: "es-CO",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/tienda?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

type ProductLd = {
  name: string;
  slug: string;
  description: string;
  priceCop: number;
  stock: number;
  images: string[];
  categoryName: string;
};

/** Datos estructurados de producto (precio, disponibilidad, marca). */
export function productJsonLd(p: ProductLd) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    image: p.images.map((i) => absoluteUrl(i)),
    sku: p.slug,
    category: p.categoryName,
    brand: { "@type": "Brand", name: siteConfig.name },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/producto/${p.slug}`),
      priceCurrency: siteConfig.currency,
      price: p.priceCop,
      itemCondition: "https://schema.org/NewCondition",
      availability:
        p.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: siteConfig.name },
    },
  };
}

/** Datos estructurados de migas de pan. */
export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}
