"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, CheckCircle2, Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "What is your vehicle return and guarantee policy?",
    answer:
      "We offer a 7-day satisfaction guarantee on all certified pre-owned and exotic vehicles. If you are not completely satisfied, our concierge team will facilitate an exchange or white-glove refund subject to inspection.",
  },
  {
    question: "Do you provide financing and leasing options?",
    answer:
      "Yes. We collaborate with premier US automotive financial institutions to deliver competitive financing packages and structured leases tailored to your portfolio.",
  },
  {
    question: "How do I schedule a test drive or showroom visit?",
    answer:
      "You can reserve an appointment directly through our online form, via phone at +1 448 226 4666, or through WhatsApp. We can prepare the vehicle at our Beverly Hills showroom or deliver it to your residence in an enclosed transport.",
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
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 pt-20 sm:pt-24">
      {/* ─── 1. HERO TITLE SECTION ─── */}
      <section className="relative w-full bg-[#F9FAFB] border-b border-neutral-200 py-12 sm:py-16">
        <Container>
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 block">
              Dealership Concierge & Showroom
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
                <p className="text-lg font-bold">
                  Bespoke Acquisition & Sales
                </p>
                <p className="text-xs text-neutral-300 mt-1">
                  Direct Line: +1 448 226 4666
                </p>
              </div>
            </div>

            {/* Right: Clean Light Form */}
            <div className="lg:col-span-7 flex flex-col justify-center bg-[#F9FAFB] p-6 sm:p-10 rounded-2xl border border-neutral-200 shadow-sm">
              {submitted ? (
                <div className="p-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="font-extrabold text-2xl tracking-tight text-neutral-950">
                    Inquiry Received
                  </h3>
                  <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="text-neutral-950 font-bold">{formData.name}</span>. A Senior Motoring Advisor will reach out via email or phone within 60 minutes.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", phone: "", message: "" });
                    }}
                    className="mt-4 px-6 py-3 rounded-lg bg-neutral-950 text-white font-semibold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="text-xl font-bold text-neutral-950">
                    Send an Inquiry
                  </h2>

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
                      Vehicle or Inquiry Details
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Specify the vehicle of interest, trade-in details, or appointment preferences..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950 transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-lg bg-neutral-950 text-white font-bold text-xs uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-sm"
                    >
                      Submit Inquiry
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* ─── 3. HEADQUARTERS & CONTACT INFO ─── */}
      <section className="py-14 sm:py-20 border-t border-neutral-200 bg-[#F9FAFB]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Showroom Details */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 block mb-1">
                  Flagship Showroom
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
                  Beverly Hills Gallery
                </h2>
                <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
                  Our premier gallery features a private consultation lounge, delivery bay, and dedicated vehicle display floor.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                {/* Address */}
                <div className="p-4 bg-white rounded-xl border border-neutral-200">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    <MapPin className="w-4 h-4 text-neutral-800" />
                    <span>Location</span>
                  </div>
                  <p className="text-sm font-semibold text-neutral-900">
                    450 North Rodeo Drive<br />
                    Beverly Hills, CA 90210
                  </p>
                </div>

                {/* Direct Phone */}
                <div className="p-4 bg-white rounded-xl border border-neutral-200">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    <Phone className="w-4 h-4 text-neutral-800" />
                    <span>Direct Phone</span>
                  </div>
                  <a
                    href="tel:+14482264666"
                    className="text-sm font-bold text-neutral-900 hover:text-neutral-600 transition-colors"
                  >
                    +1 448 226 4666
                  </a>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    concierge@astonautostores.com
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="p-5 bg-white rounded-xl border border-neutral-200">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
                  <Clock className="w-4 h-4 text-neutral-800" />
                  <span>Showroom Hours (PST)</span>
                </div>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between border-b border-neutral-100 pb-1.5">
                    <span className="text-neutral-600">Monday - Friday</span>
                    <span className="font-semibold text-neutral-950">9:00 AM - 7:00 PM</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-100 pb-1.5">
                    <span className="text-neutral-600">Saturday</span>
                    <span className="font-semibold text-neutral-950">10:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Sunday</span>
                    <span className="font-semibold text-neutral-500">By Private Appointment</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Map / Image preview */}
            <div className="lg:col-span-6 w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-100 relative shadow-sm">
              <iframe
                title="Beverly Hills Showroom Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3304.7738245595697!2d-118.40567792348574!3d34.06883291652431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bc04d6d14777%3A0x6b77c5950e417935!2sRodeo%20Dr%2C%20Beverly%20Hills%2C%20CA!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* ─── 4. FAQ ─── */}
      <section className="py-14 sm:py-20 bg-white">
        <Container className="max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Common inquiries regarding acquisitions, vehicle transport, and financing.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                  >
                    <span className="text-sm sm:text-base font-bold text-neutral-900 pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-500 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Container>
      </section>
    </div>
  );
}
