import { ShieldCheck, CircleDollarSign, HeartHandshake } from "lucide-react";
import Container from "@/components/ui/Container";

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Curated Selection",
    desc: "Every vehicle is physically verified, mechanically inspected, and chosen for pristine provenance.",
  },
  {
    icon: CircleDollarSign,
    title: "Transparent Pricing",
    desc: "Fixed market prices without concealed dealership surcharges, dealer prep fees, or fine print.",
  },
  {
    icon: HeartHandshake,
    title: "Honest Service",
    desc: "Direct concierge communication with experienced automotive specialists, not commissioned salespeople.",
  },
];

export default function HomeWhyChooseUs() {
  return (
    <section className="py-20 md:py-28 bg-white border-t border-[#E8E8E8]">
      <Container>
        <div className="max-w-2xl mb-14">
          <span className="text-xs uppercase tracking-[0.14em] text-[#6B6B6B] block mb-3">
            Standards &amp; Principles
          </span>
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-[#0A0A0A]">
            Why Choose Aston Auto
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div key={idx} className="space-y-4">
                <div className="w-10 h-10 rounded-lg border border-[#E8E8E8] bg-[#FAFAFA] flex items-center justify-center text-[#0A0A0A]">
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-medium text-[#0A0A0A]">
                  {pillar.title}
                </h3>
                <p className="text-sm text-[#6B6B6B] leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
