import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LiveRaceDisplay } from "@/components/live-race-display";
import { getLocation, locations } from "@/lib/locations";

export function generateStaticParams() {
  return locations
    .filter((location) => location.liveRace)
    .map((location) => ({ slug: location.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const location = getLocation(slug);
  return {
    title: location?.liveRace ? `${location.liveRace.name} en vivo | ARPA` : "Carrera en vivo | ARPA",
  };
}

export default async function LiveRacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const location = getLocation(slug);
  if (!location?.liveRace) notFound();

  return <LiveRaceDisplay location={location} />;
}
