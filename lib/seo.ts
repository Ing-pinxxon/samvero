const rawUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://samvero.co";

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
    category: p.categoryName,
    brand: { "@type": "Brand", name: siteConfig.name },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/producto/${p.slug}`),
      priceCurrency: siteConfig.currency,
      price: p.priceCop,
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
