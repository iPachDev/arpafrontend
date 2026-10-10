import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, MapPin, MonitorPlay, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { locations } from "@/lib/locations";

export function LocationsList() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {locations.map((location) => (
        <Card key={location.slug} size="sm">
          <div className="relative h-28 overflow-hidden bg-muted">
            <Image
              src={location.coverImage}
              alt={`Portada de ${location.name}`}
              fill
              sizes="(min-width: 1280px) 30vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <CardHeader>
            <CardTitle>{location.name}</CardTitle>
            <CardDescription>{location.discipline}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted-foreground">
            <p className="flex items-center gap-2">
              <Building2 className="size-4" /> {location.business}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="size-4" /> {location.city}
            </p>
          </CardContent>
          <CardFooter className="gap-2">
            <Button
              size="sm"
              className="flex-1"
              variant="outline"
              nativeButton={false}
              render={<Link href={`/locations/${location.slug}`} />}
            >
              Ver ubicación <ArrowRight data-icon="inline-end" />
            </Button>
            {location.liveRace && (
              <Button
                size="icon-sm"
                nativeButton={false}
                render={
                  <Link
                    href={`/live/${location.slug}`}
                    aria-label={`Ver carrera en vivo de ${location.name}`}
                    title="Vista de carrera en vivo"
                  />
                }
              >
                <MonitorPlay />
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}

      <Card size="sm" className="border-dashed">
        <CardContent className="flex min-h-60 flex-col items-center justify-center gap-3 text-center">
          <div className="flex size-10 items-center justify-center rounded-full bg-muted">
            <Plus className="size-5" />
          </div>
          <div>
            <p className="font-semibold">Registra una ubicación</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Agrega las instalaciones de tu negocio.
            </p>
          </div>
          <Button
            nativeButton={false}
            render={<Link href="/locations/create" />}
          >
            <Plus data-icon="inline-start" /> Crear ubicación
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
