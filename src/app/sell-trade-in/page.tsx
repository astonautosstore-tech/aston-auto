import { Metadata } from "next";
import TradeInClient from "@/components/forms/TradeInClient";

export const metadata: Metadata = {
  title: "Sell or Trade-In Your Exotic | Aston Auto Stores",
  description: "Receive certified luxury market equity for your current supercar or trade in towards any allocation at Aston Auto Stores.",
};

export default function TradeInPage() {
  return <TradeInClient />;
}
