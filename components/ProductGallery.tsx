"use client";

import { useState } from "react";
import { clsx } from "clsx";
import ProductImage from "./ProductImage";

type Props = {
  images: { url: string; alt: string | null }[];
  name: string;
};

export default function ProductGallery({ images, name }: Props) {
  const [active, setActive] = useState(0);
  const gallery = images.length > 0 ? images : [{ url: "", alt: name }];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-navy/5 bg-light">
        <ProductImage
          src={gallery[active]?.url}
          alt={gallery[active]?.alt ?? name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {gallery.length > 1 && (
        <div className="flex gap-3">
          {gallery.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ver imagen ${i + 1}`}
              className={clsx(
                "relative h-20 w-20 overflow-hidden rounded-xl border-2 bg-light transition-colors",
                i === active ? "border-brand" : "border-transparent hover:border-navy/20"
              )}
            >
              <ProductImage
                src={img.url}
                alt={img.alt ?? name}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
