// Auditoría SEO de productos (SOLO LECTURA). No modifica nada en la base.
// Uso:  npm run seo:audit           -> escribe seo-audit-report.md
//       npm run seo:audit -- ruta.md
//
// Recorre todos los productos y revisa nombre, descripción, imágenes, ficha
// técnica, estado y duplicados. Genera un reporte en Markdown con el
// diagnóstico por producto y un resumen con prioridades.

import { writeFile } from "node:fs/promises";
import { prisma } from "../lib/prisma";

type Severity = "CRÍTICO" | "IMPORTANTE" | "MENOR";
type Issue = { severity: Severity; message: string };

const ICON: Record<Severity, string> = {
  CRÍTICO: "🔴",
  IMPORTANTE: "🟠",
  MENOR: "🟡",
};

const MIN_NAME = 15;
const MAX_NAME = 70;
const MIN_DESC = 80;

function auditProduct(
  p: {
    name: string;
    slug: string;
    description: string;
    active: boolean;
    stock: number;
    images: { url: string; alt: string | null }[];
    specs: { id: number }[];
    category: { name: string } | null;
  },
  descIndex: Map<string, number>
): Issue[] {
  const issues: Issue[] = [];
  const desc = p.description.trim();

  // --- Imágenes ---
  if (p.images.length === 0) {
    issues.push({ severity: "CRÍTICO", message: "Sin imágenes: no aparece en Google Imágenes ni habilita resultados enriquecidos." });
  } else {
    const local = p.images.filter((i) => i.url.startsWith("/uploads/"));
    if (local.length > 0) {
      issues.push({ severity: "CRÍTICO", message: `${local.length} imagen(es) apuntan a /uploads/ (disco local): no existen en producción y salen rotas.` });
    }
    if (p.images.length === 1) {
      issues.push({ severity: "MENOR", message: "Solo 1 imagen. Con 3+ mejora la conversión y la galería." });
    }
    const noAlt = p.images.filter((i) => !i.alt || !i.alt.trim()).length;
    if (noAlt > 0) {
      issues.push({ severity: "MENOR", message: `${noAlt} imagen(es) sin texto alternativo (alt).` });
    }
  }

  // --- Descripción ---
  if (desc.length === 0) {
    issues.push({ severity: "CRÍTICO", message: "Sin descripción: la meta description usará un respaldo genérico." });
  } else if (desc.length < MIN_DESC) {
    issues.push({ severity: "IMPORTANTE", message: `Descripción muy corta (${desc.length} car.). Ideal 150+ con beneficios y palabras clave.` });
  }
  if (desc.length > 0) {
    const key = desc.toLowerCase();
    const count = descIndex.get(key) ?? 0;
    if (count > 1) {
      issues.push({ severity: "IMPORTANTE", message: "Descripción duplicada con otro(s) producto(s): Google puede tratarla como contenido repetido." });
    }
  }

  // --- Nombre / título ---
  if (p.name.trim().length < MIN_NAME) {
    issues.push({ severity: "IMPORTANTE", message: `Título corto (${p.name.trim().length} car.). Agrega tipo de producto + atributo clave (marca, tamaño, uso).` });
  } else if (p.name.trim().length > MAX_NAME) {
    issues.push({ severity: "MENOR", message: `Título largo (${p.name.trim().length} car.). Google recorta ~60-65 car. en el resultado.` });
  }

  // --- Ficha técnica ---
  if (p.specs.length === 0) {
    issues.push({ severity: "IMPORTANTE", message: "Sin ficha técnica: página delgada (thin content). Agrega 3-6 características." });
  }

  // --- Estado ---
  if (!p.category) {
    issues.push({ severity: "IMPORTANTE", message: "Sin categoría asignada." });
  }
  if (!p.active) {
    issues.push({ severity: "MENOR", message: "Producto inactivo: no aparece en la tienda ni en el sitemap." });
  }
  if (p.stock === 0) {
    issues.push({ severity: "MENOR", message: "Stock 0: sale como 'Agotado' (OutOfStock) en los resultados enriquecidos." });
  }

  return issues;
}

async function main() {
  const outPath = process.argv[2] ?? "seo-audit-report.md";

  const products = await prisma.product.findMany({
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      specs: true,
      category: true,
    },
    orderBy: [{ active: "desc" }, { name: "asc" }],
  });

  // Índice de descripciones para detectar duplicados.
  const descIndex = new Map<string, number>();
  for (const p of products) {
    const key = p.description.trim().toLowerCase();
    if (key) descIndex.set(key, (descIndex.get(key) ?? 0) + 1);
  }

  const rows = products.map((p) => ({ p, issues: auditProduct(p, descIndex) }));

  const totals = { CRÍTICO: 0, IMPORTANTE: 0, MENOR: 0 };
  for (const { issues } of rows) for (const i of issues) totals[i.severity]++;
  const perfect = rows.filter((r) => r.issues.length === 0).length;

  const lines: string[] = [];
  lines.push(`# Auditoría SEO de productos — SAMVERO`);
  lines.push("");
  lines.push(`Generado: ${new Date().toISOString()}`);
  lines.push("");
  lines.push(`## Resumen`);
  lines.push("");
  lines.push(`- Productos analizados: **${products.length}**`);
  lines.push(`- Sin problemas: **${perfect}**`);
  lines.push(`- 🔴 Problemas críticos: **${totals.CRÍTICO}**`);
  lines.push(`- 🟠 Importantes: **${totals.IMPORTANTE}**`);
  lines.push(`- 🟡 Menores: **${totals.MENOR}**`);
  lines.push("");
  lines.push(`## Guía rápida de redacción`);
  lines.push("");
  lines.push(`- **Título:** \`[Tipo de producto] [marca/atributo] [beneficio o uso]\`. Ej: "Máquina Afeitadora Geemy 3 en 1 Recargable para Barba y Cuerpo".`);
  lines.push(`- **Descripción:** 150+ caracteres, primer renglón con el gancho (qué es + beneficio principal), luego características y para quién es. Evita repetir la misma descripción entre productos.`);
  lines.push(`- **Imágenes:** 3+ por producto, subidas desde el panel (no URLs \`/uploads/\` locales).`);
  lines.push(`- **Ficha técnica:** 3-6 características (material, medidas, contenido de la caja, garantía).`);
  lines.push("");
  lines.push(`## Detalle por producto`);
  lines.push("");

  for (const { p, issues } of rows) {
    const status = issues.length === 0 ? "✅ Sin problemas" : issues.length + " problema(s)";
    lines.push(`### ${p.name}`);
    lines.push("");
    lines.push(`- Slug: \`/producto/${p.slug}\``);
    lines.push(`- Categoría: ${p.category?.name ?? "—"} · Estado: ${p.active ? "activo" : "inactivo"} · Stock: ${p.stock}`);
    lines.push(`- Imágenes: ${p.images.length} · Ficha técnica: ${p.specs.length} · Descripción: ${p.description.trim().length} car.`);
    lines.push(`- Diagnóstico: ${status}`);
    for (const i of issues) lines.push(`  - ${ICON[i.severity]} **${i.severity}:** ${i.message}`);
    lines.push("");
  }

  await writeFile(outPath, lines.join("\n"), "utf8");

  // Resumen también por consola.
  console.log(`Productos analizados: ${products.length}`);
  console.log(`Sin problemas: ${perfect}`);
  console.log(`Críticos: ${totals.CRÍTICO} | Importantes: ${totals.IMPORTANTE} | Menores: ${totals.MENOR}`);
  console.log(`Reporte escrito en: ${outPath}`);
}

main()
  .catch((e) => {
    console.error("Error en la auditoría:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
