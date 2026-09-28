"use client";

import Image from "next/image";
import Link from "next/link";
import type { CartLine } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { useCart } from "./cart-provider";

export function CartLineItem({ line, compact = false }: { line: CartLine; compact?: boolean }) {
  const { update, remove, pending, close } = useCart();
  const imgSize = compact ? "w-24" : "w-28 sm:w-36";

  return (
    <li className="flex gap-5 py-6 first:pt-0">
      <Link
        href={`/products/${line.productHandle}`}
        onClick={close}
        className={`${imgSize} shrink-0 overflow-hidden rounded-xl bg-paper border border-line`}
      >
        <div className="relative aspect-square">
          {line.image && (
            <Image src={line.image} alt={line.productTitle} fill sizes="160px" className="object-cover" />
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div className="flex justify-between gap-4">
          <div className="min-w-0">
            <Link
              href={`/products/${line.productHandle}`}
              onClick={close}
              className="block text-sm font-semibold leading-snug tracking-tight truncate"
            >
              {line.productTitle}
            </Link>
            <p className="mt-1 text-xs text-mute">
              {line.color} · {line.size}
            </p>
          </div>
          <p className="text-sm font-medium tabular-nums">{formatPrice(line.price * line.quantity)}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center rounded-full border border-line-strong">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={pending}
              onClick={() => update(line.id, line.quantity - 1)}
              className="h-9 w-9 grid place-items-center text-lg leading-none hover:bg-ink hover:text-white rounded-full transition-colors disabled:opacity-40"
            >
              −
            </button>
            <span className="w-8 text-center text-sm tabular-nums">{line.quantity}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={pending || line.quantity >= 10}
              onClick={() => update(line.id, line.quantity + 1)}
              className="h-9 w-9 grid place-items-center text-lg leading-none hover:bg-ink hover:text-white rounded-full transition-colors disabled:opacity-40"
            >
              +
            </button>
          </div>
          <button
            type="button"
            disabled={pending}
            onClick={() => remove(line.id)}
            className="text-[11px] uppercase tracking-[0.18em] text-mute hover:text-ink transition-colors link-line"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
