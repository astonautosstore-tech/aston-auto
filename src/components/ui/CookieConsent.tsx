"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("aston_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("aston_cookie_consent", "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("aston_cookie_consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-6 left-6 right-6 sm:right-auto sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-4 duration-300"
      role="region"
      aria-label="Cookie consent banner"
    >
      <div className="bg-white border border-[#E8E8E8] rounded-2xl p-6 shadow-sm space-y-4 text-[#0A0A0A]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="text-sm font-medium text-[#0A0A0A]">
              Privacy &amp; Cookies
            </h4>
            <p className="text-xs text-[#6B6B6B] mt-1 leading-relaxed">
              We use necessary cookies to ensure site functionality and enhance your vehicle search experience. Review our{" "}
              <Link href="/privacy" className="text-[#0A0A0A] underline hover:opacity-80">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
          <button
            onClick={handleDecline}
            className="text-[#6B6B6B] hover:text-[#0A0A0A] p-1 -mr-1"
            aria-label="Dismiss cookie banner"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={handleAccept}
            className="flex-1 py-2 px-4 rounded-lg bg-[#0A0A0A] text-white text-xs font-medium hover:opacity-90 transition-opacity"
          >
            Accept
          </button>
          <button
            onClick={handleDecline}
            className="flex-1 py-2 px-4 rounded-lg bg-white border border-[#E8E8E8] text-[#0A0A0A] text-xs font-medium hover:bg-[#FAFAFA] transition-colors"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
