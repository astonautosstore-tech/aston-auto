"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CookieConsent from "@/components/ui/CookieConsent";

export default function StorefrontShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isBackdoor = pathname.startsWith("/backdoor") || pathname.startsWith("/admin");

  if (isBackdoor) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <CookieConsent />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
}
