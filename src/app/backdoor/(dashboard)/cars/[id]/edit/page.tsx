import { Metadata } from "next";
import CarEditorPage from "@/components/admin/CarEditorPage";

export const metadata: Metadata = {
  title: "Edit Vehicle | Aston Console",
  description: "Modify specifications, pricing, and photography for this vehicle.",
};

export default async function EditCarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CarEditorPage carId={id} />;
}
