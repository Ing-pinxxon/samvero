import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Sugerencias del buscador (ruta pública). Devuelve los campos mínimos que
// necesita el desplegable: nombre, precio e imagen principal.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";

  const products = await searchProducts(q).catch(() => []);

  return NextResponse.json(
    products.map((p) => ({
      slug: p.slug,
      name: p.name,
      priceCop: p.priceCop,
      compareAtPriceCop: p.compareAtPriceCop,
      image: p.images[0]?.url ?? null,
    }))
  );
}
