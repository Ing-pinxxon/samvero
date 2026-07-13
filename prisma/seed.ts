import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`;

type SeedCategory = {
  name: string;
  slug: string;
  tagline: string;
  iconKey: string;
  imageUrl: string;
  sortOrder: number;
};

const categories: SeedCategory[] = [
  {
    name: "Tecnología",
    slug: "tecnologia",
    tagline: "Conectividad y entretenimiento para ti.",
    iconKey: "cpu",
    imageUrl: img("1505740420928-5e560c06d30e"),
    sortOrder: 1,
  },
  {
    name: "Hogar",
    slug: "hogar",
    tagline: "Productos para tu hogar pensados en ti.",
    iconKey: "home",
    imageUrl: img("1493663284031-b7e3aefcae8e"),
    sortOrder: 2,
  },
  {
    name: "Iluminación",
    slug: "iluminacion",
    tagline: "Luce tus espacios con estilo.",
    iconKey: "lightbulb",
    imageUrl: img("1507473885765-e6ed057f782c"),
    sortOrder: 3,
  },
  {
    name: "Organización",
    slug: "organizacion",
    tagline: "Todo en orden, todo a la mano.",
    iconKey: "package",
    imageUrl: img("1594040226829-7f251ab46d80"),
    sortOrder: 4,
  },
  {
    name: "Regalos",
    slug: "regalos",
    tagline: "Ideas especiales para todos.",
    iconKey: "gift",
    imageUrl: img("1549465220-1a8b9238cd48"),
    sortOrder: 5,
  },
];

type SeedProduct = {
  name: string;
  slug: string;
  description: string;
  priceCop: number;
  compareAtPriceCop?: number;
  stock: number;
  featured: boolean;
  categorySlug: string;
  images: string[];
  specs?: { label: string; value: string }[];
};

const products: SeedProduct[] = [
  // ---------------- Tecnología ----------------
  {
    name: "Audífonos Inalámbricos Pro",
    slug: "audifonos-inalambricos-pro",
    description:
      "Sonido envolvente con cancelación de ruido activa, hasta 30 horas de batería y estuche de carga rápida. Perfectos para trabajo y música.",
    priceCop: 189900,
    compareAtPriceCop: 249900,
    stock: 25,
    featured: true,
    categorySlug: "tecnologia",
    images: [img("1505740420928-5e560c06d30e"), img("1484704849700-f032a568e944")],
    specs: [
      { label: "Conectividad", value: "Bluetooth 5.3" },
      { label: "Batería", value: "Hasta 30 horas" },
      { label: "Cancelación de ruido", value: "Activa (ANC)" },
      { label: "Garantía", value: "12 meses" },
    ],
  },
  {
    name: "Smartwatch Serie 8",
    slug: "smartwatch-serie-8",
    description:
      "Monitorea tu salud, notificaciones y actividad física. Pantalla AMOLED, resistente al agua y batería de larga duración.",
    priceCop: 279900,
    compareAtPriceCop: 349900,
    stock: 18,
    featured: true,
    categorySlug: "tecnologia",
    images: [img("1523275335684-37898b6baf30"), img("1546868871-7041f2a55e12")],
    specs: [
      { label: "Pantalla", value: "AMOLED 1.4”" },
      { label: "Resistencia al agua", value: "IP68" },
      { label: "Sensores", value: "Ritmo cardíaco, SpO2, podómetro" },
      { label: "Compatibilidad", value: "Android e iOS" },
      { label: "Garantía", value: "12 meses" },
    ],
  },
  {
    name: "Parlante Bluetooth Portátil",
    slug: "parlante-bluetooth-portatil",
    description:
      "Bajos potentes, resistencia al agua IPX7 y 12 horas de reproducción. Llévalo a todas partes.",
    priceCop: 129900,
    stock: 40,
    featured: true,
    categorySlug: "tecnologia",
    images: [img("1608043152269-423dbba4e7e1")],
  },
  {
    name: "Teclado Mecánico RGB",
    slug: "teclado-mecanico-rgb",
    description:
      "Switches responsivos, iluminación RGB personalizable y estructura compacta para gaming y productividad.",
    priceCop: 159900,
    stock: 22,
    featured: false,
    categorySlug: "tecnologia",
    images: [img("1587829741301-dc798b83add3")],
  },
  {
    name: "Cargador Inalámbrico Rápido",
    slug: "cargador-inalambrico-rapido",
    description:
      "Base de carga rápida 15W compatible con todos los dispositivos Qi. Diseño minimalista antideslizante.",
    priceCop: 74900,
    compareAtPriceCop: 99900,
    stock: 50,
    featured: false,
    categorySlug: "tecnologia",
    images: [img("1591290619762-c588ab0f2a02")],
  },
  // ---------------- Hogar ----------------
  {
    name: "Difusor de Aromas Ultrasónico",
    slug: "difusor-de-aromas-ultrasonico",
    description:
      "Humidifica y aromatiza tus espacios con luz LED de ambiente en 7 colores. Apagado automático y funcionamiento silencioso.",
    priceCop: 89900,
    compareAtPriceCop: 119900,
    stock: 35,
    featured: true,
    categorySlug: "hogar",
    images: [img("1602928321679-560bb453f190")],
  },
  {
    name: "Set de Ollas Antiadherentes",
    slug: "set-de-ollas-antiadherentes",
    description:
      "Juego de 5 piezas con recubrimiento antiadherente de alta resistencia y mangos ergonómicos que no se calientan.",
    priceCop: 219900,
    stock: 15,
    featured: false,
    categorySlug: "hogar",
    images: [img("1584990347449-a2d4c2c7a03b")],
  },
  {
    name: "Manta Cobija Suave Premium",
    slug: "manta-cobija-suave-premium",
    description:
      "Ultra suave, cálida y ligera. Ideal para sala o habitación. Material hipoalergénico fácil de lavar.",
    priceCop: 99900,
    stock: 30,
    featured: true,
    categorySlug: "hogar",
    images: [img("1522771739844-6a9f6d5f14af")],
  },
  {
    name: "Cafetera Eléctrica Compacta",
    slug: "cafetera-electrica-compacta",
    description:
      "Prepara hasta 4 tazas de café en minutos. Jarra de vidrio, placa térmica y apagado automático.",
    priceCop: 149900,
    compareAtPriceCop: 189900,
    stock: 20,
    featured: false,
    categorySlug: "hogar",
    images: [img("1495474472287-4d71bcdd2085")],
  },
  // ---------------- Iluminación ----------------
  {
    name: "Lámpara de Mesa LED Táctil",
    slug: "lampara-de-mesa-led-tactil",
    description:
      "Control táctil con 3 niveles de intensidad y puerto USB integrado. Luz cálida perfecta para leer o trabajar.",
    priceCop: 84900,
    stock: 28,
    featured: true,
    categorySlug: "iluminacion",
    images: [img("1517991104123-1d56a6e81ed9")],
  },
  {
    name: "Tira LED RGB Inteligente 5m",
    slug: "tira-led-rgb-inteligente-5m",
    description:
      "Millones de colores controlables desde tu celular o por voz. Sincroniza con la música y crea ambientes únicos.",
    priceCop: 69900,
    compareAtPriceCop: 89900,
    stock: 45,
    featured: true,
    categorySlug: "iluminacion",
    images: [img("1550985616-10810253b84d")],
  },
  {
    name: "Lámpara de Pie Moderna",
    slug: "lampara-de-pie-moderna",
    description:
      "Diseño elegante de brazo ajustable para iluminar cualquier rincón de tu hogar con estilo contemporáneo.",
    priceCop: 189900,
    stock: 12,
    featured: false,
    categorySlug: "iluminacion",
    images: [img("1507473885765-e6ed057f782c")],
  },
  {
    name: "Bombillo Inteligente Wi-Fi",
    slug: "bombillo-inteligente-wifi",
    description:
      "Ajusta color y brillo desde una app. Compatible con asistentes de voz. Ahorra energía sin perder ambiente.",
    priceCop: 39900,
    stock: 60,
    featured: false,
    categorySlug: "iluminacion",
    images: [img("1532032281026-4b3b3c5f2b3a")],
  },
  // ---------------- Organización ----------------
  {
    name: "Set de Frascos Herméticos x6",
    slug: "set-de-frascos-hermeticos-x6",
    description:
      "Mantén tus alimentos frescos y tu despensa ordenada. Tapa hermética con sello de silicona y etiquetas incluidas.",
    priceCop: 79900,
    compareAtPriceCop: 109900,
    stock: 33,
    featured: true,
    categorySlug: "organizacion",
    images: [img("1594040226829-7f251ab46d80")],
  },
  {
    name: "Organizador de Escritorio Multiuso",
    slug: "organizador-de-escritorio-multiuso",
    description:
      "Compartimentos para lápices, notas y accesorios. Mantén tu espacio de trabajo limpio y funcional.",
    priceCop: 54900,
    stock: 40,
    featured: false,
    categorySlug: "organizacion",
    images: [img("1524578271613-d550eacf6090")],
  },
  {
    name: "Cajas Organizadoras Plegables x3",
    slug: "cajas-organizadoras-plegables-x3",
    description:
      "Ideales para closet, ropa o juguetes. Material resistente, plegables y con asas para transportar fácil.",
    priceCop: 64900,
    stock: 26,
    featured: false,
    categorySlug: "organizacion",
    images: [img("1558997519-83ea9252edf8")],
  },
  // ---------------- Regalos ----------------
  {
    name: "Caja de Regalo Sorpresa Premium",
    slug: "caja-de-regalo-sorpresa-premium",
    description:
      "Una selección especial de productos SAMVERO en una presentación elegante. El detalle perfecto para sorprender.",
    priceCop: 149900,
    compareAtPriceCop: 199900,
    stock: 15,
    featured: true,
    categorySlug: "regalos",
    images: [img("1549465220-1a8b9238cd48")],
  },
  {
    name: "Set de Velas Aromáticas x3",
    slug: "set-de-velas-aromaticas-x3",
    description:
      "Fragancias relajantes de larga duración en frascos de vidrio reutilizables. Ideal para regalar o consentirte.",
    priceCop: 59900,
    stock: 38,
    featured: false,
    categorySlug: "regalos",
    images: [img("1602874801007-bd458bb1b8b6")],
  },
];

async function main() {
  console.log("🌱 Sembrando base de datos SAMVERO...");

  // Categorías (upsert por slug)
  const categoryIdBySlug = new Map<string, number>();
  for (const c of categories) {
    const saved = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {
        name: c.name,
        tagline: c.tagline,
        iconKey: c.iconKey,
        imageUrl: c.imageUrl,
        sortOrder: c.sortOrder,
      },
      create: c,
    });
    categoryIdBySlug.set(c.slug, saved.id);
  }
  console.log(`✅ ${categories.length} categorías listas`);

  // Productos (upsert por slug, reemplazando imágenes)
  for (const p of products) {
    const categoryId = categoryIdBySlug.get(p.categorySlug);
    if (!categoryId) continue;

    const data = {
      name: p.name,
      description: p.description,
      priceCop: p.priceCop,
      compareAtPriceCop: p.compareAtPriceCop ?? null,
      stock: p.stock,
      featured: p.featured,
      active: true,
      categoryId,
    };

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: data,
      create: { slug: p.slug, ...data },
    });

    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.createMany({
      data: p.images.map((url, i) => ({
        url,
        alt: p.name,
        sortOrder: i,
        productId: product.id,
      })),
    });

    await prisma.productSpec.deleteMany({ where: { productId: product.id } });
    if (p.specs?.length) {
      await prisma.productSpec.createMany({
        data: p.specs.map((s, i) => ({
          label: s.label,
          value: s.value,
          sortOrder: i,
          productId: product.id,
        })),
      });
    }
  }
  console.log(`✅ ${products.length} productos listos`);
  console.log("🎉 Seed completado.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
