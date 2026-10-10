import type { Metadata } from "next";

import { PersistedTeamProfile } from "@/components/persisted-team-profile";

export const metadata: Metadata = {
  title: "Equipo | ARPA",
  description: "Integrantes e invitaciones del equipo.",
};

export default async function TeamPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <PersistedTeamProfile slug={slug} />
    </div>
  );
}
