"use client";

import Image from "next/image";
import { useState } from "react";
import { clsx } from "clsx";

type Props = {
  src: string | null | undefined;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  priority?: boolean;
};

const FALLBACK = "/placeholder.svg";

/**
 * Wrapper de next/image con recuperación en dos pasos:
 * 1. Si el optimizador falla (p. ej. la URL es de un host que no está en la
 *    lista de `images.remotePatterns`), reintenta cargando la imagen directa
 *    sin optimizar — así las URLs pegadas a mano en el admin sí se ven.
 * 2. Si también falla directa (URL rota), muestra el placeholder.
 */
export default function ProductImage({
  src,
  alt,
  fill,
  width,
  height,
  sizes,
  className,
  priority,
}: Props) {
  // 0 = optimizada, 1 = directa sin optimizar, 2 = placeholder.
  const [attempt, setAttempt] = useState(0);
  const finalSrc = !src || attempt >= 2 ? FALLBACK : src;

  return (
    <Image
      key={attempt}
      src={finalSrc}
      alt={alt}
      fill={fill}
      width={fill ? undefined : (width ?? 600)}
      height={fill ? undefined : (height ?? 600)}
      sizes={sizes}
      priority={priority}
      unoptimized={attempt === 1}
      onError={() => setAttempt((a) => a + 1)}
      className={clsx(className)}
    />
  );
}
