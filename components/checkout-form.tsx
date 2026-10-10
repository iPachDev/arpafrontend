"use client";

import { FormEvent, useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  LoaderCircle,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type CheckoutStatus = "idle" | "loading" | "success";

export function CheckoutForm({
  eventName,
  amount,
}: {
  eventName: string;
  amount: string;
}) {
  const [method, setMethod] = useState("card");
  const [status, setStatus] = useState<CheckoutStatus>("idle");

  function handlePayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    window.setTimeout(() => {
      setStatus("success");
    }, 1600);
  }

  if (status === "success") {
    return (
      <Card className="mx-auto max-w-xl text-center">
        <CardContent className="space-y-5 py-8">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-600/10">
            <CheckCircle2 className="size-9 text-green-600" />
          </div>
          <div className="space-y-2" aria-live="polite">
            <CardTitle className="text-2xl">Pago confirmado</CardTitle>
            <CardDescription>
              Tu pago se realizó correctamente y ya estás inscrito en
              {` ${eventName}`}.
            </CardDescription>
          </div>
          <Button type="button">Ver mi inscripción</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_320px]">
      <Card>
        <form onSubmit={handlePayment}>
          <CardHeader>
            <CardTitle>Información de pago</CardTitle>
            <CardDescription>
              Selecciona cómo deseas completar el pago.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={method} onValueChange={setMethod} className="gap-6">
              <TabsList className="w-full">
                <TabsTrigger value="card">
                  <CreditCard />
                  Tarjeta
                </TabsTrigger>
                <TabsTrigger value="paypal">
                  <WalletCards />
                  PayPal
                </TabsTrigger>
              </TabsList>

              <TabsContent value="card" className="space-y-5">
                <div className="grid gap-2">
                  <Label htmlFor="card-name">Nombre en la tarjeta</Label>
                  <Input
                    id="card-name"
                    autoComplete="cc-name"
                    placeholder="Nombre completo"
                    required={method === "card"}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="card-number">Número de tarjeta</Label>
                  <Input
                    id="card-number"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="0000 0000 0000 0000"
                    required={method === "card"}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="card-expiration">Vencimiento</Label>
                    <Input
                      id="card-expiration"
                      autoComplete="cc-exp"
                      placeholder="MM/AA"
                      required={method === "card"}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="card-cvv">CVV</Label>
                    <Input
                      id="card-cvv"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      placeholder="123"
                      required={method === "card"}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="paypal">
                <Alert>
                  <WalletCards />
                  <AlertTitle>Pago con PayPal</AlertTitle>
                  <AlertDescription>
                    Esta maqueta simulará la autorización con PayPal sin salir
                    de la página.
                  </AlertDescription>
                </Alert>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="mt-6 flex-col gap-3">
            <Button type="submit" size="lg" className="w-full" disabled={status === "loading"}>
              {status === "loading" ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  Procesando pago...
                </>
              ) : method === "paypal" ? (
                "Pagar con PayPal"
              ) : (
                "Pagar ahora"
              )}
            </Button>
            <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-4" />
              Pago seguro de demostración
            </p>
          </CardFooter>
        </form>
      </Card>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Resumen</CardTitle>
          <CardDescription>Inscripción al evento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <p className="font-medium">{eventName}</p>
            <p className="text-sm text-muted-foreground">
              Acceso para un participante
            </p>
          </div>
          <div className="flex items-center justify-between border-t pt-4">
            <span className="font-medium">Total</span>
            <span className="font-semibold">{amount}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
