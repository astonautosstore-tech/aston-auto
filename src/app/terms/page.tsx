import { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";

// TODO: Confirm legal wording and registered dealership entity with client

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Review the terms governing vehicle catalog browsing, inquiry submissions, private viewing appointments, and sales advisory at Aston Auto Stores.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] pt-24 pb-24">
      <Container className="max-w-3xl">
        {/* Header */}
        <div className="pb-10 sm:pb-14 border-b border-[#E8E8E8]">
          <span className="text-xs uppercase tracking-[0.14em] text-[#6B6B6B] block mb-3">
            Policies &amp; Governance
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#0A0A0A]">
            Terms of Service
          </h1>
          <p className="text-xs text-[#6B6B6B] mt-3">
            Last updated: May 2026 &bull; Aston Auto Stores Client Office
          </p>
        </div>

        {/* Content */}
        <div className="space-y-10 text-sm text-[#6B6B6B] leading-relaxed pt-10">
          <p className="text-sm sm:text-base text-[#0A0A0A] leading-relaxed">
            Welcome to Aston Auto Stores. These Terms of Service (&quot;Terms&quot;) govern your access to our inventory catalog, vehicle inquiry channels, private appointments, and advisory communications. By browsing our platform or contacting our team, you agree to these Terms.
          </p>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-medium text-[#0A0A0A] tracking-tight">
              1. Catalog Nature &amp; Acquisition Workflow
            </h2>
            <p>
              Our website serves as an informational automotive showcase and client inquiry portal. There is no automated online shopping cart, retail checkout, or digital payment processing on this website. Our acquisition flow operates as follows:
            </p>
            <ol className="list-decimal pl-5 space-y-1.5 text-[#0A0A0A]">
              <li><strong>Browse Catalog:</strong> Review verified high-resolution photography, detailed mechanical specifications, mileage, and pricing in US Dollars ($ USD).</li>
              <li><strong>Inquire or Book:</strong> Submit an online inquiry form, schedule a test drive, or contact our concierge via telephone or WhatsApp.</li>
              <li><strong>Vehicle Inspection:</strong> Conduct an in-person vehicle examination or request an exhaustive digital walk-through with an automotive specialist.</li>
              <li><strong>Terms Agreement:</strong> Finalize purchase agreements, title transfer paperwork, and delivery logistics directly with dealership management.</li>
              <li><strong>Payment &amp; Handover:</strong> Settle transactions through direct certified dealership banking and collect your vehicle or arrange white-glove enclosed nationwide delivery.</li>
            </ol>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-medium text-[#0A0A0A] tracking-tight">
              2. Vehicle Availability &amp; Pricing
            </h2>
            <p>
              All vehicles displayed are subject to prior sale, availability confirmation, and formal contract execution. Listed prices reflect current North American market valuations in US Dollars ($ USD). While we make every effort to maintain real-time accuracy, Aston Auto Stores reserves the right to correct typographical discrepancies prior to formal agreement execution.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-medium text-[#0A0A0A] tracking-tight">
              3. Certified Inspection &amp; Provenance
            </h2>
            <p>
              Each exotic, supercar, and luxury vehicle in our inventory undergoes a rigorous 150-point diagnostic and physical inspection. Vehicle history reports, service records, and factory documentation are made available for review prior to purchase completion.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-medium text-[#0A0A0A] tracking-tight">
              4. Appointments &amp; Test Drives
            </h2>
            <p>
              Private viewings and test-drive appointments are scheduled through our concierge desk. All test-drive participants must hold a valid driver&apos;s license and coordinate scheduling in advance with our team.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-medium text-[#0A0A0A] tracking-tight">
              5. Intellectual Property
            </h2>
            <p>
              All visual assets, editorial articles, brand imagery, and software interface code are the proprietary intellectual property of Aston Auto Stores or their respective automotive manufacturers. Unauthorized commercial duplication or scraping is strictly prohibited.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-medium text-[#0A0A0A] tracking-tight">
              6. Legal Contacts
            </h2>
            <p>
              For formal legal notices, purchasing compliance, or corporate inquiries, please direct correspondence to:
            </p>
            <div className="p-5 bg-[#FAFAFA] rounded-lg border border-[#E8E8E8] text-xs space-y-1.5 text-[#0A0A0A]">
              <p>Email: <a href="mailto:concierge@astonautostores.com" className="font-medium underline">concierge@astonautostores.com</a></p>
              <p>Telephone: <a href="tel:+14482264666" className="font-medium underline">+1 448 226 4666</a></p>
              <p>Location: United States</p>
            </div>
          </section>

          {/* Bottom Link to Privacy */}
          <div className="pt-8 text-right border-t border-[#E8E8E8]">
            <Link
              href="/privacy"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-medium text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors"
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
