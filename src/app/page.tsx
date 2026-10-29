import Link from "next/link";
import { getFeaturedProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/product/product-card";
import { Reveal } from "@/components/reveal";
import { Wordmark } from "@/components/brand/wordmark";
import { MenuTrigger } from "@/components/layout/menu";
import { ReviewsCarousel } from "@/components/home/reviews-carousel";
import { REVIEWS } from "@/lib/reviews";
import { BOOKSY_URL, SITE_LOCATION, SITE_TAGLINE } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = await getFeaturedProducts(4);

  return (
    <>
      {/* HERO */}
      <section className="relative -mt-14 sm:-mt-16 min-h-[100svh] flex flex-col items-center justify-center overflow-hidden grain px-4 pt-20 pb-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_45%,rgba(214,178,94,0.10),transparent_70%)]"
        />
        <h1 className="relative animate-fade-up" style={{ animationDelay: "60ms" }}>
          <Wordmark size="hero" priority />
        </h1>

        <div className="relative mt-12 sm:mt-14 flex flex-col items-center gap-8 animate-fade-up" style={{ animationDelay: "220ms" }}>
          <a href={BOOKSY_URL} target="_blank" rel="noopener noreferrer" className="btn btn-book">
            Book now
          </a>
          <MenuTrigger large />
        </div>

        <a
          href="#reviews"
          className="pressable absolute bottom-6 left-1/2 -ml-[22px] grid h-11 w-11 place-items-center text-ink/50 hover:text-ink transition-colors animate-fade-in"
          style={{ animationDelay: "600ms" }}
          aria-label="Scroll to reviews"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
            <path d="M3 6.5l6 6 6-6" />
          </svg>
        </a>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="scroll-mt-16 pt-20 sm:pt-28 pb-8">
        <Reveal className="px-5 text-center">
          <p className="eyebrow text-mute">From Google</p>
          <h2 className="mt-4 font-serif font-light uppercase text-[34px] sm:text-5xl tracking-[0.12em] leading-none">
            Customer Reviews
          </h2>
        </Reveal>
        <Reveal className="mt-10 sm:mt-14" delay={80}>
          <ReviewsCarousel reviews={REVIEWS} />
        </Reveal>
      </section>

      {/* BOOK CTA */}
      <section className="px-5 pt-20 sm:pt-28 text-center">
        <Reveal>
          <p className="eyebrow text-mute">{SITE_LOCATION}</p>
          <h2 className="display mt-4 text-[44px] sm:text-6xl lg:text-7xl">
            Ready for your next cut?<br />
            <span className="italic text-gold">Book it on Booksy.</span>
          </h2>
          <a href={BOOKSY_URL} target="_blank" rel="noopener noreferrer" className="btn btn-book mt-10">
            Book now
          </a>
        </Reveal>
      </section>

      {/* APPAREL TEASER */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12 pt-28 sm:pt-36">
          <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">
            <div>
              <p className="eyebrow text-mute">Legends Apparel</p>
              <h2 className="display mt-3 text-[40px] sm:text-5xl lg:text-6xl">
                {SITE_TAGLINE.split(". ")[0]}.{" "}
                <span className="italic text-gold">{SITE_TAGLINE.split(". ")[1]}</span>
              </h2>
            </div>
            <Link href="/apparel" className="btn btn-outline self-start sm:self-auto">
              Shop apparel
            </Link>
          </Reveal>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={i * 70}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
