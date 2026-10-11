"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  LoaderCircle,
  LogIn,
  MapPinned,
  TriangleAlert,
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  apiUrl,
  type LocationOwnershipTransferPreview,
} from "@/lib/location-api";

type AuthState = "loading" | "authenticated" | "anonymous";
type ApiError = { message?: string | string[] };
const message = (error: ApiError) =>
  Array.isArray(error.message)
    ? error.message.join(" ")
    : (error.message ?? "No pudimos procesar la transferencia.");

export function LocationOwnershipTransferView({ token }: { token: string }) {
  const [transfer, setTransfer] =
    useState<LocationOwnershipTransferPreview | null>(null);
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      fetch(
        `${apiUrl}/location-ownership-transfers/${encodeURIComponent(token)}`,
        { cache: "no-store", signal: controller.signal },
      ),
      fetch(`${apiUrl}/auth/me`, {
        credentials: "include",
        cache: "no-store",
        signal: controller.signal,
      }),
    ])
      .then(async ([transferResponse, sessionResponse]) => {
        if (!transferResponse.ok)
          throw new Error(
            "La transferencia no existe o dejó de estar disponible.",
          );
        setTransfer(
          (await transferResponse.json()) as LocationOwnershipTransferPreview,
        );
        if (sessionResponse.ok) {
          const user = (await sessionResponse.json()) as { email: string };
          setUserEmail(user.email);
          setAuthState("authenticated");
        } else setAuthState("anonymous");
      })
      .catch((loadError: Error) => {
        if (loadError.name !== "AbortError") setError(loadError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, [token]);

  async function accept() {
    setIsAccepting(true);
    setError("");
    try {
      const response = await fetch(
        `${apiUrl}/location-ownership-transfers/${encodeURIComponent(token)}/accept`,
        { method: "POST", credentials: "include" },
      );
      if (!response.ok)
        throw new Error(
          message((await response.json().catch(() => ({}))) as ApiError),
        );
      setAccepted(true);
      window.dispatchEvent(new Event("arpa:locations-changed"));
    } catch (acceptError) {
      setError(
        acceptError instanceof Error
          ? acceptError.message
          : "No pudimos aceptar la transferencia.",
      );
    } finally {
      setIsAccepting(false);
    }
  }

  if (isLoading || authState === "loading")
    return (
      <Card className="w-full max-w-xl">
        <CardHeader className="gap-3">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <Skeleton className="h-7 w-72 max-w-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-28 w-full" />
        </CardContent>
      </Card>
    );
  if (!transfer)
    return (
      <Alert variant="destructive" className="w-full max-w-xl">
        <TriangleAlert />
        <AlertTitle>Transferencia no disponible</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  const emailMatches =
    userEmail.trim().toLowerCase() === transfer.email.trim().toLowerCase();
  const unavailable = transfer.status !== "pending" && !accepted;
  const loginHref = `/login?next=${encodeURIComponent(`/location-ownership-transfers/${token}`)}`;

  return (
    <Card className="w-full max-w-xl">
      <CardHeader className="gap-3 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <MapPinned />
        </span>
        <div>
          <CardTitle className="text-2xl">Propiedad de una ubicación</CardTitle>
          <CardDescription className="mt-2">
            {transfer.newOwnerName}, te invitaron a administrar
          </CardDescription>
        </div>
        <p className="text-xl font-semibold">{transfer.locationName}</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">
          Al aceptar podrás editar, transferir o dar de baja esta ubicación. El
          propietario anterior perderá esos permisos.
        </div>
        {error && (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>No se pudo aceptar</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {accepted && (
          <Alert className="border-emerald-300 bg-emerald-50 text-emerald-900">
            <CheckCircle2 />
            <AlertTitle>Ahora eres propietario</AlertTitle>
            <AlertDescription>
              La transferencia se completó correctamente.
            </AlertDescription>
          </Alert>
        )}
        {unavailable && (
          <Alert>
            <TriangleAlert />
            <AlertTitle>Transferencia no disponible</AlertTitle>
            <AlertDescription>
              Su estado actual es {transfer.status}.
            </AlertDescription>
          </Alert>
        )}
        {authState === "authenticated" && !emailMatches && !unavailable && (
          <Alert>
            <TriangleAlert />
            <AlertTitle>Usa la cuenta invitada</AlertTitle>
            <AlertDescription>
              La invitación corresponde a {transfer.email}, pero tu sesión usa{" "}
              {userEmail}.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-3">
        {accepted || transfer.status === "accepted" ? (
          <Button
            className="w-full"
            nativeButton={false}
            render={<Link href={`/locations/${transfer.locationSlug}`} />}
          >
            Ir a la ubicación
          </Button>
        ) : authState === "authenticated" && emailMatches && !unavailable ? (
          <Button
            className="w-full"
            onClick={() => void accept()}
            disabled={isAccepting}
          >
            {isAccepting && <LoaderCircle className="animate-spin" />}
            {isAccepting ? "Aceptando..." : "Aceptar propiedad"}
          </Button>
        ) : authState === "anonymous" ? (
          <Button
            className="w-full"
            nativeButton={false}
            render={<Link href={loginHref} />}
          >
            <LogIn /> Iniciar sesión para aceptar
          </Button>
        ) : null}
        <p className="text-center text-xs text-muted-foreground">
          Invitación enviada a {transfer.email}
        </p>
      </CardFooter>
    </Card>
  );
}
