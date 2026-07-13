import ProductCard from "./ProductCard";
import type { ProductWithRelations } from "@/lib/data";

export default function ProductGrid({
  products,
}: {
  products: ProductWithRelations[];
}) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-navy/15 bg-light py-16 text-center">
        <p className="text-lg font-semibold text-navy">No hay productos aquí todavía</p>
        <p className="mt-1 text-sm text-slatebrand">
          Vuelve pronto, estamos agregando novedades.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
