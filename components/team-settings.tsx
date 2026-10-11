"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  LoaderCircle,
  Pencil,
  Save,
  Send,
  Trash2,
  TriangleAlert,
  UserRoundCog,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CollapsibleSettingsCard } from "@/components/collapsible-settings-card";
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
import { Textarea } from "@/components/ui/textarea";
import {
  apiUrl,
  disciplineLabels,
  privacyLabels,
  type ApiTeam,
  type TeamDiscipline,
  type TeamPrivacy,
} from "@/lib/team-api";

type ApiError = { message?: string | string[] };

function getErrorMessage(error: ApiError, fallback: string): string {
  if (Array.isArray(error.message)) return error.message.join(" ");
  return error.message ?? fallback;
}

export function TeamSettings({
  team,
  onUpdated,
}: {
  team: ApiTeam;
  onUpdated: (team: ApiTeam) => void;
}) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [discipline, setDiscipline] = useState<TeamDiscipline>(team.discipline);
  const [privacy, setPrivacy] = useState<TeamPrivacy>(team.privacy);
  const [confirmationName, setConfirmationName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function updateTeam(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch(
        `${apiUrl}/teams/${encodeURIComponent(team.slug)}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.get("name"),
            discipline,
            privacy,
            location: formData.get("location"),
            description: formData.get("description"),
            logoImageUrl: formData.get("logoImageUrl"),
            coverImageUrl: formData.get("coverImageUrl"),
          }),
        },
      );

      if (!response.ok) {
        const apiError = (await response.json().catch(() => ({}))) as ApiError;
        throw new Error(
          getErrorMessage(apiError, "No pudimos actualizar el equipo."),
        );
      }

      const updatedTeam = (await response.json()) as ApiTeam;
      onUpdated(updatedTeam);
      window.dispatchEvent(new Event("arpa:teams-changed"));
      setSuccess("La información del equipo se actualizó correctamente.");
      setEditOpen(false);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No pudimos actualizar el equipo.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function archiveTeam() {
    setIsArchiving(true);
    setError("");

    try {
      const response = await fetch(
        `${apiUrl}/teams/${encodeURIComponent(team.slug)}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ confirmationName }),
        },
      );
      if (!response.ok) {
        const apiError = (await response.json().catch(() => ({}))) as ApiError;
        throw new Error(
          getErrorMessage(apiError, "No pudimos dar de baja el equipo."),
        );
      }

      window.dispatchEvent(new Event("arpa:teams-changed"));
      router.replace("/teams");
      router.refresh();
    } catch (archiveError) {
      setError(
        archiveError instanceof Error
          ? archiveError.message
          : "No pudimos dar de baja el equipo.",
      );
      setIsArchiving(false);
    }
  }

  async function requestOwnershipTransfer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsTransferring(true);
    setError("");
    setSuccess("");
    const email = String(
      new FormData(event.currentTarget).get("ownerEmail") ?? "",
    );

    try {
      const response = await fetch(
        `${apiUrl}/teams/${encodeURIComponent(team.slug)}/ownership-transfers`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );
      if (!response.ok) {
        const apiError = (await response.json().catch(() => ({}))) as ApiError;
        throw new Error(
          getErrorMessage(apiError, "No pudimos enviar la transferencia."),
        );
      }

      setTransferOpen(false);
      setSuccess(
        `Invitación enviada a ${email}. Seguirás siendo propietario hasta que sea aceptada.`,
      );
    } catch (transferError) {
      setError(
        transferError instanceof Error
          ? transferError.message
          : "No pudimos enviar la transferencia.",
      );
    } finally {
      setIsTransferring(false);
    }
  }

  return (
    <CollapsibleSettingsCard
      title="Administrar equipo"
      description="Actualiza la información visible o da de baja el equipo."
    >
      {success && (
        <Alert className="border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200 [&_[data-slot=alert-description]]:text-emerald-800 dark:[&_[data-slot=alert-description]]:text-emerald-300">
          <CheckCircle2 />
          <AlertTitle>Operación completada</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200 [&_[data-slot=alert-description]]:text-red-800 dark:[&_[data-slot=alert-description]]:text-red-300">
          <TriangleAlert />
          <AlertTitle>No se completó la operación</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium">Información e imágenes</p>
          <p className="text-sm text-muted-foreground">
            Edita nombre, descripción, ubicación, logo y portada.
          </p>
        </div>
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogTrigger
            render={<Button variant="outline" className="cursor-pointer" />}
          >
            <Pencil /> Editar equipo
          </DialogTrigger>
          <DialogContent className="max-h-[90svh] overflow-y-auto bg-background sm:max-w-2xl">
            <form onSubmit={updateTeam}>
              <DialogHeader>
                <DialogTitle>Editar equipo</DialogTitle>
                <DialogDescription>
                  El enlace del equipo no cambiará aunque edites su nombre.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-5 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="team-name">Nombre</Label>
                  <Input
                    id="team-name"
                    name="name"
                    defaultValue={team.name}
                    minLength={2}
                    maxLength={100}
                    disabled={isSaving}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Disciplina</Label>
                  <Select
                    value={discipline}
                    onValueChange={(value) =>
                      setDiscipline(value as TeamDiscipline)
                    }
                    disabled={isSaving}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(disciplineLabels).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Privacidad</Label>
                  <Select
                    value={privacy}
                    onValueChange={(value) => setPrivacy(value as TeamPrivacy)}
                    disabled={isSaving}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(privacyLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="team-location">Ubicación</Label>
                  <Input
                    id="team-location"
                    name="location"
                    defaultValue={team.location}
                    minLength={2}
                    maxLength={120}
                    disabled={isSaving}
                    required
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="team-description">Descripción</Label>
                  <Textarea
                    id="team-description"
                    name="description"
                    defaultValue={team.description}
                    minLength={10}
                    maxLength={500}
                    rows={4}
                    disabled={isSaving}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team-logo">URL del logo</Label>
                  <Input
                    id="team-logo"
                    name="logoImageUrl"
                    type="url"
                    defaultValue={team.logoImageUrl ?? ""}
                    placeholder="https://..."
                    disabled={isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team-cover">URL de la portada</Label>
                  <Input
                    id="team-cover"
                    name="coverImageUrl"
                    type="url"
                    defaultValue={team.coverImageUrl ?? ""}
                    placeholder="https://..."
                    disabled={isSaving}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditOpen(false)}
                  disabled={isSaving}
                  className="cursor-pointer"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="cursor-pointer"
                >
                  {isSaving ? (
                    <LoaderCircle className="animate-spin motion-reduce:animate-none" />
                  ) : (
                    <Save />
                  )}
                  {isSaving ? "Guardando..." : "Guardar cambios"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <UserRoundCog className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
          <div>
            <p className="font-medium">Transferir propiedad</p>
            <p className="text-sm text-muted-foreground">
              El nuevo propietario deberá aceptar la invitación desde su correo.
            </p>
          </div>
        </div>
        <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
          <DialogTrigger
            render={<Button variant="outline" className="cursor-pointer" />}
          >
            <Send /> Transferir
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <form onSubmit={requestOwnershipTransfer}>
              <DialogHeader>
                <DialogTitle>Transferir propiedad del equipo</DialogTitle>
                <DialogDescription>
                  El destinatario debe tener una cuenta activa en ARPA. La
                  invitación vence en siete días. Cuando acepte, perderás el
                  acceso a este equipo.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 py-5">
                <Label htmlFor="new-team-owner-email">
                  Correo del nuevo propietario
                </Label>
                <Input
                  id="new-team-owner-email"
                  name="ownerEmail"
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  disabled={isTransferring}
                  required
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setTransferOpen(false)}
                  disabled={isTransferring}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isTransferring}>
                  {isTransferring && (
                    <LoaderCircle className="animate-spin motion-reduce:animate-none" />
                  )}
                  {isTransferring ? "Enviando..." : "Enviar invitación"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <CollapsibleSettingsCard
        danger
        title="Zona de peligro"
        description="La baja oculta el equipo para todos, pero conserva sus datos."
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-red-900 dark:text-red-200">
              Dar de baja el equipo
            </p>
            <p className="text-sm text-red-800 dark:text-red-300">
              Dejará de aparecer para todos sus integrantes.
            </p>
          </div>
          <AlertDialog
            open={archiveOpen}
            onOpenChange={(open) => {
              setArchiveOpen(open);
              if (!open) setConfirmationName("");
            }}
          >
            <AlertDialogTrigger
              render={
                <Button variant="destructive" className="cursor-pointer" />
              }
            >
              <Trash2 /> Dar de baja
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-md">
              <AlertDialogHeader>
                <AlertDialogMedia className="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                  <TriangleAlert />
                </AlertDialogMedia>
                <AlertDialogTitle>Dar de baja el equipo</AlertDialogTitle>
                <AlertDialogDescription>
                  Integrantes e invitaciones dejarán de tener acceso.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="space-y-2">
                <Label htmlFor="archive-confirmation">
                  Escribe{" "}
                  <span className="font-semibold text-foreground">
                    {team.name}
                  </span>{" "}
                  para confirmar
                </Label>
                <Input
                  id="archive-confirmation"
                  value={confirmationName}
                  onChange={(event) => setConfirmationName(event.target.value)}
                  autoComplete="off"
                  disabled={isArchiving}
                />
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel
                  disabled={isArchiving}
                  className="cursor-pointer"
                >
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  className="cursor-pointer"
                  disabled={confirmationName !== team.name || isArchiving}
                  onClick={() => void archiveTeam()}
                >
                  {isArchiving && (
                    <LoaderCircle className="animate-spin motion-reduce:animate-none" />
                  )}
                  {isArchiving ? "Dando de baja..." : "Confirmar baja"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CollapsibleSettingsCard>
    </CollapsibleSettingsCard>
  );
}
