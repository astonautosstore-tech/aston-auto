import type { Metadata } from "next";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
// import LuxuryCursor from "@/components/ui/LuxuryCursor";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import FlyingCarAnimation from "@/components/cart/FlyingCarAnimation";
import CookieConsent from "@/components/ui/CookieConsent";

export const metadata: Metadata = {
  title: "Aston Auto Stores | Curators of Extraordinary Motoring",
  description:
    "Aston Auto Stores is West Africa's most prestigious luxury automotive dealership. Curated inventory of Aston Martin, Rolls-Royce, Porsche, Ferrari, Bentley, and Lamborghini with bespoke white-glove acquisition.",
  keywords: [
    "Aston Auto Stores",
    "Luxury Cars Nigeria",
    "Aston Martin Lagos",
    "Rolls Royce Spectre Nigeria",
    "Porsche GT3 RS Lagos",
    "Ferrari 296 GTB Nigeria",
    "Supercars Nigeria",
    "Ikoyi Car Dealership",
  ],
  authors: [{ name: "Aston Auto Stores Concierge" }],
  openGraph: {
    title: "Aston Auto Stores | Curators of Extraordinary Motoring",
    description: "Explore Nigeria's most prestigious portfolio of curated supercars and bespoke grand tourers.",
    url: "https://astonautostores.com",
    siteName: "Aston Auto Stores",
    images: [
      {
        url: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Aston Martin DBS 770 Ultimate at Aston Auto Stores",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aston Auto Stores | Curators of Extraordinary Motoring",
    description: "The apex of luxury automotive in Nigeria. Explore our pristine collection.",
    images: ["https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className="font-sans">
      <body className="min-h-screen bg-[#050505] text-white selection:bg-[#E10600] selection:text-white relative">
        <SmoothScrollProvider>
          {/* <LuxuryCursor /> */}
          <FlyingCarAnimation />
          <CartDrawer />
          <CookieConsent />

          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
