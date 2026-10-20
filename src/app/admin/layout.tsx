import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aston Dealership Portal",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-[#F9FAFB] text-neutral-900">{children}</div>;
}
