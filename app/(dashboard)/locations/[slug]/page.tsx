import type { Metadata } from "next";
import { LocationProfile } from "@/components/location-profile";

export const metadata: Metadata = { title: "Ubicación | ARPA" };

export default async function LocationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <LocationProfile slug={slug} />
    </div>
  );
}
