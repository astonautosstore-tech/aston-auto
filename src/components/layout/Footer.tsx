"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SiteSettings } from "@/types/database";
import { storeApi } from "@/lib/supabase/client";
import { getWhatsAppUrl, getTelUrl } from "@/lib/utils";

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    let mounted = true;
    storeApi.getSiteSettings().then((data) => {
      if (mounted && data) setSettings(data);
    });

    const handleUpdate = () => {
      storeApi.getSiteSettings().then((data) => {
        if (mounted && data) setSettings(data);
      });
    };

    window.addEventListener("aston_settings_updated", handleUpdate);
    return () => {
      mounted = false;
      window.removeEventListener("aston_settings_updated", handleUpdate);
    };
  }, []);

  const phone = settings?.phone || "+1 448 226 4666";
  const email = settings?.email || "concierge@astonautostores.com";
  const whatsapp = settings?.whatsapp || phone;
  const hours = settings?.showroom_hours || "";
  // TODO: Confirm official US dealership street address with client
  const address = settings?.address?.trim() || "";

  const socialLinks = settings?.social_links || {};
  const activeSocials = Object.entries(socialLinks).filter(
    ([, url]) => typeof url === "string" && url.trim().length > 0
  );

  return (
    <footer className="w-full bg-white border-t border-[#E8E8E8] text-[#0A0A0A]">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-16 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10">
          {/* Column 1: Brand & Short Text */}
          <div className="space-y-4">
            <Link href="/" className="inline-block" aria-label="Aston Auto Stores">
              <Image
                src="/logo.png"
                alt="Aston Auto Stores"
                width={140}
                height={38}
                className="h-7 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-[#6B6B6B] leading-relaxed max-w-xs">
              {settings?.tagline ||
                "Curated performance and luxury motorcars. Transparent acquiring experience across North America."}
            </p>
            {activeSocials.length > 0 && (
              <div className="flex items-center gap-4 pt-2">
                {activeSocials.map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs uppercase tracking-wider text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors"
                  >
                    {platform}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Column 2: Pages */}
          <div className="space-y-4">
            <h4 className="text-xs font-medium uppercase tracking-[0.1em] text-[#0A0A0A]">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-[#6B6B6B]">
              <li>
                <Link href="/inventory" className="hover:text-[#0A0A0A] transition-colors">
                  Inventory
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#0A0A0A] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#0A0A0A] transition-colors">
                  Journal
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#0A0A0A] transition-colors">
                  Contact &amp; Location
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact details from site_settings */}
          <div className="space-y-4">
            <h4 className="text-xs font-medium uppercase tracking-[0.1em] text-[#0A0A0A]">
              Client Services
            </h4>
            <ul className="space-y-2.5 text-sm text-[#6B6B6B]">
              <li>
                <a href={getTelUrl(phone)} className="hover:text-[#0A0A0A] transition-colors">
                  {phone}
                </a>
              </li>
              <li>
                <a
                  href={getWhatsAppUrl(whatsapp, "Hello Aston Auto Stores, I would like to inquire about your vehicle collection.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#0A0A0A] transition-colors"
                >
                  WhatsApp Consultation
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="hover:text-[#0A0A0A] transition-colors">
                  {email}
                </a>
              </li>
              {hours && <li className="text-xs text-[#6B6B6B] pt-1">{hours}</li>}
              {/* If address is provided in site_settings, display it; otherwise omit (TODO comment above) */}
              {address && (
                <li className="text-xs text-[#6B6B6B] leading-relaxed pt-1">{address}</li>
              )}
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="space-y-4">
            <h4 className="text-xs font-medium uppercase tracking-[0.1em] text-[#0A0A0A]">
              Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-[#6B6B6B]">
              <li>
                <Link href="/privacy" className="hover:text-[#0A0A0A] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#0A0A0A] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <span className="text-xs text-[#6B6B6B]">
                  United States Automotive Dealer
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Small Bottom Copyright Line */}
        <div className="mt-14 pt-8 border-t border-[#E8E8E8] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B6B6B]">
          <p>&copy; {new Date().getFullYear()} Aston Auto Stores. All rights reserved.</p>
          <p>Curated Automotive Excellence &bull; United States</p>
        </div>
      </div>
    </footer>
  );
}
