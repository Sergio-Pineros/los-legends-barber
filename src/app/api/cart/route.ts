import { NextResponse } from "next/server";
import { getVariant } from "@/lib/catalog";
import { addToCart, getCart, removeCartLine, updateCartLine } from "@/lib/cart";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getCart());
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { variantId?: number; quantity?: number } | null;
  const variantId = Number(body?.variantId);
  const quantity = Math.max(1, Math.min(10, Number(body?.quantity ?? 1)));
  if (!Number.isInteger(variantId)) {
    return NextResponse.json({ error: "variantId is required" }, { status: 400 });
  }
  const match = getVariant(variantId);
  if (!match || !match.variant.available) {
    return NextResponse.json({ error: "Variant unavailable" }, { status: 404 });
  }
  await addToCart(variantId, quantity);
  return NextResponse.json(await getCart());
}

export async function PATCH(req: Request) {
  const body = (await req.json().catch(() => null)) as { lineId?: number; quantity?: number } | null;
  const lineId = Number(body?.lineId);
  const quantity = Number(body?.quantity);
  if (!Number.isInteger(lineId) || !Number.isInteger(quantity)) {
    return NextResponse.json({ error: "lineId and quantity are required" }, { status: 400 });
  }
  await updateCartLine(lineId, quantity);
  return NextResponse.json(await getCart());
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const lineId = Number(searchParams.get("lineId"));
  if (Number.isInteger(lineId)) await removeCartLine(lineId);
  return NextResponse.json(await getCart());
}
