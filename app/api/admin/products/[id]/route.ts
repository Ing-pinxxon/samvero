import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { normalizeSpecs } from "@/lib/product-input";

async function uniqueSlug(base: string, excludeId: number): Promise<string> {
  const root = slugify(base) || "producto";
  let slug = root;
  let n = 1;
  while (true) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    n += 1;
    slug = `${root}-${n}`;
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
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

  if (!Number.isFinite(Number(priceCop)) || Number(priceCop) < 0) {
    return NextResponse.json({ error: "Precio inválido" }, { status: 400 });
  }

  const slug = await uniqueSlug(body.slug || name, id);

  // Reemplaza las imágenes por las nuevas.
  const product = await prisma.product.update({
    where: { id },
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
        deleteMany: {},
        create: (images as string[])
          .filter(Boolean)
          .map((url, i) => ({ url, alt: name, sortOrder: i })),
      },
      specs: {
        deleteMany: {},
        create: normalizeSpecs(specs),
      },
    },
    include: { images: true, specs: true },
  });

  return NextResponse.json(product);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  await prisma.product.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
