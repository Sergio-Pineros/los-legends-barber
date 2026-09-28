import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  bigint,
} from "drizzle-orm/pg-core";

export type SizeGuide = {
  sizes: string[];
  rows: { label: string; inch: number[]; cm: number[] }[];
};

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  shopifyId: bigint("shopify_id", { mode: "number" }).notNull().unique(),
  handle: varchar("handle", { length: 191 }).notNull().unique(),
  title: varchar("title", { length: 191 }).notNull(),
  category: varchar("category", { length: 64 }).notNull(), // hoodies | tees | bottoms
  price: integer("price").notNull(), // cents
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  features: jsonb("features").$type<string[]>().notNull().default([]),
  specs: jsonb("specs").$type<{ label: string; value: string }[]>().notNull().default([]),
  fitNote: text("fit_note"),
  sizeGuide: jsonb("size_guide").$type<SizeGuide>(),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  src: text("src").notNull(),
  alt: text("alt").notNull().default(""),
  color: varchar("color", { length: 64 }),
  position: integer("position").notNull().default(0),
});

export const productVariants = pgTable("product_variants", {
  id: serial("id").primaryKey(),
  shopifyVariantId: bigint("shopify_variant_id", { mode: "number" }).notNull().unique(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  color: varchar("color", { length: 64 }).notNull(),
  size: varchar("size", { length: 16 }).notNull(),
  price: integer("price").notNull(),
  available: boolean("available").notNull().default(true),
  imageSrc: text("image_src"),
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cartId: varchar("cart_id", { length: 64 }).notNull(),
  variantId: integer("variant_id")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type ProductImage = typeof productImages.$inferSelect;
export type ProductVariant = typeof productVariants.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;
