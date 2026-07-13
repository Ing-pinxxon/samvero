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

  return (
    <div className={clsx("flex flex-wrap items-baseline gap-2", className)}>
      <span
        className={clsx(
          "font-bold text-navy",
          size === "lg" ? "text-3xl" : "text-lg"
        )}
      >
        {formatCop(priceCop)}
      </span>
      {compareAtPriceCop && discount && (
        <>
          <span
            className={clsx(
              "text-slatebrand line-through",
              size === "lg" ? "text-lg" : "text-sm"
            )}
          >
            {formatCop(compareAtPriceCop)}
          </span>
          <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
            -{discount}%
          </span>
        </>
      )}
    </div>
  );
}
