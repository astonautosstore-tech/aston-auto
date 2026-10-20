"use client";

import { useState } from "react";
import Image from "next/image";
import { z } from "zod";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ChevronDown, 
  MessageSquare,
  AlertCircle
} from "lucide-react";
import Container from "@/components/ui/Container";
import { storeApi } from "@/lib/supabase/client";
import { soundEngine } from "@/lib/sound";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().trim().email("Please enter a valid email address"),
  phone: z.string().trim().min(7, "Please enter a valid phone number").max(30, "Phone number is too long"),
  message: z.string().trim().min(5, "Message must be at least 5 characters").max(2000, "Message cannot exceed 2,000 characters"),
});

const FAQS = [
  {
    question: "How does vehicle purchase work at Aston?",
    answer:
      "Our process is transparent and personalized. You browse our verified collection, submit an inquiry or schedule a showroom viewing, inspect the car with our advisory team, agree on terms, and complete direct payment with white-glove enclosed delivery or showroom collection.",
  },
  {
    question: "Do you offer private showroom appointments?",
    answer:
      "Yes. Our Beverly Hills gallery is open for private appointments Monday through Saturday from 9:00 AM to 7:00 PM PST. We ensure one-on-one attention with an executive advisor.",
  },
  {
    question: "Are all vehicles certified with clean titles?",
    answer:
      "Every vehicle undergoes a comprehensive 150-point mechanical, structural, and ECU diagnostic inspection. Full vehicle history reports, title documentation, and provenance dossiers are provided before acquisition.",
  },
  {
    question: "Is nationwide enclosed shipping available?",
    answer:
      "Yes, we provide fully insured, climate-controlled enclosed carrier delivery directly to your driveway anywhere in the contiguous United States.",
  },
];

export default function ContactClient() {
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

      soundEngine.playSuccessChime();
      setSubmitted(true);
    } catch (err: any) {
      console.error("Inquiry submission error:", err);
      setErrorMessage(err?.message || "Failed to submit inquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const whatsappHref = `https://wa.me/14482264666?text=${encodeURIComponent(
    `Hello, my name is ${formData.name}. Inquiry: ${formData.message}`
  )}`;

  return (
    <div className="min-h-screen bg-white text-neutral-900 pt-20 sm:pt-24">
      {/* ─── 1. HERO TITLE SECTION ─── */}
      <section className="relative w-full bg-[#F9FAFB] border-b border-neutral-200 py-12 sm:py-16">
        <Container>
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 block">
              Dealership Concierge &amp; Showroom
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-950 tracking-tight mb-3">
              Contact Our Advisors
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              Whether you are acquiring a vehicle from our curated collection, inquiring about bespoke vehicle delivery, or scheduling a private viewing, our dedicated team is at your service.
            </p>
          </div>
        </Container>
      </section>

      {/* ─── 2. CONTACT FORM & ADVISOR ─── */}
      <section className="py-14 sm:py-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* Left: Advisor / Concierge Photo */}
            <div className="lg:col-span-5 relative rounded-2xl overflow-hidden min-h-[360px] lg:min-h-full border border-neutral-200 bg-neutral-100 shadow-sm">
              <Image
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1400&q=90"
                alt="Aston Client Advisor"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs uppercase font-bold tracking-widest text-neutral-300 block mb-1">
                  Private Client Concierge
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  Julian St. Clair
                </h3>
                <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                  Senior Automotive Advisor &bull; Beverly Hills Showroom
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs font-mono text-neutral-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Available for Consultations</span>
                </div>
              </div>
            </div>

            {/* Right: Modern Simple Form */}
            <div className="lg:col-span-7 bg-[#F9FAFB] rounded-2xl p-6 sm:p-10 border border-neutral-200">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-neutral-950">
                    Inquiry Received
                  </h3>
                  <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="text-neutral-950 font-bold">{formData.name}</span>. A Senior Motoring Advisor will reach out via email or phone within 60 minutes.
                  </p>
                  
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 text-white font-semibold text-xs uppercase tracking-wider hover:bg-emerald-700 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Continue on WhatsApp</span>
                    </a>

                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: "", email: "", phone: "", message: "" });
                      }}
                      className="w-full sm:w-auto px-6 py-3 rounded-lg bg-neutral-950 text-white font-semibold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="text-xl font-bold text-neutral-950">
                    Send an Inquiry
                  </h2>

                  {errorMessage && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Robert Vance"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950 transition-colors"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. robert@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950 transition-colors"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">
                      Vehicle or Inquiry Details <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Specify the vehicle of interest, delivery location, or appointment preferences..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950 transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 px-6 rounded-lg bg-neutral-950 hover:bg-neutral-800 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                    >
                      {submitting ? "Transmitting..." : "Send Showroom Inquiry"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* ─── 3. SHOWROOM LOCATIONS & HOURS ─── */}
      <section className="py-14 sm:py-16 bg-[#F9FAFB] border-y border-neutral-200">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-xl border border-neutral-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-900">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-neutral-950">Showroom Address</h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-mono">
                450 North Rodeo Drive<br />
                Beverly Hills, CA 90210<br />
                United States
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-neutral-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-900">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-neutral-950">Direct Contact</h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-mono">
                Phone: <a href="tel:+14482264666" className="text-neutral-950 font-bold hover:underline">+1 448 226 4666</a><br />
                Email: <a href="mailto:concierge@astonautostores.com" className="text-neutral-950 hover:underline">concierge@astonautostores.com</a><br />
                WhatsApp: +1 448 226 4666
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-neutral-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-900">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-neutral-950">Concierge Hours</h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-mono">
                Monday – Friday: 9:00 AM – 7:00 PM PST<br />
                Saturday: 10:00 AM – 6:00 PM PST<br />
                Sunday: Private Appointments Only
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── 4. ACCORDION FAQS ─── */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 block mb-1">
                Frequently Asked
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
                Common Questions
              </h2>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-neutral-200 overflow-hidden bg-white transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(i)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-sm text-neutral-900 hover:bg-neutral-50 transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-500 transition-transform duration-200 shrink-0 ml-4 ${
                        activeFaq === i ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {activeFaq === i && (
                    <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3">
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
