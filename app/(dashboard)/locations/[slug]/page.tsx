import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LocationProfile } from "@/components/location-profile";
import { getLocation, locations, type BusinessLocation } from "@/lib/locations";

export function generateStaticParams() {
  return locations.map((location) => ({ slug: location.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const location = getLocation(slug);
  return { title: location ? `${location.name} | ARPA` : "Ubicación | ARPA" };
}

export default async function LocationDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const storedLocation = getLocation(slug);
  if (!storedLocation) notFound();

  const value = (key: string) => typeof query[key] === "string" ? query[key] as string : undefined;
  const location: BusinessLocation = {
    ...storedLocation,
    name: value("name") ?? storedLocation.name,
    business: value("business") ?? storedLocation.business,
    discipline: (value("discipline") as BusinessLocation["discipline"]) ?? storedLocation.discipline,
    address: value("address") ?? storedLocation.address,
    city: value("city") ?? storedLocation.city,
    description: value("description") ?? storedLocation.description,
  };

  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <LocationProfile location={location} />
    </div>
  );
}
