import { Metadata } from "next";
import ContactClient from "@/components/contact/ContactClient";

export const metadata: Metadata = {
  title: "Contact & Showrooms | Aston Auto Stores",
  description: "Schedule a private salon appointment at our Ikoyi or Abuja galleries. Direct VIP concierge contact.",
};

export default function ContactPage() {
  return <ContactClient />;
}
