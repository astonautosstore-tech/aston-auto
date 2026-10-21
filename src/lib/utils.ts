import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format numbers as US Dollar currency ($) with thousands separators
 * e.g. 45000 -> $45,000
 */
export function formatUSD(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return "$0";
  }
  const numeric = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(numeric);
}

/**
 * Standard Price Formatter (USD)
 */
export const formatPrice = formatUSD;

/**
 * Format large numbers with abbreviated units (e.g. $150M, $1.2M, $750K)
 */
export function formatCompactUSD(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(0)}M`;
  }
  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(0)}K`;
  }
  return formatUSD(amount);
}

/**
 * Generic phone number digits extractor for WhatsApp links
 * Strips spaces, dashes, parentheses, dots and leading +
 */
export function normalizePhoneDigits(phone: string): string {
  if (!phone) return "";
  return phone.replace(/[^0-9]/g, "");
}

/**
 * Build WhatsApp link from site settings or default US phone (+1 448 226 4666)
 */
export function getWhatsAppUrl(phone?: string | null, message?: string): string {
  const defaultPhone = "14482264666";
  const digits = phone ? normalizePhoneDigits(phone) : defaultPhone;
  const target = digits || defaultPhone;
  const baseUrl = `https://wa.me/${target}`;
  if (message) {
    return `${baseUrl}?text=${encodeURIComponent(message)}`;
  }
  return baseUrl;
}

/**
 * Build tel link for click-to-call
 */
export function getTelUrl(phone?: string | null): string {
  const target = phone ? phone.trim() : "+1 448 226 4666";
  return `tel:${target.replace(/\s+/g, "")}`;
}

/**
 * Validate phone number: 10 to 15 digits, optional leading +
 */
export function isValidPhone(phone: string): boolean {
  if (!phone) return false;
  const digits = normalizePhoneDigits(phone);
  return digits.length >= 10 && digits.length <= 15;
}

/**
 * Calculate estimated monthly financing payment (US prime luxury auto loan terms)
 * @param price Total vehicle price in USD
 * @param downPaymentPercent default 20%
 * @param tenureMonths default 60 months
 * @param annualInterestRate default 5.9%
 */
export function calculateFinancing(
  price: number,
  downPaymentPercent: number = 20,
  tenureMonths: number = 60,
  annualInterestRate: number = 5.9
) {
  const downPayment = price * (downPaymentPercent / 100);
  const loanPrincipal = price - downPayment;
  const monthlyRate = (annualInterestRate / 100) / 12;

  if (monthlyRate === 0) {
    const monthlyPayment = loanPrincipal / tenureMonths;
    return {
      monthlyPayment: Math.round(monthlyPayment),
      downPayment: Math.round(downPayment),
      loanPrincipal: Math.round(loanPrincipal),
      totalPayable: Math.round(price),
    };
  }

  const monthlyPayment =
    (loanPrincipal * (monthlyRate * Math.pow(1 + monthlyRate, tenureMonths))) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);

  const totalPayable = downPayment + (monthlyPayment * tenureMonths);

  return {
    monthlyPayment: Math.round(monthlyPayment),
    downPayment: Math.round(downPayment),
    loanPrincipal: Math.round(loanPrincipal),
    totalPayable: Math.round(totalPayable),
  };
}

export function generateOrderNumber(): string {
  const prefix = "AST";
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${dateStr}-${random}`;
}

/**
 * Validate standard UUID format (v1-v5)
 */
export function isValidUUID(val?: string | null): boolean {
  if (!val) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
}

/**
 * Ensure a valid UUID string, generating one via crypto.randomUUID() if invalid
 */
export function ensureUUID(val?: string | null): string {
  return isValidUUID(val) ? (val as string) : crypto.randomUUID();
}

