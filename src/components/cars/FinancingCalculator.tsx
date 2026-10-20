"use client";

import { useState } from "react";
import { Calculator, Check } from "lucide-react";
import { formatUSD, calculateFinancing } from "@/lib/utils";

interface FinancingCalculatorProps {
  vehiclePrice: number;
}

export default function FinancingCalculator({ vehiclePrice }: FinancingCalculatorProps) {
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [tenureMonths, setTenureMonths] = useState<number>(48);
  const [interestRate, setInterestRate] = useState<number>(5.9);
  const [applied, setApplied] = useState(false);

  const calc = calculateFinancing(vehiclePrice, downPaymentPercent, tenureMonths, interestRate);

  const handleApply = () => {
    setApplied(true);
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[#F9FAFB] border border-neutral-200">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
        <Calculator className="w-4 h-4 text-neutral-800" />
        <span>US Automotive Loan & Lease Calculator</span>
      </div>
      <h3 className="text-xl font-bold text-neutral-950 tracking-tight mb-6">
        Estimated Monthly Payment
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Sliders Form */}
        <div className="space-y-6">
          {/* Down Payment % */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold mb-2">
              <span className="text-neutral-500">Down Payment:</span>
              <span className="font-bold text-neutral-950">
                {downPaymentPercent}% ({formatUSD(calc.downPayment)})
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={60}
              step={5}
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              aria-label="Down payment percentage"
              className="w-full accent-neutral-950"
            />
            <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
              <span>10% (Minimum)</span>
              <span>60%</span>
            </div>
          </div>

          {/* Tenure Months */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold mb-2">
              <span className="text-neutral-500">Loan Term:</span>
              <span className="font-bold text-neutral-950">{tenureMonths} Months ({tenureMonths / 12} Years)</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[24, 36, 48, 60].map((months) => (
                <button
                  key={months}
                  type="button"
                  onClick={() => setTenureMonths(months)}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    tenureMonths === months
                      ? "bg-neutral-950 text-white border-neutral-950"
                      : "bg-white text-neutral-800 border-neutral-300 hover:border-neutral-950"
                  }`}
                >
                  {months} Mo
                </button>
              ))}
            </div>
          </div>

          {/* Annual Interest Rate */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold mb-2">
              <span className="text-neutral-500">Estimated APR:</span>
              <span className="font-bold text-neutral-950">{interestRate}% APR</span>
            </div>
            <input
              type="range"
              min={3.9}
              max={10.9}
              step={0.5}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              aria-label="Annual interest rate"
              className="w-full accent-neutral-950"
            />
            <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
              <span>3.9% (Tier 1 Prime)</span>
              <span>10.9%</span>
            </div>
          </div>
        </div>

        {/* Calculated Results Summary Box */}
        <div className="p-6 rounded-xl bg-white border border-neutral-200 flex flex-col justify-between shadow-sm">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Estimated Monthly Payment
            </span>
            <div className="text-3xl font-extrabold text-neutral-950 mt-1 mb-6">
              {formatUSD(calc.monthlyPayment)}
              <span className="text-xs font-normal text-neutral-500"> / month</span>
            </div>

            <div className="space-y-3 pt-4 border-t border-neutral-100 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Down Payment Due:</span>
                <span className="font-bold text-neutral-950">{formatUSD(calc.downPayment)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Loan Principal:</span>
                <span className="font-bold text-neutral-950">{formatUSD(calc.loanPrincipal)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Total Repayment:</span>
                <span className="font-bold text-neutral-950">{formatUSD(calc.totalPayable)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-100">
            {applied ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 font-semibold flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                <span>Pre-Approval Application Dispatched</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleApply}
                className="w-full py-3 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
              >
                Apply for Dealership Pre-Approval
              </button>
            )}
            <p className="text-[10px] text-neutral-400 text-center mt-2">
              Subject to tier-1 US credit approval • Exact rates determined at contract signing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
