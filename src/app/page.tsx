import Image from "next/image";
import Link from "next/link";
import { getAllProducts, getFeaturedProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/product/product-card";
import { Reveal } from "@/components/reveal";
import { Marquee } from "@/components/marquee";
import { NewsletterForm } from "@/components/newsletter-form";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, all] = await Promise.all([getFeaturedProducts(4), getAllProducts()]);
  const hoodie = all.find((p) => p.handle === "legends-heavyweight-hoodie");
  const camel = all.find((p) => p.handle === "legends-heavyweight-hoodie-camel");
  const boxing = all.find((p) => p.handle === "legends-boxing-tee");
  const worldwide = all.find((p) => p.handle === "legends-worldwide-22-tee");
  const sweats = all.find((p) => p.handle === "legends-relaxed-drawstring-sweatpants");

  const categoryTiles = [
    { label: "Hoodies", slug: "hoodies", image: camel?.images[0]?.src, count: all.filter((p) => p.category === "hoodies").length },
    { label: "Tees", slug: "tees", image: worldwide?.images[0]?.src, count: all.filter((p) => p.category === "tees").length },
    { label: "Bottoms", slug: "bottoms", image: sweats?.images[0]?.src, count: all.filter((p) => p.category === "bottoms").length },
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative -mt-16 lg:-mt-[72px] pt-16 lg:pt-[72px] overflow-hidden grain">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12 pt-10 sm:pt-16 lg:pt-20 pb-16 lg:pb-24">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-end">
            <div className="lg:col-span-7 relative z-10">
              <p className="eyebrow text-mute animate-fade-in">Los Angeles · Est. 2022 · Lifestyle Clothing</p>
              <h1 className="display mt-6 text-[17vw] sm:text-[13vw] lg:text-[9.2vw] xl:text-[8.6rem] leading-[0.86]">
                <span className="block animate-fade-up" style={{ animationDelay: "60ms" }}>Made to</span>
                <span className="block animate-fade-up" style={{ animationDelay: "160ms" }}>Inspire.</span>
                <span
                  className="block serif-accent text-navy text-[0.62em] leading-[1] mt-2 animate-fade-up"
                  style={{ animationDelay: "260ms" }}
                >
                  cut different.
                </span>
              </h1>
              <p className="mt-8 max-w-md text-[15px] leading-relaxed text-ink-soft animate-fade-up" style={{ animationDelay: "360ms" }}>
                Heavyweight essentials with a clean, minimal mark. Built for those who move with purpose — from the studio in LA to everywhere.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: "440ms" }}>
                <Link href="/shop" className="btn btn-primary">
                  Shop the collection
                </Link>
                <Link href="/shop?category=hoodies" className="btn btn-outline">
                  Heavyweight Hoodie
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="relative rounded-[28px] overflow-hidden bg-paper border border-line shadow-[0_30px_80px_-40px_rgba(11,11,12,0.35)]">
                <div className="relative aspect-[4/5]">
                  {hoodie?.images[0] && (
                    <Image
                      src={hoodie.images[0].src}
                      alt={hoodie.images[0].alt}
                      fill
                      priority
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-contain"
                    />
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 flex items-end justify-between bg-gradient-to-t from-white/95 via-white/70 to-transparent">
                    <div>
                      <p className="eyebrow text-[10px] text-mute">Featured</p>
                      <p className="mt-1 font-semibold tracking-tight">{hoodie?.title}</p>
                    </div>
                    {hoodie && (
                      <Link
                        href={`/products/${hoodie.handle}`}
                        className="btn btn-primary h-11 px-5 text-[10px]"
                      >
                        {formatPrice(hoodie.price)} →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
              <div className="hidden lg:block absolute -left-24 bottom-10 w-52 rotate-[-6deg] rounded-2xl overflow-hidden border border-line bg-paper shadow-xl">
                <Image src="/images/hero.jpg" alt="Legends Apparel — Made To Inspire" width={1774} height={887} className="w-full h-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="border-y border-line bg-paper py-5 sm:py-7">
        <Marquee items={["Legends Worldwide", "Made To Inspire", "Cut Different", "Est. 2022"]} />
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12 pt-20 lg:pt-28">
        <Reveal className="flex items-end justify-between gap-6 mb-10">
          <div>
            <p className="eyebrow text-mute">The latest</p>
            <h2 className="display text-4xl sm:text-5xl lg:text-6xl mt-3">
              New <span className="serif-accent text-navy">arrivals</span>
            </h2>
          </div>
          <Link href="/shop" className="eyebrow text-[11px] link-line pb-1 shrink-0">
            View all
          </Link>
        </Reveal>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <ProductCard product={p} priority={i < 2} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* BRAND STATEMENT */}
      <section className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12 pt-24 lg:pt-36">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <Reveal className="lg:col-span-6 order-2 lg:order-1">
            <div className="relative rounded-[28px] overflow-hidden bg-paper border border-line">
              <Image
                src="/images/hero.jpg"
                alt="Legends Apparel — Made To Inspire, Lifestyle Clothing, Cut Different, LA"
                width={1774}
                height={887}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="w-full h-auto"
              />
            </div>
          </Reveal>
          <Reveal className="lg:col-span-5 lg:col-start-8 order-1 lg:order-2" delay={100}>
            <p className="eyebrow text-mute">The brand</p>
            <h2 className="display text-4xl sm:text-5xl lg:text-6xl mt-4 leading-[0.95]">
              Built for those who <span className="serif-accent text-navy">move with purpose.</span>
            </h2>
            <p className="mt-6 text-[15px] leading-relaxed text-ink-soft max-w-md">
              Legends Apparel is lifestyle clothing from Los Angeles. Heavyweight construction, relaxed
              cuts and a minimal LEGENDS mark — made to be worn every day, anywhere.
            </p>
            <ul className="mt-8 grid grid-cols-3 gap-4 max-w-md">
              {[
                ["Heavyweight", "Premium feel"],
                ["Relaxed", "Oversized fit"],
                ["Everyday", "Made to layer"],
              ].map(([a, b]) => (
                <li key={a} className="border-t border-ink pt-3">
                  <p className="text-sm font-semibold tracking-tight">{a}</p>
                  <p className="text-xs text-mute mt-0.5">{b}</p>
                </li>
              ))}
            </ul>
            <Link href="/about" className="btn btn-outline mt-10">
              Our story
            </Link>
          </Reveal>
        </div>
      </section>

      {/* COLOR STORY */}
      {hoodie && (
        <section className="mt-24 lg:mt-36 bg-ink text-canvas py-20 lg:py-28 overflow-hidden">
          <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
            <Reveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <p className="eyebrow text-canvas/50">Heavyweight Hoodie</p>
                <h2 className="display text-5xl sm:text-6xl lg:text-7xl mt-3">
                  Seven <span className="serif-accent text-canvas/70">colorways.</span>
                </h2>
              </div>
              <p className="text-sm text-canvas/60 max-w-sm">
                Black, Blackish Green, Flower Gray, Blue, Apricot, Pink — and Camel. One hoodie, cut relaxed, in every mood.
              </p>
            </Reveal>
          </div>
          <Reveal delay={120} className="mt-12">
            <div className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar px-5 sm:px-8 lg:px-12 snap-x snap-mandatory">
              {[
                ...hoodie.images.filter((img, i, arr) => arr.findIndex((x) => x.color === img.color) === i),
                ...(camel ? camel.images.slice(0, 1) : []),
              ].map((img, i) => {
                const target = img.color === "Camel" && camel ? camel : hoodie;
                return (
                  <Link
                    key={img.id}
                    href={`/products/${target.handle}?color=${encodeURIComponent(img.color ?? "")}`}
                    className="group relative shrink-0 w-[68vw] sm:w-[40vw] lg:w-[24vw] snap-start"
                  >
                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-white">
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="(min-width: 1024px) 24vw, 68vw"
                        className="object-contain transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-sm font-medium">
                        <span className="text-canvas/40 tabular-nums mr-3">0{i + 1}</span>
                        {img.color}
                      </p>
                      <span className="eyebrow text-[10px] text-canvas/50 group-hover:text-canvas transition-colors">Shop →</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Reveal>
        </section>
      )}

      {/* CATEGORIES */}
      <section className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12 pt-24 lg:pt-32">
        <Reveal className="mb-10">
          <p className="eyebrow text-mute">Shop by</p>
          <h2 className="display text-4xl sm:text-5xl lg:text-6xl mt-3">Category</h2>
        </Reveal>
        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
          {categoryTiles.map((tile, i) => (
            <Reveal key={tile.slug} delay={i * 90}>
              <Link href={`/shop?category=${tile.slug}`} className="group relative block aspect-[4/5] rounded-[24px] overflow-hidden bg-paper border border-line">
                {tile.image && (
                  <Image
                    src={tile.image}
                    alt={tile.label}
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-contain transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 flex items-end justify-between text-canvas">
                  <div>
                    <p className="eyebrow text-[10px] text-canvas/70">
                      {tile.count} {tile.count === 1 ? "style" : "styles"}
                    </p>
                    <p className="display text-4xl mt-1">{tile.label}</p>
                  </div>
                  <span className="h-11 w-11 rounded-full border border-canvas/50 grid place-items-center transition-all duration-500 group-hover:bg-canvas group-hover:text-ink">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M2 8h11M9 3.5L13.5 8 9 12.5" />
                    </svg>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* EDITORIAL SPLIT */}
      {boxing && (
        <section className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12 pt-24 lg:pt-32">
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
            <Reveal className="relative rounded-[28px] overflow-hidden bg-paper border border-line aspect-square lg:aspect-auto lg:min-h-[640px]">
              <Image
                src={boxing.images[1]?.src ?? boxing.images[0].src}
                alt={boxing.images[1]?.alt ?? boxing.title}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain"
              />
            </Reveal>
            <Reveal delay={100} className="rounded-[28px] bg-navy text-canvas p-8 sm:p-12 lg:p-16 flex flex-col justify-between min-h-[480px]">
              <p className="eyebrow text-canvas/60">Legends Worldwide</p>
              <div>
                <h2 className="display text-5xl sm:text-6xl lg:text-7xl leading-[0.9]">
                  Gloves <span className="serif-accent text-canvas/80">up.</span>
                </h2>
                <p className="mt-6 text-[15px] leading-relaxed text-canvas/75 max-w-sm">
                  The Legends Boxing Tee — Legends in blue up front, gloves on the back. Available in white and black.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href={`/products/${boxing.handle}`} className="btn btn-light">
                    Shop the tee · {formatPrice(boxing.price)}
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ALL PRODUCTS STRIP */}
      <section className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12 pt-24 lg:pt-32">
        <Reveal className="flex items-end justify-between gap-6 mb-10">
          <div>
            <p className="eyebrow text-mute">Everything</p>
            <h2 className="display text-4xl sm:text-5xl lg:text-6xl mt-3">
              The full <span className="serif-accent text-navy">line.</span>
            </h2>
          </div>
          <Link href="/shop" className="eyebrow text-[11px] link-line pb-1 shrink-0">
            Shop all
          </Link>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 sm:gap-x-6">
          {all.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 80}>
              <ProductCard product={p} sizes="(min-width: 768px) 33vw, 50vw" />
            </Reveal>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12 pt-24 lg:pt-32">
        <Reveal className="rounded-[28px] border border-line bg-paper px-6 py-14 sm:px-12 sm:py-20 text-center">
          <p className="eyebrow text-mute">Join the list</p>
          <h2 className="display text-4xl sm:text-6xl lg:text-7xl mt-4">
            First on every <span className="serif-accent text-navy">drop.</span>
          </h2>
          <div className="mx-auto mt-10 max-w-md">
            <NewsletterForm />
          </div>
        </Reveal>
      </section>
    </>
  );
}
