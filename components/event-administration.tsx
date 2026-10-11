"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  LoaderCircle,
  Send,
  Trash2,
  TriangleAlert,
  UserRoundCog,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Button } from "@/components/ui/button";
import { CollapsibleSettingsCard } from "@/components/collapsible-settings-card";
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
import { apiUrl, type ApiEvent } from "@/lib/event-api";

type ApiError = { message?: string | string[] };

function getErrorMessage(error: ApiError, fallback: string) {
  return Array.isArray(error.message)
    ? error.message.join(" ")
    : (error.message ?? fallback);
}

export function EventAdministration({ event }: { event: ApiEvent }) {
  const router = useRouter();
  const [transferOpen, setTransferOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [confirmationTitle, setConfirmationTitle] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function requestTransfer(submitEvent: FormEvent<HTMLFormElement>) {
    submitEvent.preventDefault();
    setIsTransferring(true);
    setError("");
    setSuccess("");
    const formData = new FormData(submitEvent.currentTarget);
    const email = String(formData.get("email") ?? "");

    try {
      const response = await fetch(
        `${apiUrl}/events/${encodeURIComponent(event.slug)}/ownership-transfers`,
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

  async function archiveEvent() {
    setIsArchiving(true);
    setError("");

    try {
      const response = await fetch(
        `${apiUrl}/events/${encodeURIComponent(event.slug)}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ confirmationTitle }),
        },
      );
      if (!response.ok) {
        const apiError = (await response.json().catch(() => ({}))) as ApiError;
        throw new Error(
          getErrorMessage(apiError, "No pudimos dar de baja el evento."),
        );
      }

      window.dispatchEvent(new Event("arpa:events-changed"));
      window.dispatchEvent(new Event("arpa:registrations-changed"));
      router.replace("/events");
      router.refresh();
    } catch (archiveError) {
      setError(
        archiveError instanceof Error
          ? archiveError.message
          : "No pudimos dar de baja el evento.",
      );
      setIsArchiving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {success && (
        <Alert className="border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
          <CheckCircle2 />
          <AlertTitle>Transferencia creada</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>No se completó la operación</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Propiedad del evento</CardTitle>
          <CardDescription>
            El nuevo propietario deberá aceptar la invitación desde su correo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <UserRoundCog className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
              <div>
                <p className="font-medium">Transferir propiedad</p>
                <p className="text-sm text-muted-foreground">
                  Al aceptar, perderás la capacidad de editar o eliminar este
                  evento.
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
                <form onSubmit={requestTransfer}>
                  <DialogHeader>
                    <DialogTitle>Transferir propiedad</DialogTitle>
                    <DialogDescription>
                      Ingresa el correo de un usuario activo de ARPA. La
                      invitación vence en siete días.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2 py-5">
                    <Label htmlFor="new-owner-email">
                      Correo del nuevo propietario
                    </Label>
                    <Input
                      id="new-owner-email"
                      name="email"
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
        </CardContent>
      </Card>

      <CollapsibleSettingsCard
        danger
        title="Zona de peligro"
        description="La baja oculta el evento y sus inscripciones activas, pero conserva todo el historial."
      >
        <div className="flex flex-col gap-4 rounded-xl border border-red-300 bg-red-50/70 p-4 dark:border-red-900 dark:bg-red-950/20 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-red-900 dark:text-red-200">
              Dar de baja el evento
            </p>
            <p className="text-sm text-red-800 dark:text-red-300">
              Dejará de aparecer en eventos e inscripciones.
            </p>
          </div>
          <AlertDialog
            open={archiveOpen}
            onOpenChange={(open) => {
              setArchiveOpen(open);
              if (!open) setConfirmationTitle("");
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
                <AlertDialogTitle>Dar de baja el evento</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción ocultará el evento para todos los usuarios.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-2">
                <Label htmlFor="archive-event-confirmation">
                  Escribe{" "}
                  <span className="font-semibold text-foreground">
                    {event.title}
                  </span>{" "}
                  para confirmar
                </Label>
                <Input
                  id="archive-event-confirmation"
                  value={confirmationTitle}
                  onChange={(change) =>
                    setConfirmationTitle(change.target.value)
                  }
                  autoComplete="off"
                  disabled={isArchiving}
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isArchiving}>
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  disabled={confirmationTitle !== event.title || isArchiving}
                  onClick={() => void archiveEvent()}
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
    </div>
  );
}
