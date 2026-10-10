import type { Metadata } from "next";

import { LocationCreateForm } from "@/components/location-create-form";

export const metadata: Metadata = {
  title: "Crear ubicación | ARPA",
  description: "Registra una nueva ubicación deportiva",
};

export default function CreateLocationPage() {
  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <LocationCreateForm />
    </div>
  );
}
