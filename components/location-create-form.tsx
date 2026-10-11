"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bike,
  Car,
  Gauge,
  LoaderCircle,
  PersonStanding,
  TriangleAlert,
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
import { Textarea } from "@/components/ui/textarea";
import {
  apiUrl,
  locationDisciplineLabels,
  type LocationDiscipline,
} from "@/lib/location-api";

const disciplines = [
  {
    value: "karting",
    description: "Pistas y centros de karting.",
    icon: Gauge,
  },
  {
    value: "running",
    description: "Rutas y centros de entrenamiento.",
    icon: PersonStanding,
  },
  { value: "cycling", description: "Circuitos y rutas ciclistas.", icon: Bike },
  {
    value: "motorsport",
    description: "Autódromos y centros de manejo.",
    icon: Car,
  },
] satisfies Array<{
  value: LocationDiscipline;
  description: string;
  icon: typeof Gauge;
}>;
type ApiError = { message?: string | string[] };
const message = (error: ApiError) =>
  Array.isArray(error.message) ? error.message.join(" ") : error.message;

export function LocationCreateForm() {
  const router = useRouter();
  const [discipline, setDiscipline] = useState<LocationDiscipline | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!discipline) return;
    setIsSaving(true);
    setError("");
    const data = new FormData(event.currentTarget);
    const photoUrls = String(data.get("photoUrls") ?? "")
      .split("\n")
      .map((url) => url.trim())
      .filter(Boolean);
    try {
      const response = await fetch(`${apiUrl}/locations`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          discipline,
          name: data.get("name"),
          business: data.get("business"),
          address: data.get("address"),
          city: data.get("city"),
          description: data.get("description"),
          coverImageUrl: data.get("coverImageUrl") || null,
          circuitMapImageUrl: data.get("circuitMapImageUrl") || null,
          photoUrls,
        }),
      });
      if (!response.ok) {
        const apiError = (await response.json().catch(() => ({}))) as ApiError;
        throw new Error(message(apiError) ?? "No pudimos crear la ubicación.");
      }
      const location = (await response.json()) as { slug: string };
      window.dispatchEvent(new Event("arpa:locations-changed"));
      router.push(`/locations/${location.slug}`);
      router.refresh();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "No pudimos crear la ubicación.",
      );
      setIsSaving(false);
    }
  }

  if (!discipline)
    return (
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Selecciona una disciplina
          </h1>
          <p className="mt-2 text-muted-foreground">
            Indica la actividad principal de la ubicación.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {disciplines.map(({ value, description, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setDiscipline(value)}
              className="rounded-xl text-left outline-none ring-ring transition hover:-translate-y-1 focus-visible:ring-3"
            >
              <Card className="h-full">
                <CardContent className="flex h-full flex-col items-center gap-4 p-5 text-center">
                  <div className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Icon className="size-6" />
                  </div>
                  <div>
                    <p className="font-semibold">
                      {locationDisciplineLabels[value]}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      </div>
    );

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {locationDisciplineLabels[discipline]}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Crea una ubicación
          </h1>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setDiscipline(null)}
          disabled={isSaving}
        >
          Cambiar disciplina
        </Button>
      </div>
      {error && (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>No se pudo crear</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Información de la ubicación</CardTitle>
          <CardDescription>
            Los enlaces de imagen son opcionales y se pueden editar después.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id="name"
              label="Nombre de la ubicación"
              minLength={3}
              disabled={isSaving}
            />
            <Field
              id="business"
              label="Nombre del negocio"
              minLength={2}
              disabled={isSaving}
            />
          </div>
          <Field
            id="address"
            label="Dirección"
            minLength={5}
            disabled={isSaving}
          />
          <Field id="city" label="Ciudad" minLength={2} disabled={isSaving} />
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              minLength={10}
              maxLength={1000}
              rows={4}
              disabled={isSaving}
              required
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id="coverImageUrl"
              label="URL de portada (opcional)"
              type="url"
              required={false}
              disabled={isSaving}
            />
            <Field
              id="circuitMapImageUrl"
              label="URL del mapa (opcional)"
              type="url"
              required={false}
              disabled={isSaving}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="photoUrls">URLs de galería (opcional)</Label>
            <Textarea
              id="photoUrls"
              name="photoUrls"
              rows={3}
              placeholder="Una URL por línea, máximo 12"
              disabled={isSaving}
            />
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/locations")}
          disabled={isSaving}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving && (
            <LoaderCircle className="animate-spin motion-reduce:animate-none" />
          )}
          {isSaving ? "Creando..." : "Crear ubicación"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  type = "text",
  required = true,
  ...props
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  minLength?: number;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={id}
        type={type}
        maxLength={type === "url" ? 2048 : 180}
        required={required}
        {...props}
      />
    </div>
  );
}
