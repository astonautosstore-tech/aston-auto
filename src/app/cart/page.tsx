import { Metadata } from "next";
import CartPageClient from "@/components/cart/CartPageClient";

export const metadata: Metadata = {
  title: "Your Acquisition Portfolio | Aston Auto Stores",
  description: "Review and secure your reserved supercars and luxury allocations at Aston Auto Stores.",
};

export default function CartPage() {
  return <CartPageClient />;
}
