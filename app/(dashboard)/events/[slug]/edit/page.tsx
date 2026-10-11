import type { Metadata } from "next";

import { EventEdit } from "@/components/event-edit";

export const metadata: Metadata = {
  title: "Editar evento | ARPA",
};

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div className="space-y-6 p-6 sm:p-8 lg:p-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight">Editar evento</h1>
        <p className="mt-1 text-muted-foreground">
          Mantén actualizada la información para los participantes.
        </p>
      </div>
      <EventEdit slug={slug} />
    </div>
  );
}
