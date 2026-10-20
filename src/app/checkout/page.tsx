import { Metadata } from "next";
import CheckoutClient from "@/components/checkout/CheckoutClient";

export const metadata: Metadata = {
  title: "VIP Checkout & Reservation | Aston Auto Stores",
  description: "Secure your luxury vehicle allocation with Aston Auto Stores white-glove acquisition service.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
