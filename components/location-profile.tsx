"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  LoaderCircle,
  Map,
  MapPin,
  Pencil,
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
import { Button, buttonVariants } from "@/components/ui/button";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  apiUrl,
  locationDisciplineLabels,
  locationFallbackImages,
  type ApiLocation,
} from "@/lib/location-api";

type ApiError = { message?: string | string[] };
const errorMessage = (error: ApiError, fallback: string) =>
  Array.isArray(error.message)
    ? error.message.join(" ")
    : (error.message ?? fallback);

export function LocationProfile({ slug }: { slug: string }) {
  const router = useRouter();
  const [location, setLocation] = useState<ApiLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [confirmationName, setConfirmationName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${apiUrl}/locations/${encodeURIComponent(slug)}`, {
      credentials: "include",
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok)
          throw new Error("La ubicación no existe o ya no está disponible.");
        setLocation((await response.json()) as ApiLocation);
      })
      .catch((loadError: Error) => {
        if (loadError.name !== "AbortError") setError(loadError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, [slug]);

  async function updateLocation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!location) return;
    setIsSaving(true);
    setError("");
    setSuccess("");
    const data = new FormData(event.currentTarget);
    const payload = {
      name: data.get("name"),
      business: data.get("business"),
      address: data.get("address"),
      city: data.get("city"),
      description: data.get("description"),
      coverImageUrl: data.get("coverImageUrl") || null,
      circuitMapImageUrl: data.get("circuitMapImageUrl") || null,
      photoUrls: String(data.get("photoUrls") ?? "")
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean),
    };
    try {
      const response = await fetch(
        `${apiUrl}/locations/${encodeURIComponent(location.slug)}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!response.ok)
        throw new Error(
          errorMessage(
            (await response.json().catch(() => ({}))) as ApiError,
            "No pudimos actualizar la ubicación.",
          ),
        );
      setLocation((await response.json()) as ApiLocation);
      setEditOpen(false);
      setSuccess("La ubicación se actualizó correctamente.");
      window.dispatchEvent(new Event("arpa:locations-changed"));
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "No pudimos actualizar la ubicación.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function requestTransfer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!location) return;
    setIsTransferring(true);
    setError("");
    setSuccess("");
    const email = String(new FormData(event.currentTarget).get("email") ?? "");
    try {
      const response = await fetch(
        `${apiUrl}/locations/${encodeURIComponent(location.slug)}/ownership-transfers`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );
      if (!response.ok)
        throw new Error(
          errorMessage(
            (await response.json().catch(() => ({}))) as ApiError,
            "No pudimos enviar la transferencia.",
          ),
        );
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

  async function archiveLocation() {
    if (!location) return;
    setIsArchiving(true);
    setError("");
    try {
      const response = await fetch(
        `${apiUrl}/locations/${encodeURIComponent(location.slug)}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ confirmationName }),
        },
      );
      if (!response.ok)
        throw new Error(
          errorMessage(
            (await response.json().catch(() => ({}))) as ApiError,
            "No pudimos dar de baja la ubicación.",
          ),
        );
      window.dispatchEvent(new Event("arpa:locations-changed"));
      router.replace("/locations");
      router.refresh();
    } catch (archiveError) {
      setError(
        archiveError instanceof Error
          ? archiveError.message
          : "No pudimos dar de baja la ubicación.",
      );
      setIsArchiving(false);
    }
  }

  if (isLoading)
    return (
      <div className="space-y-6" role="status">
        <Skeleton className="h-9 w-36 motion-reduce:animate-none" />
        <Skeleton className="h-72 w-full motion-reduce:animate-none" />
        <Skeleton className="h-40 w-full motion-reduce:animate-none" />
      </div>
    );
  if (!location)
    return (
      <Alert variant="destructive">
        <TriangleAlert />
        <AlertTitle>Ubicación no disponible</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  const cover =
    location.coverImageUrl ?? locationFallbackImages[location.discipline];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/locations"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <ArrowLeft /> Mis ubicaciones
        </Link>
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogTrigger render={<Button className="cursor-pointer" />}>
            <Pencil /> Editar
          </DialogTrigger>
          <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-2xl">
            <form onSubmit={updateLocation}>
              <DialogHeader>
                <DialogTitle>Editar ubicación</DialogTitle>
                <DialogDescription>
                  Actualiza los datos e imágenes mediante enlaces públicos.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-5 sm:grid-cols-2">
                <EditField name="name" label="Nombre" value={location.name} />
                <EditField
                  name="business"
                  label="Negocio"
                  value={location.business}
                />
                <EditField
                  name="address"
                  label="Dirección"
                  value={location.address}
                />
                <EditField name="city" label="Ciudad" value={location.city} />
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="edit-description">Descripción</Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    defaultValue={location.description}
                    minLength={10}
                    maxLength={1000}
                    required
                  />
                </div>
                <EditField
                  name="coverImageUrl"
                  label="URL de portada"
                  value={location.coverImageUrl ?? ""}
                  type="url"
                  required={false}
                />
                <EditField
                  name="circuitMapImageUrl"
                  label="URL del mapa"
                  value={location.circuitMapImageUrl ?? ""}
                  type="url"
                  required={false}
                />
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="edit-photos">Galería</Label>
                  <Textarea
                    id="edit-photos"
                    name="photoUrls"
                    defaultValue={location.photoUrls.join("\n")}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <LoaderCircle className="animate-spin" />}
                  {isSaving ? "Guardando..." : "Guardar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {success && (
        <Alert className="border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
          <CheckCircle2 />
          <AlertTitle>Operación completada</AlertTitle>
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
      <div
        className="relative isolate min-h-64 overflow-hidden rounded-xl border bg-cover bg-center sm:min-h-72"
        style={{ backgroundImage: `url(${cover})` }}
      >
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-x-0 bottom-0 space-y-2 p-5 text-white sm:p-6">
          <p className="text-sm font-medium text-white/80">
            {locationDisciplineLabels[location.discipline]}
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">
            {location.name}
          </h1>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/80">
            <span className="flex items-center gap-2">
              <Building2 className="size-4" />
              {location.business}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="size-4" />
              {location.address}, {location.city}
            </span>
          </div>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Acerca de la ubicación</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-muted-foreground">
            {location.description}
          </p>
        </CardContent>
      </Card>
      {location.circuitMapImageUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="size-5" /> Mapa del circuito
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="aspect-[16/7] min-h-64 rounded-xl bg-contain bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${location.circuitMapImageUrl})` }}
            />
          </CardContent>
        </Card>
      )}
      {location.photoUrls.length > 0 && (
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Galería</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {location.photoUrls.map((photo, index) => (
              <div
                key={`${photo}-${index}`}
                className="aspect-[4/3] rounded-xl bg-muted bg-cover bg-center"
                style={{ backgroundImage: `url(${photo})` }}
                role="img"
                aria-label={`Foto ${index + 1} de ${location.name}`}
              />
            ))}
          </div>
        </section>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Propiedad de la ubicación</CardTitle>
          <CardDescription>
            El nuevo propietario debe aceptar la invitación desde su correo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <UserRoundCog className="size-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Transferir propiedad</p>
                <p className="text-sm text-muted-foreground">
                  Al aceptar, perderás permisos de edición y baja.
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
                      Ingresa el correo de un usuario activo de ARPA.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2 py-5">
                    <Label htmlFor="new-location-owner">
                      Correo del nuevo propietario
                    </Label>
                    <Input
                      id="new-location-owner"
                      name="email"
                      type="email"
                      autoComplete="email"
                      maxLength={254}
                      required
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setTransferOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isTransferring}>
                      {isTransferring && (
                        <LoaderCircle className="animate-spin" />
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
        description="La baja oculta la ubicación, pero conserva todo su historial."
      >
        <div className="flex flex-col gap-4 rounded-xl border border-red-300 bg-red-50/70 p-4 dark:border-red-900 dark:bg-red-950/20 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-red-900 dark:text-red-200">
              Dar de baja la ubicación
            </p>
            <p className="text-sm text-red-800 dark:text-red-300">
              Dejará de aparecer en tu menú y listados.
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
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <TriangleAlert />
                </AlertDialogMedia>
                <AlertDialogTitle>
                  ¿Dar de baja {location.name}?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Escribe el nombre exacto para confirmar. Los datos se
                  conservarán.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-2">
                <Label htmlFor="confirm-location-name">
                  Nombre de la ubicación
                </Label>
                <Input
                  id="confirm-location-name"
                  value={confirmationName}
                  onChange={(event) => setConfirmationName(event.target.value)}
                  autoComplete="off"
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  disabled={confirmationName !== location.name || isArchiving}
                  onClick={() => void archiveLocation()}
                >
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

function EditField({
  name,
  label,
  value,
  type = "text",
  required = true,
}: {
  name: string;
  label: string;
  value: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={`edit-${name}`}>{label}</Label>
      <Input
        id={`edit-${name}`}
        name={name}
        type={type}
        defaultValue={value}
        required={required}
      />
    </div>
  );
}
