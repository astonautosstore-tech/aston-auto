import { Suspense } from "react";
import { Metadata } from "next";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Console | Aston Dealership",
  description: "Secure management console for Aston vehicles, inquiries, test drives, and customer reviews.",
};

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-400 mb-3" />
          <p className="text-xs text-neutral-500 font-medium">Loading console...</p>
        </div>
      }
    >
      <AdminDashboardClient />
    </Suspense>
  );
}

