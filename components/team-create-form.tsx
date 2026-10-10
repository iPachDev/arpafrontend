"use client";

import { type ChangeEvent, type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bike,
  Car,
  Gauge,
  ImagePlus,
  LoaderCircle,
  Lock,
  PersonStanding,
  TriangleAlert,
  Users,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  apiUrl,
  type ApiTeam,
  type TeamDiscipline,
  type TeamPrivacy,
} from "@/lib/team-api";

type ApiError = { message?: string | string[] };

const disciplines: Array<{
  value: TeamDiscipline;
  name: string;
  description: string;
  icon: typeof Gauge;
}> = [
  {
    value: "karting",
    name: "Karting",
    description: "Pilotos, mecánicos e ingeniería de pista.",
    icon: Gauge,
  },
  {
    value: "running",
    name: "Running",
    description: "Corredores, entrenadores y preparación física.",
    icon: PersonStanding,
  },
  {
    value: "cycling",
    name: "Ciclismo",
    description: "Ciclistas, entrenadores y soporte técnico.",
    icon: Bike,
  },
  {
    value: "motorsport",
    name: "Automovilismo",
    description: "Pilotos, mecánicos e ingenieros de carrera.",
    icon: Car,
  },
];

function getErrorMessage(error: ApiError): string {
  if (Array.isArray(error.message)) return error.message.join(" ");
  return error.message ?? "No pudimos crear el equipo.";
}

export function TeamCreateForm() {
  const router = useRouter();
  const [discipline, setDiscipline] = useState<TeamDiscipline | null>(null);
  const [title, setTitle] = useState("");
  const [privacy, setPrivacy] = useState<TeamPrivacy>("private");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [photoNames, setPhotoNames] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  function handlePhotos(event: ChangeEvent<HTMLInputElement>) {
    setPhotoNames(Array.from(event.target.files ?? []).map((file) => file.name));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!discipline) return;

    setIsSaving(true);
    setError("");

    try {
      const response = await fetch(`${apiUrl}/teams`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: title,
          discipline,
          privacy,
          location,
          description,
        }),
      });

      if (response.status === 401) {
        router.replace("/login?next=/teams/create");
        return;
      }
      if (!response.ok) {
        const apiError = (await response.json().catch(() => ({}))) as ApiError;
        throw new Error(getErrorMessage(apiError));
      }

      const team = (await response.json()) as ApiTeam;
      window.dispatchEvent(new Event("arpa:teams-changed"));
      router.push(`/teams/${team.slug}`);
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No pudimos crear el equipo.",
      );
      setIsSaving(false);
    }
  }

  if (!discipline) {
    return (
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Selecciona una disciplina
          </h1>
          <p className="mt-2 text-muted-foreground">
            La disciplina definirá la identidad y los roles del equipo.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {disciplines.map(
            ({ value, name, description: itemDescription, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setDiscipline(value)}
                className="cursor-pointer rounded-xl text-left outline-none ring-ring transition-colors duration-200 focus-visible:ring-3"
              >
                <Card className="h-full transition-colors duration-200 hover:border-primary/40 hover:bg-primary/5">
                  <CardContent className="flex h-full flex-col items-center gap-4 p-5 text-center">
                    <div className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Icon className="size-6" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-semibold">{name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {itemDescription}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </button>
            ),
          )}
        </div>
      </div>
    );
  }

  const disciplineName =
    disciplines.find((item) => item.value === discipline)?.name ?? discipline;

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-primary">{disciplineName}</p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Crea tu equipo
          </h1>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setDiscipline(null)}
          disabled={isSaving}
          className="cursor-pointer"
        >
          Cambiar disciplina
        </Button>
      </div>

      {error && (
        <Alert className="border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200 [&_[data-slot=alert-description]]:text-red-800 dark:[&_[data-slot=alert-description]]:text-red-300">
          <TriangleAlert />
          <AlertTitle>No se creó el equipo</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Información general</CardTitle>
          <CardDescription>
            Tú quedarás registrado automáticamente como owner.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="team-title">Nombre del equipo</Label>
            <Input
              id="team-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              minLength={2}
              maxLength={100}
              disabled={isSaving}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="team-location">Ubicación</Label>
            <Input
              id="team-location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              minLength={2}
              maxLength={120}
              disabled={isSaving}
              required
            />
          </div>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium">Privacidad</legend>
            <RadioGroup
              value={privacy}
              onValueChange={(value) => setPrivacy(value as TeamPrivacy)}
              className="grid sm:grid-cols-2"
              disabled={isSaving}
            >
              <Label className="flex cursor-pointer gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                <RadioGroupItem value="public" />
                <span>
                  <span className="flex items-center gap-2 font-medium">
                    <Users className="size-4" aria-hidden="true" /> Público
                  </span>
                  <span className="mt-1 block text-xs font-normal text-muted-foreground">
                    Otros usuarios podrán descubrir el equipo.
                  </span>
                </span>
              </Label>
              <Label className="flex cursor-pointer gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                <RadioGroupItem value="private" />
                <span>
                  <span className="flex items-center gap-2 font-medium">
                    <Lock className="size-4" aria-hidden="true" /> Privado
                  </span>
                  <span className="mt-1 block text-xs font-normal text-muted-foreground">
                    Solo se accederá mediante invitación.
                  </span>
                </span>
              </Label>
            </RadioGroup>
          </fieldset>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="team-description">Descripción</Label>
              <span className="text-xs tabular-nums text-muted-foreground">
                {description.length}/500
              </span>
            </div>
            <Textarea
              id="team-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              minLength={10}
              maxLength={500}
              disabled={isSaving}
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="team-photos">Fotos del equipo</Label>
            <label
              htmlFor="team-photos"
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-8 text-center transition-colors hover:bg-muted/50"
            >
              <ImagePlus className="size-6 text-muted-foreground" />
              <span className="text-sm font-medium">Seleccionar imágenes</span>
              <span className="text-xs text-muted-foreground">
                Vista previa local; las imágenes todavía no se guardan.
              </span>
            </label>
            <Input
              id="team-photos"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              className="hidden"
              onChange={handlePhotos}
              disabled={isSaving}
            />
            {photoNames.length > 0 && (
              <div className="grid gap-2 sm:grid-cols-2">
                {photoNames.map((name) => (
                  <div
                    key={name}
                    className="truncate rounded-md bg-muted px-3 py-2 text-xs"
                  >
                    {name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/teams")}
          disabled={isSaving}
          className="cursor-pointer"
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSaving} className="cursor-pointer">
          {isSaving && (
            <LoaderCircle className="animate-spin motion-reduce:animate-none" />
          )}
          {isSaving ? "Creando equipo..." : "Crear equipo"}
        </Button>
      </div>
    </form>
  );
}

