import Image from "next/image";
import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { BOOKSY_URL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `About ${SITE_NAME}, a barbershop in Minneapolis.`,
};

const PHOTOS = [
  { src: "/images/about/barber-ring-light.jpg", w: 791, h: 1400, alt: "Barber cutting a client's hair under a ring light, wearing a Legends tee and cap" },
  { src: "/images/about/legends-tee-and-cap.jpg", w: 450, h: 600, alt: "Black Legends tee and Legends cap worn outdoors" },
  { src: "/images/about/shop-wall-trophies.jpg", w: 450, h: 600, alt: "Shop wall with Legends tees and trophies" },
  { src: "/images/about/barber-legends-hoodie.jpg", w: 453, h: 600, alt: "Barber in a Legends Barber Studio hoodie" },
  { src: "/images/about/fade-cut.jpg", w: 303, h: 600, alt: "Fresh fade cut inside the shop" },
];

export default function AboutPage() {
  const [lead, ...rest] = PHOTOS;
  return (
    <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 pt-12 sm:pt-20">
      <Reveal className="text-center">
        <p className="eyebrow text-mute">{SITE_NAME}</p>
        <h1 className="display mt-5 text-[56px] sm:text-7xl lg:text-8xl">About Us</h1>
        {/* TODO: replace with the client's story once they send it. */}
        <p className="mt-6 text-[15px] text-ink-soft">Our story is coming soon.</p>
      </Reveal>

      <div className="mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <Reveal className="col-span-2 lg:col-span-1 lg:row-span-2">
          <figure className="relative aspect-[4/5] lg:aspect-auto lg:h-full overflow-hidden rounded-[22px] bg-paper">
            <Image
              src={lead.src}
              alt={lead.alt}
              fill
              priority
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover object-[50%_30%]"
            />
          </figure>
        </Reveal>
        {rest.map((p, i) => (
          <Reveal key={p.src} delay={(i + 1) * 70}>
            <figure className="relative aspect-[3/4] overflow-hidden rounded-[22px] bg-paper">
              <Image src={p.src} alt={p.alt} fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-cover" />
            </figure>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-16 text-center">
        <a href={BOOKSY_URL} target="_blank" rel="noopener noreferrer" className="btn btn-book">
          Book now
        </a>
      </Reveal>
    </div>
  );
}
