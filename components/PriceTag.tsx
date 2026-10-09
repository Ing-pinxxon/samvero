import { clsx } from "clsx";
import { formatCop, discountPercent } from "@/lib/format";

type Props = {
  priceCop: number;
  compareAtPriceCop?: number | null;
  size?: "sm" | "lg";
  className?: string;
};

export default function PriceTag({
  priceCop,
  compareAtPriceCop,
  size = "sm",
  className,
}: Props) {
  const discount = discountPercent(priceCop, compareAtPriceCop);
  const onSale = Boolean(compareAtPriceCop && discount);

  return (
    <div className={clsx("flex flex-wrap items-baseline gap-2", className)}>
      <span
        className={clsx(
          "font-bold",
          // Estilo Temu: el precio rebajado va en naranja y en grande.
          onSale ? "text-brand" : "text-navy",
          size === "lg" ? (onSale ? "text-4xl font-extrabold" : "text-3xl") : "text-lg"
        )}
      >
        {formatCop(priceCop)}
      </span>
      {onSale && compareAtPriceCop && (
        <>
          <span
            className={clsx(
              "text-slatebrand line-through",
              size === "lg" ? "text-lg" : "text-sm"
            )}
          >
            {formatCop(compareAtPriceCop)}
          </span>
          {size === "lg" ? (
            <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-sm font-bold text-emerald-700">
              Ahorras {formatCop(compareAtPriceCop - priceCop)} (-{discount}%)
            </span>
          ) : (
            <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
              -{discount}%
            </span>
          )}
        </>
      )}
    </div>
  );
}
