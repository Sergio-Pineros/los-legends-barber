"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { MenuTrigger } from "./menu";
import { SITE_NAME } from "@/lib/site";

export function Header() {
  const { cart, open } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-[60] transition-[background-color,border-color] duration-500 ${
        scrolled ? "bg-canvas/80 backdrop-blur-xl border-b border-line" : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="relative mx-auto max-w-[1600px] px-3 sm:px-6 lg:px-10 h-14 sm:h-16 flex items-center justify-between">
        <MenuTrigger />

        <div className="absolute left-1/2 -translate-x-1/2">
        <Link
          href="/"
          className="pressable min-h-11 flex items-center px-2 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.26em] sm:tracking-[0.38em] text-ink/85 hover:text-ink whitespace-nowrap"
        >
          <span className="mr-[-0.26em] sm:mr-[-0.38em]">{SITE_NAME}</span>
        </Link>
        </div>

        <button
          type="button"
          onClick={open}
          className="pressable inline-flex items-center gap-2 min-h-11 min-w-11 justify-end px-2 text-[11px] font-semibold uppercase tracking-[0.2em]"
          aria-label={`Open bag, ${cart.count} items`}
        >
          <span className="hidden sm:inline">Bag</span>
          <span
            key={cart.count}
            className={`grid place-items-center h-7 min-w-7 px-2 rounded-full border border-line-strong text-[10px] tabular-nums ${cart.count > 0 ? "animate-bump" : ""}`}
          >
            {cart.count}
          </span>
        </button>
      </div>
    </header>
  );
}
