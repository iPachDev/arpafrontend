"use client";

import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Camera,
  ImagePlus,
  LockKeyhole,
  LoaderCircle,
  Pencil,
  Save,
  Send,
  Trash2,
  TriangleAlert,
  UserRoundCog,
  Users,
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
import { Switch } from "@/components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  apiUrl,
  disciplineLabels,
  type ApiTeam,
  type TeamDiscipline,
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
  const [teamName, setTeamName] = useState(team.name);
  const [discipline, setDiscipline] = useState<TeamDiscipline>(team.discipline);
  const [location, setLocation] = useState(team.location ?? "");
  const [description, setDescription] = useState(team.description ?? "");
  const [allowNonMembers, setAllowNonMembers] = useState(
    team.allowNonMembers,
  );
  const [showMembers, setShowMembers] = useState(team.showMembers);
  const [confirmationName, setConfirmationName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  useEffect(
    () => () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    },
    [logoPreview],
  );
  useEffect(
    () => () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    },
    [coverPreview],
  );
  useEffect(
    () => () => {
      photoPreviews.forEach((preview) => URL.revokeObjectURL(preview));
    },
    [photoPreviews],
  );

  function validImage(file: File): boolean {
    return (
      ["image/jpeg", "image/png", "image/webp"].includes(file.type) &&
      file.size <= 5 * 1024 * 1024
    );
  }

  function selectImage(
    event: ChangeEvent<HTMLInputElement>,
    kind: "logo" | "cover",
  ) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!validImage(file)) {
      setError("La imagen debe ser JPG, PNG o WebP y pesar máximo 5 MB.");
      return;
    }
    if (kind === "logo") {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    } else {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
    setError("");
  }

  function selectPhotos(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    const available = 6 - team.photoUrls.length;
    if (files.length > available) {
      setError(
        `Puedes agregar ${available} foto${available === 1 ? "" : "s"} más.`,
      );
      return;
    }
    if (files.some((file) => !validImage(file))) {
      setError("Cada foto debe ser JPG, PNG o WebP y pesar máximo 5 MB.");
      return;
    }
    setPhotoFiles(files);
    setPhotoPreviews(files.map((file) => URL.createObjectURL(file)));
    setError("");
  }

  async function uploadImage(
    currentTeam: ApiTeam,
    kind: "logo" | "cover",
    file: File,
  ): Promise<ApiTeam> {
    const body = new FormData();
    body.append("file", file);
    const response = await fetch(
      `${apiUrl}/teams/${encodeURIComponent(currentTeam.slug)}/images/${kind}`,
      { method: "POST", credentials: "include", body },
    );
    if (!response.ok) {
      const apiError = (await response.json().catch(() => ({}))) as ApiError;
      throw new Error(
        getErrorMessage(
          apiError,
          `No pudimos subir ${kind === "logo" ? "el logo" : "la portada"}.`,
        ),
      );
    }
    return (await response.json()) as ApiTeam;
  }

  async function uploadPhotos(currentTeam: ApiTeam): Promise<ApiTeam> {
    const body = new FormData();
    photoFiles.forEach((file) => body.append("files", file));
    const response = await fetch(
      `${apiUrl}/teams/${encodeURIComponent(currentTeam.slug)}/photos`,
      { method: "POST", credentials: "include", body },
    );
    if (!response.ok) {
      const apiError = (await response.json().catch(() => ({}))) as ApiError;
      throw new Error(
        getErrorMessage(apiError, "No pudimos subir las fotos del equipo."),
      );
    }
    return (await response.json()) as ApiTeam;
  }

  function resetSelectedImages() {
    setLogoFile(null);
    setCoverFile(null);
    setPhotoFiles([]);
    setLogoPreview(null);
    setCoverPreview(null);
    setPhotoPreviews([]);
  }

  function resetEditor() {
    setTeamName(team.name);
    setDiscipline(team.discipline);
    setLocation(team.location ?? "");
    setDescription(team.description ?? "");
    setAllowNonMembers(team.allowNonMembers);
    setShowMembers(team.showMembers);
    resetSelectedImages();
  }

  async function updateTeam(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch(
        `${apiUrl}/teams/${encodeURIComponent(team.slug)}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: teamName,
            discipline,
            allowNonMembers,
            showMembers,
            location,
            description,
          }),
        },
      );

      if (!response.ok) {
        const apiError = (await response.json().catch(() => ({}))) as ApiError;
        throw new Error(
          getErrorMessage(apiError, "No pudimos actualizar el equipo."),
        );
      }

      let updatedTeam = (await response.json()) as ApiTeam;
      if (logoFile)
        updatedTeam = await uploadImage(updatedTeam, "logo", logoFile);
      if (coverFile) {
        updatedTeam = await uploadImage(updatedTeam, "cover", coverFile);
      }
      if (photoFiles.length > 0) updatedTeam = await uploadPhotos(updatedTeam);
      onUpdated(updatedTeam);
      setTeamName(updatedTeam.name);
      setDiscipline(updatedTeam.discipline);
      setLocation(updatedTeam.location ?? "");
      setDescription(updatedTeam.description ?? "");
      setAllowNonMembers(updatedTeam.allowNonMembers);
      setShowMembers(updatedTeam.showMembers);
      window.dispatchEvent(new Event("arpa:teams-changed"));
      setSuccess("La información del equipo se actualizó correctamente.");
      resetSelectedImages();
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
          <p className="font-medium">Información</p>
          <p className="text-sm text-muted-foreground">
            Edita nombre, descripción, ubicación, logo y portada.
          </p>
        </div>
        <Dialog
          open={editOpen}
          onOpenChange={(open) => {
            if (isSaving) return;
            setEditOpen(open);
            if (!open) resetEditor();
          }}
        >
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

              <div
                className="relative mt-5 min-h-48 overflow-hidden rounded-2xl border bg-muted bg-cover bg-center"
                style={
                  coverPreview || team.coverImageUrl
                    ? {
                        backgroundImage: `url("${coverPreview ?? team.coverImageUrl}")`,
                      }
                    : undefined
                }
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
                <Label
                  htmlFor="team-cover-file"
                  className="absolute right-3 top-3 z-10 inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-black/65 px-3 text-sm font-medium text-white hover:bg-black/80"
                >
                  <Camera className="size-4" /> Cambiar portada
                </Label>
                <Input
                  id="team-cover-file"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  disabled={isSaving}
                  onChange={(event) => selectImage(event, "cover")}
                />

                <div className="absolute inset-x-4 bottom-4 z-10 flex items-end gap-4 text-white">
                  <div className="group/logo relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-white/80 bg-background bg-cover bg-center text-xl font-semibold text-foreground shadow-lg">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={
                        logoPreview || team.logoImageUrl
                          ? {
                              backgroundImage: `url("${logoPreview ?? team.logoImageUrl}")`,
                            }
                          : undefined
                      }
                    />
                    {!logoPreview && !team.logoImageUrl && (
                      <span>{teamName.trim().charAt(0).toUpperCase() || "A"}</span>
                    )}
                    <Label
                      htmlFor="team-logo-file"
                      aria-label="Cambiar logo"
                      className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/55 text-white opacity-0 transition-opacity hover:opacity-100 focus-within:opacity-100"
                    >
                      <Camera className="size-5" />
                    </Label>
                    <Input
                      id="team-logo-file"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="sr-only"
                      disabled={isSaving}
                      onChange={(event) => selectImage(event, "logo")}
                    />
                  </div>
                  <div className="min-w-0 pb-1">
                    <p className="truncate text-xl font-semibold sm:text-2xl">
                      {teamName || "Nombre del equipo"}
                    </p>
                    <p className="text-xs text-white/80">
                      Presiona el logo o la portada para cambiarlos
                    </p>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="information" className="pt-5">
                <TabsList className="grid h-10 w-full grid-cols-2">
                  <TabsTrigger value="information">Información</TabsTrigger>
                  <TabsTrigger value="privacy">
                    <LockKeyhole /> Privacidad
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="information">
                  <div className="grid gap-4 pt-5 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="team-name">Nombre</Label>
                  <Input
                    id="team-name"
                    name="name"
                    value={teamName}
                    onChange={(event) => setTeamName(event.target.value)}
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
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="team-location">Ubicación</Label>
                  <Input
                    id="team-location"
                    name="location"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
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
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    minLength={10}
                    maxLength={500}
                    rows={4}
                    disabled={isSaving}
                    required
                  />
                </div>
                <div className="space-y-3 sm:col-span-2">
                  <div>
                    <Label>Agregar fotos del equipo</Label>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {team.photoUrls.length}/6 fotos guardadas. JPG, PNG o
                      WebP, máximo 5 MB cada una.
                    </p>
                  </div>
                  {team.photoUrls.length < 6 && (
                    <>
                      <Label
                        htmlFor="team-gallery-files"
                        className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed p-5 text-sm font-medium hover:bg-muted/50"
                      >
                        <ImagePlus className="size-5" /> Seleccionar fotos
                      </Label>
                      <Input
                        id="team-gallery-files"
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        multiple
                        className="sr-only"
                        disabled={isSaving}
                        onChange={selectPhotos}
                      />
                    </>
                  )}
                  {photoPreviews.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {photoPreviews.map((preview, index) => (
                        <div
                          key={preview}
                          role="img"
                          aria-label={`Nueva foto ${index + 1}`}
                          className="aspect-video rounded-lg border bg-cover bg-center"
                          style={{ backgroundImage: `url("${preview}")` }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                  </div>
                </TabsContent>

                <TabsContent value="privacy">
                  <div className="space-y-4 pt-5">
                    <div className="rounded-xl border p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <Label htmlFor="allow-non-members">
                            Permitir visitas de personas no integrantes
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Personas autenticadas podrán consultar la descripción
                            y las fotos mediante el enlace compartido.
                          </p>
                        </div>
                        <Switch
                          id="allow-non-members"
                          checked={allowNonMembers}
                          onCheckedChange={(checked) => {
                            setAllowNonMembers(checked);
                            if (!checked) setShowMembers(false);
                          }}
                          disabled={isSaving}
                          aria-label="Permitir ver el equipo sin ser integrante"
                        />
                      </div>
                    </div>

                    <div className="rounded-xl border p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <Label htmlFor="show-team-members">
                            Mostrar integrantes
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Muestra únicamente nombres y roles. Correos e
                            invitaciones siempre permanecen privados.
                          </p>
                        </div>
                        <Switch
                          id="show-team-members"
                          checked={showMembers}
                          onCheckedChange={setShowMembers}
                          disabled={isSaving || !allowNonMembers}
                          aria-label="Mostrar integrantes a visitantes"
                        />
                      </div>
                      {!allowNonMembers && (
                        <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                          <Users className="size-4" /> Activa primero las
                          visitas de personas no integrantes.
                        </p>
                      )}
                    </div>

                    <div className="rounded-xl bg-muted/60 p-4 text-sm text-muted-foreground">
                      Por defecto ambas opciones están desactivadas: solo los
                      integrantes pueden ver el perfil completo y su listado.
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditOpen(false);
                    resetEditor();
                  }}
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
