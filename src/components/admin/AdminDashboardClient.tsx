"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  DollarSign,
  Car as CarIcon,
  ShoppingBag,
  MessageSquare,
  Settings,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Clock,
  Search,
  ExternalLink,
  Download,
  X,
  Save,
  Shield,
  Eye,
} from "lucide-react";
import { Car, Order, Comment, SiteSettings } from "@/types/database";
import { storeApi } from "@/lib/supabase/client";
import { formatNaira } from "@/lib/utils";
import { soundEngine } from "@/lib/sound";

export default function AdminDashboardClient() {
  const [activeTab, setActiveTab] = useState<"overview" | "cars" | "orders" | "comments" | "settings">("overview");

  const [cars, setCars] = useState<Car[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // Car Dialog state
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Partial<Car> | null>(null);

  // Search filters
  const [carSearch, setCarSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    async function loadAdminData() {
      const [fetchedCars, fetchedOrders, fetchedComments, fetchedSettings] = await Promise.all([
        storeApi.getCars(),
        storeApi.getOrders(),
        storeApi.getAllCommentsForAdmin(),
        storeApi.getSiteSettings(),
      ]);
      setCars(fetchedCars);
      setOrders(fetchedOrders);
      setComments(fetchedComments);
      setSettings(fetchedSettings);
    }
    loadAdminData();
  }, []);

  // Compute metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending_payment").length;
  const availableCars = cars.filter((c) => c.status === "available").length;
  const reservedCars = cars.filter((c) => c.status === "reserved").length;
  const soldCars = cars.filter((c) => c.status === "sold").length;
  const pendingComments = comments.filter((c) => c.status === "pending").length;

  // Actions
  const handleSaveCar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCar?.title || !editingCar?.brand) return;

    soundEngine.playSuccessChime();

    const carToSave: Car = {
      id: editingCar.id || `car-${Date.now()}`,
      title: editingCar.title,
      slug: editingCar.slug || editingCar.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      brand: editingCar.brand,
      model: editingCar.model || "Custom Model",
      year: Number(editingCar.year) || 2024,
      price: Number(editingCar.price) || 100000000,
      discount_price: editingCar.discount_price ? Number(editingCar.discount_price) : null,
      mileage: Number(editingCar.mileage) || 0,
      transmission: editingCar.transmission || "Automatic",
      fuel_type: editingCar.fuel_type || "Petrol",
      body_type: editingCar.body_type || "Coupe",
      color: editingCar.color || "Obsidian Black",
      interior_color: editingCar.interior_color || "Black Leather",
      condition: editingCar.condition || "Brand New",
      engine: editingCar.engine || "V8 Twin-Turbo",
      acceleration_0_100: Number(editingCar.acceleration_0_100) || 3.5,
      top_speed_kmh: Number(editingCar.top_speed_kmh) || 300,
      horsepower: Number(editingCar.horsepower) || 600,
      torque_nm: Number(editingCar.torque_nm) || 750,
      description: editingCar.description || "Pristine showroom allocation.",
      features: editingCar.features || ["Carbon Ceramic Brakes", "Surround Audio", "Adaptive Suspension"],
      status: editingCar.status || "available",
      stock_quantity: 1,
      is_featured: Boolean(editingCar.is_featured),
      hero_image:
        editingCar.hero_image ||
        "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
      images: editingCar.images?.length
        ? editingCar.images
        : [
            editingCar.hero_image ||
              "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
          ],
      created_at: editingCar.created_at || new Date().toISOString(),
    };

    await storeApi.saveCar(carToSave);
    const updated = await storeApi.getCars();
    setCars(updated);
    setIsCarModalOpen(false);
    setEditingCar(null);
  };

  const handleDeleteCar = async (id: string) => {
    if (confirm("Are you sure you want to permanently delete this vehicle from the showroom registry?")) {
      await storeApi.deleteCar(id);
      setCars(cars.filter((c) => c.id !== id));
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order["status"]) => {
    soundEngine.playHoverTick();
    await storeApi.updateOrderStatus(orderId, status);
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  const handleModerateComment = async (
    id: string,
    status: "approved" | "hidden",
    reply?: string
  ) => {
    soundEngine.playHoverTick();
    await storeApi.updateCommentStatus(id, status, reply);
    setComments(
      comments.map((c) => (c.id === id ? { ...c, status, admin_reply: reply || c.admin_reply } : c))
    );
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    soundEngine.playSuccessChime();
    await storeApi.updateSiteSettings(settings);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const exportOrdersCSV = () => {
    soundEngine.playHoverTick();
    const headers = "Order Number,Customer,Email,Phone,Total (NGN),Status,Date\n";
    const rows = orders
      .map(
        (o) =>
          `"${o.order_number}","${o.customer_name}","${o.customer_email}","${o.customer_phone}",${o.total},"${o.status}","${o.created_at}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aston_orders_export_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0A0A0A] text-white shadow-xl mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#0D5C3A] flex items-center justify-center font-serif text-xl font-bold border border-[#C5A059]">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Aston Auto Stores — Executive Administration
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-[#0D5C3A] text-white text-[9px] font-mono font-bold uppercase">
                  Verified Admin
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">
                Central Inventory, Acquisition & Moderation Console
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/inventory"
              target="_blank"
              className="btn-luxury-outline border-white/30 text-white hover:bg-white/10 text-xs py-2 px-4 rounded-xl flex items-center gap-1.5"
            >
              <span>Live Showroom</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={() => {
                setEditingCar({
                  brand: "Aston Martin",
                  condition: "Brand New",
                  status: "available",
                  year: 2024,
                });
                setIsCarModalOpen(true);
              }}
              className="btn-luxury-primary bg-[#0D5C3A] hover:bg-[#15803d] text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Vehicle Allocation</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E4E4E7] mb-8 gap-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-4 text-xs font-bold uppercase tracking-wider transition-colors relative cursor-pointer ${
              activeTab === "overview" ? "text-[#0D5C3A]" : "text-[#64748B] hover:text-black"
            }`}
          >
            Overview & Metrics
            {activeTab === "overview" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0D5C3A]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("cars")}
            className={`pb-4 text-xs font-bold uppercase tracking-wider transition-colors relative cursor-pointer ${
              activeTab === "cars" ? "text-[#0D5C3A]" : "text-[#64748B] hover:text-black"
            }`}
          >
            Inventory ({cars.length})
            {activeTab === "cars" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0D5C3A]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-4 text-xs font-bold uppercase tracking-wider transition-colors relative cursor-pointer ${
              activeTab === "orders" ? "text-[#0D5C3A]" : "text-[#64748B] hover:text-black"
            }`}
          >
            Reservations & Orders ({orders.length})
            {activeTab === "orders" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0D5C3A]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("comments")}
            className={`pb-4 text-xs font-bold uppercase tracking-wider transition-colors relative cursor-pointer ${
              activeTab === "comments" ? "text-[#0D5C3A]" : "text-[#64748B] hover:text-black"
            }`}
          >
            Reviews Moderation ({comments.length})
            {activeTab === "comments" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0D5C3A]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`pb-4 text-xs font-bold uppercase tracking-wider transition-colors relative cursor-pointer ${
              activeTab === "settings" ? "text-[#0D5C3A]" : "text-[#64748B] hover:text-black"
            }`}
          >
            Dealership Settings
            {activeTab === "settings" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0D5C3A]" />
            )}
          </button>
        </div>

        {/* TAB 1: OVERVIEW & METRICS */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-[#F7F7F8] border border-[#E4E4E7]">
                <span className="text-[11px] font-mono uppercase text-[#64748B] block mb-1">
                  Total Portfolio Value / Volume
                </span>
                <div className="text-2xl font-bold font-mono text-[#0D5C3A]">
                  {formatNaira(totalRevenue || 520000000)}
                </div>
                <span className="text-[10px] text-[#64748B] font-mono mt-1 block">
                  {orders.length} transactions processed
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-[#F7F7F8] border border-[#E4E4E7]">
                <span className="text-[11px] font-mono uppercase text-[#64748B] block mb-1">
                  Available Allocations
                </span>
                <div className="text-2xl font-bold font-mono text-[#0A0A0A]">
                  {availableCars} <span className="text-xs text-[#64748B] font-normal">Vehicles</span>
                </div>
                <span className="text-[10px] text-[#0D5C3A] font-mono mt-1 block">
                  Ready for immediate handover
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-[#F7F7F8] border border-[#E4E4E7]">
                <span className="text-[11px] font-mono uppercase text-[#64748B] block mb-1">
                  Active Reservation Holds
                </span>
                <div className="text-2xl font-bold font-mono text-[#C5A059]">
                  {reservedCars} <span className="text-xs text-[#64748B] font-normal">Reserved</span>
                </div>
                <span className="text-[10px] text-[#64748B] font-mono mt-1 block">
                  Locked in consultation
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-[#F7F7F8] border border-[#E4E4E7]">
                <span className="text-[11px] font-mono uppercase text-[#64748B] block mb-1">
                  Pending Moderation
                </span>
                <div className="text-2xl font-bold font-mono text-[#0A0A0A]">
                  {pendingComments} <span className="text-xs text-[#64748B] font-normal">Reviews</span>
                </div>
                <span className="text-[10px] text-[#64748B] font-mono mt-1 block">
                  Awaiting review approval
                </span>
              </div>
            </div>

            {/* Quick Actions & Recent Orders Table */}
            <div className="p-6 rounded-2xl bg-[#F7F7F8] border border-[#E4E4E7]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#0A0A0A]">
                  Recent Client Acquisitions
                </h3>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-xs font-semibold text-[#0D5C3A] hover:underline"
                >
                  View All Orders &rarr;
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-[#E4E4E7] text-[#64748B] font-mono">
                      <th className="pb-3">Order Number</th>
                      <th className="pb-3">Client</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4E4E7]">
                    {orders.slice(0, 5).map((o) => (
                      <tr key={o.id} className="py-2.5">
                        <td className="py-3 font-mono font-bold text-[#0A0A0A]">
                          #{o.order_number}
                        </td>
                        <td className="py-3 text-[#0A0A0A] font-semibold">{o.customer_name}</td>
                        <td className="py-3 font-mono text-[#0D5C3A] font-bold">
                          {formatNaira(o.total)}
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-amber-100 text-amber-800 font-bold">
                            {o.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-3 font-mono text-neutral-400">
                          {new Date(o.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CARS INVENTORY */}
        {activeTab === "cars" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter inventory..."
                  value={carSearch}
                  onChange={(e) => setCarSearch(e.target.value)}
                  className="w-full bg-[#F7F7F8] border border-[#E4E4E7] rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#0D5C3A]"
                />
              </div>

              <button
                onClick={() => {
                  setEditingCar({
                    brand: "Aston Martin",
                    condition: "Brand New",
                    status: "available",
                    year: 2024,
                  });
                  setIsCarModalOpen(true);
                }}
                className="btn-luxury-primary text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer w-full sm:w-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Vehicle</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[#E4E4E7] bg-white">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-[#F7F7F8] border-b border-[#E4E4E7] text-[#64748B] font-mono">
                    <th className="p-4">Vehicle</th>
                    <th className="p-4">Marque / Year</th>
                    <th className="p-4">Price (NGN)</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Specs</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E4E7]">
                  {cars
                    .filter((c) => c.title.toLowerCase().includes(carSearch.toLowerCase()))
                    .map((car) => (
                      <tr key={car.id} className="hover:bg-[#F7F7F8]/50 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-neutral-100 shrink-0 border border-[#E4E4E7]">
                            <Image
                              src={car.hero_image}
                              alt={car.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <strong className="text-[#0A0A0A] block truncate max-w-xs">
                              {car.title}
                            </strong>
                            <span className="text-[10px] text-[#64748B] font-mono">
                              Slug: /{car.slug}
                            </span>
                          </div>
                        </td>

                        <td className="p-4 font-mono">
                          {car.brand} &bull; {car.year}
                        </td>

                        <td className="p-4 font-mono font-bold text-[#0A0A0A]">
                          {formatNaira(car.price)}
                          {car.discount_price && (
                            <span className="block text-[10px] text-[#0D5C3A]">
                              Disc: {formatNaira(car.discount_price)}
                            </span>
                          )}
                        </td>

                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold ${
                              car.status === "available"
                                ? "bg-green-100 text-green-800"
                                : car.status === "reserved"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-neutral-200 text-neutral-800"
                            }`}
                          >
                            {car.status}
                          </span>
                        </td>

                        <td className="p-4 font-mono text-[11px] text-[#64748B]">
                          {car.horsepower} HP &bull; {car.acceleration_0_100}s
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingCar(car);
                                setIsCarModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg border border-[#E4E4E7] hover:bg-neutral-100 text-[#0A0A0A] cursor-pointer"
                              title="Edit Car"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteCar(car.id)}
                              className="p-1.5 rounded-lg border border-[#E4E4E7] hover:bg-red-50 text-red-500 cursor-pointer"
                              title="Delete Car"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter orders..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full bg-[#F7F7F8] border border-[#E4E4E7] rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#0D5C3A]"
                />
              </div>

              <button
                onClick={exportOrdersCSV}
                className="btn-luxury-outline text-xs py-2 px-4 rounded-xl flex items-center gap-2 cursor-pointer w-full sm:w-auto"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[#E4E4E7] bg-white">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-[#F7F7F8] border-b border-[#E4E4E7] text-[#64748B] font-mono">
                    <th className="p-4">Order #</th>
                    <th className="p-4">Client Details</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Transit</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E4E7]">
                  {orders
                    .filter(
                      (o) =>
                        o.order_number.toLowerCase().includes(orderSearch.toLowerCase()) ||
                        o.customer_name.toLowerCase().includes(orderSearch.toLowerCase())
                    )
                    .map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#F7F7F8]/50 transition-colors">
                        <td className="p-4 font-mono font-bold text-[#0A0A0A]">
                          #{ord.order_number}
                        </td>

                        <td className="p-4">
                          <strong className="text-[#0A0A0A] block">{ord.customer_name}</strong>
                          <span className="text-[10px] text-[#64748B] font-mono">
                            {ord.customer_phone} &bull; {ord.customer_email}
                          </span>
                        </td>

                        <td className="p-4 font-mono font-bold text-[#0D5C3A]">
                          {formatNaira(ord.total)}
                        </td>

                        <td className="p-4 capitalize text-[11px] text-[#64748B]">
                          {ord.delivery_method}
                        </td>

                        <td className="p-4">
                          <select
                            value={ord.status}
                            onChange={(e) =>
                              handleUpdateOrderStatus(ord.id, e.target.value as Order["status"])
                            }
                            className="bg-[#F7F7F8] border border-[#E4E4E7] rounded-lg px-2 py-1 text-[11px] font-mono focus:outline-none"
                          >
                            <option value="pending_payment">pending_payment</option>
                            <option value="paid">paid</option>
                            <option value="processing">processing</option>
                            <option value="completed">completed</option>
                            <option value="cancelled">cancelled</option>
                          </select>
                        </td>

                        <td className="p-4 text-right">
                          <Link
                            href={`/order-success/${ord.order_number}`}
                            target="_blank"
                            className="p-1.5 rounded-lg border border-[#E4E4E7] hover:bg-neutral-100 text-[#0A0A0A] inline-flex items-center gap-1 font-mono text-[11px]"
                          >
                            <span>Receipt</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: COMMENTS MODERATION */}
        {activeTab === "comments" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-[#64748B]">
                Only approved reviews appear publicly on vehicle pages.
              </span>
            </div>

            <div className="space-y-4">
              {comments.map((comm) => (
                <div
                  key={comm.id}
                  className="p-5 rounded-2xl bg-[#F7F7F8] border border-[#E4E4E7] flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3">
                      <strong className="text-xs text-[#0A0A0A]">{comm.user_name}</strong>
                      <span className="text-[10px] text-[#C5A059] font-bold">
                        ★ {comm.rating} / 5
                      </span>
                      <span
                        className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded-full ${
                          comm.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {comm.status}
                      </span>
                    </div>

                    <p className="text-xs text-[#64748B] italic leading-relaxed">
                      &ldquo;{comm.body}&rdquo;
                    </p>

                    {comm.admin_reply && (
                      <p className="text-[11px] text-[#0D5C3A] font-medium pt-1">
                        Admin Reply: {comm.admin_reply}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto">
                    {comm.status !== "approved" && (
                      <button
                        onClick={() => handleModerateComment(comm.id, "approved")}
                        className="px-3 py-1.5 bg-[#0D5C3A] text-white rounded-lg text-xs font-semibold hover:bg-[#15803d] cursor-pointer"
                      >
                        Approve
                      </button>
                    )}

                    {comm.status !== "hidden" && (
                      <button
                        onClick={() => handleModerateComment(comm.id, "hidden")}
                        className="px-3 py-1.5 bg-white border border-[#E4E4E7] text-[#0A0A0A] rounded-lg text-xs hover:bg-neutral-100 cursor-pointer"
                      >
                        Hide
                      </button>
                    )}

                    <button
                      onClick={() => {
                        const reply = prompt("Enter Concierge reply to client:", comm.admin_reply || "");
                        if (reply !== null) {
                          handleModerateComment(comm.id, "approved", reply);
                        }
                      }}
                      className="px-3 py-1.5 bg-white border border-[#E4E4E7] text-[#0A0A0A] rounded-lg text-xs hover:bg-neutral-100 cursor-pointer"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SITE SETTINGS */}
        {activeTab === "settings" && settings && (
          <form onSubmit={handleSaveSettings} className="max-w-2xl space-y-6">
            {settingsSaved && (
              <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Site settings updated successfully.</span>
              </div>
            )}

            <div className="p-6 rounded-2xl bg-[#F7F7F8] border border-[#E4E4E7] space-y-4">
              <div>
                <label className="text-xs text-[#64748B] block mb-1">Company Name</label>
                <input
                  type="text"
                  value={settings.company_name}
                  onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                  className="w-full bg-white border border-[#E4E4E7] rounded-xl px-3.5 py-2.5 text-xs text-[#0A0A0A]"
                />
              </div>

              <div>
                <label className="text-xs text-[#64748B] block mb-1">VIP Concierge Telephone</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full bg-white border border-[#E4E4E7] rounded-xl px-3.5 py-2.5 text-xs text-[#0A0A0A]"
                />
              </div>

              <div>
                <label className="text-xs text-[#64748B] block mb-1">WhatsApp Direct Line</label>
                <input
                  type="text"
                  value={settings.whatsapp}
                  onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                  className="w-full bg-white border border-[#E4E4E7] rounded-xl px-3.5 py-2.5 text-xs text-[#0A0A0A]"
                />
              </div>

              <div>
                <label className="text-xs text-[#64748B] block mb-1">Flagship Salon Address</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full bg-white border border-[#E4E4E7] rounded-xl px-3.5 py-2.5 text-xs text-[#0A0A0A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#64748B] block mb-1">Deposit Rate (%)</label>
                  <input
                    type="number"
                    value={settings.deposit_percentage}
                    onChange={(e) =>
                      setSettings({ ...settings, deposit_percentage: Number(e.target.value) })
                    }
                    className="w-full bg-white border border-[#E4E4E7] rounded-xl px-3.5 py-2.5 text-xs text-[#0A0A0A]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#64748B] block mb-1">Enclosed Delivery Fee (₦)</label>
                  <input
                    type="number"
                    value={settings.flat_delivery_fee}
                    onChange={(e) =>
                      setSettings({ ...settings, flat_delivery_fee: Number(e.target.value) })
                    }
                    className="w-full bg-white border border-[#E4E4E7] rounded-xl px-3.5 py-2.5 text-xs text-[#0A0A0A]"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn-luxury-primary text-xs py-3.5 px-8 rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Save Dealership Settings</span>
            </button>
          </form>
        )}

        {/* Add/Edit Car Modal Dialog */}
        {isCarModalOpen && editingCar && (
          <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-8 border border-[#E4E4E7] shadow-2xl relative my-8">
              <button
                onClick={() => {
                  setIsCarModalOpen(false);
                  setEditingCar(null);
                }}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-bold text-[#0A0A0A] mb-4">
                {editingCar.id ? "Edit Vehicle Allocation" : "Add New Vehicle Allocation"}
              </h2>

              <form onSubmit={handleSaveCar} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[#64748B] block mb-1">Title *</label>
                    <input
                      type="text"
                      required
                      value={editingCar.title || ""}
                      onChange={(e) => setEditingCar({ ...editingCar, title: e.target.value })}
                      placeholder="e.g. Aston Martin DBS 770"
                      className="w-full bg-[#F7F7F8] border border-[#E4E4E7] rounded-xl px-3 py-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#64748B] block mb-1">Marque Brand *</label>
                    <input
                      type="text"
                      required
                      value={editingCar.brand || ""}
                      onChange={(e) => setEditingCar({ ...editingCar, brand: e.target.value })}
                      placeholder="Aston Martin"
                      className="w-full bg-[#F7F7F8] border border-[#E4E4E7] rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-[#64748B] block mb-1">Model Year *</label>
                    <input
                      type="number"
                      required
                      value={editingCar.year || 2024}
                      onChange={(e) => setEditingCar({ ...editingCar, year: Number(e.target.value) })}
                      className="w-full bg-[#F7F7F8] border border-[#E4E4E7] rounded-xl px-3 py-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#64748B] block mb-1">Price in NGN *</label>
                    <input
                      type="number"
                      required
                      value={editingCar.price || ""}
                      onChange={(e) => setEditingCar({ ...editingCar, price: Number(e.target.value) })}
                      className="w-full bg-[#F7F7F8] border border-[#E4E4E7] rounded-xl px-3 py-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#64748B] block mb-1">Discount Price (NGN)</label>
                    <input
                      type="number"
                      value={editingCar.discount_price || ""}
                      onChange={(e) =>
                        setEditingCar({ ...editingCar, discount_price: Number(e.target.value) || null })
                      }
                      className="w-full bg-[#F7F7F8] border border-[#E4E4E7] rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-[#64748B] block mb-1">Horsepower</label>
                    <input
                      type="number"
                      value={editingCar.horsepower || ""}
                      onChange={(e) =>
                        setEditingCar({ ...editingCar, horsepower: Number(e.target.value) })
                      }
                      className="w-full bg-[#F7F7F8] border border-[#E4E4E7] rounded-xl px-3 py-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#64748B] block mb-1">0-100 km/h (sec)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingCar.acceleration_0_100 || ""}
                      onChange={(e) =>
                        setEditingCar({ ...editingCar, acceleration_0_100: Number(e.target.value) })
                      }
                      className="w-full bg-[#F7F7F8] border border-[#E4E4E7] rounded-xl px-3 py-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#64748B] block mb-1">Top Speed (km/h)</label>
                    <input
                      type="number"
                      value={editingCar.top_speed_kmh || ""}
                      onChange={(e) =>
                        setEditingCar({ ...editingCar, top_speed_kmh: Number(e.target.value) })
                      }
                      className="w-full bg-[#F7F7F8] border border-[#E4E4E7] rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[#64748B] block mb-1">Status</label>
                    <select
                      value={editingCar.status || "available"}
                      onChange={(e) =>
                        setEditingCar({ ...editingCar, status: e.target.value as Car["status"] })
                      }
                      className="w-full bg-[#F7F7F8] border border-[#E4E4E7] rounded-xl px-3 py-2 text-xs"
                    >
                      <option value="available">Available</option>
                      <option value="reserved">Reserved</option>
                      <option value="sold">Sold</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-[#64748B] block mb-1">Condition</label>
                    <select
                      value={editingCar.condition || "Brand New"}
                      onChange={(e) =>
                        setEditingCar({ ...editingCar, condition: e.target.value as Car["condition"] })
                      }
                      className="w-full bg-[#F7F7F8] border border-[#E4E4E7] rounded-xl px-3 py-2 text-xs"
                    >
                      <option value="Brand New">Brand New</option>
                      <option value="Certified Pre-Owned">Certified Pre-Owned</option>
                      <option value="Classic / Collector">Classic / Collector</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[#64748B] block mb-1">Hero Image URL</label>
                  <input
                    type="url"
                    value={editingCar.hero_image || ""}
                    onChange={(e) => setEditingCar({ ...editingCar, hero_image: e.target.value })}
                    className="w-full bg-[#F7F7F8] border border-[#E4E4E7] rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#64748B] block mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editingCar.description || ""}
                    onChange={(e) => setEditingCar({ ...editingCar, description: e.target.value })}
                    className="w-full bg-[#F7F7F8] border border-[#E4E4E7] rounded-xl px-3 py-2 text-xs resize-none"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCarModalOpen(false)}
                    className="btn-luxury-outline text-xs py-2 px-4 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-luxury-primary text-xs py-2 px-6 rounded-xl cursor-pointer"
                  >
                    Save Allocation
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
