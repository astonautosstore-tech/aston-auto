import { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";

// TODO: Confirm legal wording and registered dealership entity with client

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Aston Auto Stores collects, uses, and safeguards your personal data, client confidentiality, and vehicle inquiry records.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] pt-24 pb-24">
      <Container className="max-w-3xl">
        {/* Header */}
        <div className="pb-10 sm:pb-14 border-b border-[#E8E8E8]">
          <span className="text-xs uppercase tracking-[0.14em] text-[#6B6B6B] block mb-3">
            Legal &amp; Privacy
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#0A0A0A]">
            Privacy Policy
          </h1>
          <p className="text-xs text-[#6B6B6B] mt-3">
            Last updated: May 2026 &bull; Aston Auto Stores Client Office
          </p>
        </div>

        {/* Content */}
        <div className="space-y-10 text-sm text-[#6B6B6B] leading-relaxed pt-10">
          <p className="text-sm sm:text-base text-[#0A0A0A] leading-relaxed">
            At Aston Auto Stores, we respect client discretion and privacy. This Privacy Policy outlines how we handle and protect your personal information when you browse our motorcar inventory, submit vehicle inquiries, schedule private viewing appointments, or communicate with our client advisory team.
          </p>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-medium text-[#0A0A0A] tracking-tight">
              1. Information We Collect
            </h2>
            <p>We collect information necessary to provide tailored automotive concierge and acquisition services:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#0A0A0A]">
              <li>Contact details (full name, email address, telephone number)</li>
              <li>Vehicle interest, appointment preferences, and customized inquiries</li>
              <li>Correspondence history via web forms, direct phone consultations, or verified WhatsApp channels</li>
              <li>Technical usage data (anonymized page views, session duration, and device characteristics)</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-medium text-[#0A0A0A] tracking-tight">
              2. How We Use Your Information
            </h2>
            <p>Your information is utilized strictly to:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#0A0A0A]">
              <li>Respond directly to vehicle inquiries and schedule showroom test-drive appointments</li>
              <li>Coordinate vehicle provenance verification, window sticker documentation, and physical inspections</li>
              <li>Facilitate direct sales consultations, purchase agreement preparation, and nationwide transport logistics</li>
              <li>Ensure digital security, prevent automated form abuse, and maintain site integrity</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-medium text-[#0A0A0A] tracking-tight">
              3. Transparent Acquisition Workflow
            </h2>
            <p>
              Aston Auto Stores does not operate an automated self-checkout, digital wallet, or online retail cart. All acquisition discussions occur directly between you and an authorized motoring advisor. After browsing our inventory, you submit an inquiry or schedule a viewing, inspect the vehicle in person or through a digital walkthrough, agree on terms, and settle transactions via secure certified dealership payment.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-medium text-[#0A0A0A] tracking-tight">
              4. Data Confidentiality &amp; Security
            </h2>
            <p>
              We enforce appropriate technical and administrative safeguards to protect your personal information. We never sell, rent, or trade client contact details to third-party marketing brokers. Any service providers (such as hosting and database infrastructure) operate under strict confidentiality obligations.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-medium text-[#0A0A0A] tracking-tight">
              5. Cookies &amp; Preferences
            </h2>
            <p>
              Our website utilizes essential session cookies and performance telemetry to remember catalog filters and ensure smooth navigation. You may modify or decline non-essential cookies at any time via your browser settings or our on-site cookie manager.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-medium text-[#0A0A0A] tracking-tight">
              6. Your Rights
            </h2>
            <p>You maintain the right at any time to:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#0A0A0A]">
              <li>Request an extract of personal contact records held in our concierge system</li>
              <li>Request correction of outdated contact details</li>
              <li>Request deletion of your inquiry submissions and correspondence history</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg font-medium text-[#0A0A0A] tracking-tight">
              7. Contact Our Privacy Office
            </h2>
            <p>
              For privacy inquiries, data removal requests, or confidentiality queries, please contact our office:
            </p>
            <div className="p-5 bg-[#FAFAFA] rounded-lg border border-[#E8E8E8] text-xs space-y-1.5 text-[#0A0A0A]">
              <p>Email: <a href="mailto:concierge@astonautostores.com" className="font-medium underline">concierge@astonautostores.com</a></p>
              <p>Telephone: <a href="tel:+14482264666" className="font-medium underline">+1 448 226 4666</a></p>
              <p>Location: United States</p>
            </div>
          </section>

          {/* Bottom Link to Terms */}
          <div className="pt-8 text-right border-t border-[#E8E8E8]">
            <Link
              href="/terms"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-medium text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors"
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
