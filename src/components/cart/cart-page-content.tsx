"use client";

import Link from "next/link";
import { useCart } from "./cart-provider";
import { CartLineItem } from "./cart-line-item";
import { formatPrice } from "@/lib/format";

export function CartPageContent() {
  const { cart, loading, pending } = useCart();

  return (
    <>
      <div className="flex items-end justify-between gap-6">
        <h1 className="display text-5xl sm:text-6xl lg:text-7xl">
          Your <span className="serif-accent text-navy">bag</span>
          <span className="serif-accent text-mute text-[0.45em] align-top ml-3">({cart.count})</span>
        </h1>
        <Link href="/shop" className="eyebrow text-[11px] link-line pb-1 shrink-0">Continue shopping</Link>
      </div>

      {loading ? (
        <div className="py-32 text-center text-sm text-mute">Loading your bag…</div>
      ) : cart.items.length === 0 ? (
        <div className="py-28 text-center">
          <p className="serif-accent text-3xl sm:text-4xl text-ink-soft">Your bag is empty.</p>
          <p className="mt-3 text-sm text-mute">Start with the heavyweight hoodie.</p>
          <Link href="/shop" className="btn btn-primary mt-8">Shop the collection</Link>
        </div>
      ) : (
        <div className="mt-12 grid lg:grid-cols-12 gap-10 lg:gap-16">
          <ul className={`lg:col-span-7 divide-y divide-line transition-opacity ${pending ? "opacity-60" : ""}`}>
            {cart.items.map((line) => (
              <CartLineItem key={line.id} line={line} />
            ))}
          </ul>
          <aside className="lg:col-span-5 lg:col-start-8">
            <div className="lg:sticky lg:top-28 rounded-[24px] border border-line bg-paper p-6 sm:p-8">
              <h2 className="display text-2xl">Summary</h2>
              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-mute">Subtotal</dt>
                  <dd className="tabular-nums">{formatPrice(cart.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-mute">Shipping</dt>
                  <dd className="text-mute">Calculated at checkout</dd>
                </div>
              </dl>
              <div className="mt-6 pt-6 border-t border-line flex justify-between items-baseline">
                <span className="eyebrow">Total</span>
                <span className="text-2xl font-semibold tabular-nums">{formatPrice(cart.subtotal)}</span>
              </div>
              <a href={cart.checkoutUrl ?? "#"} className="btn btn-primary w-full mt-6 h-14">
                Checkout securely
              </a>
              <p className="mt-4 text-[11px] text-mute text-center leading-relaxed">
                You&apos;ll complete payment on our secure Shopify checkout.
              </p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
