import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, Cormorant_Garamond, UnifrakturMaguntia } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/cart-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { MenuProvider } from "@/components/layout/menu";
import { SITE_NAME } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
const unifraktur = UnifrakturMaguntia({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-unifraktur",
  display: "swap",
});

const description =
  "Legends Barber Studio — a barbershop in Minneapolis. Book your cut online and shop Legends apparel.";

export const metadata: Metadata = {
  metadataBase: new URL("https://los-legends-barber.vercel.app"),
  title: {
    default: SITE_NAME,
    template: `%s — ${SITE_NAME}`,
  },
  description,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description,
    images: ["/images/about/barber-ring-light.jpg"],
  },
  twitter: { card: "summary_large_image", title: SITE_NAME, description },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} ${unifraktur.variable}`}>
      <body className="min-h-dvh flex flex-col">
        <CartProvider>
          <MenuProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
          </MenuProvider>
        </CartProvider>
      </body>
    </html>
  );
}
