"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  LoaderCircle,
  MailPlus,
  TriangleAlert,
  UserCog,
  Users,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  apiUrl,
  type ApiTeam,
  type TeamRosterEntry,
} from "@/lib/team-api";

type ApiError = { message?: string | string[] };

const statusLabels: Record<TeamRosterEntry["status"], string> = {
  owner: "Owner",
  accepted: "Aceptada",
  pending: "Pendiente",
  cancelled: "Cancelada",
  expired: "Expirada",
  failed: "No enviada",
};

const statusClasses: Record<TeamRosterEntry["status"], string> = {
  owner: "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200",
  accepted: "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200",
  pending: "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200",
  cancelled: "border-border bg-muted text-muted-foreground",
  expired: "border-border bg-muted text-muted-foreground",
  failed: "border-red-300 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200",
};

const membershipLabels: Record<TeamRosterEntry["membershipRole"], string> = {
  owner: "Owner",
  editor: "Editor",
  reader: "Lector",
};

function getErrorMessage(error: ApiError): string {
  if (Array.isArray(error.message)) return error.message.join(" ");
  return error.message ?? "No pudimos enviar la invitación.";
}

function initials(name: string): string {
  return (
    name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "AR"
  );
}

function InviteMemberDialog({
  team,
  onCreated,
}: {
  team: ApiTeam;
  onCreated: (entry: TeamRosterEntry) => void;
}) {
  const [open, setOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const roles = useMemo(() => {
    if (team.discipline === "running") {
      return ["Corredor", "Entrenador", "Preparador físico"];
    }
    if (team.discipline === "cycling") {
      return ["Ciclista", "Entrenador", "Mecánico", "Director deportivo"];
    }
    return ["Piloto", "Mecánico", "Ingeniero de pista", "Jefe de equipo"];
  }, [team.discipline]);
  const [sportsRole, setSportsRole] = useState(roles[0]);
  const [memberRole, setMemberRole] = useState<"editor" | "reader">("reader");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setIsSending(true);
    setError("");

    try {
      const response = await fetch(
        `${apiUrl}/teams/${encodeURIComponent(team.slug)}/invitations`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            invitedName: formData.get("invitedName"),
            email: formData.get("email"),
            sportsRole,
            memberRole,
          }),
        },
      );

      if (!response.ok) {
        const apiError = (await response.json().catch(() => ({}))) as ApiError;
        throw new Error(getErrorMessage(apiError));
      }

      onCreated((await response.json()) as TeamRosterEntry);
      form.reset();
      setSportsRole(roles[0]);
      setMemberRole("reader");
      setOpen(false);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No pudimos enviar la invitación.",
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="cursor-pointer" />}>
        <MailPlus /> Invitar integrante
      </DialogTrigger>
      <DialogContent className="bg-background sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Invitar a {team.name}</DialogTitle>
            <DialogDescription>
              Enviaremos un enlace personal y válido durante siete días.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-5">
            <div className="space-y-2">
              <Label htmlFor="invite-name">Nombre</Label>
              <Input
                id="invite-name"
                name="invitedName"
                minLength={2}
                maxLength={100}
                disabled={isSending}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-email">Correo electrónico</Label>
              <Input
                id="invite-email"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={254}
                disabled={isSending}
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Rol deportivo</Label>
                <Select
                  value={sportsRole}
                  onValueChange={(value) => setSportsRole(value as string)}
                  disabled={isSending}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Permiso</Label>
                <Select
                  value={memberRole}
                  onValueChange={(value) =>
                    setMemberRole(value as "editor" | "reader")
                  }
                  disabled={isSending}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="reader">Lector</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && (
              <Alert className="border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200 [&_[data-slot=alert-description]]:text-red-800 dark:[&_[data-slot=alert-description]]:text-red-300">
                <TriangleAlert />
                <AlertTitle>No se envió la invitación</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSending}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSending} className="cursor-pointer">
              {isSending && (
                <LoaderCircle className="animate-spin motion-reduce:animate-none" />
              )}
              {isSending ? "Enviando..." : "Enviar invitación"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function TeamRoster({ team }: { team: ApiTeam }) {
  const [entries, setEntries] = useState<TeamRosterEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadRoster() {
      try {
        const response = await fetch(
          `${apiUrl}/teams/${encodeURIComponent(team.slug)}/members`,
          {
            credentials: "include",
            cache: "no-store",
            signal: controller.signal,
          },
        );
        if (!response.ok) throw new Error("No pudimos cargar los integrantes.");
        setEntries((await response.json()) as TeamRosterEntry[]);
      } catch (loadError) {
        if ((loadError as Error).name !== "AbortError") {
          setError("No pudimos cargar los integrantes e invitaciones.");
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    void loadRoster();
    return () => controller.abort();
  }, [team.slug]);

  function addInvitation(entry: TeamRosterEntry) {
    setEntries((current) => [...current, entry]);
    setSuccess(`La invitación para ${entry.email} fue enviada.`);
    setError("");
  }

  return (
    <Card>
      <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-5" /> Integrantes e invitaciones
          </CardTitle>
          <CardDescription>
            Consulta integrantes, permisos e historial de invitaciones.
          </CardDescription>
        </div>
        {team.membershipRole === "owner" && (
          <InviteMemberDialog team={team} onCreated={addInvitation} />
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {success && (
          <Alert className="border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200 [&_[data-slot=alert-description]]:text-emerald-800 dark:[&_[data-slot=alert-description]]:text-emerald-300">
            <CheckCircle2 />
            <AlertTitle>Invitación enviada</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert className="border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200 [&_[data-slot=alert-description]]:text-red-800 dark:[&_[data-slot=alert-description]]:text-red-300">
            <TriangleAlert />
            <AlertTitle>No se cargó la tabla</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <Skeleton className="h-44 w-full rounded-lg motion-reduce:animate-none" />
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Permiso</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={`${entry.status}-${entry.id}`}>
                    <TableCell>
                      <div className="flex min-w-52 items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{initials(entry.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{entry.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {entry.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{entry.sportsRole}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <UserCog className="size-4 text-muted-foreground" />
                        {membershipLabels[entry.membershipRole]}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusClasses[entry.status]}>
                        {statusLabels[entry.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
