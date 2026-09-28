"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { Logo } from "./logo";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=hoodies", label: "Hoodies" },
  { href: "/shop?category=tees", label: "Tees" },
  { href: "/shop?category=bottoms", label: "Bottoms" },
  { href: "/about", label: "About" },
];

export function Header() {
  const { cart, open } = useCart();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (cart.count === 0) return;
    setBump(true);
    const t = setTimeout(() => setBump(false), 400);
    return () => clearTimeout(t);
  }, [cart.count]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-[60] transition-[background-color,border-color,box-shadow] duration-500 ${
          scrolled || menuOpen
            ? "bg-canvas/85 backdrop-blur-xl border-b border-line"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12 h-16 lg:h-[72px] flex items-center justify-between">
          <nav className="hidden lg:flex items-center gap-8" aria-label="Primary">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="eyebrow text-[11px] link-line text-ink-soft hover:text-ink transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="lg:hidden h-10 w-10 -ml-2 grid place-items-center"
          >
            <span className="relative block w-5 h-3">
              <span className={`absolute left-0 top-0 h-px w-5 bg-ink transition-transform duration-300 ${menuOpen ? "translate-y-[6px] rotate-45" : ""}`} />
              <span className={`absolute left-0 top-[6px] h-px w-5 bg-ink transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 bottom-0 h-px w-5 bg-ink transition-transform duration-300 ${menuOpen ? "-translate-y-[6px] -rotate-45" : ""}`} />
            </span>
          </button>

          <div className="absolute left-1/2 -translate-x-1/2">
            <Logo />
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            <button
              type="button"
              onClick={open}
              className="group inline-flex items-center gap-2 eyebrow text-[11px] h-10 px-1"
              aria-label={`Open bag, ${cart.count} items`}
            >
              <span className="hidden sm:inline">Bag</span>
              <span
                className={`grid place-items-center h-7 min-w-7 px-2 rounded-full bg-ink text-canvas text-[10px] tabular-nums transition-transform duration-300 ${bump ? "scale-125" : ""} group-hover:bg-navy`}
              >
                {cart.count}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`lg:hidden fixed inset-0 z-[55] bg-canvas pt-28 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          menuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3 pointer-events-none"
        }`}
      >
        <nav className="px-6 pt-8 flex flex-col" aria-label="Mobile">
          {NAV.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{ transitionDelay: `${i * 40}ms` }}
              className={`display text-4xl py-4 border-b border-line transition-all duration-500 ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
            >
              {item.label}
            </Link>
          ))}
          <p className="mt-10 serif-accent text-2xl text-mute">Made to inspire. Cut different.</p>
        </nav>
      </div>
    </>
  );
}
