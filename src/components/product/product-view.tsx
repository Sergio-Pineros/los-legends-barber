"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { ProductWithMedia } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/components/cart/cart-provider";
import { SWATCH } from "./product-card";

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

export function ProductView({ product, initialColor }: { product: ProductWithMedia; initialColor?: string }) {
  const { add, pending } = useCart();
  const colors = product.colors;
  const [color, setColor] = useState(colors.includes(initialColor ?? "") ? (initialColor as string) : colors[0]);
  const [size, setSize] = useState<string | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);
  const [tab, setTab] = useState<"details" | "size" | "care">("details");

  const gallery = useMemo(() => {
    const forColor = product.images.filter((i) => i.color === color);
    return forColor.length ? forColor : product.images;
  }, [product.images, color]);

  useEffect(() => setActiveIdx(0), [color]);

  const sizes = useMemo(
    () => [...product.sizes].sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b)),
    [product.sizes],
  );
  const variantFor = (s: string) => product.variants.find((v) => v.color === color && v.size === s);
  const selected = size ? variantFor(size) : undefined;

  async function handleAdd() {
    if (!size) {
      setError("Select a size to continue.");
      return;
    }
    if (!selected) return;
    setError(null);
    const ok = await add(selected.id, 1);
    if (ok) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1800);
    } else {
      setError("Couldn't add to bag. Please try again.");
    }
  }

  return (
    <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
      {/* GALLERY */}
      <div className="lg:col-span-7">
        <div className="lg:sticky lg:top-24 flex flex-col-reverse sm:flex-row gap-4">
          {gallery.length > 1 && (
            <div className="flex sm:flex-col gap-3 sm:w-20 shrink-0 overflow-x-auto no-scrollbar">
              {gallery.map((img, i) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setActiveIdx(i)}
                  aria-label={`View image ${i + 1}`}
                  className={`relative w-20 aspect-[4/5] shrink-0 rounded-xl overflow-hidden border transition-colors bg-paper ${
                    i === activeIdx ? "border-ink" : "border-line hover:border-line-strong"
                  }`}
                >
                  <Image src={img.src} alt="" fill sizes="80px" className="object-contain" />
                </button>
              ))}
            </div>
          )}
          <div className="relative flex-1 aspect-[4/5] rounded-[24px] overflow-hidden bg-paper border border-line">
            {gallery.map((img, i) => (
              <Image
                key={img.id}
                src={img.src}
                alt={img.alt || product.title}
                fill
                priority={i === 0}
                sizes="(min-width: 1024px) 55vw, 100vw"
                className={`object-contain transition-opacity duration-500 ${i === activeIdx ? "opacity-100" : "opacity-0"}`}
              />
            ))}
            {gallery.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {gallery.map((_, i) => (
                  <span key={i} className={`h-1.5 rounded-full transition-all ${i === activeIdx ? "w-6 bg-ink" : "w-1.5 bg-ink/25"}`} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PANEL */}
      <div className="lg:col-span-5">
        <p className="eyebrow text-mute">Legends Worldwide</p>
        <h1 className="display text-4xl sm:text-5xl mt-3 leading-[0.95]">{product.title}</h1>
        <div className="mt-4 flex items-center gap-4">
          <p className="text-xl font-medium tabular-nums">{formatPrice(product.price)}</p>
          <span className="h-4 w-px bg-line-strong" />
          <p className="text-xs text-mute">{product.tagline}</p>
        </div>

        {/* Color */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <p className="eyebrow text-[10px]">Color</p>
            <p className="text-xs text-ink-soft">{color}</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                aria-label={c}
                aria-pressed={c === color}
                title={c}
                className={`relative h-9 w-9 rounded-full grid place-items-center border transition-all ${
                  c === color ? "border-ink scale-105" : "border-line-strong hover:border-ink"
                }`}
              >
                <span className="h-6 w-6 rounded-full border border-black/10" style={{ background: SWATCH[c] ?? "#ccc" }} />
              </button>
            ))}
          </div>
        </div>

        {/* Size */}
        <div className="mt-7">
          <div className="flex items-center justify-between">
            <p className="eyebrow text-[10px]">Size</p>
            <button type="button" onClick={() => setTab("size")} className="text-xs text-mute link-line hover:text-ink">
              Size guide
            </button>
          </div>
          <div className="mt-3 grid grid-cols-6 gap-2">
            {sizes.map((s) => {
              const v = variantFor(s);
              const disabled = !v || !v.available;
              return (
                <button
                  key={s}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    setSize(s);
                    setError(null);
                  }}
                  aria-pressed={size === s}
                  className={`h-11 rounded-xl border text-xs font-semibold tracking-wide transition-all ${
                    size === s
                      ? "bg-ink text-canvas border-ink"
                      : "border-line-strong hover:border-ink disabled:opacity-30 disabled:line-through"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
          {product.fitNote && <p className="mt-3 text-xs text-mute">{product.fitNote}</p>}
        </div>

        {/* CTA */}
        <div className="mt-8">
          <button
            type="button"
            onClick={handleAdd}
            disabled={pending}
            className={`btn w-full h-14 ${justAdded ? "btn-outline" : "btn-primary"}`}
          >
            {justAdded ? "Added to bag ✓" : pending ? "Adding…" : size ? `Add to bag · ${formatPrice(selected?.price ?? product.price)}` : "Select a size"}
          </button>
          <p aria-live="polite" className={`mt-3 text-xs h-4 ${error ? "text-red-500" : "text-mute"}`}>
            {error ?? ""}
          </p>
        </div>

        <ul className="mt-2 grid grid-cols-3 gap-3 text-center">
          {[
            ["Unisex", "Sizing"],
            ["Relaxed", "Fit"],
            ["LA", "Studio"],
          ].map(([a, b]) => (
            <li key={b} className="rounded-2xl border border-line bg-paper py-3">
              <p className="text-sm font-semibold tracking-tight">{a}</p>
              <p className="eyebrow text-[9px] text-mute mt-0.5">{b}</p>
            </li>
          ))}
        </ul>

        {/* Tabs */}
        <div className="mt-10 border-t border-line">
          <div className="flex gap-6">
            {(
              [
                ["details", "Details"],
                ["size", "Size guide"],
                ["care", "Fabric & care"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`eyebrow text-[10px] py-4 border-t -mt-px transition-colors ${
                  tab === key ? "border-ink text-ink" : "border-transparent text-mute hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="pb-2 text-sm leading-relaxed text-ink-soft">
            {tab === "details" && (
              <div className="space-y-5">
                <p>{product.description}</p>
                {product.features.length > 0 && (
                  <ul className="space-y-2">
                    {product.features.map((f) => (
                      <li key={f} className="flex gap-3">
                        <span className="mt-2 h-1 w-1 rounded-full bg-navy shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {tab === "size" && product.sizeGuide && (
              <div className="overflow-x-auto">
                <table className="size-table w-full text-xs min-w-[420px]">
                  <thead>
                    <tr className="eyebrow text-[9px] text-mute">
                      <th>Inches</th>
                      {product.sizeGuide.sizes.map((s) => (
                        <th key={s}>{s}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {product.sizeGuide.rows.map((row) => (
                      <tr key={row.label}>
                        <td className="font-medium text-ink">{row.label}</td>
                        {row.inch.map((v, i) => (
                          <td key={i}>{v.toFixed(1)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                  <thead>
                    <tr className="eyebrow text-[9px] text-mute">
                      <th className="pt-6">Centimeters</th>
                      {product.sizeGuide.sizes.map((s) => (
                        <th key={s} className="pt-6">{s}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {product.sizeGuide.rows.map((row) => (
                      <tr key={row.label}>
                        <td className="font-medium text-ink">{row.label}</td>
                        {row.cm.map((v, i) => (
                          <td key={i}>{v}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-4 text-xs text-mute">Garment measurements, laid flat. Allow ±1–2 cm variance.</p>
              </div>
            )}
            {tab === "care" && (
              <dl className="divide-y divide-line">
                {product.specs.map((s) => (
                  <div key={s.label} className="grid grid-cols-[110px_1fr] gap-4 py-3">
                    <dt className="eyebrow text-[10px] text-mute pt-0.5">{s.label}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
