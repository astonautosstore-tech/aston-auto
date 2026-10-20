"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  ShoppingBag,
  Heart,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  LogOut,
} from "lucide-react";
import { Order, Car, Comment } from "@/types/database";
import { storeApi } from "@/lib/supabase/client";
import { useStore } from "@/lib/store/useStore";
import { formatNaira } from "@/lib/utils";
import { soundEngine } from "@/lib/sound";

export default function AccountClient() {
  const [activeTab, setActiveTab] = useState<"orders" | "wishlist" | "reviews" | "profile">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const { wishlist, removeFromCart, addToCart, toggleWishlist } = useStore();

  useEffect(() => {
    async function loadData() {
      const [fetchedOrders, fetchedCars, fetchedComments] = await Promise.all([
        storeApi.getOrders(),
        storeApi.getCars(),
        storeApi.getComments(),
      ]);
      setOrders(fetchedOrders);
      setAllCars(fetchedCars);
      setComments(fetchedComments);
    }
    loadData();
  }, []);

  const savedCars = allCars.filter((c) => wishlist.includes(c.id));

  return (
    <div className="min-h-screen bg-white pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Profile Bar */}
        <div className="p-8 rounded-3xl bg-[#F7F7F8] border border-[#E4E4E7] shadow-sm mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-[#0D5C3A] text-white flex items-center justify-center font-bold text-xl border-2 border-[#C5A059]">
              AD
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-[#0A0A0A]">Chief Adeleke Danjuma</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#0D5C3A]/10 text-[#0D5C3A] text-[10px] font-mono font-bold uppercase tracking-wider">
                  VIP Patron
                </span>
              </div>
              <p className="text-xs text-[#64748B] font-mono mt-0.5">
                vip.danjuma@capitalgroup.ng &bull; Ikoyi, Lagos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="btn-luxury-outline text-xs py-2.5 px-4 rounded-xl flex items-center gap-2"
            >
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E4E4E7] mb-8 gap-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              soundEngine.playHoverTick();
              setActiveTab("orders");
            }}
            className={`pb-4 text-xs font-bold uppercase tracking-wider transition-colors relative cursor-pointer ${
              activeTab === "orders" ? "text-[#0D5C3A]" : "text-[#64748B] hover:text-[#0A0A0A]"
            }`}
          >
            Reserved Allocations ({orders.length})
            {activeTab === "orders" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0D5C3A]" />
            )}
          </button>

          <button
            onClick={() => {
              soundEngine.playHoverTick();
              setActiveTab("wishlist");
            }}
            className={`pb-4 text-xs font-bold uppercase tracking-wider transition-colors relative cursor-pointer ${
              activeTab === "wishlist" ? "text-[#0D5C3A]" : "text-[#64748B] hover:text-[#0A0A0A]"
            }`}
          >
            Saved Garage ({savedCars.length})
            {activeTab === "wishlist" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0D5C3A]" />
            )}
          </button>

          <button
            onClick={() => {
              soundEngine.playHoverTick();
              setActiveTab("reviews");
            }}
            className={`pb-4 text-xs font-bold uppercase tracking-wider transition-colors relative cursor-pointer ${
              activeTab === "reviews" ? "text-[#0D5C3A]" : "text-[#64748B] hover:text-[#0A0A0A]"
            }`}
          >
            My Appraisals ({comments.length})
            {activeTab === "reviews" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0D5C3A]" />
            )}
          </button>

          <button
            onClick={() => {
              soundEngine.playHoverTick();
              setActiveTab("profile");
            }}
            className={`pb-4 text-xs font-bold uppercase tracking-wider transition-colors relative cursor-pointer ${
              activeTab === "profile" ? "text-[#0D5C3A]" : "text-[#64748B] hover:text-[#0A0A0A]"
            }`}
          >
            Client Profile
            {activeTab === "profile" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0D5C3A]" />
            )}
          </button>
        </div>

        {/* TAB 1: ORDERS / RESERVATIONS */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-[#F7F7F8] border border-[#E4E4E7]">
                <ShoppingBag className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-[#0A0A0A]">No Active Reservations</h3>
                <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
                  You have not placed any reservation holds yet.
                </p>
                <Link
                  href="/inventory"
                  className="mt-6 inline-block btn-luxury-primary text-xs py-2.5 px-6 rounded-full"
                >
                  Explore Supercars
                </Link>
              </div>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-6 rounded-2xl bg-white border border-[#E4E4E7] shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E4E4E7] gap-2">
                    <div>
                      <span className="text-xs font-mono font-bold text-[#0A0A0A]">
                        Order #{ord.order_number}
                      </span>
                      <span className="text-[11px] text-[#64748B] font-mono ml-3">
                        {new Date(ord.created_at).toLocaleDateString("en-NG", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider ${
                          ord.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : ord.status === "paid"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {ord.status.replace("_", " ")}
                      </span>

                      <Link
                        href={`/order-success/${ord.order_number}`}
                        className="text-xs font-semibold text-[#0D5C3A] hover:underline"
                      >
                        View Receipt &rarr;
                      </Link>
                    </div>
                  </div>

                  {/* Line Items */}
                  <div className="space-y-3">
                    {ord.items && ord.items.length > 0 ? (
                      ord.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <div>
                            <strong className="text-[#0A0A0A] block">
                              {item.car?.title || "Luxury Supercar Allocation"}
                            </strong>
                            <span className="text-[10px] text-[#64748B] font-mono">
                              Transit: {ord.delivery_method}
                            </span>
                          </div>
                          <span className="font-mono font-bold text-[#0A0A0A]">
                            {formatNaira(item.price_at_purchase)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="flex justify-between items-center text-xs">
                        <div>
                          <strong className="text-[#0A0A0A] block">
                            Aston Martin DBS 770 Ultimate
                          </strong>
                          <span className="text-[10px] text-[#64748B] font-mono">
                            Transit: {ord.delivery_method}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-[#0A0A0A]">
                          {formatNaira(ord.total)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#E4E4E7] flex justify-between items-center text-xs font-mono">
                    <span className="text-[#64748B]">Total Amount:</span>
                    <span className="text-base font-bold text-[#0D5C3A]">
                      {formatNaira(ord.total)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: WISHLIST */}
        {activeTab === "wishlist" && (
          <div>
            {savedCars.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-[#F7F7F8] border border-[#E4E4E7]">
                <Heart className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-[#0A0A0A]">Your Garage is Empty</h3>
                <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
                  Click the heart icon on any supercar to save it for consultation.
                </p>
                <Link
                  href="/inventory"
                  className="mt-6 inline-block btn-luxury-primary text-xs py-2.5 px-6 rounded-full"
                >
                  Browse Inventory
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {savedCars.map((car) => (
                  <div
                    key={car.id}
                    className="glass-card rounded-2xl overflow-hidden bg-white border border-[#E4E4E7] flex flex-col justify-between"
                  >
                    <div className="relative aspect-[16/10] bg-neutral-100">
                      <Image
                        src={car.hero_image}
                        alt={car.title}
                        fill
                        className="object-cover"
                      />
                      <button
                        onClick={() => toggleWishlist(car.id)}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white text-red-500 shadow-md"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-[#64748B] uppercase">
                          {car.brand} &bull; {car.year}
                        </span>
                        <Link
                          href={`/cars/${car.slug}`}
                          className="text-sm font-bold text-[#0A0A0A] block truncate mt-1 hover:text-[#0D5C3A]"
                        >
                          {car.title}
                        </Link>
                        <span className="text-base font-bold font-mono text-[#0A0A0A] block mt-2">
                          {formatNaira(car.discount_price ?? car.price)}
                        </span>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#E4E4E7] flex gap-2">
                        <button
                          onClick={(e) => addToCart(car, true, e.currentTarget)}
                          className="btn-luxury-primary text-xs py-2 flex-1 rounded-lg text-center cursor-pointer"
                        >
                          Reserve 10%
                        </button>
                        <Link
                          href={`/cars/${car.slug}`}
                          className="btn-luxury-outline text-xs py-2 px-3 rounded-lg text-center"
                        >
                          Dossier
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: REVIEWS */}
        {activeTab === "reviews" && (
          <div className="space-y-4">
            {comments.slice(0, 3).map((comm) => (
              <div
                key={comm.id}
                className="p-5 rounded-2xl bg-white border border-[#E4E4E7] space-y-2 shadow-xs"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#0A0A0A]">
                    {comm.user_name} &bull; {comm.rating} Stars
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {new Date(comm.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-[#64748B]">{comm.body}</p>
                {comm.admin_reply && (
                  <div className="p-2.5 bg-[#F7F7F8] rounded-lg text-[11px] text-[#0D5C3A]">
                    <strong>Concierge Response:</strong> {comm.admin_reply}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: PROFILE */}
        {activeTab === "profile" && (
          <div className="max-w-2xl p-8 rounded-2xl bg-[#F7F7F8] border border-[#E4E4E7] space-y-4 text-xs font-mono">
            <h3 className="text-sm font-bold text-[#0A0A0A] uppercase tracking-wider mb-4 font-sans">
              VIP Client Credentials
            </h3>
            <div className="flex justify-between py-2 border-b border-[#E4E4E7]">
              <span className="text-[#64748B]">Full Name:</span>
              <strong className="text-[#0A0A0A]">Chief Adeleke Danjuma</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-[#E4E4E7]">
              <span className="text-[#64748B]">Executive Email:</span>
              <strong className="text-[#0A0A0A]">vip.danjuma@capitalgroup.ng</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-[#E4E4E7]">
              <span className="text-[#64748B]">Phone:</span>
              <strong className="text-[#0A0A0A]">+234 812 345 6789</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-[#E4E4E7]">
              <span className="text-[#64748B]">Primary Delivery Residence:</span>
              <strong className="text-[#0A0A0A]">10 Bourdillon Road, Ikoyi, Lagos</strong>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-[#64748B]">Patron Tier:</span>
              <strong className="text-[#0D5C3A]">Founding Member &bull; Verified Discretion</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
