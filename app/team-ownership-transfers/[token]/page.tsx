import type { Metadata } from "next";

import { TeamOwnershipTransferView } from "@/app/team-ownership-transfers/[token]/transfer-view";

export const metadata: Metadata = {
  title: "Transferencia de equipo | ARPA",
  description: "Revisa y acepta la propiedad de un equipo",
};

export default async function TeamOwnershipTransferPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-10 sm:px-6">
      <TeamOwnershipTransferView token={token} />
    </main>
  );
}
