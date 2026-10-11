import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { MyEventsList } from "@/components/my-events-list";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Mis eventos | ARPA",
  description: "Administra tus eventos deportivos",
};

export default function EventsPage() {
  return (
    <div className="space-y-6 p-6 sm:p-8 lg:p-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Mis eventos</h1>
          <p className="mt-1 text-muted-foreground">
            Crea, edita y consulta las inscripciones de tus eventos.
          </p>
        </div>
        <Button
          className="cursor-pointer"
          nativeButton={false}
          render={<Link href="/events/create" />}
        >
          <Plus /> Crear evento
        </Button>
      </div>
      <MyEventsList />
    </div>
  );
}
