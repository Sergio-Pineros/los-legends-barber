import { imageUrl, seedProducts } from "./catalog-data";
import type { Product, ProductImage, ProductVariant } from "./types";

export type ProductWithMedia = Product & {
  images: ProductImage[];
  variants: ProductVariant[];
  colors: string[];
  sizes: string[];
};

function buildCatalog(): ProductWithMedia[] {
  let variantId = 1;
  let imageId = 1;
  return seedProducts.map((p, index) => {
    const productId = index + 1;
    const images: ProductImage[] = p.images.map((img, i) => ({
      id: imageId++,
      productId,
      src: imageUrl(img.file),
      alt: img.alt,
      color: img.color ?? null,
      position: i,
    }));
    const variants: ProductVariant[] = p.colors.flatMap((c) =>
      Object.entries(c.variantIds).map(([size, shopifyVariantId]) => ({
        id: variantId++,
        shopifyVariantId,
        productId,
        color: c.name,
        size,
        price: p.price,
        available: true,
        imageSrc: imageUrl(c.image),
      })),
    );
    const product: Product = {
      id: productId,
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
    };
    return {
      ...product,
      images,
      variants,
      colors: [...new Set(variants.map((v) => v.color))],
      sizes: [...new Set(variants.map((v) => v.size))],
    };
  });
}

const catalog = buildCatalog();

export function getVariant(id: number) {
  for (const product of catalog) {
    const variant = product.variants.find((v) => v.id === id);
    if (variant) return { product, variant };
  }
  return null;
}

export async function getAllProducts(category?: string) {
  return catalog
    .filter((p) => (category ? p.category === category : true))
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getFeaturedProducts(limit = 4) {
  return catalog
    .filter((p) => p.featured)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, limit);
}

export async function getProductByHandle(handle: string) {
  return catalog.find((p) => p.handle === handle) ?? null;
}

export async function getRelatedProducts(product: Product, limit = 4) {
  const others = catalog.filter((p) => p.id !== product.id);
  const same = others.filter((p) => p.category === product.category);
  return [...same, ...others.filter((p) => p.category !== product.category)]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, limit);
}

export function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}
