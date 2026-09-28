import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { Marquee } from "@/components/marquee";
import { getFeaturedProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/product/product-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About",
  description: "Legends Apparel — lifestyle clothing from Los Angeles, est. 2022. Made to inspire. Cut different.",
};

export default async function AboutPage() {
  const featured = await getFeaturedProducts(4);

  return (
    <>
      <section className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12 pt-12 sm:pt-20">
        <Reveal>
          <p className="eyebrow text-mute">About</p>
          <h1 className="display mt-5 text-[14vw] sm:text-[10vw] lg:text-[7.5rem] leading-[0.86] max-w-5xl">
            Lifestyle clothing, <span className="serif-accent text-navy">cut different.</span>
          </h1>
        </Reveal>
        <div className="mt-14 grid lg:grid-cols-12 gap-10">
          <Reveal className="lg:col-span-7">
            <div className="rounded-[28px] overflow-hidden bg-paper border border-line">
              <Image
                src="/images/hero.jpg"
                alt="Legends Apparel — Made To Inspire, Lifestyle Clothing, Cut Different, LA"
                width={1774}
                height={887}
                priority
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="w-full h-auto"
              />
            </div>
          </Reveal>
          <Reveal className="lg:col-span-4 lg:col-start-9 flex flex-col justify-center" delay={100}>
            <p className="text-lg leading-relaxed text-ink">
              Legends Apparel is made to inspire. Born in Los Angeles in 2022, we make lifestyle
              clothing with a heavyweight feel and a minimal mark — pieces that go from training
              days to everyday, anywhere.
            </p>
            <p className="mt-6 text-[15px] leading-relaxed text-ink-soft">
              Every piece is built for those who move with purpose. Relaxed, oversized-inspired
              cuts. Premium construction. A clean LEGENDS design up front and nothing that
              doesn&apos;t need to be there.
            </p>
            <dl className="mt-10 grid grid-cols-3 gap-6">
              {[
                ["2022", "Established"],
                ["LA", "Studio"],
                ["Worldwide", "Community"],
              ].map(([a, b]) => (
                <div key={b} className="border-t border-ink pt-3">
                  <dt className="display text-2xl">{a}</dt>
                  <dd className="eyebrow text-[9px] text-mute mt-1">{b}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="mt-24 border-y border-line bg-paper py-6">
        <Marquee items={["Made To Inspire", "Lifestyle Clothing", "Cut Different", "Legends Worldwide"]} />
      </section>

      <section id="sizing" className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12 pt-24">
        <div className="grid lg:grid-cols-12 gap-10">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow text-mute">Sizing &amp; fit</p>
            <h2 className="display text-4xl sm:text-5xl mt-4">
              Relaxed by <span className="serif-accent text-navy">design.</span>
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-7 lg:col-start-6 grid sm:grid-cols-2 gap-6" delay={100}>
            {[
              ["Relaxed fit", "Our hoodies and tees are cut relaxed with an oversized-inspired silhouette. For a more fitted look, consider sizing down."],
              ["Unisex sizing", "Every piece is unisex, available from S up to 2XL or 3XL depending on the style. Full garment measurements are listed on each product page."],
              ["Heavyweight feel", "The Heavyweight Hoodie is built with a premium, substantial hand-feel — perfect for layering or on its own."],
              ["Care", "Machine wash cold on a gentle cycle, tumble dry low, and avoid ironing directly on the print to keep every piece looking its best."],
            ].map(([title, body]) => (
              <div key={title} className="rounded-2xl border border-line bg-paper p-6">
                <h3 className="font-semibold tracking-tight">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12 pt-24 lg:pt-32">
        <Reveal className="flex items-end justify-between gap-6 mb-10">
          <h2 className="display text-4xl sm:text-5xl">
            Start <span className="serif-accent text-navy">here.</span>
          </h2>
          <Link href="/shop" className="eyebrow text-[11px] link-line pb-1 shrink-0">Shop all</Link>
        </Reveal>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
