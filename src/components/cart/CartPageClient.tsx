"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ArrowRight, ShieldCheck, Truck, RotateCcw, Lock } from "lucide-react";
import { useStore } from "@/lib/store/useStore";
import { formatNaira } from "@/lib/utils";

export default function CartPageClient() {
  const { cart, removeFromCart, toggleDepositMode, getSubtotal, clearCart } = useStore();
  const [orderNotes, setOrderNotes] = useState("");

  const subtotal = getSubtotal();
  const documentationFee = 250000; // Registration & Title documentation
  const deliveryFee = 0; // Complimentary white-glove enclosed delivery on reserved allocations
  const total = subtotal + documentationFee + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 pt-32 pb-24">
        <div className="w-20 h-20 rounded-full bg-[#F7F7F8] border border-[#E4E4E7] flex items-center justify-center mb-6 text-[#64748B]">
          <ShieldCheck className="w-10 h-10 text-[#0D5C3A]" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#0A0A0A] tracking-tight">
          Your Reserved Portfolio is Empty
        </h1>
        <p className="text-sm text-[#64748B] max-w-md mt-3 leading-relaxed">
          No vehicles have been reserved for private acquisition yet. Explore our curated portfolio of rare supercars.
        </p>
        <Link href="/inventory" className="mt-8 btn-luxury-primary text-xs py-3.5 px-8 rounded-full">
          Browse Showroom Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#0D5C3A] mb-2 font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#0D5C3A]" />
              <span>Acquisition Portfolio &bull; Stage 1</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0A0A0A] tracking-tight">
              Review Reserved Vehicles
            </h1>
          </div>

          <button
            onClick={clearCart}
            className="text-xs text-neutral-400 hover:text-red-500 font-mono transition-colors self-start md:self-auto cursor-pointer"
          >
            Clear Entire Portfolio
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-6">
            {cart.map((item) => {
              const price = item.car.discount_price ?? item.car.price;
              const deposit = price * 0.1;
              const displayPrice = item.isDepositOnly ? deposit : price;

              return (
                <div
                  key={item.car.id}
                  className="p-6 rounded-2xl bg-white border border-[#E4E4E7] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-[#0D5C3A]/30 transition-all"
                >
                  <div className="flex items-center gap-5 w-full sm:w-auto">
                    <div className="relative w-32 h-24 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-[#E4E4E7]">
                      <Image
                        src={item.car.hero_image}
                        alt={item.car.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-[#64748B]">
                        <span>{item.car.year}</span>
                        <span>&bull;</span>
                        <span>{item.car.brand}</span>
                      </div>
                      <Link
                        href={`/cars/${item.car.slug}`}
                        className="text-base font-bold text-[#0A0A0A] hover:text-[#0D5C3A] transition-colors truncate block"
                      >
                        {item.car.title}
                      </Link>
                      <p className="text-xs text-[#64748B] font-mono mt-0.5">
                        {item.car.engine} &bull; {item.car.horsepower} HP
                      </p>

                      <div className="mt-2 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => toggleDepositMode(item.car.id)}
                          className="text-[11px] font-semibold text-[#0D5C3A] hover:underline cursor-pointer"
                        >
                          {item.isDepositOnly
                            ? "Switch to Full Vehicle Purchase"
                            : "Switch to 10% Reservation Hold"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E4E4E7]">
                    <div className="text-right">
                      <span className="text-base font-bold text-[#0A0A0A] font-mono block">
                        {formatNaira(displayPrice)}
                      </span>
                      {item.isDepositOnly && (
                        <span className="text-[10px] font-mono text-[#0D5C3A] uppercase bg-[#0D5C3A]/10 px-2 py-0.5 rounded">
                          10% Reservation Hold
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.car.id)}
                      aria-label="Remove item"
                      className="text-neutral-400 hover:text-red-500 p-2 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Order Notes Textarea */}
            <div className="p-6 rounded-2xl bg-[#F7F7F8] border border-[#E4E4E7]">
              <label className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A] block mb-2">
                Special Client Instructions / Delivery Requests
              </label>
              <textarea
                rows={3}
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="e.g. Please deliver to private hangar, schedule private viewing prior to registration..."
                className="w-full bg-white border border-[#E4E4E7] rounded-xl p-3 text-xs text-[#0A0A0A] focus:outline-none focus:border-[#0D5C3A] resize-none"
              />
            </div>
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-4">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#F7F7F8] border border-[#E4E4E7] shadow-lg space-y-6 sticky top-28">
              <h3 className="text-lg font-bold text-[#0A0A0A] tracking-tight">
                Acquisition Summary
              </h3>

              <div className="space-y-3 text-xs font-mono text-[#64748B]">
                <div className="flex justify-between">
                  <span>Vehicles Allocation:</span>
                  <span className="text-[#0A0A0A] font-bold">{formatNaira(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Documentation & Customs:</span>
                  <span className="text-[#0A0A0A]">{formatNaira(documentationFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Enclosed Transit:</span>
                  <span className="text-[#0D5C3A] font-semibold">Complimentary</span>
                </div>

                <div className="pt-4 border-t border-[#E4E4E7] flex justify-between text-base font-bold text-[#0A0A0A]">
                  <span>Total Due Today:</span>
                  <span className="text-[#0D5C3A] text-lg">{formatNaira(total)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 text-[11px] text-[#64748B]">
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-[#0D5C3A]" />
                  <span>Vehicle automatically locked in Supabase upon reservation</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0D5C3A]" />
                  <span>Escrow-grade acquisition guarantee</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="btn-luxury-primary w-full text-xs py-4 rounded-xl text-center flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Proceed to VIP Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/inventory"
                className="block text-center text-xs text-[#64748B] hover:text-[#0A0A0A] transition-colors"
              >
                &larr; Continue Exploring Inventory
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
