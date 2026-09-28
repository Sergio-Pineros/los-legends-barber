import Link from "next/link";
import type { Metadata } from "next";
import { getAllProducts } from "@/lib/catalog";
import { CATEGORIES } from "@/lib/catalog-data";
import { ProductCard } from "@/components/product/product-card";
import { Reveal } from "@/components/reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Shop" };

type Search = { category?: string; sort?: string };

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "az", label: "A – Z" },
];

export default async function ShopPage({ searchParams }: { searchParams: Promise<Search> }) {
  const { category, sort = "featured" } = await searchParams;
  const activeCategory = CATEGORIES.find((c) => c.slug === category)?.slug;
  const products = await getAllProducts(activeCategory);

  const sorted = [...products].sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "az":
        return a.title.localeCompare(b.title);
      default:
        return Number(b.featured) - Number(a.featured) || a.sortOrder - b.sortOrder;
    }
  });

  const heading = activeCategory ? CATEGORIES.find((c) => c.slug === activeCategory)!.label : "All products";
  const buildHref = (next: Partial<Search>) => {
    const params = new URLSearchParams();
    const cat = next.category === undefined ? activeCategory : next.category;
    const s = next.sort === undefined ? sort : next.sort;
    if (cat) params.set("category", cat);
    if (s && s !== "featured") params.set("sort", s);
    const q = params.toString();
    return q ? `/shop?${q}` : "/shop";
  };

  return (
    <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12 pt-10 sm:pt-16">
      <Reveal>
        <nav className="eyebrow text-[10px] text-mute flex items-center gap-2" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span>/</span>
          <span className="text-ink">Shop</span>
        </nav>
        <div className="mt-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <h1 className="display text-5xl sm:text-6xl lg:text-7xl">
            {heading}
            <span className="serif-accent text-mute text-[0.45em] align-top ml-3">({sorted.length})</span>
          </h1>
          <p className="text-sm text-ink-soft max-w-sm">
            Heavyweight hoodies, tees and bottoms. Relaxed cuts, minimal LEGENDS mark, made to be worn every day.
          </p>
        </div>
      </Reveal>

      <div className="sticky top-16 lg:top-[72px] z-40 -mx-5 sm:-mx-8 lg:-mx-12 px-5 sm:px-8 lg:px-12 mt-10 py-3 bg-canvas/85 backdrop-blur-xl border-y border-line">
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {[{ slug: "", label: "All" }, ...CATEGORIES].map((c) => {
              const active = (c.slug || undefined) === activeCategory;
              return (
                <Link
                  key={c.slug}
                  href={buildHref({ category: c.slug })}
                  aria-current={active ? "page" : undefined}
                  className={`eyebrow text-[10px] h-9 px-4 rounded-full border whitespace-nowrap grid place-items-center transition-colors ${
                    active ? "bg-ink text-canvas border-ink" : "border-line-strong text-ink-soft hover:border-ink hover:text-ink"
                  }`}
                >
                  {c.label}
                </Link>
              );
            })}
          </div>
          <details key={`${sort}-${activeCategory ?? "all"}`} className="relative shrink-0 group">
            <summary className="list-none cursor-pointer eyebrow text-[10px] h-9 px-4 rounded-full border border-line-strong grid place-items-center hover:border-ink [&::-webkit-details-marker]:hidden">
              Sort · {SORTS.find((s) => s.value === sort)?.label ?? "Featured"}
            </summary>
            <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-line bg-paper shadow-xl p-2 z-50">
              {SORTS.map((s) => (
                <Link
                  key={s.value}
                  href={buildHref({ sort: s.value })}
                  className={`block rounded-xl px-3 py-2 text-sm hover:bg-canvas ${s.value === sort ? "font-semibold" : "text-ink-soft"}`}
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </details>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="py-32 text-center">
          <p className="serif-accent text-3xl text-mute">Nothing here yet.</p>
          <Link href="/shop" className="btn btn-outline mt-8">View all products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 pt-10">
          {sorted.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 70}>
              <ProductCard product={p} priority={i < 4} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
