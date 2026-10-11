import type { Metadata } from "next";

import { EventDetail } from "@/components/event-detail";

export const metadata: Metadata = {
  title: "Mi inscripción | ARPA",
  description: "Consulta o cancela tu inscripción",
};

export default async function RegistrationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <EventDetail slug={slug} />
    </div>
  );
}
