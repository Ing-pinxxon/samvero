type SpecInput = { label?: string; value?: string };

/** Limpia y ordena la ficha técnica: descarta filas sin etiqueta. */
export function normalizeSpecs(specs: unknown) {
  if (!Array.isArray(specs)) return [];
  return (specs as SpecInput[])
    .map((s) => ({ label: (s.label ?? "").trim(), value: (s.value ?? "").trim() }))
    .filter((s) => s.label.length > 0)
    .map((s, i) => ({ label: s.label, value: s.value, sortOrder: i }));
}
