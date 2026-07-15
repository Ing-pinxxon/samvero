import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
// Vercel limita el cuerpo de las funciones serverless a ~4.5 MB. Dejamos el
// tope en 4 MB para tener margen (el multipart añade algo de peso) y que la
// subida no falle de forma opaca con un 413 del propio Vercel.
const MAX_BYTES = 4 * 1024 * 1024; // 4 MB

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 });
  }

  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { error: "Formato no permitido. Usa JPG, PNG, WEBP, GIF o AVIF." },
      { status: 400 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "La imagen supera el límite de 4 MB." },
      { status: 400 }
    );
  }

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  // Producción serverless (Vercel): almacenamiento en la nube con Vercel Blob.
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`productos/${filename}`, file, {
      access: "public",
      addRandomSuffix: false,
    });
    return NextResponse.json({ url: blob.url });
  }

  // Desarrollo local: se guarda en public/uploads.
  if (process.env.NODE_ENV !== "production") {
    const bytes = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), bytes);
    return NextResponse.json({ url: `/uploads/${filename}` });
  }

  // Producción sin Blob configurado: se indica cómo resolverlo.
  return NextResponse.json(
    {
      error:
        "Almacenamiento de imágenes no configurado. Activa Vercel Blob y define BLOB_READ_WRITE_TOKEN, o pega la URL de la imagen manualmente.",
    },
    { status: 501 }
  );
}
