"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  LoaderCircle,
  LogIn,
  ShieldCheck,
  TriangleAlert,
  UserPlus,
  Users,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
  type TeamInvitationPreview,
} from "@/lib/team-api";

type AuthenticatedUser = { email: string };
type ApiError = { message?: string | string[] };
type AuthState = "loading" | "authenticated" | "anonymous";

function getErrorMessage(error: ApiError): string {
  if (Array.isArray(error.message)) return error.message.join(" ");
  return error.message ?? "No pudimos procesar la invitación.";
}

export function TeamInvitationView({ token }: { token: string }) {
  const [invitation, setInvitation] =
    useState<TeamInvitationPreview | null>(null);
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState("");
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const [invitationResponse, sessionResponse] = await Promise.all([
          fetch(`${apiUrl}/team-invitations/${encodeURIComponent(token)}`, {
            cache: "no-store",
            signal: controller.signal,
          }),
          fetch(`${apiUrl}/auth/me`, {
            credentials: "include",
            cache: "no-store",
            signal: controller.signal,
          }),
        ]);

        if (!invitationResponse.ok) {
          throw new Error("La invitación no existe o dejó de estar disponible.");
        }
        setInvitation(
          (await invitationResponse.json()) as TeamInvitationPreview,
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
              : "No pudimos cargar la invitación.",
          );
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    void load();
    return () => controller.abort();
  }, [token]);

  async function acceptInvitation() {
    setIsAccepting(true);
    setError("");

    try {
      const response = await fetch(
        `${apiUrl}/team-invitations/${encodeURIComponent(token)}/accept`,
        { method: "POST", credentials: "include" },
      );
      if (!response.ok) {
        const apiError = (await response.json().catch(() => ({}))) as ApiError;
        throw new Error(getErrorMessage(apiError));
      }

      setAccepted(true);
      window.dispatchEvent(new Event("arpa:teams-changed"));
    } catch (acceptError) {
      setError(
        acceptError instanceof Error
          ? acceptError.message
          : "No pudimos aceptar la invitación.",
      );
    } finally {
      setIsAccepting(false);
    }
  }

  if (isLoading || authState === "loading") {
    return (
      <Card className="w-full max-w-xl">
        <CardHeader className="gap-3">
          <Skeleton className="h-10 w-10 rounded-xl motion-reduce:animate-none" />
          <Skeleton className="h-7 w-64 max-w-full motion-reduce:animate-none" />
          <Skeleton className="h-4 w-full motion-reduce:animate-none" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full motion-reduce:animate-none" />
        </CardContent>
      </Card>
    );
  }

  if (!invitation) {
    return (
      <Alert className="w-full max-w-xl border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200 [&_[data-slot=alert-description]]:text-red-800 dark:[&_[data-slot=alert-description]]:text-red-300">
        <TriangleAlert />
        <AlertTitle>Invitación no disponible</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const invitationPath = `/invitations/${encodeURIComponent(token)}`;
  const loginHref = `/login?next=${encodeURIComponent(invitationPath)}`;
  const signupHref = `/signin?invitation=${encodeURIComponent(token)}&email=${encodeURIComponent(invitation.email)}`;
  const unavailable = invitation.status !== "pending" && !accepted;
  const emailMatches =
    userEmail.trim().toLowerCase() === invitation.email.trim().toLowerCase();

  return (
    <Card className="w-full max-w-xl">
      <CardHeader className="gap-3 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Users className="size-6" />
        </span>
        <div>
          <CardTitle className="text-2xl">Invitación a un equipo</CardTitle>
          <CardDescription className="mt-2">
            {invitation.invitedName}, te invitaron a formar parte de
          </CardDescription>
        </div>
        <p className="text-xl font-semibold">{invitation.teamName}</p>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid gap-3 rounded-xl border bg-muted/40 p-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Rol deportivo
            </p>
            <p className="mt-1 font-medium">{invitation.sportsRole}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Permiso
            </p>
            <Badge variant="outline" className="mt-1">
              <ShieldCheck />
              {invitation.membershipRole === "editor"
                ? "Editor"
                : "Lector"}
            </Badge>
          </div>
        </div>

        {error && (
          <Alert className="border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200 [&_[data-slot=alert-description]]:text-red-800 dark:[&_[data-slot=alert-description]]:text-red-300">
            <TriangleAlert />
            <AlertTitle>No se pudo aceptar</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {accepted && (
          <Alert className="border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200 [&_[data-slot=alert-description]]:text-emerald-800 dark:[&_[data-slot=alert-description]]:text-emerald-300">
            <CheckCircle2 />
            <AlertTitle>Ya formas parte del equipo</AlertTitle>
            <AlertDescription>
              La invitación fue aceptada correctamente.
            </AlertDescription>
          </Alert>
        )}

        {unavailable && (
          <Alert>
            <TriangleAlert />
            <AlertTitle>Esta invitación ya no está disponible</AlertTitle>
            <AlertDescription>
              Su estado actual es {invitation.status}.
            </AlertDescription>
          </Alert>
        )}

        {authState === "authenticated" && !emailMatches && !unavailable && (
          <Alert className="border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200 [&_[data-slot=alert-description]]:text-amber-800 dark:[&_[data-slot=alert-description]]:text-amber-300">
            <TriangleAlert />
            <AlertTitle>Usa la cuenta invitada</AlertTitle>
            <AlertDescription>
              La invitación corresponde a {invitation.email}, pero tu sesión usa {userEmail}.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      <CardFooter className="flex-col gap-3">
        {accepted || invitation.status === "accepted" ? (
          <Button
            className="w-full cursor-pointer"
            nativeButton={false}
            render={<Link href={`/teams/${invitation.teamSlug}`} />}
          >
            Ir al equipo
          </Button>
        ) : authState === "authenticated" && emailMatches && !unavailable ? (
          <Button
            className="w-full cursor-pointer"
            onClick={() => void acceptInvitation()}
            disabled={isAccepting}
          >
            {isAccepting && (
              <LoaderCircle className="animate-spin motion-reduce:animate-none" />
            )}
            {isAccepting ? "Aceptando..." : "Aceptar invitación"}
          </Button>
        ) : authState === "anonymous" && invitation.requiresRegistration ? (
          <Button
            className="w-full cursor-pointer"
            nativeButton={false}
            render={<Link href={signupHref} />}
          >
            <UserPlus /> Crear cuenta para aceptar
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
          Invitación enviada a {invitation.email}
        </p>
      </CardFooter>
    </Card>
  );
}
