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

/** Wrapper de next/image con fallback automático si la imagen falla al cargar. */
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
  const [error, setError] = useState(false);
  const finalSrc = !src || error ? FALLBACK : src;

  return (
    <Image
      src={finalSrc}
      alt={alt}
      fill={fill}
      width={fill ? undefined : (width ?? 600)}
      height={fill ? undefined : (height ?? 600)}
      sizes={sizes}
      priority={priority}
      onError={() => setError(true)}
      className={clsx(className)}
    />
  );
}
