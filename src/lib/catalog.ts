import { db } from "@/db";
import {
  productImages,
  productVariants,
  products,
  type Product,
  type ProductImage,
  type ProductVariant,
} from "@/db/schema";
import { and, asc, count, eq, ne } from "drizzle-orm";
import { imageUrl, seedProducts } from "./catalog-data";

let seeded = false;

/** Idempotently seed the catalog from the Shopify export on first access. */
export async function ensureSeeded() {
  if (seeded) return;
  const [{ value }] = await db.select({ value: count() }).from(products);
  if (value > 0) {
    seeded = true;
    return;
  }
  await db.transaction(async (tx) => {
    for (const p of seedProducts) {
      const [row] = await tx
        .insert(products)
        .values({
          shopifyId: p.shopifyId,
          handle: p.handle,
          title: p.title,
          category: p.category,
          price: p.price,
          tagline: p.tagline,
          description: p.description,
          features: p.features,
          specs: p.specs,
          fitNote: p.fitNote ?? null,
          sizeGuide: p.sizeGuide,
          featured: p.featured,
          sortOrder: p.sortOrder,
        })
        .onConflictDoNothing()
        .returning({ id: products.id });
      if (!row) continue;
      await tx.insert(productImages).values(
        p.images.map((img, i) => ({
          productId: row.id,
          src: imageUrl(img.file),
          alt: img.alt,
          color: img.color ?? null,
          position: i,
        })),
      );
      const variants = p.colors.flatMap((c) =>
        Object.entries(c.variantIds).map(([size, shopifyVariantId]) => ({
          shopifyVariantId,
          productId: row.id,
          color: c.name,
          size,
          price: p.price,
          available: true,
          imageSrc: imageUrl(c.image),
        })),
      );
      await tx.insert(productVariants).values(variants).onConflictDoNothing();
    }
  });
  seeded = true;
}

export type ProductWithMedia = Product & {
  images: ProductImage[];
  variants: ProductVariant[];
  colors: string[];
  sizes: string[];
};

async function hydrate(rows: Product[]): Promise<ProductWithMedia[]> {
  if (rows.length === 0) return [];
  const ids = rows.map((r) => r.id);
  const [imgs, vars] = await Promise.all([
    db.select().from(productImages).orderBy(asc(productImages.position)),
    db.select().from(productVariants).orderBy(asc(productVariants.id)),
  ]);
  return rows.map((p) => {
    const images = imgs.filter((i) => ids.includes(i.productId) && i.productId === p.id);
    const variants = vars.filter((v) => v.productId === p.id);
    const colors = [...new Set(variants.map((v) => v.color))];
    const sizes = [...new Set(variants.map((v) => v.size))];
    return { ...p, images, variants, colors, sizes };
  });
}

export async function getAllProducts(category?: string) {
  await ensureSeeded();
  const rows = await db
    .select()
    .from(products)
    .where(category ? eq(products.category, category) : undefined)
    .orderBy(asc(products.sortOrder));
  return hydrate(rows);
}

export async function getFeaturedProducts(limit = 4) {
  await ensureSeeded();
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.featured, true))
    .orderBy(asc(products.sortOrder))
    .limit(limit);
  return hydrate(rows);
}

export async function getProductByHandle(handle: string) {
  await ensureSeeded();
  const rows = await db.select().from(products).where(eq(products.handle, handle)).limit(1);
  const [p] = await hydrate(rows);
  return p ?? null;
}

export async function getRelatedProducts(product: Product, limit = 4) {
  await ensureSeeded();
  const same = await db
    .select()
    .from(products)
    .where(and(eq(products.category, product.category), ne(products.id, product.id)))
    .orderBy(asc(products.sortOrder))
    .limit(limit);
  if (same.length >= limit) return hydrate(same);
  const others = await db
    .select()
    .from(products)
    .where(ne(products.id, product.id))
    .orderBy(asc(products.sortOrder));
  const merged = [...same, ...others.filter((o) => !same.some((s) => s.id === o.id))].slice(0, limit);
  return hydrate(merged);
}

export function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}
