"use client";

import { useEffect, useState } from "react";
import { Phone, MessageSquare, Mail } from "lucide-react";
import Container from "@/components/ui/Container";
import { SiteSettings } from "@/types/database";
import { storeApi } from "@/lib/supabase/client";
import { getWhatsAppUrl, getTelUrl } from "@/lib/utils";

export default function HomeContactCta() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    storeApi.getSiteSettings().then((data) => {
      if (data) setSettings(data);
    });
  }, []);

  const phone = settings?.phone || "+1 448 226 4666";
  const whatsapp = settings?.whatsapp || phone;
  const email = settings?.email || "concierge@astonautostores.com";

  return (
    <section className="py-24 md:py-36 bg-[#FAFAFA] border-t border-[#E8E8E8]">
      <Container>
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <span className="text-xs uppercase tracking-[0.14em] text-[#6B6B6B] block">
            Direct Concierge
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#0A0A0A]">
            Questions? Talk to us.
          </h2>
          <p className="text-sm sm:text-base text-[#6B6B6B] leading-relaxed max-w-lg mx-auto">
            Whether you require acquisition counsel, vehicle history verification, or enclosed shipping logistics, our private client team is available.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3.5">
            {/* Phone Button */}
            <a
              href={getTelUrl(phone)}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#0A0A0A] text-white text-xs font-medium tracking-wide transition-opacity hover:opacity-90"
            >
              <Phone className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>{phone}</span>
            </a>

            {/* WhatsApp Button */}
            <a
              href={getWhatsAppUrl(whatsapp, "Hello Aston Auto Stores, I would like to speak with a concierge.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-white border border-[#E8E8E8] text-[#0A0A0A] text-xs font-medium tracking-wide transition-colors hover:border-[#0A0A0A] hover:bg-[#FAFAFA]"
            >
              <MessageSquare className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>WhatsApp</span>
            </a>

            {/* Email Link */}
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-white border border-[#E8E8E8] text-[#0A0A0A] text-xs font-medium tracking-wide transition-colors hover:border-[#0A0A0A] hover:bg-[#FAFAFA]"
            >
              <Mail className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>{email}</span>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
