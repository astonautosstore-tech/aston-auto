"use client";

import { useState } from "react";
import { Calculator, ShieldCheck, Check } from "lucide-react";
import { formatNaira, calculateFinancing } from "@/lib/utils";
import { soundEngine } from "@/lib/sound";

interface FinancingCalculatorProps {
  vehiclePrice: number;
}

export default function FinancingCalculator({ vehiclePrice }: FinancingCalculatorProps) {
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [tenureMonths, setTenureMonths] = useState<number>(36);
  const [interestRate, setInterestRate] = useState<number>(18);
  const [applied, setApplied] = useState(false);

  const calc = calculateFinancing(vehiclePrice, downPaymentPercent, tenureMonths, interestRate);

  const handleApply = () => {
    soundEngine.playSuccessChime();
    setApplied(true);
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[#F7F7F8] border border-[#E4E4E7]">
      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#0D5C3A] mb-2 font-semibold">
        <Calculator className="w-4 h-4" />
        <span>Bespoke Amortization Calculator</span>
      </div>
      <h3 className="text-xl font-bold text-[#0A0A0A] tracking-tight mb-6">
        Private Concierge Financing
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Sliders Form */}
        <div className="space-y-6">
          {/* Down Payment % */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono mb-2">
              <span className="text-[#64748B]">Down Payment:</span>
              <span className="font-bold text-[#0A0A0A]">
                {downPaymentPercent}% ({formatNaira(calc.downPayment)})
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
              className="w-full accent-[#0D5C3A]"
            />
            <div className="flex justify-between text-[10px] text-neutral-400 font-mono mt-1">
              <span>10% (Minimum)</span>
              <span>60%</span>
            </div>
          </div>

          {/* Tenure Months */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono mb-2">
              <span className="text-[#64748B]">Repayment Period:</span>
              <span className="font-bold text-[#0A0A0A]">{tenureMonths} Months ({tenureMonths / 12} Years)</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[12, 24, 36, 48].map((months) => (
                <button
                  key={months}
                  type="button"
                  onClick={() => {
                    soundEngine.playHoverTick();
                    setTenureMonths(months);
                  }}
                  className={`py-2 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                    tenureMonths === months
                      ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                      : "bg-white text-[#0A0A0A] border-[#E4E4E7] hover:border-black"
                  }`}
                >
                  {months} Mo
                </button>
              ))}
            </div>
          </div>

          {/* Annual Interest Rate */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono mb-2">
              <span className="text-[#64748B]">Estimated Luxury Rate:</span>
              <span className="font-bold text-[#0A0A0A]">{interestRate}% APR</span>
            </div>
            <input
              type="range"
              min={12}
              max={24}
              step={1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              aria-label="Annual interest rate"
              className="w-full accent-[#0D5C3A]"
            />
          </div>
        </div>

        {/* Calculated Results Summary Box */}
        <div className="p-6 rounded-xl bg-white border border-[#E4E4E7] flex flex-col justify-between shadow-xs">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#94a3b8]">
              Estimated Monthly Outlay
            </span>
            <div className="text-3xl font-extrabold font-mono text-[#0D5C3A] mt-1 mb-6">
              {formatNaira(calc.monthlyPayment)}
              <span className="text-xs font-normal text-neutral-400"> / month</span>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#E4E4E7] text-xs font-mono">
              <div className="flex justify-between text-[#64748B]">
                <span>Down Payment Due:</span>
                <span className="font-bold text-[#0A0A0A]">{formatNaira(calc.downPayment)}</span>
              </div>
              <div className="flex justify-between text-[#64748B]">
                <span>Loan Principal:</span>
                <span className="text-[#0A0A0A]">{formatNaira(calc.loanPrincipal)}</span>
              </div>
              <div className="flex justify-between text-[#64748B]">
                <span>Total Repayment:</span>
                <span className="text-[#0A0A0A]">{formatNaira(calc.totalPayable)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E4E4E7]">
            {applied ? (
              <div className="p-3 bg-[#0D5C3A]/10 border border-[#0D5C3A]/30 rounded-lg text-xs text-[#0D5C3A] font-medium flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                <span>Pre-Approval Application Dispatched</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleApply}
                className="btn-luxury-primary w-full text-xs py-3 rounded-lg text-center cursor-pointer"
              >
                Apply for Concierge Pre-Approval
              </button>
            )}
            <p className="text-[10px] text-neutral-400 text-center mt-2 font-mono">
              Subject to tier-1 private wealth credit appraisal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
