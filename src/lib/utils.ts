import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format numbers as US Dollar currency ($)
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
 * Backward compatibility alias for legacy components
 */
export const formatNaira = formatUSD;

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

export const formatCompactNaira = formatCompactUSD;

/**
 * Calculate estimated monthly financing payment (US luxury auto terms)
 * @param price Total vehicle price in USD
 * @param downPaymentPercent e.g. 20 (percent)
 * @param tenureMonths e.g. 36, 48, or 60 months
 * @param annualInterestRate e.g. 5.9 (percent standard US prime auto loan rate)
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
