import type { SizeGuide } from "@/db/schema";

const IMG = "/images/products/";

export type SeedProduct = {
  shopifyId: number;
  handle: string;
  title: string;
  category: "hoodies" | "tees" | "bottoms";
  price: number;
  tagline: string;
  description: string;
  features: string[];
  specs: { label: string; value: string }[];
  fitNote?: string;
  sizeGuide: SizeGuide;
  featured: boolean;
  sortOrder: number;
  images: { file: string; color?: string; alt: string }[];
  colors: { name: string; image: string; variantIds: Record<string, number> }[];
};

const careInstructions =
  "Machine wash at 30°C (gentle cycle). Do not bleach. Tumble dry low. Iron at low temperature, avoid ironing on print. Do not dry clean.";

export const seedProducts: SeedProduct[] = [
  {
    shopifyId: 15345684250669,
    handle: "legends-heavyweight-hoodie",
    title: "Legends Heavyweight Hoodie",
    category: "hoodies",
    price: 5000,
    tagline: "Built for everyday comfort with a premium, elevated feel.",
    description:
      "The Legends Heavyweight Hoodie is built for everyday comfort with a premium, elevated feel. Featuring a clean minimalist LEGENDS design and a heavyweight construction, this hoodie delivers a relaxed streetwear-inspired fit that's easy to wear anywhere. Made for those who move with purpose.",
    features: [
      "Premium heavyweight feel",
      "Relaxed, oversized-inspired fit",
      "Soft and comfortable for everyday wear",
      "Minimal LEGENDS front design",
      "Perfect for layering, training days, or everyday lifestyle wear",
    ],
    specs: [
      { label: "Gender", value: "Unisex" },
      { label: "Weight", value: "Heavyweight" },
      { label: "Care", value: careInstructions },
    ],
    fitNote: "Relaxed fit. For a more fitted look, consider sizing down.",
    sizeGuide: {
      sizes: ["S", "M", "L", "XL", "2XL"],
      rows: [
        { label: "Length", inch: [27.56, 28.35, 29.13, 29.92, 30.71], cm: [70, 72, 74, 76, 78] },
        { label: "Shoulder", inch: [25.2, 25.98, 26.77, 27.56, 28.35], cm: [64, 66, 68, 70, 72] },
        { label: "Chest", inch: [25.59, 26.38, 27.17, 27.95, 28.74], cm: [65, 67, 69, 71, 73] },
        { label: "Sleeve", inch: [20.87, 21.26, 21.65, 22.05, 22.44], cm: [53, 54, 55, 56, 57] },
      ],
    },
    featured: true,
    sortOrder: 1,
    images: [
      { file: "a7266c0ce4cf4fecac255af66569f4bb_b3f53f9d-6f7f-49da-bec9-2b8bd8b5fd3c.jpg", color: "Black", alt: "Legends Heavyweight Hoodie in Black, front" },
      { file: "37e3d56e0be446969fe5887cb9154ef1_8fce7fd5-cf0a-443f-aa8e-c53ff4059224.jpg", color: "Black", alt: "Legends Heavyweight Hoodie in Black, back" },
      { file: "57cdf10155d94b0db5a22b4392eb7887.jpg", color: "Blackish Green", alt: "Legends Heavyweight Hoodie in Blackish Green, front" },
      { file: "d45151f5db104121ac4320e2a6ed6206.jpg", color: "Blackish Green", alt: "Legends Heavyweight Hoodie in Blackish Green, back" },
      { file: "21eaa5e861954874ab40cb7d6c294d03.jpg", color: "Flower Gray", alt: "Legends Heavyweight Hoodie in Flower Gray, front" },
      { file: "ebe4e876dd7e45c1b520c60a60c9cbd3.jpg", color: "Flower Gray", alt: "Legends Heavyweight Hoodie in Flower Gray, back" },
      { file: "98cfa1ef9cd4432da195886a06d537f7.jpg", color: "Blue", alt: "Legends Heavyweight Hoodie in Blue, front" },
      { file: "c60af65eade64f479796f2732a455292.jpg", color: "Blue", alt: "Legends Heavyweight Hoodie in Blue, back" },
      { file: "857496edb10f43b39c443545a9733b7b.jpg", color: "Apricot", alt: "Legends Heavyweight Hoodie in Apricot, front" },
      { file: "d7b08b3d35ec4fa093a7bb4015f65dc9.jpg", color: "Apricot", alt: "Legends Heavyweight Hoodie in Apricot, back" },
      { file: "157c7229963a4fa6a809adad70b58c66.jpg", color: "Pink", alt: "Legends Heavyweight Hoodie in Pink, front" },
      { file: "2d06089bfde84019b6b9c65c211468c1.jpg", color: "Pink", alt: "Legends Heavyweight Hoodie in Pink, back" },
    ],
    colors: [
      { name: "Black", image: "a7266c0ce4cf4fecac255af66569f4bb_b3f53f9d-6f7f-49da-bec9-2b8bd8b5fd3c.jpg", variantIds: { S: 67424273891373, M: 67424273924141, L: 67424273956909, XL: 67424273989677, "2XL": 67424274022445 } },
      { name: "Blackish Green", image: "57cdf10155d94b0db5a22b4392eb7887.jpg", variantIds: { S: 67424273072173, M: 67424273104941, L: 67424273137709, XL: 67424273170477, "2XL": 67424273203245 } },
      { name: "Flower Gray", image: "21eaa5e861954874ab40cb7d6c294d03.jpg", variantIds: { S: 67424273563693, M: 67424273596461, L: 67424273629229, XL: 67424273661997, "2XL": 67424273694765 } },
      { name: "Blue", image: "98cfa1ef9cd4432da195886a06d537f7.jpg", variantIds: { S: 67424273399853, M: 67424273432621, L: 67424273465389, XL: 67424273498157, "2XL": 67424273530925 } },
      { name: "Apricot", image: "857496edb10f43b39c443545a9733b7b.jpg", variantIds: { S: 67424273727533, M: 67424273760301, L: 67424273793069, XL: 67424273825837, "2XL": 67424273858605 } },
      { name: "Pink", image: "157c7229963a4fa6a809adad70b58c66.jpg", variantIds: { S: 67424273236013, M: 67424273268781, L: 67424273301549, XL: 67424273334317, "2XL": 67424273367085 } },
    ],
  },
  {
    shopifyId: 15374361264173,
    handle: "legends-heavyweight-hoodie-camel",
    title: "Legends Heavyweight Hoodie — Camel",
    category: "hoodies",
    price: 5000,
    tagline: "The heavyweight, in a warm camel tone.",
    description:
      "The Legends Heavyweight Hoodie in Camel. A clean minimalist LEGENDS design on a heavyweight construction, cut to a relaxed streetwear-inspired fit that's easy to wear anywhere. Made for those who move with purpose.",
    features: [
      "Premium heavyweight feel",
      "Relaxed, oversized-inspired fit",
      "Minimal LEGENDS front design",
      "Perfect for layering or everyday lifestyle wear",
    ],
    specs: [
      { label: "Gender", value: "Unisex" },
      { label: "Weight", value: "Heavyweight" },
      { label: "Care", value: careInstructions },
    ],
    fitNote: "Relaxed fit. For a more fitted look, consider sizing down.",
    sizeGuide: {
      sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
      rows: [
        { label: "Length", inch: [26.38, 27.17, 27.95, 28.74, 29.53, 30.31], cm: [67, 69, 71, 73, 75, 77] },
        { label: "Shoulder", inch: [23.46, 24.17, 24.88, 25.59, 26.3, 27.01], cm: [59.6, 61.4, 63.2, 65, 66.8, 68.6] },
        { label: "Chest", inch: [23.62, 24.41, 25.2, 25.98, 26.77, 27.56], cm: [60, 62, 64, 66, 68, 70] },
        { label: "Sleeve", inch: [21.81, 22.13, 22.44, 22.76, 23.07, 23.39], cm: [55.4, 56.2, 57, 57.8, 58.6, 59.4] },
      ],
    },
    featured: true,
    sortOrder: 2,
    images: [
      { file: "e7722de107d64223a69bc66191e65693.jpg", color: "Camel", alt: "Legends Heavyweight Hoodie in Camel, front" },
      { file: "30c3bbe93a4c47998271190977bc324d.jpg", color: "Camel", alt: "Legends Heavyweight Hoodie in Camel, back" },
    ],
    colors: [
      { name: "Camel", image: "e7722de107d64223a69bc66191e65693.jpg", variantIds: { S: 67526146293805, M: 67526146326573, L: 67526146359341, XL: 67526146392109, "2XL": 67526146424877, "3XL": 67526146457645 } },
    ],
  },
  {
    shopifyId: 15310498725933,
    handle: "legends-boxing-tee",
    title: "Legends Boxing Tee",
    category: "tees",
    price: 3500,
    tagline: "Legends in blue up front. Gloves on the back.",
    description:
      "LEGENDS WORLDWIDE. Built for those who move with purpose. The Legends Boxing Tee features Legends in a blue font on the front and boxing gloves on the back.",
    features: ["Legends blue front graphic", "Boxing gloves back print", "Relaxed everyday fit"],
    specs: [
      { label: "Gender", value: "Unisex" },
      { label: "Care", value: careInstructions },
    ],
    sizeGuide: {
      sizes: ["S", "M", "L", "XL", "2XL"],
      rows: [
        { label: "Length", inch: [26.38, 27.17, 27.95, 28.74, 29.53], cm: [67, 69, 71, 73, 75] },
        { label: "Shoulder", inch: [19.69, 20.47, 21.26, 22.05, 22.83], cm: [50, 52, 54, 56, 58] },
        { label: "Chest", inch: [20.87, 21.65, 22.44, 23.23, 24.02], cm: [53, 55, 57, 59, 61] },
        { label: "Sleeve", inch: [7.09, 7.48, 7.87, 8.27, 8.66], cm: [18, 19, 20, 21, 22] },
      ],
    },
    featured: true,
    sortOrder: 3,
    images: [
      { file: "81ef8a1e05e247b4a9eb29deb04ccef7.jpg", color: "Black", alt: "Legends Boxing Tee in Black, front" },
      { file: "ad7a5bb11f4d4873945dade5f151a2b5.jpg", color: "Black", alt: "Legends Boxing Tee in Black, back" },
      { file: "d44ae349c7174a1282703bab1c914654.jpg", color: "White", alt: "Legends Boxing Tee in White, front" },
      { file: "ccc4b87b5a5449a2a0995c3087da8d94.jpg", color: "White", alt: "Legends Boxing Tee in White, back" },
    ],
    colors: [
      { name: "Black", image: "81ef8a1e05e247b4a9eb29deb04ccef7.jpg", variantIds: { S: 67358889148461, M: 67358889181229, L: 67358889213997, XL: 67358889246765, "2XL": 67358889279533 } },
      { name: "White", image: "d44ae349c7174a1282703bab1c914654.jpg", variantIds: { S: 67358888984621, M: 67358889017389, L: 67358889050157, XL: 67358889082925, "2XL": 67358889115693 } },
    ],
  },
  {
    shopifyId: 15334318833709,
    handle: "legends-worldwide-22-tee",
    title: "Legends WorldWide 22 Tee",
    category: "tees",
    price: 3500,
    tagline: "Cotton and Sorona®. Quick-dry, cooling, everyday.",
    description:
      "The Legends WorldWide 22 Tee. A drop-shoulder, relaxed cotton and Sorona® blend that stays cool and dries quick — with the Legends Worldwide mark front and center. Each piece features the official Sorona® hang tag, a mark of authentic, eco-friendly innovation and next-level comfort.",
    features: [
      "Quick-dry, cooling Sorona® blend",
      "Drop shoulder, relaxed fit",
      "Round neck, short sleeve",
      "Official Sorona® hang tag",
    ],
    specs: [
      { label: "Gender", value: "Unisex" },
      { label: "Fabric", value: "73.31% cotton, 26.69% Sorona®" },
      { label: "Weight", value: "7.1 oz/yd² (240 g/m²)" },
      { label: "Care", value: careInstructions },
    ],
    sizeGuide: {
      sizes: ["S", "M", "L", "XL", "2XL"],
      rows: [
        { label: "Length", inch: [26.38, 27.17, 27.95, 28.74, 29.53], cm: [67, 69, 71, 73, 75] },
        { label: "Shoulder", inch: [19.69, 20.47, 21.26, 22.05, 22.83], cm: [50, 52, 54, 56, 58] },
        { label: "Chest", inch: [20.87, 21.65, 22.44, 23.23, 24.02], cm: [53, 55, 57, 59, 61] },
        { label: "Sleeve", inch: [7.09, 7.48, 7.87, 8.27, 8.66], cm: [18, 19, 20, 21, 22] },
      ],
    },
    featured: true,
    sortOrder: 4,
    images: [
      { file: "0452d649105f4f76abbe843cbcebdaa2.jpg", color: "White", alt: "Legends WorldWide 22 Tee in White, front" },
      { file: "df1a006333d74afca04e5bce0c80d770.jpg", color: "White", alt: "Legends WorldWide 22 Tee in White, back" },
    ],
    colors: [
      { name: "White", image: "0452d649105f4f76abbe843cbcebdaa2.jpg", variantIds: { S: 67401305325613, M: 67401305358381, L: 67401305391149, XL: 67401305423917, "2XL": 67401305456685 } },
    ],
  },
  {
    shopifyId: 15310497251373,
    handle: "snow-washed-legends-tee",
    title: "Snow Washed Legends Tee",
    category: "tees",
    price: 4000,
    tagline: "Snow-washed black with a pink Legends hit.",
    description:
      "The Snow Washed Legends Tee. A snow-washed black base with a pink Legends graphic — relaxed, lived-in, and made for those who move with purpose.",
    features: ["Snow-washed finish", "Pink Legends graphic", "Relaxed fit, sizes S–3XL"],
    specs: [
      { label: "Gender", value: "Unisex" },
      { label: "Care", value: careInstructions },
    ],
    sizeGuide: {
      sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
      rows: [
        { label: "Length", inch: [27.56, 28.35, 29.13, 29.92, 30.71, 31.1], cm: [70, 72, 74, 76, 78, 79] },
        { label: "Shoulder", inch: [20.87, 21.65, 22.44, 23.23, 24.02, 24.8], cm: [53, 55, 57, 59, 61, 63] },
        { label: "Chest", inch: [22.05, 22.83, 23.62, 24.41, 25.2, 26.38], cm: [56, 58, 60, 62, 64, 67] },
        { label: "Sleeve", inch: [8.19, 8.46, 8.74, 9.02, 9.29, 9.29], cm: [20.8, 21.5, 22.2, 22.9, 23.6, 23.6] },
      ],
    },
    featured: false,
    sortOrder: 5,
    images: [
      { file: "ce433ebac303443dbbdbd3f781a2ab4e.jpg", color: "Black", alt: "Snow Washed Legends Tee, front" },
      { file: "05151c3c35034c2293ca753eb56d65ca.jpg", color: "Black", alt: "Snow Washed Legends Tee, back" },
    ],
    colors: [
      { name: "Black", image: "ce433ebac303443dbbdbd3f781a2ab4e.jpg", variantIds: { S: 67358884167725, M: 67358884200493, L: 67358884233261, XL: 67358884266029, "2XL": 67358884298797, "3XL": 67358884331565 } },
    ],
  },
  {
    shopifyId: 15356338765869,
    handle: "legends-relaxed-drawstring-sweatpants",
    title: "Legends Relaxed Drawstring Three-Quarter Sweatpants",
    category: "bottoms",
    price: 4000,
    tagline: "Thick, relaxed, three-quarter. Built to move.",
    description:
      "The Legends Relaxed Drawstring Three-Quarter Sweatpants. A thick 350 gsm cotton blend with a mid-waist drawstring and a loose, mid-long cut — for training, running, or everyday casual.",
    features: ["Drawstring mid waist", "Loose, three-quarter length", "Thick 350 gsm cotton blend"],
    specs: [
      { label: "Gender", value: "Unisex" },
      { label: "Fabric", value: "57.4% polyester, 36.8% cotton, 5.8% other fibers" },
      { label: "Weight", value: "10.3 oz/yd² (350 g/m²)" },
      { label: "Care", value: careInstructions },
    ],
    sizeGuide: {
      sizes: ["S", "M", "L", "XL", "2XL"],
      rows: [
        { label: "Length", inch: [28.35, 29.13, 29.92, 30.71, 31.5], cm: [72, 74, 76, 78, 80] },
        { label: "Waist", inch: [14.37, 14.96, 15.55, 16.14, 16.73], cm: [36.5, 38, 39.5, 41, 42.5] },
        { label: "Hip", inch: [22.83, 23.62, 24.41, 25.2, 25.98], cm: [58, 60, 62, 64, 66] },
      ],
    },
    featured: false,
    sortOrder: 6,
    images: [
      { file: "c6eb282901ca48c580b7bae5869411b5.jpg", color: "Black", alt: "Legends Relaxed Drawstring Sweatpants, front" },
      { file: "fb57ac3915294ed99f3f044f56066275.jpg", color: "Black", alt: "Legends Relaxed Drawstring Sweatpants, back" },
    ],
    colors: [
      { name: "Black", image: "c6eb282901ca48c580b7bae5869411b5.jpg", variantIds: { S: 67448265867309, M: 67448265900077, L: 67448265932845, XL: 67448265965613, "2XL": 67448265998381 } },
    ],
  },
];

export const imageUrl = (file: string) => `${IMG}${file}`;

export const CATEGORIES = [
  { slug: "hoodies", label: "Hoodies" },
  { slug: "tees", label: "Tees" },
  { slug: "bottoms", label: "Bottoms" },
] as const;

export const SHOPIFY_STORE_URL = "https://legends-apparel-3476.myshopify.com";
