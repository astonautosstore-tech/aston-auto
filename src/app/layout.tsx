import type { Metadata } from "next";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CookieConsent from "@/components/ui/CookieConsent";

export const metadata: Metadata = {
  title: "Aston | Curators of Extraordinary Motoring",
  description:
    "Aston is North America's premier luxury and exotic automotive dealership. Curated inventory of Aston Martin, Rolls-Royce, Porsche, Ferrari, Bentley, and Lamborghini with bespoke white-glove nationwide delivery. Beverly Hills Showroom: +1 448 226 4666.",
  keywords: [
    "Aston",
    "Aston Luxury Dealership",
    "Beverly Hills Supercars",
    "Exotic Cars USA",
    "Aston Martin Rodeo Drive",
    "Rolls-Royce Spectre",
    "Porsche 911 GT3 RS",
    "Ferrari 296 GTB",
    "Luxury Car Dealership",
  ],
  authors: [{ name: "Aston Concierge" }],
  openGraph: {
    title: "Aston | Curators of Extraordinary Motoring",
    description: "Explore our premier portfolio of curated supercars and bespoke grand tourers.",
    url: "https://astonautostores.com",
    siteName: "Aston",
    images: [
      {
        url: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Aston Martin DBS 770 Ultimate at Aston",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aston | Curators of Extraordinary Motoring",
    description: "The apex of luxury automotive. Explore our pristine collection.",
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
      <body className="min-h-screen bg-white text-neutral-900 selection:bg-neutral-950 selection:text-white relative">
        <SmoothScrollProvider>
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
