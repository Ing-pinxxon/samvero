const copFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

/** Formatea un valor entero en pesos colombianos, ej: 129900 -> "$ 129.900" */
export function formatCop(value: number): string {
  return copFormatter.format(value);
}

/** Porcentaje de descuento entre precio original y precio actual. */
export function discountPercent(priceCop: number, compareAtPriceCop?: number | null): number | null {
  if (!compareAtPriceCop || compareAtPriceCop <= priceCop) return null;
  return Math.round(((compareAtPriceCop - priceCop) / compareAtPriceCop) * 100);
}
