import { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Privacy Policy | Aston",
  description:
    "Learn how Aston collects, uses, and safeguards your personal data, client confidentiality, and vehicle inquiry records.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 pt-24 sm:pt-32 pb-24">
      <Container className="max-w-3xl">
        {/* Header */}
        <div className="text-center pb-10 sm:pb-14 border-b border-neutral-200">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 font-bold block mb-2">
            Legal &amp; Client Confidentiality
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-neutral-950 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-3">
            Last updated: May 2026 &bull; Aston Concierge Desk
          </p>
        </div>

        {/* Content */}
        <div className="space-y-10 text-xs sm:text-sm text-neutral-700 leading-relaxed pt-10">
          <p className="text-sm sm:text-base text-neutral-800 leading-relaxed">
            At Aston, we hold client discretion and privacy to the highest standard. This Privacy Policy details how we handle and protect your personal information when you browse our digital showroom, submit vehicle inquiries, book private viewing consultations, or communicate with our Beverly Hills sales advisory team.
          </p>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg sm:text-xl text-neutral-950 uppercase tracking-tight">
              1. Information We Collect
            </h2>
            <p>We collect only the information necessary to provide tailored automotive concierge services:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-800">
              <li>Contact details (name, email address, direct phone number)</li>
              <li>Vehicle interest, appointment preferences, and customized inquiries</li>
              <li>Communication history via web forms, direct phone consultation, or official WhatsApp channels</li>
              <li>Technical usage data (anonymized page views, session duration, and device characteristics)</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg sm:text-xl text-neutral-950 uppercase tracking-tight">
              2. How We Use Your Information
            </h2>
            <p>Your details are utilized strictly to:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-800">
              <li>Respond directly to vehicle inquiries and schedule showroom test-drive appointments</li>
              <li>Coordinate vehicle provenance verification, window sticker documentation, and physical inspections</li>
              <li>Facilitate direct sales consultation, purchase agreement preparation, and white-glove transport logistics</li>
              <li>Ensure digital security, prevent automated form abuse, and maintain site integrity</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg sm:text-xl text-neutral-950 uppercase tracking-tight">
              3. Transparent Acquisition Workflow
            </h2>
            <p>
              Aston does not operate an automated self-checkout, digital wallet, or online retail cart. All acquisition discussions occur directly between you and an executive client advisor. After browsing our catalog, you simply submit an inquiry or book a showroom visit, inspect the vehicle in person or through high-definition live video walkthrough, agree on terms with our management, and settle transactions via secure certified dealership payment.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg sm:text-xl text-neutral-950 uppercase tracking-tight">
              4. Data Confidentiality &amp; Security
            </h2>
            <p>
              We enforce strict technical, physical, and administrative safeguards to protect your personal information. We never sell, rent, or trade client dossiers to third-party marketing brokers. Any trusted service providers (such as hosting and database infrastructure) operate under stringent data confidentiality obligations.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg sm:text-xl text-neutral-950 uppercase tracking-tight">
              5. Cookies &amp; Tracking Preferences
            </h2>
            <p>
              Our website utilizes essential session cookies and performance telemetry to remember your preferred catalog filters and ensure smooth navigation. You may modify or decline non-essential cookies at any time via your browser settings or our on-site cookie manager.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg sm:text-xl text-neutral-950 uppercase tracking-tight">
              6. Your Privacy Rights
            </h2>
            <p>You maintain the right at any time to:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-800">
              <li>Request an extract of your personal contact records held in our concierge system</li>
              <li>Request immediate correction of outdated contact details</li>
              <li>Request complete deletion of your inquiry submissions and correspondence history</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg sm:text-xl text-neutral-950 uppercase tracking-tight">
              7. Contact Our Privacy Concierge
            </h2>
            <p>
              For privacy inquiries, data removal requests, or confidentiality queries, please contact our executive office:
            </p>
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-mono space-y-1.5 text-neutral-800">
              <p>Email: <a href="mailto:concierge@astonautostores.com" className="font-bold underline hover:text-neutral-950">concierge@astonautostores.com</a></p>
              <p>Direct Phone: <a href="tel:+14482264666" className="font-bold underline hover:text-neutral-950">+1 448 226 4666</a></p>
              <p>Showroom: 450 North Rodeo Drive, Beverly Hills, CA 90210, United States</p>
            </div>
          </section>

          {/* Bottom Link to Terms */}
          <div className="pt-8 text-right border-t border-neutral-200">
            <Link
              href="/terms"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-mono font-bold text-neutral-600 hover:text-neutral-950 transition-colors"
            >
              <span>Terms of Service</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
