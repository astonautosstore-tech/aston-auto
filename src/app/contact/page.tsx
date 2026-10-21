import { Metadata } from "next";
import ContactClient from "@/components/contact/ContactClient";

export const metadata: Metadata = {
  title: "Contact & Concierge | Aston Auto Stores",
  description:
    "Schedule a private showroom appointment or contact our client concierge in the United States. Direct phone: +1 448 226 4666.",
};

export default function ContactPage() {
  return <ContactClient />;
}
