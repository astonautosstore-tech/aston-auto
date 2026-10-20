"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Car as CarIcon,
  Upload,
  CheckCircle2,
  ShieldCheck,
  Calculator,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { soundEngine } from "@/lib/sound";
import { formatNaira } from "@/lib/utils";

export default function TradeInClient() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [make, setMake] = useState("Porsche");
  const [model, setModel] = useState("911 Carrera S");
  const [year, setYear] = useState("2022");
  const [mileage, setMileage] = useState("14,500");
  const [condition, setCondition] = useState("Excellent");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Approximate luxury trade equity calculation
  const calculatedEstimate = 165000000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playSuccessChime();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#0D5C3A] mb-2 font-semibold">
            <CarIcon className="w-4 h-4" />
            <span>VIP Valuation & Trade-In Desk</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0A0A0A] tracking-tight">
            Sell or Trade-In Your Exotic
          </h1>
          <p className="text-sm text-[#64748B] mt-3 leading-relaxed">
            Receive certified market equity for your current supercar or trade in seamlessly against any allocation in our 2024 showroom portfolio.
          </p>
        </div>

        {isSubmitted ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-[#F7F7F8] border border-[#E4E4E7] text-center shadow-lg">
            <div className="w-16 h-16 rounded-full bg-[#0D5C3A]/10 text-[#0D5C3A] flex items-center justify-center mx-auto mb-4 border border-[#0D5C3A]/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#0D5C3A] font-bold">
              Appraisal Dossier Received
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A0A0A] mt-2 mb-3">
              Preliminary Value: {formatNaira(calculatedEstimate)}
            </h2>
            <p className="text-xs text-[#64748B] max-w-md mx-auto leading-relaxed mb-8">
              Our Chief Appraiser will contact <strong>{clientPhone || "+234 812 345 6789"}</strong> within 2 hours to schedule a complimentary physical inspection at your residence or in our Ikoyi salon.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`https://wa.me/2348123456789?text=Hello%20Aston%20Auto%20Concierge,%20inquiring%20about%20my%20trade-in%20appraisal%20for%20${year}%20${make}%20${model}`}
                target="_blank"
                rel="noreferrer"
                className="btn-luxury-primary text-xs py-3 px-6 rounded-full flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Expedite via WhatsApp VIP</span>
              </a>

              <Link href="/inventory" className="btn-luxury-outline text-xs py-3 px-6 rounded-full">
                Explore Allocations to Trade Into
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="p-8 sm:p-12 rounded-3xl bg-[#F7F7F8] border border-[#E4E4E7] shadow-xl space-y-8"
          >
            {/* Step 1: Vehicle Specs */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#0A0A0A] mb-4">
                1. Vehicle Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-[#64748B] block mb-1">Make / Marque</label>
                  <input
                    type="text"
                    required
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="w-full bg-white border border-[#E4E4E7] rounded-xl px-3.5 py-2.5 text-xs text-[#0A0A0A]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#64748B] block mb-1">Model & Trim</label>
                  <input
                    type="text"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-white border border-[#E4E4E7] rounded-xl px-3.5 py-2.5 text-xs text-[#0A0A0A]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#64748B] block mb-1">Year</label>
                  <input
                    type="text"
                    required
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-white border border-[#E4E4E7] rounded-xl px-3.5 py-2.5 text-xs text-[#0A0A0A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-xs text-[#64748B] block mb-1">Odometer Mileage (KM)</label>
                  <input
                    type="text"
                    value={mileage}
                    onChange={(e) => setMileage(e.target.value)}
                    className="w-full bg-white border border-[#E4E4E7] rounded-xl px-3.5 py-2.5 text-xs text-[#0A0A0A]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#64748B] block mb-1">Vehicle Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full bg-white border border-[#E4E4E7] rounded-xl px-3.5 py-2.5 text-xs text-[#0A0A0A]"
                  >
                    <option value="Showroom Pristine">Showroom Pristine (No Imperfections)</option>
                    <option value="Excellent">Excellent (Minor Stone Chips Only)</option>
                    <option value="Good">Good (Regular Road Wear)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: Upload Dropzone */}
            <div className="pt-6 border-t border-[#E4E4E7]">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#0A0A0A] mb-4">
                2. Photography & Title Documentation
              </h3>
              <div className="border-2 border-dashed border-[#E4E4E7] rounded-2xl p-8 text-center bg-white hover:border-[#0D5C3A] transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-[#0D5C3A] mx-auto mb-2" />
                <span className="text-xs font-semibold text-[#0A0A0A] block">
                  Drag & Drop Vehicle Photos or Click to Upload
                </span>
                <span className="text-[10px] text-[#94a3b8] block mt-1">
                  Front, profile, cockpit, odometer, and engine bay (Max 15MB)
                </span>
              </div>
            </div>

            {/* Step 3: Owner Details */}
            <div className="pt-6 border-t border-[#E4E4E7]">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#0A0A0A] mb-4">
                3. Owner Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-[#64748B] block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Chief Adeleke"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-white border border-[#E4E4E7] rounded-xl px-3.5 py-2.5 text-xs text-[#0A0A0A]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#64748B] block mb-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+234 812 345 6789"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full bg-white border border-[#E4E4E7] rounded-xl px-3.5 py-2.5 text-xs text-[#0A0A0A]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#64748B] block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="client@domain.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full bg-white border border-[#E4E4E7] rounded-xl px-3.5 py-2.5 text-xs text-[#0A0A0A]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E4E4E7] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-[#64748B]">
                <ShieldCheck className="w-4 h-4 text-[#0D5C3A]" />
                <span>Confidential appraisal. No public record or VIN exposure.</span>
              </div>

              <button
                type="submit"
                className="btn-luxury-primary text-xs py-3.5 px-8 rounded-xl w-full sm:w-auto cursor-pointer"
              >
                <span>Request Certified Appraisal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
