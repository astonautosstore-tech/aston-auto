import { Metadata } from "next";
import CarEditorPage from "@/components/admin/CarEditorPage";

export const metadata: Metadata = {
  title: "Add Vehicle | Aston Console",
  description: "Create and publish a new vehicle to the Aston Auto showroom inventory.",
};

export default function NewCarPage() {
  return <CarEditorPage />;
}
