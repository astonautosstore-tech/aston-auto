import { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Terms of Service | Aston",
  description:
    "Review the terms governing vehicle catalog browsing, inquiry submissions, private viewing appointments, and sales advisory at Aston.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 pt-24 sm:pt-32 pb-24">
      <Container className="max-w-3xl">
        {/* Header */}
        <div className="text-center pb-10 sm:pb-14 border-b border-neutral-200">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 font-bold block mb-2">
            Showroom Policies &amp; Terms
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-neutral-950 leading-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-3">
            Last updated: May 2026 &bull; Aston Executive Office
          </p>
        </div>

        {/* Content */}
        <div className="space-y-10 text-xs sm:text-sm text-neutral-700 leading-relaxed pt-10">
          <p className="text-sm sm:text-base text-neutral-800 leading-relaxed">
            Welcome to Aston. These Terms of Service (&quot;Terms&quot;) govern your access to our digital catalog, vehicle inquiry channels, private showroom appointments, and sales communications. By accessing our platform or contacting our advisory desk, you agree to these Terms.
          </p>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg sm:text-xl text-neutral-950 uppercase tracking-tight">
              1. Catalog Nature &amp; Acquisition Workflow
            </h2>
            <p>
              Our website serves as an informational automotive showcase and client inquiry portal. There is no automated online shopping cart, retail checkout, or digital payment processing on this website. Our acquisition flow operates as follows:
            </p>
            <ol className="list-decimal pl-5 space-y-1.5 text-neutral-800">
              <li><strong>Browse Catalog:</strong> Review verified high-resolution photography, detailed mechanical specifications, mileage, and market pricing in US Dollars ($ USD).</li>
              <li><strong>Inquire or Book:</strong> Submit an online inquiry form, schedule a showroom test drive, or contact our concierge via direct telephone or verified WhatsApp.</li>
              <li><strong>Vehicle Inspection:</strong> Conduct an in-person vehicle examination at our Beverly Hills salon or request an exhaustive digital walk-through with a certified brand specialist.</li>
              <li><strong>Terms Agreement:</strong> Finalize purchase agreements, title transfer paperwork, and delivery logistics directly with dealership management.</li>
              <li><strong>Payment &amp; Handover:</strong> Settle transactions through direct certified dealership banking and collect your vehicle or arrange white-glove enclosed nationwide delivery.</li>
            </ol>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg sm:text-xl text-neutral-950 uppercase tracking-tight">
              2. Vehicle Availability &amp; Pricing
            </h2>
            <p>
              All vehicles displayed are subject to prior sale, availability confirmation, and formal purchase contract execution. Listed prices reflect current North American market valuations in US Dollars ($ USD). While we make every effort to maintain real-time accuracy, Aston reserves the right to correct typographical discrepancies prior to formal agreement execution.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg sm:text-xl text-neutral-950 uppercase tracking-tight">
              3. Certified Inspection &amp; Provenance
            </h2>
            <p>
              Each exotic, supercar, and luxury vehicle in our inventory undergoes a rigorous multipoint diagnostic and physical inspection. Vehicle history reports, service records, and factory documentation are made available for review prior to purchase completion.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg sm:text-xl text-neutral-950 uppercase tracking-tight">
              4. Showroom Appointments &amp; Test Drives
            </h2>
            <p>
              Private showroom viewings and test-drive appointments are scheduled through our concierge desk. All test-drive participants must hold a valid driver&apos;s license and coordinate scheduling in advance with our dealership team.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg sm:text-xl text-neutral-950 uppercase tracking-tight">
              5. Intellectual Property
            </h2>
            <p>
              All visual assets, editorial articles, brand imagery, and software interface code are the proprietary intellectual property of Aston or their respective automotive manufacturers. Unauthorized commercial duplication or scraping is strictly prohibited.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg sm:text-xl text-neutral-950 uppercase tracking-tight">
              6. Dealership Legal Contacts
            </h2>
            <p>
              For formal legal notices, purchasing compliance, or corporate inquiries, please direct correspondence to:
            </p>
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-mono space-y-1.5 text-neutral-800">
              <p>Email: <a href="mailto:concierge@astonautostores.com" className="font-bold underline hover:text-neutral-950">concierge@astonautostores.com</a></p>
              <p>Direct Phone: <a href="tel:+14482264666" className="font-bold underline hover:text-neutral-950">+1 448 226 4666</a></p>
              <p>Showroom Address: 450 North Rodeo Drive, Beverly Hills, CA 90210, United States</p>
            </div>
          </section>

          {/* Bottom Link to Privacy */}
          <div className="pt-8 text-right border-t border-neutral-200">
            <Link
              href="/privacy"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-mono font-bold text-neutral-600 hover:text-neutral-950 transition-colors"
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
