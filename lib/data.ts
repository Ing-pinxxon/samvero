import { prisma } from "./prisma";
import type { Prisma } from "@prisma/client";

const productInclude = {
  images: { orderBy: { sortOrder: "asc" } },
  specs: { orderBy: { sortOrder: "asc" } },
  category: true,
} satisfies Prisma.ProductInclude;

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: typeof productInclude;
}>;

/** Imagen principal de un producto (primera de la galería) o null. */
export function primaryImage(product: ProductWithRelations): string | null {
  return product.images[0]?.url ?? null;
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: { where: { active: true } } } } },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export async function getFeaturedProducts(limit = 8) {
  return prisma.product.findMany({
    where: { active: true, featured: true },
    include: productInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export type ProductSort = "recientes" | "precio-asc" | "precio-desc";

type ProductQuery = {
  categorySlug?: string;
  search?: string;
  sort?: ProductSort;
  onlyOffers?: boolean;
};

export async function getProducts({
  categorySlug,
  search,
  sort = "recientes",
  onlyOffers = false,
}: ProductQuery = {}) {
  const where: Prisma.ProductWhereInput = { active: true };

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }
  if (onlyOffers) {
    where.compareAtPriceCop = { not: null };
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "precio-asc"
      ? { priceCop: "asc" }
      : sort === "precio-desc"
        ? { priceCop: "desc" }
        : { createdAt: "desc" };

  return prisma.product.findMany({ where, include: productInclude, orderBy });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: productInclude,
  });
}

export async function getRelatedProducts(
  categoryId: number,
  excludeId: number,
  limit = 4
) {
  return prisma.product.findMany({
    where: { active: true, categoryId, id: { not: excludeId } },
    include: productInclude,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminCounts() {
  const [products, categories, featured, active] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.product.count({ where: { featured: true } }),
    prisma.product.count({ where: { active: true } }),
  ]);
  return { products, categories, featured, active };
}
