"use client";

import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Compass, CheckCircle2, ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";

// TODO: Confirm official statistics with client
const STATS = [
  { target: "10+", label: "Years of Curation" },
  { target: "500+", label: "Vehicles Delivered" },
  { target: "100%", label: "Clean Title Provenance" },
  { target: "98%", label: "Client Satisfaction" },
];

const PILLARS = [
  {
    icon: ShieldCheck,
    step: "01",
    title: "150-Point Certified Inspection",
    desc: "Every performance and luxury vehicle undergoes paint-depth measurement, engine diagnostics, and title history verification before joining our collection.",
  },
  {
    icon: CheckCircle2,
    step: "02",
    title: "Transparent Fixed Pricing",
    desc: "Zero concealed preparation fees, documentation surcharges, or dealer markups. The asking price is clearly defined from the start.",
  },
  {
    icon: Compass,
    step: "03",
    title: "Nationwide Enclosed Delivery",
    desc: "Direct, insured door-to-door transport in dedicated climate-controlled carriers to residences throughout the United States.",
  },
];

export default function AboutClient() {
  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] pt-28 pb-24">
      {/* ─── Hero Header ─── */}
      <section className="pb-16 border-b border-[#E8E8E8]">
        <Container>
          <div className="max-w-3xl">
            <span className="text-xs uppercase tracking-[0.14em] text-[#6B6B6B] block mb-3">
              About Aston Auto Stores
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-[#0A0A0A] mb-6 [text-wrap:balance]">
              Curating exceptional motorcars. Completely transparent.
            </h1>
            <p className="text-base sm:text-lg text-[#6B6B6B] leading-relaxed">
              Founded on the conviction that acquiring an extraordinary vehicle should be straightforward, dignified, and backed by genuine expertise. We eliminate the friction and ambiguity traditional dealerships have perpetuated for decades.
            </p>
          </div>
        </Container>
      </section>

      {/* ─── Philosophy & Image Split ─── */}
      <section className="py-20 md:py-28 border-b border-[#E8E8E8]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-[0.14em] text-[#6B6B6B] block">
                Our Standards
              </span>
              <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-[#0A0A0A]">
                Every vehicle represents an uncompromising standard.
              </h2>
              <div className="space-y-4 text-sm text-[#6B6B6B] leading-relaxed">
                <p>
                  We do not operate a high-volume car lot. Our showroom inventory is strictly limited to vehicles with documented ownership pedigree, certified service records, and pristine structural condition.
                </p>
                <p>
                  Whether you are purchasing your first sports car or adding to a curated private fleet, our advisors provide comprehensive guidance, title handling, and nationwide delivery arrangements.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/inventory"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#0A0A0A] text-white text-xs font-medium tracking-wide transition-opacity hover:opacity-90"
                >
                  <span>Explore Available Vehicles</span>
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAFAFA] border border-[#E8E8E8]">
                <Image
                  src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1400&q=80"
                  alt="Aston Auto Showroom Curation"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── Pillars ─── */}
      <section className="py-20 md:py-28 bg-[#FAFAFA] border-b border-[#E8E8E8]">
        <Container>
          <div className="max-w-2xl mb-14">
            <span className="text-xs uppercase tracking-[0.14em] text-[#6B6B6B] block mb-3">
              How We Operate
            </span>
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-[#0A0A0A]">
              Three Foundational Guarantees
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PILLARS.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={idx} className="p-8 bg-white rounded-2xl border border-[#E8E8E8] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg border border-[#E8E8E8] bg-[#FAFAFA] flex items-center justify-center text-[#0A0A0A]">
                      <Icon className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <span className="font-mono text-xs text-[#6B6B6B]">{p.step}</span>
                  </div>
                  <h3 className="text-base font-medium text-[#0A0A0A]">{p.title}</h3>
                  <p className="text-sm text-[#6B6B6B] leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ─── Numbers Row ─── */}
      <section className="py-20 md:py-28 bg-white border-b border-[#E8E8E8]">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((s, idx) => (
              <div key={idx}>
                <div className="text-3xl sm:text-4xl md:text-5xl font-medium text-[#0A0A0A] tracking-tight">
                  {s.target}
                </div>
                <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[#6B6B6B]">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── Contact Callout ─── */}
      <section className="py-20 md:py-28 bg-[#FAFAFA]">
        <Container>
          <div className="max-w-2xl mx-auto text-center space-y-5">
            <h2 className="text-3xl font-medium text-[#0A0A0A]">
              Visit or Inquire
            </h2>
            <p className="text-sm text-[#6B6B6B] leading-relaxed">
              Our showroom operates by appointment to provide dedicated, uninterrupted attention to every client.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="px-6 py-3 rounded-lg bg-[#0A0A0A] text-white text-xs font-medium tracking-wide hover:opacity-90 transition-opacity"
              >
                Contact Concierge
              </Link>
              <a
                href="tel:+14482264666"
                className="px-6 py-3 rounded-lg bg-white border border-[#E8E8E8] text-[#0A0A0A] text-xs font-medium hover:bg-[#FAFAFA] transition-colors"
              >
                +1 448 226 4666
              </a>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
