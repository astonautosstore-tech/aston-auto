"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  ChevronDown,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import Container from "@/components/ui/Container";
import { SiteSettings } from "@/types/database";
import { storeApi } from "@/lib/supabase/client";
import { getWhatsAppUrl, getTelUrl } from "@/lib/utils";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().trim().email("Please enter a valid email address"),
  phone: z.string().trim().min(7, "Please enter a valid phone number").max(30, "Phone number is too long"),
  message: z.string().trim().min(5, "Message must be at least 5 characters").max(2000, "Message cannot exceed 2,000 characters"),
});

const FAQS = [
  {
    question: "How does vehicle acquisition work at Aston?",
    answer:
      "Our process is transparent and personalized. Browse our verified inventory, submit an inquiry or schedule a viewing, inspect the car with our advisory team, finalize terms, and complete direct payment with white-glove enclosed carrier delivery or showroom collection.",
  },
  {
    question: "Do you offer private showroom appointments?",
    answer:
      "Yes. Private appointments are available Monday through Saturday. We ensure dedicated, one-on-one attention with a motoring advisor to walk you through any vehicle in detail.",
  },
  {
    question: "Are all vehicles certified with clean titles?",
    answer:
      "Every vehicle undergoes a comprehensive 150-point mechanical, structural, and diagnostic inspection. Full vehicle history reports, clean title documentation, and provenance dossiers are provided prior to purchase.",
  },
  {
    question: "Is nationwide enclosed shipping available?",
    answer:
      "Yes, we provide fully insured, climate-controlled enclosed carrier delivery directly to your residence anywhere in the contiguous United States.",
  },
];

export default function ContactClient() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    storeApi.getSiteSettings().then((data) => {
      if (data) setSettings(data);
    });
  }, []);

  const phone = settings?.phone || "+1 448 226 4666";
  const email = settings?.email || "concierge@astonautostores.com";
  const whatsapp = settings?.whatsapp || phone;
  const hours = settings?.showroom_hours || "Monday – Saturday: 9:00 AM – 7:00 PM EST";
  // TODO: Confirm official US dealership address with client
  const address = settings?.address?.trim() || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const validation = contactSchema.safeParse(formData);
    if (!validation.success) {
      setErrorMessage(validation.error.issues[0]?.message || "Invalid input.");
      return;
    }

    setSubmitting(true);
    try {
      await storeApi.submitInquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
        preferred_contact: "whatsapp",
      });

      setSubmitted(true);
    } catch (err: unknown) {
      console.error("Inquiry submission error:", err);
      const msg = err instanceof Error ? err.message : "Failed to submit inquiry. Please try again.";
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] pt-24 pb-24">
      {/* ─── 1. HERO HEADER ─── */}
      <section className="border-b border-[#E8E8E8] pb-12 sm:pb-16">
        <Container>
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.14em] text-[#6B6B6B] block mb-3">
              Concierge &amp; Showroom
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#0A0A0A] mb-4">
              Contact Our Advisors
            </h1>
            <p className="text-sm sm:text-base text-[#6B6B6B] leading-relaxed">
              Whether inquiring about a specific motorcar, scheduling a private viewing, or coordinating nationwide transport, our team is at your service.
            </p>
          </div>
        </Container>
      </section>

      {/* ─── 2. CONTACT DETAILS + INQUIRY FORM ─── */}
      <section className="py-14 sm:py-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left: Contact Info */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <h2 className="text-xl font-medium tracking-tight text-[#0A0A0A] mb-3">
                  Direct Inquiries
                </h2>
                <p className="text-sm text-[#6B6B6B] leading-relaxed">
                  Connect with a motoring advisor directly via phone, WhatsApp, or email for immediate assistance with any vehicle in our collection.
                </p>
              </div>

              <div className="space-y-5 pt-2">
                {/* Phone */}
                <div className="flex items-start gap-4 p-4 rounded-lg bg-[#FAFAFA] border border-[#E8E8E8]">
                  <div className="w-9 h-9 rounded-md bg-white border border-[#E8E8E8] flex items-center justify-center shrink-0 text-[#0A0A0A]">
                    <Phone className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#6B6B6B] block">Telephone</span>
                    <a
                      href={getTelUrl(phone)}
                      className="text-sm font-medium text-[#0A0A0A] hover:underline"
                    >
                      {phone}
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-4 p-4 rounded-lg bg-[#FAFAFA] border border-[#E8E8E8]">
                  <div className="w-9 h-9 rounded-md bg-white border border-[#E8E8E8] flex items-center justify-center shrink-0 text-[#0A0A0A]">
                    <MessageSquare className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#6B6B6B] block">WhatsApp Concierge</span>
                    <a
                      href={getWhatsAppUrl(whatsapp, "Hello Aston Auto Stores, I would like to inquire about a vehicle.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-[#0A0A0A] hover:underline"
                    >
                      {whatsapp}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 p-4 rounded-lg bg-[#FAFAFA] border border-[#E8E8E8]">
                  <div className="w-9 h-9 rounded-md bg-white border border-[#E8E8E8] flex items-center justify-center shrink-0 text-[#0A0A0A]">
                    <Mail className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#6B6B6B] block">Email</span>
                    <a
                      href={`mailto:${email}`}
                      className="text-sm font-medium text-[#0A0A0A] hover:underline"
                    >
                      {email}
                    </a>
                  </div>
                </div>

                {/* Showroom Hours */}
                <div className="flex items-start gap-4 p-4 rounded-lg bg-[#FAFAFA] border border-[#E8E8E8]">
                  <div className="w-9 h-9 rounded-md bg-white border border-[#E8E8E8] flex items-center justify-center shrink-0 text-[#0A0A0A]">
                    <Clock className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#6B6B6B] block">Showroom Hours</span>
                    <p className="text-sm text-[#0A0A0A] whitespace-pre-line">
                      {hours}
                    </p>
                  </div>
                </div>

                {/* Address (only rendered if present in site_settings) */}
                {address && (
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-[#FAFAFA] border border-[#E8E8E8]">
                    <div className="w-9 h-9 rounded-md bg-white border border-[#E8E8E8] flex items-center justify-center shrink-0 text-[#0A0A0A]">
                      <MapPin className="w-4 h-4" strokeWidth={1.5} />
                    </div>
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-[#6B6B6B] block">Location</span>
                      <p className="text-sm text-[#0A0A0A] whitespace-pre-line font-mono">
                        {address}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Modern Minimalist Form */}
            <div className="lg:col-span-7 bg-[#FAFAFA] rounded-xl p-6 sm:p-10 border border-[#E8E8E8]">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-white border border-[#E8E8E8] text-[#0A0A0A] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-medium tracking-tight text-[#0A0A0A]">
                    Inquiry Received
                  </h3>
                  <p className="text-sm text-[#6B6B6B] max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="text-[#0A0A0A] font-medium">{formData.name}</span>. An automotive advisor will review your request and respond shortly.
                  </p>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={getWhatsAppUrl(whatsapp, `Hello, my name is ${formData.name}. Inquiry: ${formData.message}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#0A0A0A] text-white font-medium text-xs tracking-wide hover:opacity-90 transition-opacity"
                    >
                      <MessageSquare className="w-3.5 h-3.5" strokeWidth={1.5} />
                      <span>Continue on WhatsApp</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: "", email: "", phone: "", message: "" });
                      }}
                      className="w-full sm:w-auto px-6 py-3 rounded-lg bg-white border border-[#E8E8E8] text-[#0A0A0A] font-medium text-xs tracking-wide hover:bg-[#F0F0F0] transition-colors cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h3 className="text-lg font-medium text-[#0A0A0A] tracking-tight">
                      Send an Inquiry
                    </h3>
                    <p className="text-xs text-[#6B6B6B] mt-1">
                      Fill out the form below and an advisor will get back to you within 24 hours.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-3 bg-white border border-red-200 rounded-lg text-red-600 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-medium text-[#0A0A0A] mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white border border-[#E8E8E8] rounded-lg px-3.5 py-2.5 text-sm text-[#0A0A0A] placeholder:text-[#6B6B6B]/60 focus:outline-none focus:border-[#0A0A0A] transition-colors"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-medium text-[#0A0A0A] mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white border border-[#E8E8E8] rounded-lg px-3.5 py-2.5 text-sm text-[#0A0A0A] placeholder:text-[#6B6B6B]/60 focus:outline-none focus:border-[#0A0A0A] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-medium text-[#0A0A0A] mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white border border-[#E8E8E8] rounded-lg px-3.5 py-2.5 text-sm text-[#0A0A0A] placeholder:text-[#6B6B6B]/60 focus:outline-none focus:border-[#0A0A0A] transition-colors"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-medium text-[#0A0A0A] mb-1.5">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Specify the vehicle of interest, appointment preferences, or delivery requirements..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white border border-[#E8E8E8] rounded-lg px-3.5 py-2.5 text-sm text-[#0A0A0A] placeholder:text-[#6B6B6B]/60 focus:outline-none focus:border-[#0A0A0A] transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 px-6 rounded-lg bg-[#0A0A0A] hover:opacity-90 disabled:opacity-50 text-white font-medium text-xs tracking-wide transition-opacity cursor-pointer"
                    >
                      {submitting ? "Sending..." : "Submit Inquiry"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* ─── 3. FAQS ─── */}
      <section className="py-16 sm:py-20 border-t border-[#E8E8E8]">
        <Container>
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs uppercase tracking-[0.14em] text-[#6B6B6B] block mb-2">
                Frequently Asked
              </span>
              <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#0A0A0A]">
                Common Questions
              </h2>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-[#E8E8E8] bg-white overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(i)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-medium text-sm text-[#0A0A0A] hover:bg-[#FAFAFA] transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#6B6B6B] transition-transform duration-200 shrink-0 ml-4 ${
                        activeFaq === i ? "rotate-180" : ""
                      }`}
                      strokeWidth={1.5}
                    />
                  </button>

                  {activeFaq === i && (
                    <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-[#6B6B6B] leading-relaxed border-t border-[#E8E8E8] pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
