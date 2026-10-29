export const SITE_NAME = "Legends Barber Studio";
export const SITE_HANDLE = "Legendsbarberstudio";
export const SITE_TAGLINE = "Made to inspire. Cut different.";
export const SITE_LOCATION = "Minneapolis";

export const BOOKSY_URL =
  "https://booksy.com/en-us/1039456_legends-barber-studio_barber-shop_134619_minneapolis?do=invite#ba_s=seo";

export const MENU_LINKS = [
  { href: "/", label: "Home" },
  { href: "/apparel", label: "Apparel" },
  { href: "/about", label: "About Us" },
] as const;

/**
 * Swap in the real logo here once the client sends the file, e.g.
 * { src: "/images/brand/legends-logo.png", width: 1600, height: 900 }.
 * When null, the typographic wordmark renders instead.
 */
export const LOGO_IMAGE: { src: string; width: number; height: number } | null = null;
