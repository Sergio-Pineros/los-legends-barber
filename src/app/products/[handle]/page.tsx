import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductByHandle, getRelatedProducts } from "@/lib/catalog";
import { ProductView } from "@/components/product/product-view";
import { ProductCard } from "@/components/product/product-card";
import { Reveal } from "@/components/reveal";
import { CATEGORIES } from "@/lib/catalog-data";

export const dynamic = "force-dynamic";

type Params = { handle: string };
type Search = { color?: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) return { title: "Not found" };
  return {
    title: product.title,
    description: product.tagline,
    openGraph: { images: product.images[0] ? [product.images[0].src] : [] },
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const { handle } = await params;
  const { color } = await searchParams;
  const product = await getProductByHandle(handle);
  if (!product) notFound();
  const related = await getRelatedProducts(product, 4);
  const categoryLabel = CATEGORIES.find((c) => c.slug === product.category)?.label ?? "Shop";

  return (
    <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12 pt-8 sm:pt-12">
      <nav className="eyebrow text-[10px] text-mute flex items-center gap-2 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link href={`/shop?category=${product.category}`} className="hover:text-ink">{categoryLabel}</Link>
        <span>/</span>
        <span className="text-ink truncate">{product.title}</span>
      </nav>

      <ProductView product={product} initialColor={color} />

      {related.length > 0 && (
        <section className="pt-24 lg:pt-32">
          <Reveal className="flex items-end justify-between gap-6 mb-10">
            <div>
              <p className="eyebrow text-mute">Complete the look</p>
              <h2 className="display text-4xl sm:text-5xl mt-3">
                You may <span className="serif-accent text-navy">also like</span>
              </h2>
            </div>
            <Link href="/shop" className="eyebrow text-[11px] link-line pb-1 shrink-0">Shop all</Link>
          </Reveal>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
