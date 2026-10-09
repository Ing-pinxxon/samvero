import Link from "next/link";
import ProductImage from "./ProductImage";
import PriceTag from "./PriceTag";
import AddToCartButton from "./AddToCartButton";
import { primaryImage, type ProductWithRelations } from "@/lib/data";
import { discountPercent, formatCop } from "@/lib/format";
import { isNewProduct, LOW_STOCK_THRESHOLD } from "@/lib/season";

export default function ProductCard({ product }: { product: ProductWithRelations }) {
  const image = primaryImage(product);
  const discount = discountPercent(product.priceCop, product.compareAtPriceCop);
  const soldOut = product.stock <= 0;
  const lowStock = !soldOut && product.stock <= LOW_STOCK_THRESHOLD;
  const savings =
    discount && product.compareAtPriceCop ? product.compareAtPriceCop - product.priceCop : null;

  return (
    <div className="product-card group relative flex flex-col overflow-hidden rounded-2xl border border-navy/5 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-cardHover">
      <Link
        href={`/producto/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-light"
      >
        <ProductImage
          src={image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Etiquetas estilo Temu: cada una depende de un dato real del panel */}
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1">
          {discount && (
            <span className="discount-badge rounded-full bg-brand px-2.5 py-1 text-xs font-bold text-white shadow">
              -{discount}%
            </span>
          )}
          {soldOut && (
            <span className="rounded-full bg-navy px-2.5 py-1 text-xs font-bold text-white shadow">
              Agotado
            </span>
          )}
          {lowStock && (
            <span className="rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white shadow">
              ¡Solo quedan {product.stock}!
            </span>
          )}
          {isNewProduct(product.createdAt) && (
            <span className="rounded-full bg-navy px-2.5 py-1 text-xs font-bold text-white shadow">
              Nuevo
            </span>
          )}
          {product.featured && (
            <span className="rounded-full bg-witch px-2.5 py-1 text-xs font-bold text-white shadow">
              ⭐ Destacado
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-brand">
          {product.category.name}
        </span>
        <Link href={`/producto/${product.slug}`} className="flex-1">
          <h3 className="line-clamp-2 text-sm font-semibold text-navy transition-colors group-hover:text-brand">
            {product.name}
          </h3>
        </Link>
        <div className="mt-1 flex items-end justify-between gap-2">
          <PriceTag
            priceCop={product.priceCop}
            compareAtPriceCop={product.compareAtPriceCop}
          />
          <AddToCartButton
            variant="icon"
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              priceCop: product.priceCop,
              image,
              maxStock: product.stock,
            }}
          />
        </div>
        {savings && (
          <p className="text-xs font-bold text-emerald-700">Ahorras {formatCop(savings)}</p>
        )}
      </div>
    </div>
  );
}
