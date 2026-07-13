// Marcas diacríticas combinantes (U+0300–U+036F). Se construye con RegExp
// para no depender del flag /u ni de escribir los caracteres combinantes.
const DIACRITICS = new RegExp("[\\u0300-\\u036f]", "g");

/** Convierte un texto en un slug URL-friendly (sin acentos ni símbolos). */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(DIACRITICS, "") // quita acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
