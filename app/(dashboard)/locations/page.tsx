import type { Metadata } from "next";

import { LocationsList } from "@/components/locations-list";

export const metadata: Metadata = {
  title: "Mis ubicaciones | ARPA",
  description: "Administra las ubicaciones de tu negocio",
};

export default function LocationsPage() {
  return (
    <div className="space-y-6 p-6 sm:p-8 lg:p-10">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Mis ubicaciones</h1>
        <p className="text-muted-foreground">
          Registra instalaciones, fotografías y mapas de sus circuitos.
        </p>
      </div>
      <LocationsList />
    </div>
  );
}
