import type { Metadata } from "next";

import { RegistrationsList } from "@/components/registrations-list";

export const metadata: Metadata = {
  title: "Mis inscripciones | ARPA",
  description: "Consulta los eventos en los que estás inscrito",
};

export default function RegistrationsPage() {
  return (
    <div className="space-y-6 p-6 sm:p-8 lg:p-10">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">
          Mis inscripciones
        </h1>
        <p className="text-muted-foreground">
          Consulta los eventos en los que estás inscrito o cancela tu lugar.
        </p>
      </div>
      <RegistrationsList />
    </div>
  );
}
