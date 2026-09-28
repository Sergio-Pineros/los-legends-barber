import Image from "next/image";
import Link from "next/link";
import type { ProductWithMedia } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

const SWATCH: Record<string, string> = {
  Black: "#111111",
  White: "#f4f4f4",
  "Blackish Green": "#1f2a24",
  Pink: "#e7b6c4",
  Blue: "#6f8fbf",
  "Flower Gray": "#b9b6ae",
  Apricot: "#e9d3b8",
  Camel: "#b48a5a",
};

export function ProductCard({
  product,
  priority = false,
  sizes = "(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw",
}: {
  product: ProductWithMedia;
  priority?: boolean;
  sizes?: string;
}) {
  const [primary, secondary] = product.images;
  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className="product-media relative aspect-[4/5] overflow-hidden rounded-2xl bg-paper border border-line">
        {primary && (
          <Image
            src={primary.src}
            alt={primary.alt || product.title}
            fill
            priority={priority}
            sizes={sizes}
            className="img-primary object-contain object-center"
          />
        )}
        {secondary && (
          <Image
            src={secondary.src}
            alt=""
            aria-hidden
            fill
            sizes={sizes}
            className="img-hover object-contain object-center absolute inset-0"
          />
        )}
        <div className="absolute left-4 top-4 flex gap-2">
          {product.featured && (
            <span className="eyebrow text-[9px] px-2.5 py-1.5 rounded-full bg-ink text-canvas">New</span>
          )}
        </div>
        <div className="absolute inset-x-4 bottom-4 translate-y-3 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
          <span className="btn btn-light w-full h-11 text-[10px] shadow-lg">View product</span>
        </div>
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold tracking-tight leading-snug truncate">{product.title}</h3>
          <p className="mt-1 text-xs text-mute truncate">{product.tagline}</p>
          {product.colors.length > 0 && (
            <div className="mt-2.5 flex items-center gap-1.5">
              {product.colors.map((c) => (
                <span
                  key={c}
                  title={c}
                  className="h-3 w-3 rounded-full border border-black/10"
                  style={{ background: SWATCH[c] ?? "#ccc" }}
                />
              ))}
              {product.colors.length > 1 && (
                <span className="text-[10px] text-mute ml-1">{product.colors.length} colors</span>
              )}
            </div>
          )}
        </div>
        <p className="text-sm font-medium tabular-nums shrink-0">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}

export { SWATCH };
