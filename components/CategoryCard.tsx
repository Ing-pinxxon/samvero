import Link from "next/link";
import ProductImage from "./ProductImage";
import { getCategoryIcon } from "@/lib/categories";

type Props = {
  category: {
    name: string;
    slug: string;
    tagline: string | null;
    iconKey: string;
    imageUrl: string | null;
  };
};

export default function CategoryCard({ category }: Props) {
  const Icon = getCategoryIcon(category.iconKey);

  return (
    <Link
      href={`/categoria/${category.slug}`}
      className="group relative flex h-56 flex-col justify-end overflow-hidden rounded-2xl shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-cardHover"
    >
      <ProductImage
        src={category.imageUrl}
        alt={category.name}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent" />
      <div className="relative p-5 text-white">
        <span className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white shadow">
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="text-lg font-bold">{category.name}</h3>
        {category.tagline && (
          <p className="mt-0.5 text-sm text-white/80">{category.tagline}</p>
        )}
      </div>
    </Link>
  );
}
