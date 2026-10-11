"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarCheck2,
  CheckCircle2,
  LoaderCircle,
  LogIn,
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
import { apiUrl, type EventOwnershipTransferPreview } from "@/lib/event-api";

type AuthState = "loading" | "authenticated" | "anonymous";
type AuthenticatedUser = { email: string };
type ApiError = { message?: string | string[] };

function getErrorMessage(error: ApiError) {
  return Array.isArray(error.message)
    ? error.message.join(" ")
    : (error.message ?? "No pudimos procesar la transferencia.");
}

export function EventOwnershipTransferView({ token }: { token: string }) {
  const [transfer, setTransfer] =
    useState<EventOwnershipTransferPreview | null>(null);
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const [transferResponse, sessionResponse] = await Promise.all([
          fetch(
            `${apiUrl}/event-ownership-transfers/${encodeURIComponent(token)}`,
            { cache: "no-store", signal: controller.signal },
          ),
          fetch(`${apiUrl}/auth/me`, {
            credentials: "include",
            cache: "no-store",
            signal: controller.signal,
          }),
        ]);
        if (!transferResponse.ok) {
          throw new Error(
            "La transferencia no existe o dejó de estar disponible.",
          );
        }
        setTransfer(
          (await transferResponse.json()) as EventOwnershipTransferPreview,
        );
        if (sessionResponse.ok) {
          const user = (await sessionResponse.json()) as AuthenticatedUser;
          setUserEmail(user.email);
          setAuthState("authenticated");
        } else {
          setAuthState("anonymous");
        }
      } catch (loadError) {
        if ((loadError as Error).name !== "AbortError") {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "No pudimos cargar la transferencia.",
          );
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [token]);

  async function acceptTransfer() {
    setIsAccepting(true);
    setError("");
    try {
      const response = await fetch(
        `${apiUrl}/event-ownership-transfers/${encodeURIComponent(token)}/accept`,
        { method: "POST", credentials: "include" },
      );
      if (!response.ok) {
        const apiError = (await response.json().catch(() => ({}))) as ApiError;
        throw new Error(getErrorMessage(apiError));
      }
      setAccepted(true);
      window.dispatchEvent(new Event("arpa:events-changed"));
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

  if (isLoading || authState === "loading") {
    return (
      <Card className="w-full max-w-xl" role="status">
        <CardHeader className="gap-3">
          <Skeleton className="h-12 w-12 rounded-2xl motion-reduce:animate-none" />
          <Skeleton className="h-7 w-72 max-w-full motion-reduce:animate-none" />
          <Skeleton className="h-4 w-full motion-reduce:animate-none" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-28 w-full motion-reduce:animate-none" />
        </CardContent>
      </Card>
    );
  }

  if (!transfer) {
    return (
      <Alert variant="destructive" className="w-full max-w-xl">
        <TriangleAlert />
        <AlertTitle>Transferencia no disponible</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const path = `/event-ownership-transfers/${encodeURIComponent(token)}`;
  const loginHref = `/login?next=${encodeURIComponent(path)}`;
  const emailMatches =
    userEmail.trim().toLowerCase() === transfer.email.trim().toLowerCase();
  const unavailable = transfer.status !== "pending" && !accepted;

  return (
    <Card className="w-full max-w-xl">
      <CardHeader className="gap-3 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <CalendarCheck2 className="size-6" />
        </span>
        <div>
          <CardTitle className="text-2xl">Propiedad de un evento</CardTitle>
          <CardDescription className="mt-2">
            {transfer.newOwnerName}, te invitaron a administrar
          </CardDescription>
        </div>
        <p className="text-xl font-semibold">{transfer.eventName}</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">
          Al aceptar podrás editar, transferir o dar de baja este evento. El
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
          <Alert className="border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
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
            <AlertTitle>Esta transferencia ya no está disponible</AlertTitle>
            <AlertDescription>
              Su estado actual es {transfer.status}.
            </AlertDescription>
          </Alert>
        )}
        {authState === "authenticated" && !emailMatches && !unavailable && (
          <Alert className="border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
            <TriangleAlert />
            <AlertTitle>Usa la cuenta invitada</AlertTitle>
            <AlertDescription>
              La transferencia corresponde a {transfer.email}, pero tu sesión
              usa {userEmail}.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-3">
        {accepted || transfer.status === "accepted" ? (
          <Button
            className="w-full cursor-pointer"
            nativeButton={false}
            render={<Link href={`/events/${transfer.eventSlug}`} />}
          >
            Ir al evento
          </Button>
        ) : authState === "authenticated" && emailMatches && !unavailable ? (
          <Button
            className="w-full cursor-pointer"
            onClick={() => void acceptTransfer()}
            disabled={isAccepting}
          >
            {isAccepting && (
              <LoaderCircle className="animate-spin motion-reduce:animate-none" />
            )}
            {isAccepting ? "Aceptando..." : "Aceptar propiedad"}
          </Button>
        ) : authState === "anonymous" ? (
          <Button
            className="w-full cursor-pointer"
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
