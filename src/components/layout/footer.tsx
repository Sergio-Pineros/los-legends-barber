import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-canvas mt-24">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12 pt-20 pb-10">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-canvas/50">Newsletter</p>
            <h3 className="display text-4xl sm:text-5xl mt-4">
              Stay <span className="serif-accent text-canvas/80">legendary.</span>
            </h3>
            <p className="mt-4 text-sm text-canvas/60 max-w-sm">
              Drops, restocks and stories from the studio. No noise.
            </p>
            <div className="mt-8 max-w-md">
              <NewsletterForm dark />
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-10 lg:pl-20">
            <div>
              <p className="eyebrow text-canvas/50 mb-5">Shop</p>
              <ul className="space-y-3 text-sm">
                {[
                  ["All products", "/shop"],
                  ["Hoodies", "/shop?category=hoodies"],
                  ["Tees", "/shop?category=tees"],
                  ["Bottoms", "/shop?category=bottoms"],
                ].map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="text-canvas/80 hover:text-canvas link-line">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow text-canvas/50 mb-5">Brand</p>
              <ul className="space-y-3 text-sm">
                <li><Link href="/about" className="text-canvas/80 hover:text-canvas link-line">About</Link></li>
                <li><Link href="/cart" className="text-canvas/80 hover:text-canvas link-line">Your bag</Link></li>
                <li><Link href="/about#sizing" className="text-canvas/80 hover:text-canvas link-line">Sizing &amp; fit</Link></li>
              </ul>
            </div>
            <div>
              <p className="eyebrow text-canvas/50 mb-5">Studio</p>
              <ul className="space-y-3 text-sm text-canvas/80">
                <li>Los Angeles, CA</li>
                <li>Est. 2022</li>
                <li>Legends Worldwide</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20 overflow-hidden select-none" aria-hidden>
          <p className="display text-[18vw] leading-[0.8] text-canvas/[0.08] -mb-[3vw] text-center tracking-[-0.06em]">
            Legends
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-canvas/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] uppercase tracking-[0.18em] text-canvas/50">
          <p>© {year} Legends Apparel</p>
          <p>Made To Inspire · Cut Different</p>
        </div>
      </div>
    </footer>
  );
}
