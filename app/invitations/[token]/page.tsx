import type { Metadata } from "next";

import { TeamInvitationView } from "@/app/invitations/[token]/team-invitation-view";

export const metadata: Metadata = {
  title: "Invitación a equipo | ARPA",
  description: "Revisa y acepta una invitación para formar parte de un equipo",
};

export default async function TeamInvitationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-10 sm:px-6">
      <TeamInvitationView token={token} />
    </main>
  );
}

