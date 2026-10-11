import type { Metadata } from "next";

import { EventForm } from "@/components/event-form";

export const metadata: Metadata = {
  title: "Crear evento | ARPA",
  description: "Publica un evento deportivo",
};

export default function CreateEventPage() {
  return (
    <div className="space-y-6 p-6 sm:p-8 lg:p-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight">Crear evento</h1>
        <p className="mt-1 text-muted-foreground">
          Publica la información necesaria para recibir inscripciones.
        </p>
      </div>
      <EventForm />
    </div>
  );
}
