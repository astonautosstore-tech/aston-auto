import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Printer, MessageCircle, ShieldCheck, ArrowRight, Home } from "lucide-react";
import { storeApi } from "@/lib/supabase/client";
import { formatNaira } from "@/lib/utils";

interface OrderSuccessProps {
  params: Promise<{ orderNumber: string }>;
}

export const metadata: Metadata = {
  title: "Allocation Confirmed | Aston Auto Stores",
  description: "Your luxury vehicle allocation receipt and reservation confirmation.",
};

export default async function OrderSuccessPage({ params }: OrderSuccessProps) {
  const { orderNumber } = await params;
  const orders = await storeApi.getOrders();
  const order = orders.find((o) => o.order_number === orderNumber);

  return (
    <div className="min-h-screen bg-white pt-28 pb-24 print:pt-4 print:pb-4">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Celebration Header (hidden in print) */}
        <div className="text-center mb-10 print:hidden">
          <div className="w-16 h-16 rounded-full bg-[#0D5C3A]/10 text-[#0D5C3A] flex items-center justify-center mx-auto mb-4 border border-[#0D5C3A]/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#0D5C3A] font-bold">
            Reservation Confirmed &bull; Status: Locked
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0A0A0A] tracking-tight mt-2">
            Vehicle Allocation Reserved
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-2 max-w-md mx-auto">
            Your vehicle has been marked as <strong>Reserved</strong> in our inventory and locked against competing purchases.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`https://wa.me/2348123456789?text=Hello%20Aston%20Auto%20Concierge,%20confirming%20my%20reservation%20${orderNumber}`}
              target="_blank"
              rel="noreferrer"
              className="btn-luxury-primary text-xs py-2.5 px-5 rounded-full flex items-center gap-2 bg-[#25D366] text-white hover:bg-[#1EBE5D]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contact Concierge on WhatsApp</span>
            </Link>

            <Link
              href="/inventory"
              className="btn-luxury-outline text-xs py-2.5 px-5 rounded-full flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>Return to Showroom</span>
            </Link>
          </div>
        </div>

        {/* Printable Luxury Invoice / Certificate */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#F7F7F8] border border-[#E4E4E7] shadow-xl print:shadow-none print:border-none print:p-0">
          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-8 border-b border-[#E4E4E7] gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-xl text-[#0D5C3A]">ASTON AUTO</span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#64748B]">STORES</span>
              </div>
              <p className="text-[11px] text-[#64748B] mt-1 font-mono">
                14 Alexander Avenue, Ikoyi, Lagos &bull; +234 812 345 6789
              </p>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono block">
                Official Reservation Certificate
              </span>
              <span className="text-sm font-mono font-bold text-[#0A0A0A]">
                #{orderNumber}
              </span>
              <span className="text-[10px] text-[#64748B] font-mono block">
                {new Date().toLocaleDateString("en-NG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Client & Delivery Info */}
          <div className="grid grid-cols-2 gap-6 py-6 border-b border-[#E4E4E7] text-xs">
            <div>
              <span className="text-[10px] uppercase font-mono text-[#64748B] block mb-1">
                Client Dossier:
              </span>
              <strong className="text-sm font-bold text-[#0A0A0A] block">
                {order ? order.customer_name : "VIP Client"}
              </strong>
              <p className="text-[#64748B] font-mono mt-0.5">
                {order ? order.customer_email : "vip@astonautostores.com"}
              </p>
              <p className="text-[#64748B] font-mono">
                {order ? order.customer_phone : "+234 812 345 6789"}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono text-[#64748B] block mb-1">
                Handover Protocol:
              </span>
              <strong className="text-xs font-semibold text-[#0A0A0A] block capitalize">
                {order ? order.delivery_method : "Enclosed Transporter"}
              </strong>
              <p className="text-[#64748B] mt-0.5 text-[11px]">
                {order?.delivery_address || "Ikoyi Showroom VIP Salon Handover"}
              </p>
              <span className="inline-block mt-1 text-[10px] font-mono uppercase text-[#0D5C3A] font-bold bg-[#0D5C3A]/10 px-2 py-0.5 rounded">
                Allocation Status: Reserved
              </span>
            </div>
          </div>

          {/* Items Table */}
          <div className="py-6 border-b border-[#E4E4E7]">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left font-mono text-[#64748B] border-b border-[#E4E4E7]/60 pb-2">
                  <th className="pb-2">Vehicle Specification</th>
                  <th className="pb-2 text-right">Acquisition Terms</th>
                  <th className="pb-2 text-right">Allocation Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E4E7]/50 font-mono">
                {order?.items && order.items.length > 0 ? (
                  order.items.map((item, idx) => (
                    <tr key={idx} className="py-3">
                      <td className="py-3">
                        <strong className="text-[#0A0A0A] block">
                          {item.car?.title || "Luxury Supercar Allocation"}
                        </strong>
                        <span className="text-[10px] text-[#64748B]">
                          {item.car?.year} &bull; {item.car?.engine}
                        </span>
                      </td>
                      <td className="py-3 text-right text-[#64748B]">
                        10% Reservation Hold
                      </td>
                      <td className="py-3 text-right font-bold text-[#0A0A0A]">
                        {formatNaira(item.price_at_purchase)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-3">Aston Martin DBS 770 Ultimate Coupe</td>
                    <td className="py-3 text-right text-[#64748B]">10% Reservation Hold</td>
                    <td className="py-3 text-right font-bold text-[#0A0A0A]">₦49,500,000</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="py-6 space-y-2 text-xs font-mono text-[#64748B]">
            <div className="flex justify-between">
              <span>Deposit Subtotal:</span>
              <span className="text-[#0A0A0A] font-bold">
                {formatNaira(order ? order.subtotal : 49500000)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Documentation & Legal Title:</span>
              <span className="text-[#0A0A0A]">{formatNaira(250000)}</span>
            </div>
            <div className="flex justify-between">
              <span>Transit & Customs Handling:</span>
              <span className="text-[#0D5C3A] font-semibold">Complimentary</span>
            </div>
            <div className="pt-4 border-t border-[#E4E4E7] flex justify-between text-base font-bold text-[#0A0A0A]">
              <span>Total Settlement:</span>
              <span className="text-[#0D5C3A] text-lg">
                {formatNaira(order ? order.total : 49750000)}
              </span>
            </div>
          </div>

          {/* Bank Wire Details Box */}
          <div className="mt-6 p-4 rounded-xl bg-white border border-[#E4E4E7] text-xs space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-[#0D5C3A] font-bold block">
              Escrow Wire Transfer Instructions:
            </span>
            <div className="grid grid-cols-2 gap-2 text-[#0A0A0A] font-mono text-[11px]">
              <div>
                Bank: <strong>Zenith Bank Plc (Private Banking)</strong>
              </div>
              <div>
                Account Name: <strong>Aston Auto Stores Ltd</strong>
              </div>
              <div>
                Account No (NGN): <strong>1019283746</strong>
              </div>
              <div>
                Reference: <strong>{orderNumber}</strong>
              </div>
            </div>
          </div>

          {/* Security Assurance */}
          <div className="mt-8 pt-6 border-t border-[#E4E4E7] flex items-center justify-between text-[11px] text-[#64748B]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0D5C3A]" />
              <span>Certified Authenticity Guaranteed &bull; Aston Auto Stores Concierge</span>
            </div>
            <span className="font-mono">Authorized Signature: ___________________</span>
          </div>
        </div>
      </div>
    </div>
  );
}
