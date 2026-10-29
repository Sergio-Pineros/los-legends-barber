import Image from "next/image";
import { LOGO_IMAGE, SITE_NAME } from "@/lib/site";

type Size = "hero" | "footer";

const SIZES: Record<Size, { legends: string; sub: string; rule: string; img: string }> = {
  hero: {
    legends: "text-[29vw] sm:text-[11rem] lg:text-[13rem]",
    sub: "text-[3.6vw] sm:text-[1.15rem] lg:text-[1.35rem] tracking-[0.42em]",
    rule: "w-[10vw] sm:w-16 lg:w-20",
    img: "w-[88vw] max-w-[760px]",
  },
  footer: {
    legends: "text-6xl sm:text-7xl",
    sub: "text-[11px] tracking-[0.38em]",
    rule: "w-8",
    img: "w-64",
  },
};

/**
 * Brand mark. Renders the real logo image when LOGO_IMAGE is set in
 * src/lib/site.ts, otherwise a typographic blackletter wordmark.
 */
export function Wordmark({ size = "hero", priority = false }: { size?: Size; priority?: boolean }) {
  const s = SIZES[size];

  if (LOGO_IMAGE) {
    return (
      <Image
        src={LOGO_IMAGE.src}
        width={LOGO_IMAGE.width}
        height={LOGO_IMAGE.height}
        alt={SITE_NAME}
        priority={priority}
        className={`${s.img} h-auto`}
      />
    );
  }

  return (
    <span className="inline-flex flex-col items-center select-none" role="img" aria-label={SITE_NAME}>
      <span aria-hidden className={`wordmark-legends ${s.legends} pr-[0.04em]`}>
        Legends
      </span>
      <span aria-hidden className="mt-[0.2em] flex items-center gap-3 sm:gap-4 text-gold">
        <span className={`h-px ${s.rule} bg-gradient-to-l from-gold to-transparent`} />
        <span className={`font-serif font-medium uppercase ${s.sub} mr-[-0.42em]`}>Barber Studio</span>
        <span className={`h-px ${s.rule} bg-gradient-to-r from-gold to-transparent`} />
      </span>
    </span>
  );
}
