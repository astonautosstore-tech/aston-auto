"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ArrowRight, ShieldCheck, KeyRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store/useStore";
import { formatNaira } from "@/lib/utils";

export default function CartDrawer() {
  const {
    cart,
    isCartDrawerOpen,
    closeCartDrawer,
    removeFromCart,
    toggleDepositMode,
    getSubtotal,
  } = useStore();

  const subtotal = getSubtotal();

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-[99998] overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCartDrawer}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer Container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="w-screen max-w-md bg-white border-l border-[#E4E4E7] flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="p-6 border-b border-[#E4E4E7] flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-[#0A0A0A]">
                    Your Reserved Portfolio
                  </h2>
                  <p className="text-xs text-[#64748B] mt-1 font-mono uppercase">
                    {cart.length} {cart.length === 1 ? "Vehicle" : "Vehicles"} in Consultation
                  </p>
                </div>
                <button
                  onClick={closeCartDrawer}
                  aria-label="Close cart"
                  className="p-2 rounded-full hover:bg-[#F7F7F8] text-[#0A0A0A] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-[#F7F7F8] flex items-center justify-center mb-4 text-[#64748B]">
                      <KeyRound className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-semibold text-[#0A0A0A]">
                      Your Garage is Empty
                    </h3>
                    <p className="text-xs text-[#64748B] max-w-xs mt-2 leading-relaxed">
                      Explore our curated catalogue of high-performance supercars and bespoke grand tourers.
                    </p>
                    <button
                      onClick={closeCartDrawer}
                      className="mt-6 text-xs uppercase tracking-wider font-semibold text-[#0D5C3A] hover:underline"
                    >
                      Browse Showroom &rarr;
                    </button>
                  </div>
                ) : (
                  cart.map((item) => {
                    const price = item.car.discount_price ?? item.car.price;
                    const deposit = price * 0.1;
                    const currentDisplayPrice = item.isDepositOnly ? deposit : price;

                    return (
                      <div
                        key={item.car.id}
                        className="flex flex-col gap-3 p-4 rounded-xl border border-[#E4E4E7] bg-[#F7F7F8]/50 hover:border-[#0D5C3A]/30 transition-all"
                      >
                        <div className="flex gap-4">
                          <div className="relative w-24 h-20 rounded-lg overflow-hidden bg-white shrink-0 border border-[#E4E4E7]">
                            <Image
                              src={item.car.hero_image}
                              alt={item.car.title}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h4 className="font-semibold text-sm text-[#0A0A0A] truncate">
                                {item.car.title}
                              </h4>
                              <button
                                onClick={() => removeFromCart(item.car.id)}
                                aria-label="Remove item"
                                className="text-neutral-400 hover:text-red-500 transition-colors ml-2"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <p className="text-xs text-[#64748B] font-mono mt-0.5">
                              {item.car.year} &bull; {item.car.engine}
                            </p>

                            <div className="mt-2 text-sm font-bold text-[#0A0A0A]">
                              {formatNaira(currentDisplayPrice)}
                              {item.isDepositOnly && (
                                <span className="ml-2 text-[10px] font-mono font-normal uppercase text-[#0D5C3A] bg-[#0D5C3A]/10 px-1.5 py-0.5 rounded">
                                  10% Reservation Hold
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Payment Mode Selector */}
                        <div className="pt-2 border-t border-[#E4E4E7]/60 flex items-center justify-between text-xs">
                          <span className="text-[#64748B]">Purchase Mode:</span>
                          <button
                            type="button"
                            onClick={() => toggleDepositMode(item.car.id)}
                            className="font-medium text-[#0D5C3A] hover:underline cursor-pointer"
                          >
                            {item.isDepositOnly
                              ? "Switch to Full Payment"
                              : "Switch to 10% Deposit Hold"}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-[#E4E4E7] bg-white space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-[#64748B]">
                      <span>Consultation Total:</span>
                      <span className="font-mono">{formatNaira(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-[#0A0A0A] pt-1 border-t border-[#E4E4E7]">
                      <span>Due Today:</span>
                      <span className="text-[#0D5C3A]">{formatNaira(subtotal)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-[#64748B] bg-[#F7F7F8] p-2.5 rounded-lg border border-[#E4E4E7]">
                    <ShieldCheck className="w-4 h-4 text-[#0D5C3A] shrink-0" />
                    <span>Includes vehicle reservation lock & concierge inspection guarantee</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/cart"
                      onClick={closeCartDrawer}
                      className="btn-luxury-outline text-center text-xs py-3 rounded-lg"
                    >
                      View Portfolio
                    </Link>
                    <Link
                      href="/checkout"
                      onClick={closeCartDrawer}
                      className="btn-luxury-primary text-center text-xs py-3 rounded-lg"
                    >
                      Checkout <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
