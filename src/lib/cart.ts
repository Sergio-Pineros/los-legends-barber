import { db } from "@/db";
import { cartItems, productVariants, products } from "@/db/schema";
import { and, asc, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { SHOPIFY_STORE_URL } from "./catalog-data";

export const CART_COOKIE = "legends_cart";

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

export async function getCartId(create = false): Promise<string | null> {
  const store = await cookies();
  const existing = store.get(CART_COOKIE)?.value;
  if (existing) return existing;
  if (!create) return null;
  const id = randomUUID();
  store.set(CART_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 90,
  });
  return id;
}

export async function getCart(cartId: string | null): Promise<CartPayload> {
  if (!cartId) return { items: [], count: 0, subtotal: 0, checkoutUrl: null };
  const rows = await db
    .select({
      id: cartItems.id,
      quantity: cartItems.quantity,
      variantId: productVariants.id,
      shopifyVariantId: productVariants.shopifyVariantId,
      color: productVariants.color,
      size: productVariants.size,
      price: productVariants.price,
      image: productVariants.imageSrc,
      productTitle: products.title,
      productHandle: products.handle,
    })
    .from(cartItems)
    .innerJoin(productVariants, eq(cartItems.variantId, productVariants.id))
    .innerJoin(products, eq(productVariants.productId, products.id))
    .where(eq(cartItems.cartId, cartId))
    .orderBy(asc(cartItems.createdAt));

  const count = rows.reduce((n, r) => n + r.quantity, 0);
  const subtotal = rows.reduce((n, r) => n + r.quantity * r.price, 0);
  const checkoutUrl =
    rows.length > 0
      ? `${SHOPIFY_STORE_URL}/cart/${rows.map((r) => `${r.shopifyVariantId}:${r.quantity}`).join(",")}`
      : null;
  return { items: rows, count, subtotal, checkoutUrl };
}

export async function addToCart(cartId: string, variantId: number, quantity: number) {
  const [existing] = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.cartId, cartId), eq(cartItems.variantId, variantId)))
    .limit(1);
  if (existing) {
    await db
      .update(cartItems)
      .set({ quantity: Math.min(existing.quantity + quantity, 10), updatedAt: new Date() })
      .where(eq(cartItems.id, existing.id));
  } else {
    await db.insert(cartItems).values({ cartId, variantId, quantity: Math.min(quantity, 10) });
  }
}

export async function updateCartLine(cartId: string, lineId: number, quantity: number) {
  if (quantity <= 0) {
    await db.delete(cartItems).where(and(eq(cartItems.id, lineId), eq(cartItems.cartId, cartId)));
    return;
  }
  await db
    .update(cartItems)
    .set({ quantity: Math.min(quantity, 10), updatedAt: new Date() })
    .where(and(eq(cartItems.id, lineId), eq(cartItems.cartId, cartId)));
}

export async function removeCartLine(cartId: string, lineId: number) {
  await db.delete(cartItems).where(and(eq(cartItems.id, lineId), eq(cartItems.cartId, cartId)));
}
