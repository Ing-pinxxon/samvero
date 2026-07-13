import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.name) {
    return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
  }

  let slug = slugify(body.slug || body.name) || "categoria";
  // Garantiza slug único.
  let n = 1;
  while (await prisma.category.findUnique({ where: { slug } })) {
    n += 1;
    slug = `${slugify(body.name)}-${n}`;
  }

  const category = await prisma.category.create({
    data: {
      name: body.name,
      slug,
      tagline: body.tagline || null,
      iconKey: body.iconKey || "box",
      imageUrl: body.imageUrl || null,
      sortOrder: body.sortOrder != null ? Number(body.sortOrder) : 0,
    },
  });

  return NextResponse.json(category, { status: 201 });
}
