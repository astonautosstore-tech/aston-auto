import { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Privacy Policy | Aston Auto Stores",
  description:
    "Learn how Aston Auto Stores collects, uses, and safeguards your personal data, client confidentiality, and vehicle inquiry records.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#E10600] selection:text-white pt-28 sm:pt-36 pb-24">
      <Container className="max-w-3xl">
        {/* Header */}
        <div className="text-center pb-12 sm:pb-16">
          <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white leading-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-[#8A8A8A] font-mono mt-3">
            Last updated: May 6, 2026
          </p>
        </div>

        {/* Intro */}
        <div className="space-y-10 text-xs sm:text-sm text-[#A0A0A0] leading-relaxed">
          <p>
            At Aston Auto, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you interact with our website, browse our curated collection, and request private viewing consultations.
          </p>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-tight">
              1. Information We Collect
            </h2>
            <p>We may collect the following types of information:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-white/80">
              <li>Personal details (name, email, phone number, physical address)</li>
              <li>Vehicle preferences and bespoke acquisition inquiry details</li>
              <li>Usage data (pages visited, interactions, device identifier, IP address)</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-tight">
              2. How We Use Your Information
            </h2>
            <p>We use your data to:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-white/80">
              <li>Respond to inquiries, VIP consultations, and test drive reservations</li>
              <li>Improve our website experience, inventory matching, and security</li>
              <li>Personalize tailored supercar recommendations</li>
              <li>Communicate confidential collection updates or offers (only if opted in)</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-tight">
              3. Data Protection
            </h2>
            <p>
              We implement industry-standard encryption and strict technical security measures to protect your personal and financial data from unauthorized access, misuse, alteration, or disclosure. Client dossiers are handled under strict confidentiality protocols.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-tight">
              4. Third-Party Services
            </h2>
            <p>
              We may use trusted third-party service providers (analytics suites, encrypted CRM platforms, secure payment gateways such as Paystack and Stripe) that process data strictly in accordance with their respective privacy and regulatory standards.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-tight">
              5. Cookies
            </h2>
            <p>
              Our website uses cookies and similar storage technologies to enhance user navigation, retain preference states, and track anonymous performance metrics. You can accept, decline, or manage cookies at any time through our on-site cookie manager or your browser settings.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-tight">
              6. Your Rights
            </h2>
            <p>You have the legal right to:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-white/80">
              <li>Access and receive a copy of your personal data</li>
              <li>Request corrections or updates to inaccurate records</li>
              <li>Request permanent deletion of your inquiry history</li>
              <li>Withdraw marketing consent at any time without penalty</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-tight">
              7. Updates
            </h2>
            <p>
              We may update this policy periodically to reflect evolving legal regulations and technological enhancements. Continued use of our website implies acknowledgment and acceptance of any published revisions.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-tight">
              8. Contact Information
            </h2>
            <p>
              If you have any questions or concerns regarding this Privacy Policy or your personal data, please contact our Data Protection Concierge:
            </p>
            <div className="pt-2 text-xs font-mono space-y-1.5 text-white/90">
              <p>Email: <a href="mailto:concierge@astonautostores.com" className="text-white underline hover:text-[#E10600]">concierge@astonautostores.com</a></p>
              <p>Phone: +234 (0) 812 345 6789 / +1 (949) 555-0199</p>
              <p>Address: 14 Alexander Avenue, Ikoyi, Lagos &bull; 1000 Automotive Way, Irvine, CA</p>
            </div>
          </section>

          {/* Bottom Link to Terms */}
          <div className="pt-8 text-right border-t border-white/10">
            <Link
              href="/terms"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-mono text-[#8A8A8A] hover:text-white transition-colors"
            >
              <span>Terms &amp; Conditions</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
