import { Metadata } from "next";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const metadata: Metadata = {
  title: "Console | Aston Dealership",
  description: "Secure management console for Aston vehicles, inquiries, test drives, and customer reviews.",
};

export default function AdminPage() {
  return <AdminDashboardClient />;
}
