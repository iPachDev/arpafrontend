"use client";

import Link from "next/link";
import { ArrowRight, Building2, MapPin, Plus } from "lucide-react";
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
import { useMyLocations } from "@/hooks/use-my-locations";
import {
  locationDisciplineLabels,
  locationFallbackImages,
} from "@/lib/location-api";

export function LocationsList() {
  const { locations, isLoading } = useMyLocations();
  if (isLoading)
    return (
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <Card key={item}>
            <Skeleton className="h-28 w-full rounded-none motion-reduce:animate-none" />
            <CardContent className="space-y-3 p-5">
              <Skeleton className="h-5 w-2/3 motion-reduce:animate-none" />
              <Skeleton className="h-4 w-full motion-reduce:animate-none" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {locations.map((location) => (
        <Card key={location.slug} size="sm">
          <div
            className="h-28 bg-cover bg-center"
            role="img"
            aria-label={`Portada de ${location.name}`}
            style={{
              backgroundImage: `url(${location.coverImageUrl ?? locationFallbackImages[location.discipline]})`,
            }}
          />
          <CardHeader>
            <CardTitle>{location.name}</CardTitle>
            <CardDescription>
              {locationDisciplineLabels[location.discipline]}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted-foreground">
            <p className="flex items-center gap-2">
              <Building2 className="size-4" />
              {location.business}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="size-4" />
              {location.city}
            </p>
          </CardContent>
          <CardFooter>
            <Button
              size="sm"
              className="w-full"
              variant="outline"
              nativeButton={false}
              render={<Link href={`/locations/${location.slug}`} />}
            >
              Ver ubicación <ArrowRight data-icon="inline-end" />
            </Button>
          </CardFooter>
        </Card>
      ))}
      <Card size="sm" className="border-dashed">
        <CardContent className="flex min-h-60 flex-col items-center justify-center gap-3 text-center">
          <div className="flex size-10 items-center justify-center rounded-full bg-muted">
            <Plus className="size-5" />
          </div>
          <div>
            <p className="font-semibold">
              {locations.length
                ? "Registra otra ubicación"
                : "Registra tu primera ubicación"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Agrega las instalaciones de tu negocio.
            </p>
          </div>
          <Button
            nativeButton={false}
            render={<Link href="/locations/create" />}
          >
            <Plus /> Crear ubicación
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
