"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle2, ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import { soundEngine } from "@/lib/sound";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "What is your vehicle return policy?",
    answer:
      "We offer a 7-day or 500-km satisfaction guarantee on all certified pre-owned and bespoke vehicles. If you are not completely satisfied, our concierge team will facilitate an exchange or white-glove refund subject to inspection.",
  },
  {
    question: "Do you provide in-house financing?",
    answer:
      "Yes. We collaborate with premier private banking institutions and luxury asset finance providers to deliver confidential, highly competitive financing packages and structured leases tailored to your portfolio.",
  },
  {
    question: "How do I schedule a test drive?",
    answer:
      "You can reserve an appointment directly through our online form above, via WhatsApp, or through our dedicated VIP concierge desk. We can prepare the vehicle at our flagship showroom or deliver it to your residence in an enclosed transport.",
  },
  {
    question: "Are maintenance services included?",
    answer:
      "All acquisitions include our signature Aston Care warranty and scheduled service intervals performed by master-certified technicians utilizing genuine manufacturer components and diagnostic protocols.",
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
    soundEngine.playSuccessChime();
    setSubmitted(true);
  };

  const toggleFaq = (index: number) => {
    soundEngine.playHoverTick();
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#E10600] selection:text-white pt-24 sm:pt-28 md:pt-32">
      
      {/* ─── 1. HERO TITLE SECTION ─── */}
      <section className="relative w-full overflow-hidden pb-12 sm:pb-16 text-center">
        {/* Ambient Showroom Glow Background */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=2400&q=90"
            alt="Aston Auto Supercar Showroom"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/70 to-[#050505]" />
        </div>

        <Container className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight uppercase"
            style={{
              background: "linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.7) 60%, rgba(255,255,255,0.2) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Get In Touch
          </motion.h1>
        </Container>
      </section>

      {/* ─── 2. CONTACT FORM & EXECUTIVE ADVISOR ─── */}
      <section className="pb-24 sm:pb-32">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            
            {/* Left: Advisor / Concierge Photo */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 relative rounded-2xl sm:rounded-3xl overflow-hidden min-h-[380px] sm:min-h-[460px] lg:min-h-full border border-white/10 bg-[#0D0D0D]"
            >
              <Image
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1400&q=90"
                alt="Aston Auto Client Advisor"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-transparent pointer-events-none" />
            </motion.div>

            {/* Right: Dark Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 flex flex-col justify-center"
            >
              {submitted ? (
                <div className="p-8 sm:p-12 rounded-2xl bg-[#0D0D0D] border border-white/10 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#E10600]/10 text-[#E10600] flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="font-display font-bold text-2xl uppercase tracking-tight text-white">
                    Inquiry Received
                  </h3>
                  <p className="text-sm text-[#8A8A8A] max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="text-white font-medium">{formData.name}</span>. A Senior Motoring Advisor will reach out via email or phone within 60 minutes.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", phone: "", message: "" });
                    }}
                    className="mt-4 px-6 py-3 rounded-lg bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-medium text-[#A0A0A0] mb-2">
                      Name <span className="text-[#E10600]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="John Smith"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#0D0D0D] border border-white/10 rounded-lg px-4 py-3.5 text-sm text-white placeholder-[#555] focus:outline-none focus:border-white/40 transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-[#A0A0A0] mb-2">
                      Email <span className="text-[#E10600]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="john@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#0D0D0D] border border-white/10 rounded-lg px-4 py-3.5 text-sm text-white placeholder-[#555] focus:outline-none focus:border-white/40 transition-colors"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-medium text-[#A0A0A0] mb-2">
                      Phone <span className="text-[#E10600]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#0D0D0D] border border-white/10 rounded-lg px-4 py-3.5 text-sm text-white placeholder-[#555] focus:outline-none focus:border-white/40 transition-colors"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-medium text-[#A0A0A0] mb-2">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      placeholder="How can we assist you today?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#0D0D0D] border border-white/10 rounded-lg px-4 py-3.5 text-sm text-white placeholder-[#555] focus:outline-none focus:border-white/40 transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-4 rounded-lg bg-white text-black font-bold text-xs uppercase tracking-[0.2em] hover:bg-neutral-200 active:scale-[0.99] transition-all duration-200 cursor-pointer shadow-lg"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ─── 3. HEADQUARTERS & GOOGLE MAP SECTION ─── */}
      <section className="pb-24 sm:pb-32 border-t border-white/10 pt-20 sm:pt-28">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: HQ Info */}
            <div className="lg:col-span-6 space-y-8">
              <div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl uppercase tracking-tight text-white mb-3">
                  Aston Auto HQ
                </h2>
                <p className="text-sm text-[#8A8A8A] leading-relaxed max-w-lg">
                  Our flagship showroom offers an immersive space where performance meets uncompromised luxury.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
                {/* Visit Us */}
                <div className="space-y-2">
                  <span className="font-mono uppercase tracking-[0.2em] font-semibold text-[#8A8A8A] block">
                    Visit Us
                  </span>
                  <p className="text-white/90 leading-relaxed">
                    1000 Automotive Way Suite<br />
                    Irvine, CA 92618
                  </p>
                </div>

                {/* Direct Contact */}
                <div className="space-y-2">
                  <span className="font-mono uppercase tracking-[0.2em] font-semibold text-[#8A8A8A] block">
                    Direct Contact
                  </span>
                  <p className="text-white/90 leading-relaxed font-mono">
                    +1 (949) 555-0199<br />
                    <span className="font-sans text-neutral-300">hello@astonautogroup.com</span>
                  </p>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="space-y-3 pt-2">
                <span className="font-mono uppercase tracking-[0.2em] font-semibold text-[#8A8A8A] block text-xs">
                  Opening Hours
                </span>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between max-w-sm py-1 border-b border-white/5">
                    <span className="text-neutral-400">Monday - Friday</span>
                    <span className="font-mono text-white">09:00 AM - 08:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between max-w-sm py-1 border-b border-white/5">
                    <span className="text-neutral-400">Saturday</span>
                    <span className="font-mono text-white">10:00 AM - 05:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between max-w-sm py-1 border-b border-white/5">
                    <span className="text-neutral-400">Sunday</span>
                    <span className="font-mono text-[#E10600]">Closed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Map Embed Card */}
            <div className="lg:col-span-6 w-full h-[360px] sm:h-[420px] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-[#0D0D0D] relative shadow-2xl">
              <iframe
                title="Aston Auto HQ Showroom Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106198.54148455113!2d-117.84273295!3d33.6845673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80dcdd0e68914073%3A0xa77ab575604b9a39!2sIrvine%2C%20CA!5e0!3m2!1sen!2sus!4v1710000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter: "grayscale(100%) invert(92%) contrast(85%)",
                }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>

          </div>
        </Container>
      </section>

      {/* ─── 4. FREQUENTLY ASKED QUESTIONS (FAQ) ─── */}
      <section className="pb-28 sm:pb-36 border-t border-white/10 pt-20 sm:pt-28">
        <Container className="max-w-4xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white leading-tight">
              Frequently Asked <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#8A8A8A]">
                Questions
              </span>
            </h2>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-white/10 bg-[#0D0D0D] overflow-hidden transition-colors hover:border-white/20"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left transition-colors focus:outline-none"
                  >
                    <span className="text-sm sm:text-base font-semibold text-white/95 pr-4">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="shrink-0 text-[#8A8A8A]"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-[#8A8A8A] leading-relaxed border-t border-white/5 pt-4">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ─── 5. READY TO FIND YOUR PERFECT CAR? BANNER ─── */}
      <section className="relative w-full overflow-hidden bg-[#070707] py-24 sm:py-32 border-t border-white/10">
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=2400&q=90"
            alt="Aston Auto Red Supercar"
            fill
            className="object-cover object-center opacity-65"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/90" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#050505]/40 to-[#050505]/90" />
        </div>

        <Container className="relative z-10 text-center max-w-2xl mx-auto space-y-6">
          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white leading-tight">
            Ready to Find Your <br />
            Perfect Car?
          </h2>

          <p className="text-xs sm:text-sm text-[#A0A0A0] leading-relaxed max-w-lg mx-auto">
            Premium vehicles curated with precision. Speak with a dedicated advisor today or explore our live showroom inventory online.
          </p>

          <div className="pt-2">
            <Link
              href="/inventory"
              onClick={() => soundEngine.playEngineRev()}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-md bg-[#E10600] text-white font-bold text-xs uppercase tracking-[0.2em] shadow-lg shadow-[#E10600]/30 hover:bg-[#FF1F14] hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <span>Browse Cars</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Container>
      </section>

      {/* End of Contact page content - global Footer in layout handles the footer */}
    </div>
  );
}
