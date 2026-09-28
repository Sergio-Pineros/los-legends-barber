import { cookies } from "next/headers";
import { getVariant } from "./catalog";
import { SHOPIFY_STORE_URL } from "./catalog-data";

export const CART_COOKIE = "legends_cart";

type StoredLine = { variantId: number; quantity: number };

export type CartLine = {
  id: number;
  quantity: number;
  variantId: number;
  shopifyVariantId: number;
  color: string;
  size: string;
  price: number;
  image: string | null;
  productTitle: string;
  productHandle: string;
};

export type CartPayload = {
  items: CartLine[];
  count: number;
  subtotal: number;
  checkoutUrl: string | null;
};

function parseLines(raw: string | undefined): StoredLine[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as StoredLine[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((line) => Number.isInteger(line.variantId) && Number.isInteger(line.quantity));
  } catch {
    return [];
  }
}

async function readLines(): Promise<StoredLine[]> {
  const store = await cookies();
  return parseLines(store.get(CART_COOKIE)?.value);
}

async function writeLines(lines: StoredLine[]) {
  const store = await cookies();
  store.set(CART_COOKIE, JSON.stringify(lines), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 90,
  });
}

function toPayload(lines: StoredLine[]): CartPayload {
  const items: CartLine[] = [];
  for (const line of lines) {
    const match = getVariant(line.variantId);
    if (!match) continue;
    items.push({
      id: line.variantId,
      quantity: line.quantity,
      variantId: line.variantId,
      shopifyVariantId: match.variant.shopifyVariantId,
      color: match.variant.color,
      size: match.variant.size,
      price: match.variant.price,
      image: match.variant.imageSrc,
      productTitle: match.product.title,
      productHandle: match.product.handle,
    });
  }
  const count = items.reduce((n, r) => n + r.quantity, 0);
  const subtotal = items.reduce((n, r) => n + r.quantity * r.price, 0);
  const checkoutUrl =
    items.length > 0
      ? `${SHOPIFY_STORE_URL}/cart/${items.map((r) => `${r.shopifyVariantId}:${r.quantity}`).join(",")}`
      : null;
  return { items, count, subtotal, checkoutUrl };
}

export async function getCart(): Promise<CartPayload> {
  return toPayload(await readLines());
}

export async function addToCart(variantId: number, quantity: number) {
  const lines = await readLines();
  const existing = lines.find((line) => line.variantId === variantId);
  if (existing) {
    existing.quantity = Math.min(existing.quantity + quantity, 10);
  } else {
    lines.push({ variantId, quantity: Math.min(quantity, 10) });
  }
  await writeLines(lines);
}

export async function updateCartLine(lineId: number, quantity: number) {
  const lines = await readLines();
  const next =
    quantity <= 0
      ? lines.filter((line) => line.variantId !== lineId)
      : lines.map((line) =>
          line.variantId === lineId ? { ...line, quantity: Math.min(quantity, 10) } : line,
        );
  await writeLines(next);
}

export async function removeCartLine(lineId: number) {
  const lines = await readLines();
  await writeLines(lines.filter((line) => line.variantId !== lineId));
}
