import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { normalizeSpecs } from "@/lib/product-input";

export async function GET() {
  const products = await prisma.product.findMany({
    include: { images: { orderBy: { sortOrder: "asc" } }, category: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

async function uniqueSlug(base: string, excludeId?: number): Promise<string> {
  const root = slugify(base) || "producto";
  let slug = root;
  let n = 1;
  // Busca un slug libre agregando sufijo numérico si es necesario.
  while (true) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    n += 1;
    slug = `${root}-${n}`;
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const {
    name,
    description = "",
    priceCop,
    compareAtPriceCop,
    stock = 0,
    featured = false,
    active = true,
    categoryId,
    images = [],
    specs = [],
  } = body;

  if (!name || !categoryId || priceCop == null) {
    return NextResponse.json(
      { error: "Nombre, categoría y precio son obligatorios" },
      { status: 400 }
    );
  }

  const slug = await uniqueSlug(body.slug || name);

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description,
      priceCop: Number(priceCop),
      compareAtPriceCop:
        compareAtPriceCop != null && compareAtPriceCop !== ""
          ? Number(compareAtPriceCop)
          : null,
      stock: Number(stock),
      featured: Boolean(featured),
      active: Boolean(active),
      categoryId: Number(categoryId),
      images: {
        create: (images as string[])
          .filter(Boolean)
          .map((url, i) => ({ url, alt: name, sortOrder: i })),
      },
      specs: {
        create: normalizeSpecs(specs),
      },
    },
    include: { images: true, specs: true },
  });

  return NextResponse.json(product, { status: 201 });
}
