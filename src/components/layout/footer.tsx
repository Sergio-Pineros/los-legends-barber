import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";
import { BOOKSY_URL, MENU_LINKS, SITE_LOCATION, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line mt-24">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12 pt-16 pb-10 flex flex-col items-center text-center">
        <Link href="/" aria-label={`${SITE_NAME} home`} className="pressable">
          <Wordmark size="footer" />
        </Link>
        <p className="mt-6 font-serif italic text-lg text-ink-soft">{SITE_TAGLINE}</p>

        <a href={BOOKSY_URL} target="_blank" rel="noopener noreferrer" className="btn btn-book mt-8">
          Book now
        </a>

        <nav aria-label="Footer" className="mt-10">
          <ul className="flex flex-wrap justify-center gap-x-2 gap-y-1">
            {MENU_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-11 items-center px-3 text-[11px] uppercase tracking-[0.22em] text-ink-soft hover:text-ink transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-10 pt-6 w-full border-t border-line flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] uppercase tracking-[0.18em] text-mute">
          <p>© {year} {SITE_NAME}</p>
          <p>{SITE_LOCATION}</p>
        </div>
      </div>
    </footer>
  );
}
