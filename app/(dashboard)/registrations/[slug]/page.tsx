import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RegistrationStatistics } from "@/components/registration-statistics";
import { getRegistration, registrations } from "@/lib/registrations";

export function generateStaticParams() {
  return registrations.map((registration) => ({ slug: registration.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const registration = getRegistration(slug);

  return {
    title: registration
      ? `${registration.title} | ARPA`
      : "Inscripción | ARPA",
    description: "Estadísticas y desempeño del evento",
  };
}

export default async function RegistrationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const registration = getRegistration(slug);

  if (!registration) {
    notFound();
  }

  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <RegistrationStatistics registration={registration} />
    </div>
  );
}
