// Utilidades para subir imágenes desde el panel (productos y categorías).
// Comprime en el navegador antes de enviar para que las fotos de celular quepan
// bajo el límite de cuerpo de las funciones serverless de Vercel (~4.5 MB).

// Tope alineado con ese límite, con margen para el multipart.
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // 4 MB
// Lado máximo tras redimensionar. Suficiente para la tienda y mantiene el peso bajo.
const MAX_DIMENSION = 1600;
// Solo re-codificamos formatos estáticos; gif (animado) y avif se suben tal cual.
const COMPRESSIBLE = ["image/jpeg", "image/png", "image/webp"];

/**
 * Redimensiona y comprime la imagen en el navegador (canvas → WebP), respetando
 * la orientación EXIF. Ante cualquier fallo devuelve el archivo original para no
 * bloquear la subida.
 */
export async function compressImage(file: File): Promise<File> {
  if (!COMPRESSIBLE.includes(file.type)) return file;
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.85)
    );
    if (!blob || blob.size >= file.size) return file;

    const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
    return new File([blob], name, { type: "image/webp" });
  } catch {
    return file;
  }
}

export type UploadResult = { url: string } | { error: string };

/**
 * Comprime, valida el tamaño y sube la imagen a /api/admin/upload. Devuelve la
 * URL resultante o un mensaje de error listo para mostrar.
 */
export async function uploadImage(selected: File): Promise<UploadResult> {
  try {
    const file = await compressImage(selected);
    if (file.size > MAX_UPLOAD_BYTES) {
      return {
        error: "La imagen es muy pesada. Usa una de menos de 4 MB o reduce su resolución.",
      };
    }

    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });

    if (!res.ok) {
      // La respuesta de error puede no ser JSON (p. ej. un 413 de Vercel).
      const data = await res.json().catch(() => null);
      return {
        error:
          data?.error ??
          (res.status === 413
            ? "La imagen es demasiado pesada para el servidor. Prueba con una más liviana."
            : "No se pudo subir la imagen."),
      };
    }

    const data = await res.json();
    return { url: data.url as string };
  } catch {
    return { error: "Error al subir la imagen." };
  }
}
