"use client";

import Link from "next/link";
import { useCart } from "./cart-provider";
import { CartLineItem } from "./cart-line-item";
import { formatPrice } from "@/lib/format";

export function CartDrawer() {
  const { cart, isOpen, close, pending } = useCart();

  return (
    <div aria-hidden={!isOpen} className={`fixed inset-0 z-[80] ${isOpen ? "" : "pointer-events-none"}`}>
      <div
        onClick={close}
        className={`absolute inset-0 bg-ink/40 backdrop-blur-[2px] transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-label="Shopping bag"
        className={`absolute right-0 top-0 h-full w-full max-w-[460px] bg-canvas shadow-2xl flex flex-col transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <header className="flex items-center justify-between px-6 sm:px-8 h-20 border-b border-line">
          <h2 className="display text-2xl">
            Bag <span className="text-mute font-medium">({cart.count})</span>
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close bag"
            className="h-10 w-10 grid place-items-center rounded-full border border-line hover:bg-ink hover:text-white hover:border-ink transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M1 1l12 12M13 1L1 13" />
            </svg>
          </button>
        </header>

        {cart.items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-6">
            <p className="serif-accent text-3xl text-ink-soft">Your bag is empty.</p>
            <Link href="/shop" onClick={close} className="btn btn-primary">
              Shop the collection
            </Link>
          </div>
        ) : (
          <>
            <ul className={`flex-1 overflow-y-auto px-6 sm:px-8 py-6 divide-y divide-line transition-opacity ${pending ? "opacity-60" : ""}`}>
              {cart.items.map((line) => (
                <CartLineItem key={line.id} line={line} compact />
              ))}
            </ul>
            <footer className="border-t border-line px-6 sm:px-8 py-6 space-y-4 bg-paper">
              <div className="flex items-center justify-between">
                <span className="eyebrow text-mute">Subtotal</span>
                <span className="text-lg font-semibold tabular-nums">{formatPrice(cart.subtotal)}</span>
              </div>
              <p className="text-xs text-mute">Shipping and taxes calculated at checkout.</p>
              <a
                href={cart.checkoutUrl ?? "#"}
                className="btn btn-primary w-full"
                aria-disabled={!cart.checkoutUrl}
              >
                Checkout
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 8h11M9 3.5L13.5 8 9 12.5" />
                </svg>
              </a>
              <Link href="/cart" onClick={close} className="block text-center text-[11px] uppercase tracking-[0.18em] text-mute hover:text-ink transition-colors">
                View full bag
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
