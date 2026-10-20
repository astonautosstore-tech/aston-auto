import { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Terms of Service | Aston Auto Stores",
  description:
    "Review the terms and conditions governing vehicle acquisition, showroom reservations, escrow deposits, and bespoke automotive concierge services at Aston Auto.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#E10600] selection:text-white pt-28 sm:pt-36 pb-24">
      <Container className="max-w-3xl">
        {/* Header */}
        <div className="text-center pb-12 sm:pb-16">
          <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white leading-tight">
            Terms &amp; Conditions
          </h1>
          <p className="text-xs text-[#8A8A8A] font-mono mt-3">
            Last updated: May 6, 2026
          </p>
        </div>

        {/* Content */}
        <div className="space-y-10 text-xs sm:text-sm text-[#A0A0A0] leading-relaxed">
          <p>
            Welcome to Aston Auto. These Terms of Service (&quot;Terms&quot;) govern your access to and use of our digital platforms, inventory catalog, private viewing reservations, and automotive brokerage transactions. By accessing our website or engaging our concierge, you agree to comply with and be bound by these Terms.
          </p>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-tight">
              1. Vehicle Acquisition &amp; Reservations
            </h2>
            <p>
              All vehicles displayed in our digital catalog are subject to prior sale, availability verification, and formal contract execution. A formal reservation hold or allocation deposit is required to secure exclusivity for any exotic or limited-production vehicle during appraisal and customs verification.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-tight">
              2. Pricing, Currencies &amp; Payment Verification
            </h2>
            <p>
              Listed prices reflect current market valuations and may be displayed in United States Dollars ($ USD) or Nigerian Naira (₦ NGN). While we strive for absolute accuracy, Aston Auto reserves the right to correct typographical or system pricing discrepancies prior to contract finalization. All transactions undergo strict Know-Your-Customer (KYC) and Anti-Money Laundering (AML) compliance checks.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-tight">
              3. Vehicle Condition &amp; 150-Point Inspection
            </h2>
            <p>
              Every certified vehicle in our collection undergoes a comprehensive 150-point mechanical, structural, and electrical inspection by master technicians. Complete provenance dossiers, battery health certifications (for electrified vehicles), and chassis verification reports are provided to the buyer prior to transfer of title.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-tight">
              4. Private Viewings &amp; Test Drives
            </h2>
            <p>
              Test drives are conducted strictly by appointment and require validation of a valid national or international driving license, comprehensive insurance verification, and mutual scheduling confirmation with our executive concierge desk.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-tight">
              5. Delivery &amp; Handover Protocol
            </h2>
            <p>
              White-glove nationwide enclosed transport is available across West Africa, North America, and the United Kingdom. Ownership and risk of loss transfer upon formal client inspection and execution of the digital Delivery Handover Protocol.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-tight">
              6. Intellectual Property
            </h2>
            <p>
              All trademarks, vehicle photographic assets, editorial journals, interface designs, and code displayed on this platform are the exclusive intellectual property of Aston Auto or licensed from their respective automotive manufacturers. Unauthorized reproduction or scraping is strictly prohibited.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-tight">
              7. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by applicable law, Aston Auto and its affiliates shall not be liable for indirect, incidental, or consequential damages resulting from digital platform interruptions or reliance on unverified third-party automotive data.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-tight">
              8. Contact &amp; Legal Notices
            </h2>
            <p>
              For legal notices, contract inquiries, or corporate governance matters, please contact:
            </p>
            <div className="pt-2 text-xs font-mono space-y-1.5 text-white/90">
              <p>Email: <a href="mailto:legal@astonautostores.com" className="text-white underline hover:text-[#E10600]">legal@astonautostores.com</a></p>
              <p>Phone: +234 (0) 812 345 6789 / +1 (949) 555-0199</p>
              <p>Corporate Office: 14 Alexander Avenue, Ikoyi, Lagos, Nigeria</p>
            </div>
          </section>

          {/* Bottom Link to Privacy */}
          <div className="pt-8 text-right border-t border-white/10">
            <Link
              href="/privacy"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-mono text-[#8A8A8A] hover:text-white transition-colors"
            >
              <span>Privacy Policy</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
