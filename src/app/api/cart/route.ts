import { NextResponse } from "next/server";
import { db } from "@/db";
import { productVariants } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ensureSeeded } from "@/lib/catalog";
import { addToCart, getCart, getCartId, removeCartLine, updateCartLine } from "@/lib/cart";

export const dynamic = "force-dynamic";

export async function GET() {
  await ensureSeeded();
  const cartId = await getCartId(false);
  return NextResponse.json(await getCart(cartId));
}

export async function POST(req: Request) {
  await ensureSeeded();
  const body = (await req.json().catch(() => null)) as { variantId?: number; quantity?: number } | null;
  const variantId = Number(body?.variantId);
  const quantity = Math.max(1, Math.min(10, Number(body?.quantity ?? 1)));
  if (!Number.isInteger(variantId)) {
    return NextResponse.json({ error: "variantId is required" }, { status: 400 });
  }
  const [variant] = await db.select().from(productVariants).where(eq(productVariants.id, variantId)).limit(1);
  if (!variant || !variant.available) {
    return NextResponse.json({ error: "Variant unavailable" }, { status: 404 });
  }
  const cartId = (await getCartId(true))!;
  await addToCart(cartId, variantId, quantity);
  return NextResponse.json(await getCart(cartId));
}

export async function PATCH(req: Request) {
  const body = (await req.json().catch(() => null)) as { lineId?: number; quantity?: number } | null;
  const lineId = Number(body?.lineId);
  const quantity = Number(body?.quantity);
  if (!Number.isInteger(lineId) || !Number.isInteger(quantity)) {
    return NextResponse.json({ error: "lineId and quantity are required" }, { status: 400 });
  }
  const cartId = await getCartId(false);
  if (!cartId) return NextResponse.json(await getCart(null));
  await updateCartLine(cartId, lineId, quantity);
  return NextResponse.json(await getCart(cartId));
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const lineId = Number(searchParams.get("lineId"));
  const cartId = await getCartId(false);
  if (!cartId) return NextResponse.json(await getCart(null));
  if (Number.isInteger(lineId)) await removeCartLine(cartId, lineId);
  return NextResponse.json(await getCart(cartId));
}
