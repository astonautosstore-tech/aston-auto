import { Metadata } from "next";
import { storeApi } from "@/lib/supabase/client";
import InventoryClient from "@/components/inventory/InventoryClient";

export const metadata: Metadata = {
  title: "Inventory | Aston Auto Stores",
  description:
    "Explore our complete collection of exotic supercars, luxury SUVs, and bespoke grand tourers available for immediate delivery in Lagos, Abuja, and throughout Nigeria.",
};

export default async function InventoryPage() {
  const cars = await storeApi.getCars();

  return <InventoryClient initialCars={cars} />;
}
