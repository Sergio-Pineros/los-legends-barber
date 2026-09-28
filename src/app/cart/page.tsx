import type { Metadata } from "next";
import { CartPageContent } from "@/components/cart/cart-page-content";

export const metadata: Metadata = { title: "Your bag" };

export default function CartPage() {
  return (
    <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12 pt-10 sm:pt-16">
      <CartPageContent />
    </div>
  );
}
