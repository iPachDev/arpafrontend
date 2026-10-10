import type { Metadata } from "next";

import { CheckoutForm } from "@/components/checkout-form";

export const metadata: Metadata = {
  title: "Checkout | ARPA",
  description: "Completa el pago de tu inscripción",
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{
    event?: string | string[];
    amount?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const eventName =
    typeof params.event === "string" ? params.event : "Evento seleccionado";
  const amount =
    typeof params.amount === "string" ? params.amount : "Por confirmar";

  return (
    <div className="space-y-6 p-6 sm:p-8 lg:p-10">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
        <p className="text-muted-foreground">
          Completa los datos para confirmar tu inscripción.
        </p>
      </div>
      <CheckoutForm eventName={eventName} amount={amount} />
    </div>
  );
}
