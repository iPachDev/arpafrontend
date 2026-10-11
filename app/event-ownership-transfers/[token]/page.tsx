import type { Metadata } from "next";

import { EventOwnershipTransferView } from "@/app/event-ownership-transfers/[token]/event-ownership-transfer-view";

export const metadata: Metadata = {
  title: "Transferencia de evento | ARPA",
  description: "Revisa y acepta la propiedad de un evento",
};

export default async function EventOwnershipTransferPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-10 sm:px-6">
      <EventOwnershipTransferView token={token} />
    </main>
  );
}
