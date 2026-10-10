"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Bike, Car, Gauge, ImagePlus, Map, PersonStanding } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const disciplines = [
  { name: "Karting", description: "Pistas y centros de karting.", icon: Gauge },
  { name: "Running", description: "Rutas, clubes y centros de entrenamiento.", icon: PersonStanding },
  { name: "Ciclismo", description: "Circuitos, velódromos y rutas ciclistas.", icon: Bike },
  { name: "Automovilismo", description: "Autódromos y centros de manejo.", icon: Car },
] as const;

export function LocationCreateForm() {
  const router = useRouter();
  const [discipline, setDiscipline] = useState<string | null>(null);
  const [name, setName] = useState("GM Carso");
  const [business, setBusiness] = useState("Grupo Motor ARPA");
  const [address, setAddress] = useState("Lago Zúrich 245, Ampliación Granada");
  const [city, setCity] = useState("Ciudad de México");
  const [description, setDescription] = useState(
    "Circuito para entrenamientos, competencias privadas y fechas de campeonato.",
  );
  const [photoNames, setPhotoNames] = useState<string[]>([]);
  const [mapName, setMapName] = useState("");

  function handlePhotos(event: ChangeEvent<HTMLInputElement>) {
    setPhotoNames(Array.from(event.target.files ?? []).map((file) => file.name));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams({
      name,
      business,
      discipline: discipline ?? "Karting",
      address,
      city,
      description,
    });
    router.push(`/locations/gm-carso?${params.toString()}`);
  }

  if (!discipline) {
    return (
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Selecciona una disciplina</h1>
          <p className="mt-2 text-muted-foreground">
            Indica el tipo de actividad principal de la ubicación.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {disciplines.map(({ name: itemName, description: itemDescription, icon: Icon }) => (
            <button
              key={itemName}
              type="button"
              onClick={() => setDiscipline(itemName)}
              className="rounded-xl text-left outline-none ring-ring transition hover:-translate-y-1 focus-visible:ring-3"
            >
              <Card className="h-full transition-colors hover:bg-muted/50">
                <CardContent className="flex h-full flex-col items-center gap-4 p-5 text-center">
                  <div className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Icon className="size-6" />
                  </div>
                  <div>
                    <p className="font-semibold">{itemName}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{itemDescription}</p>
                  </div>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{discipline}</p>
          <h1 className="text-3xl font-semibold tracking-tight">Crea una ubicación</h1>
        </div>
        <Button type="button" variant="outline" onClick={() => setDiscipline(null)}>
          Cambiar disciplina
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del negocio</CardTitle>
          <CardDescription>Datos que aparecerán en el perfil de la ubicación.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location-name">Nombre de la ubicación</Label>
              <Input id="location-name" value={name} onChange={(event) => setName(event.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business-name">Nombre del negocio</Label>
              <Input id="business-name" value={business} onChange={(event) => setBusiness(event.target.value)} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location-address">Dirección</Label>
            <Input id="location-address" value={address} onChange={(event) => setAddress(event.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location-city">Ciudad</Label>
            <Input id="location-city" value={city} onChange={(event) => setCity(event.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location-description">Descripción</Label>
            <Textarea id="location-description" value={description} onChange={(event) => setDescription(event.target.value)} rows={4} required />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-3">
              <Label htmlFor="location-photos">Fotos</Label>
              <label htmlFor="location-photos" className="flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-5 text-center hover:bg-muted/50">
                <ImagePlus className="size-6 text-muted-foreground" />
                <span className="text-sm font-medium">Agregar fotografías</span>
                <span className="text-xs text-muted-foreground">Puedes seleccionar varias.</span>
              </label>
              <Input id="location-photos" type="file" accept="image/*" multiple className="hidden" onChange={handlePhotos} />
              {photoNames.length > 0 && <p className="text-xs text-muted-foreground">{photoNames.length} fotos seleccionadas</p>}
            </div>

            <div className="space-y-3">
              <Label htmlFor="circuit-map">Mapa del circuito</Label>
              <label htmlFor="circuit-map" className="flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-5 text-center hover:bg-muted/50">
                <Map className="size-6 text-muted-foreground" />
                <span className="text-sm font-medium">Agregar mapa</span>
                <span className="text-xs text-muted-foreground">Plano o imagen del recorrido.</span>
              </label>
              <Input id="circuit-map" type="file" accept="image/*" className="hidden" onChange={(event) => setMapName(event.target.files?.[0]?.name ?? "")} />
              {mapName && <p className="truncate text-xs text-muted-foreground">{mapName}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.push("/locations")}>Cancelar</Button>
        <Button type="submit">Crear ubicación</Button>
      </div>
    </form>
  );
}
