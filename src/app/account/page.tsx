import { Metadata } from "next";
import AccountClient from "@/components/account/AccountClient";

export const metadata: Metadata = {
  title: "VIP Account & Reservations | Aston Auto Stores",
  description: "Manage your luxury vehicle allocations, saved cars, and order history at Aston Auto Stores.",
};

export default function AccountPage() {
  return <AccountClient />;
}
