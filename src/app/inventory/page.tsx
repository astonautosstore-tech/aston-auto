import { Metadata } from "next";
import { createPublicClient } from "@/lib/supabase/public";
import InventoryClient from "@/components/inventory/InventoryClient";
import { Car } from "@/types/database";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Inventory | Aston",
  description:
    "Explore our complete showroom collection of exotic supercars, luxury SUVs, and bespoke grand tourers with certified inspection and nationwide white-glove delivery.",
};

export default async function InventoryPage() {
  const publicClient = createPublicClient();
  const { data: rawCars } = await publicClient
    .from("cars")
    .select("*")
    .order("created_at", { ascending: false });

  const cars = (rawCars as Car[]) || [];

  return <InventoryClient initialCars={cars} />;
}
