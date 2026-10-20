import { Metadata } from "next";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const metadata: Metadata = {
  title: "Executive Admin Console | Aston Auto Stores",
  description: "Secure management console for Aston Auto Stores vehicles, orders, reservations, and customer reviews.",
};

export default function AdminPage() {
  return <AdminDashboardClient />;
}
