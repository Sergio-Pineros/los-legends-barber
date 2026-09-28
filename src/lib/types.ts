export type SizeGuide = {
  sizes: string[];
  rows: { label: string; inch: number[]; cm: number[] }[];
};

export type Product = {
  id: number;
  shopifyId: number;
  handle: string;
  title: string;
  category: string;
  price: number;
  tagline: string;
  description: string;
  features: string[];
  specs: { label: string; value: string }[];
  fitNote: string | null;
  sizeGuide: SizeGuide | null;
  featured: boolean;
  sortOrder: number;
};

export type ProductImage = {
  id: number;
  productId: number;
  src: string;
  alt: string;
  color: string | null;
  position: number;
};

export type ProductVariant = {
  id: number;
  shopifyVariantId: number;
  productId: number;
  color: string;
  size: string;
  price: number;
  available: boolean;
  imageSrc: string | null;
};
