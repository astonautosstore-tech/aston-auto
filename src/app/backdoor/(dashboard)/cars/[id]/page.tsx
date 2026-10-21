import { Metadata } from "next";
import CarEditorPage from "@/components/admin/CarEditorPage";

export const metadata: Metadata = {
  title: "Vehicle Details | Aston Console",
  description: "View and edit vehicle details.",
};

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CarEditorPage carId={id} />;
}
