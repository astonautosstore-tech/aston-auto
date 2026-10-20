"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  Building,
  CreditCard,
  Building2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Lock,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useStore } from "@/lib/store/useStore";
import { formatNaira, generateOrderNumber } from "@/lib/utils";
import { storeApi } from "@/lib/supabase/client";
import { soundEngine } from "@/lib/sound";
import { Order } from "@/types/database";

export default function CheckoutClient() {
  const router = useRouter();
  const { cart, getSubtotal, clearCart } = useStore();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "Lagos",
    state: "Lagos State",
    deliveryMethod: "delivery" as "delivery" | "pickup",
    pickupLocation: "Ikoyi Showroom (14 Alexander Avenue)",
    paymentMethod: "paystack" as "paystack" | "bank_wire" | "showroom",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getSubtotal();
  const documentationFee = 250000;
  const deliveryFee = formData.deliveryMethod === "delivery" ? 250000 : 0;
  const total = subtotal + documentationFee + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 pt-32 pb-24">
        <h1 className="text-2xl font-bold text-[#0A0A0A]">Your Portfolio is Empty</h1>
        <p className="text-xs text-[#64748B] mt-2 mb-6">
          Please add a vehicle from our showroom before initiating acquisition.
        </p>
        <Link href="/inventory" className="btn-luxury-primary text-xs py-3 px-6 rounded-full">
          Browse Showroom Catalog
        </Link>
      </div>
    );
  }

  const handleNext = () => {
    soundEngine.playHoverTick();
    if (currentStep === 1) {
      if (!formData.fullName || !formData.email || !formData.phone) {
        alert("Please complete all required client contact fields.");
        return;
      }
    }
    setCurrentStep((prev) => (prev < 4 ? ((prev + 1) as 1 | 2 | 3 | 4) : prev));
  };

  const handleBack = () => {
    soundEngine.playHoverTick();
    setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3 | 4) : prev));
  };

  const handleCompleteAcquisition = async () => {
    setIsSubmitting(true);
    soundEngine.playSuccessChime();

    const orderNumber = generateOrderNumber();

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      customer_name: formData.fullName,
      customer_email: formData.email,
      customer_phone: formData.phone,
      status: "pending_payment", // Saved as pending_payment before charging step
      subtotal,
      fees: documentationFee + deliveryFee,
      deposit_amount: subtotal,
      total,
      delivery_method: formData.deliveryMethod,
      delivery_address:
        formData.deliveryMethod === "delivery"
          ? `${formData.address}, ${formData.city}, ${formData.state}`
          : formData.pickupLocation,
      notes: formData.notes,
      payment_method: formData.paymentMethod,
      payment_reference: `REF-${orderNumber}`,
      items: cart.map((item) => ({
        id: `item-${Date.now()}-${item.car.id}`,
        order_id: `ord-${Date.now()}`,
        car_id: item.car.id,
        car: item.car,
        price_at_purchase: item.isDepositOnly
          ? (item.car.discount_price ?? item.car.price) * 0.1
          : item.car.discount_price ?? item.car.price,
        quantity: item.quantity,
        created_at: new Date().toISOString(),
      })),
      created_at: new Date().toISOString(),
    };

    try {
      await storeApi.createOrder(newOrder);

      // Trigger celebration confetti
      if (typeof window !== "undefined") {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#0D5C3A", "#C5A059", "#0A0A0A", "#ffffff"],
        });
      }

      clearCart();
      router.push(`/order-success/${orderNumber}`);
    } catch (err) {
      console.error("Order creation error:", err);
      alert("Encountered an issue reserving your vehicle. Please contact concierge.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-28 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Step Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between text-xs font-mono mb-3">
            <span
              className={
                currentStep >= 1 ? "text-[#0D5C3A] font-bold" : "text-neutral-400"
              }
            >
              1. Client Profile
            </span>
            <span
              className={
                currentStep >= 2 ? "text-[#0D5C3A] font-bold" : "text-neutral-400"
              }
            >
              2. Handover Method
            </span>
            <span
              className={
                currentStep >= 3 ? "text-[#0D5C3A] font-bold" : "text-neutral-400"
              }
            >
              3. Review Terms
            </span>
            <span
              className={
                currentStep >= 4 ? "text-[#0D5C3A] font-bold" : "text-neutral-400"
              }
            >
              4. Payment & Lock
            </span>
          </div>

          <div className="h-1.5 w-full bg-[#F7F7F8] rounded-full overflow-hidden border border-[#E4E4E7]">
            <div
              className="h-full bg-gradient-to-r from-[#0D5C3A] via-[#C5A059] to-[#0D5C3A] transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Step Form Canvas */}
          <div className="lg:col-span-7">
            {/* STEP 1: CLIENT DETAILS */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#0A0A0A] tracking-tight">
                    Client Identification
                  </h2>
                  <p className="text-xs text-[#64748B] mt-1">
                    Provide the legal name and contacts for vehicle registration and title transfer.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-[#64748B] block mb-1">
                      Full Legal Name (as on International Passport / Driver's License) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chief Adeleke Danjuma"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-[#F7F7F8] border border-[#E4E4E7] rounded-xl px-4 py-3 text-xs text-[#0A0A0A] focus:outline-none focus:border-[#0D5C3A]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-[#64748B] block mb-1">
                        Executive Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="vip@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#F7F7F8] border border-[#E4E4E7] rounded-xl px-4 py-3 text-xs text-[#0A0A0A] focus:outline-none focus:border-[#0D5C3A]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-[#64748B] block mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+234 812 345 6789"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[#F7F7F8] border border-[#E4E4E7] rounded-xl px-4 py-3 text-xs text-[#0A0A0A] focus:outline-none focus:border-[#0D5C3A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#64748B] block mb-1">
                      Residential or Commercial Delivery Address *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 10 Bourdillon Road, Ikoyi"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-[#F7F7F8] border border-[#E4E4E7] rounded-xl px-4 py-3 text-xs text-[#0A0A0A] focus:outline-none focus:border-[#0D5C3A]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-[#64748B] block mb-1">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-[#F7F7F8] border border-[#E4E4E7] rounded-xl px-4 py-3 text-xs text-[#0A0A0A] focus:outline-none focus:border-[#0D5C3A]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[#64748B] block mb-1">State</label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full bg-[#F7F7F8] border border-[#E4E4E7] rounded-xl px-4 py-3 text-xs text-[#0A0A0A] focus:outline-none focus:border-[#0D5C3A]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn-luxury-primary text-xs py-3.5 px-8 rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Handover Method</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: HANDOVER METHOD */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#0A0A0A] tracking-tight">
                    Select Handover Preference
                  </h2>
                  <p className="text-xs text-[#64748B] mt-1">
                    Choose how you wish to take delivery of your allocation.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Option A: Enclosed Transporter */}
                  <label
                    onClick={() => setFormData({ ...formData, deliveryMethod: "delivery" })}
                    className={`p-5 rounded-2xl border-2 flex items-start gap-4 cursor-pointer transition-all ${
                      formData.deliveryMethod === "delivery"
                        ? "border-[#0D5C3A] bg-[#0D5C3A]/5 shadow-xs"
                        : "border-[#E4E4E7] hover:border-black"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-white border border-[#E4E4E7] flex items-center justify-center text-[#0D5C3A] shrink-0">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-bold text-[#0A0A0A]">
                          White-Glove Enclosed Transporter Delivery
                        </h4>
                        <span className="text-xs font-mono font-bold text-[#0D5C3A]">₦250,000</span>
                      </div>
                      <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                        Delivered directly to your estate gates in a climate-controlled enclosed truck with zero mileage and zero road exposure. Available in Lagos, Abuja, Port Harcourt, and Kano.
                      </p>
                    </div>
                  </label>

                  {/* Option B: Showroom Pickup */}
                  <label
                    onClick={() => setFormData({ ...formData, deliveryMethod: "pickup" })}
                    className={`p-5 rounded-2xl border-2 flex items-start gap-4 cursor-pointer transition-all ${
                      formData.deliveryMethod === "pickup"
                        ? "border-[#0D5C3A] bg-[#0D5C3A]/5 shadow-xs"
                        : "border-[#E4E4E7] hover:border-black"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-white border border-[#E4E4E7] flex items-center justify-center text-[#0D5C3A] shrink-0">
                      <Building className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-bold text-[#0A0A0A]">
                          Private Showroom Handover (Ikoyi Salon)
                        </h4>
                        <span className="text-xs font-mono font-bold text-[#0D5C3A]">
                          Complimentary
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                        Red-carpet unveiling ceremony at 14 Alexander Avenue, Ikoyi, including champagne hospitality and personal orientation by our Chief Product Specialist.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="btn-luxury-outline text-xs py-3 px-6 rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn-luxury-primary text-xs py-3.5 px-8 rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Review Terms</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: ORDER REVIEW */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#0A0A0A] tracking-tight">
                    Acquisition Review & Terms
                  </h2>
                  <p className="text-xs text-[#64748B] mt-1">
                    Review your vehicle allocation, legal terms, and holding conditions.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#F7F7F8] border border-[#E4E4E7] space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A]">
                    Vehicles to be Reserved
                  </h3>
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item.car.id}
                        className="flex items-center justify-between text-xs font-mono border-b border-[#E4E4E7] pb-2"
                      >
                        <span className="text-[#0A0A0A] font-semibold">{item.car.title}</span>
                        <span className="text-[#0D5C3A] font-bold">
                          {formatNaira(
                            item.isDepositOnly
                              ? (item.car.discount_price ?? item.car.price) * 0.1
                              : item.car.discount_price ?? item.car.price
                          )}
                          {item.isDepositOnly && " (10% Hold)"}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 text-xs space-y-1.5 text-[#64748B]">
                    <div className="flex justify-between">
                      <span>Recipient:</span>
                      <span className="font-semibold text-[#0A0A0A]">{formData.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Contact:</span>
                      <span className="font-mono text-[#0A0A0A]">{formData.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Transit Mode:</span>
                      <span className="capitalize text-[#0A0A0A]">{formData.deliveryMethod}</span>
                    </div>
                  </div>
                </div>

                {/* Terms of Reservation Notice */}
                <div className="p-4 rounded-xl bg-[#0D5C3A]/5 border border-[#0D5C3A]/20 text-xs text-[#0A0A0A] space-y-2">
                  <div className="flex items-center gap-2 font-bold text-[#0D5C3A]">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Exclusive 7-Day Allocation Guarantee</span>
                  </div>
                  <p className="text-[11px] text-[#64748B] leading-relaxed">
                    By submitting this reservation, your selected vehicles will be locked in Supabase under status "Reserved". No other collector may purchase these vehicles during your consultation window.
                  </p>
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="btn-luxury-outline text-xs py-3 px-6 rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn-luxury-primary text-xs py-3.5 px-8 rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Payment Step</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: PAYMENT STEP (PROVIDER ABSTRACTION) */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#0A0A0A] tracking-tight">
                    Payment & Reservation Lock
                  </h2>
                  <p className="text-xs text-[#64748B] mt-1">
                    Select your preferred transaction channel to finalize your reservation.
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Channel A: Paystack Gateway (Stubbed/Demo) */}
                  <label
                    onClick={() => setFormData({ ...formData, paymentMethod: "paystack" })}
                    className={`p-4 rounded-2xl border-2 flex items-start gap-4 cursor-pointer transition-all ${
                      formData.paymentMethod === "paystack"
                        ? "border-[#0D5C3A] bg-[#0D5C3A]/5"
                        : "border-[#E4E4E7]"
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#0D5C3A] shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-[#0A0A0A]">
                          Paystack Electronic Gateway (Cards / NIBSS / USSD)
                        </span>
                        <span className="text-[10px] font-mono bg-[#0D5C3A]/10 text-[#0D5C3A] px-2 py-0.5 rounded font-bold">
                          Sandbox Ready
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] mt-1">
                        Instant reservation clearance via Visa, Mastercard, Verve, or direct bank payment.
                      </p>
                    </div>
                  </label>

                  {/* Channel B: Private Banking Wire */}
                  <label
                    onClick={() => setFormData({ ...formData, paymentMethod: "bank_wire" })}
                    className={`p-4 rounded-2xl border-2 flex items-start gap-4 cursor-pointer transition-all ${
                      formData.paymentMethod === "bank_wire"
                        ? "border-[#0D5C3A] bg-[#0D5C3A]/5"
                        : "border-[#E4E4E7]"
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-[#0D5C3A] shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="text-sm font-bold text-[#0A0A0A]">
                        Institutional Escrow / Private Wire Transfer
                      </span>
                      <p className="text-xs text-[#64748B] mt-1">
                        Zenith Bank &bull; Standard Chartered Private Banking wire settlement instructions generated with pro-forma invoice.
                      </p>
                    </div>
                  </label>

                  {/* Channel C: Showroom POS Terminal */}
                  <label
                    onClick={() => setFormData({ ...formData, paymentMethod: "showroom" })}
                    className={`p-4 rounded-2xl border-2 flex items-start gap-4 cursor-pointer transition-all ${
                      formData.paymentMethod === "showroom"
                        ? "border-[#0D5C3A] bg-[#0D5C3A]/5"
                        : "border-[#E4E4E7]"
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5 text-[#0D5C3A] shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="text-sm font-bold text-[#0A0A0A]">
                        In-Salon Terminal (Ikoyi Showroom)
                      </span>
                      <p className="text-xs text-[#64748B] mt-1">
                        Settle in person via luxury POS terminal during your vehicle inspection viewing.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Sandbox Demo Notice */}
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
                  <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">Demo Reservation Mode Active:</strong>
                    <span>
                      As requested, real charging is disabled. Clicking Confirm will securely create your order as <strong>pending_payment</strong>, lock the vehicle as <strong>reserved</strong>, and display your printable luxury invoice.
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="btn-luxury-outline text-xs py-3 px-6 rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleCompleteAcquisition}
                    className="btn-luxury-primary text-xs py-4 px-10 rounded-xl flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                  >
                    <span>{isSubmitting ? "Locking Reservation..." : "Confirm & Lock Reservation"}</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Summary Sidebar */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#F7F7F8] border border-[#E4E4E7] shadow-lg space-y-6 sticky top-28">
              <h3 className="text-base font-bold text-[#0A0A0A] tracking-tight">
                Order Breakdown
              </h3>

              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.car.id} className="flex gap-3">
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-white shrink-0 border border-[#E4E4E7]">
                      <Image
                        src={item.car.hero_image}
                        alt={item.car.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#0A0A0A] truncate">
                        {item.car.title}
                      </h4>
                      <span className="text-[10px] font-mono text-[#0D5C3A]">
                        {item.isDepositOnly ? "10% Reservation Hold" : "Full Purchase"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#E4E4E7] space-y-2 text-xs font-mono text-[#64748B]">
                <div className="flex justify-between">
                  <span>Vehicles Allocation:</span>
                  <span className="text-[#0A0A0A]">{formatNaira(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Registration & Customs:</span>
                  <span className="text-[#0A0A0A]">{formatNaira(documentationFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Enclosed Transit:</span>
                  <span className="text-[#0A0A0A]">{formatNaira(deliveryFee)}</span>
                </div>

                <div className="pt-4 border-t border-[#E4E4E7] flex justify-between text-base font-bold text-[#0A0A0A]">
                  <span>Total Amount Due:</span>
                  <span className="text-[#0D5C3A] text-lg font-mono">{formatNaira(total)}</span>
                </div>
              </div>

              <div className="text-[11px] text-[#64748B] bg-white p-3 rounded-xl border border-[#E4E4E7]">
                <strong>Aston Auto Guarantee:</strong> Cars are held exclusively for 7 business days following deposit settlement.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
