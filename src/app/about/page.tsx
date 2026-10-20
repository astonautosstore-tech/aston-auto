import { Metadata } from "next";
import AboutClient from "@/components/about/AboutClient";

export const metadata: Metadata = {
  title: "About Us | Aston Auto Stores",
  description: "Learn about the heritage, craftsmanship, and ethos of Aston Auto Stores — Curators of Extraordinary Motoring and Pioneers of Transparent Acquisition.",
};

export default function AboutPage() {
  return <AboutClient />;
}
