import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import StorefrontShell from "@/components/layout/StorefrontShell";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://astonautostores.com"),
  title: {
    default: "Aston Auto Stores | Curated Automotive Dealership",
    template: "%s | Aston Auto Stores",
  },
  description:
    "Curated selection of performance and luxury vehicles. Transparent pricing, nationwide delivery, and dedicated client service in the United States.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Aston Auto Stores | Curated Automotive Dealership",
    description:
      "Curated selection of performance and luxury vehicles. Transparent pricing, nationwide delivery, and dedicated client service.",
    url: "https://astonautostores.com",
    siteName: "Aston Auto Stores",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Aston Auto Stores Emblem",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aston Auto Stores",
    description: "Curated selection of performance and luxury vehicles.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`}>
      <body className="min-h-screen bg-white text-[#0A0A0A] font-sans antialiased selection:bg-[#0A0A0A] selection:text-white">
        <SmoothScrollProvider>
          <StorefrontShell>{children}</StorefrontShell>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
