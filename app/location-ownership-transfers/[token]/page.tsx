import type { Metadata } from "next";
import { LocationOwnershipTransferView } from "./transfer-view";

export const metadata: Metadata = {
  title: "Transferencia de ubicación | ARPA",
  description: "Revisa y acepta la propiedad de una ubicación",
};

export default async function LocationOwnershipTransferPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-10 sm:px-6">
      <LocationOwnershipTransferView token={token} />
    </main>
  );
}
