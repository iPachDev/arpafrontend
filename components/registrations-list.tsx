"use client";

import Link from "next/link";
import { CalendarCheck2, CalendarDays, MapPin, TriangleAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
import { useMyRegistrations } from "@/hooks/use-my-registrations";
import {
  eventDisciplineLabels,
  eventFallbackImages,
  formatEventDate,
} from "@/lib/event-api";

export function RegistrationsList() {
  const { registrations, isLoading, error } = useMyRegistrations();

  if (isLoading) {
    return (
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" role="status">
        {[1, 2, 3].map((item) => (
          <Skeleton key={item} className="h-80 rounded-xl motion-reduce:animate-none" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <TriangleAlert />
        <AlertTitle>No se cargaron tus inscripciones</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!registrations.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <CalendarCheck2 className="size-10 text-muted-foreground" />
          <div>
            <p className="font-medium">Aún no tienes inscripciones</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Explora los eventos disponibles y elige el siguiente.
            </p>
          </div>
          <Button nativeButton={false} render={<Link href="/explore" />}>
            Explorar eventos
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {registrations.map((registration) => {
        const event = registration.event;
        const image = event.imageUrl ?? eventFallbackImages[event.discipline];
        return (
          <Card key={registration.id} className="overflow-hidden py-0">
            <div
              role="img"
              aria-label={`Imagen de ${event.title}`}
              className="aspect-[16/8] bg-muted bg-cover bg-center"
              style={{ backgroundImage: `url("${image}")` }}
            />
            <CardHeader className="px-5 pt-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{eventDisciplineLabels[event.discipline]}</Badge>
                <Badge className="bg-emerald-600 text-white">Inscrito</Badge>
              </div>
              <CardTitle className="mt-2 text-xl">{event.title}</CardTitle>
              <CardDescription>
                Inscrito el {formatEventDate(registration.registeredAt)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 px-5 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <CalendarDays className="size-4" /> {formatEventDate(event.startsAt)}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="size-4" />
                {event.location?.name ?? "Sin ubicación asociada"}
              </p>
            </CardContent>
            <CardFooter className="justify-end border-t bg-muted/30 px-5 py-4">
              <Button
                variant="outline"
                nativeButton={false}
                render={<Link href={`/registrations/${event.slug}`} />}
              >
                Ver inscripción
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
