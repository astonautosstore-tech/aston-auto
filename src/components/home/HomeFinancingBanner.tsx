import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";
import Container from "@/components/ui/Container";

export default function HomeFinancingBanner() {
  return (
    <section className="py-16 md:py-24 bg-white border-t border-[#E8E8E8]">
      <Container>
        <div className="p-8 sm:p-12 md:p-16 rounded-2xl border border-[#E8E8E8] bg-[#FAFAFA] flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl space-y-3">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#6B6B6B]">
              <Calculator className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Automotive Financing</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#0A0A0A]">
              Tailored Acquisition Financing
            </h3>
            <p className="text-sm text-[#6B6B6B] leading-relaxed">
              Estimate monthly payments, custom down payment percentages, and competitive loan tenures directly on each vehicle listing.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/inventory"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#0A0A0A] text-white text-xs font-medium tracking-wide transition-opacity hover:opacity-90"
            >
              <span>Explore Vehicles &amp; Rates</span>
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
