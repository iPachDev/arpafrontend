import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TeamProfile } from "@/components/team-profile";
import { getTeam, teams, type Team } from "@/lib/teams";

export function generateStaticParams() {
  return teams.map((team) => ({ slug: team.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const team = getTeam(slug);
  return { title: team ? `${team.name} | ARPA` : "Equipo | ARPA" };
}

export default async function TeamDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const storedTeam = getTeam(slug);
  if (!storedTeam) notFound();

  const value = (key: string) => typeof query[key] === "string" ? query[key] as string : undefined;
  const team: Team = {
    ...storedTeam,
    name: value("name") ?? storedTeam.name,
    discipline: (value("discipline") as Team["discipline"]) ?? storedTeam.discipline,
    privacy: (value("privacy") as Team["privacy"]) ?? storedTeam.privacy,
    location: value("location") ?? storedTeam.location,
    description: value("description") ?? storedTeam.description,
  };

  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <TeamProfile team={team} />
    </div>
  );
}
