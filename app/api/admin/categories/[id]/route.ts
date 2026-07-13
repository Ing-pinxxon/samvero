import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.name) {
    return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
  }

  let slug = slugify(body.slug || body.name) || "categoria";
  let n = 1;
  // Slug único (permitiendo el propio registro).
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (!existing || existing.id === id) break;
    n += 1;
    slug = `${slugify(body.name)}-${n}`;
  }

  const category = await prisma.category.update({
    where: { id },
    data: {
      name: body.name,
      slug,
      tagline: body.tagline || null,
      iconKey: body.iconKey || "box",
      imageUrl: body.imageUrl || null,
      sortOrder: body.sortOrder != null ? Number(body.sortOrder) : 0,
    },
  });

  return NextResponse.json(category);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) {
    return NextResponse.json(
      { error: `No se puede eliminar: tiene ${count} producto(s) asociados.` },
      { status: 409 }
    );
  }

  await prisma.category.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
