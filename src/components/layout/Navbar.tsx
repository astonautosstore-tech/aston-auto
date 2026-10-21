"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: "Inventory", href: "/inventory" },
    { label: "About", href: "/about" },
    { label: "Journal", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-200 bg-white ${
          scrolled ? "border-b border-[#E8E8E8]" : "border-b border-transparent"
        }`}
      >
        <div className="max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-16 h-20 flex items-center justify-between">
          {/* Left: Logo mark */}
          <Link
            href="/"
            className="flex items-center gap-3 focus:outline-none"
            aria-label="Aston Auto Stores Home"
          >
            <Image
              src="/logo.png"
              alt="Aston Auto Stores"
              width={160}
              height={44}
              priority
              className="h-8 w-auto object-contain"
            />
          </Link>

          {/* Center: Desktop Links */}
          <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-[#6B6B6B]">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors duration-150 hover:text-[#0A0A0A] ${
                    isActive ? "text-[#0A0A0A]" : ""
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: CTA Button */}
          <div className="hidden md:flex items-center">
            <Link
              href="/contact?topic=test-drive"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[#0A0A0A] text-white text-xs font-medium tracking-wide transition-opacity hover:opacity-90"
            >
              Book a Test Drive
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="md:hidden p-2 -mr-2 text-[#0A0A0A] focus:outline-none"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" strokeWidth={1.5} />
            ) : (
              <Menu className="w-6 h-6" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Full-Screen Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col justify-between p-6 sm:p-10 md:hidden animate-in fade-in duration-200">
          <div className="flex items-center justify-between h-20">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center"
              aria-label="Aston Auto Stores Home"
            >
              <Image
                src="/logo.png"
                alt="Aston Auto Stores"
                width={140}
                height={38}
                priority
                className="h-7 w-auto object-contain"
              />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              className="p-2 -mr-2 text-[#0A0A0A] focus:outline-none"
            >
              <X className="w-6 h-6" strokeWidth={1.5} />
            </button>
          </div>

          <nav className="flex flex-col space-y-6 my-auto">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-3xl font-medium text-[#0A0A0A] tracking-tight hover:text-[#6B6B6B] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-8 border-t border-[#E8E8E8] flex flex-col gap-4">
            <Link
              href="/contact?topic=test-drive"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center py-3.5 rounded-lg bg-[#0A0A0A] text-white text-sm font-medium transition-opacity hover:opacity-90"
            >
              Book a Test Drive
            </Link>
            <a
              href="tel:+14482264666"
              className="text-center text-xs font-medium text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors"
            >
              +1 448 226 4666
            </a>
          </div>
        </div>
      )}
    </>
  );
}
