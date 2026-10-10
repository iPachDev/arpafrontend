import Image from "next/image";
import { ArrowRight, CalendarDays, ImageIcon, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const events = [
  {
    title: "Copa Metropolitana de Karting",
    date: "12 de septiembre de 2026",
    location: "Ciudad de México",
    description:
      "Jornada de velocidad con categorías para pilotos principiantes y avanzados.",
    action: "Ver detalles",
    image: "/images/events/kart-track.jpg",
    imageAlt: "Vista aérea de una pista de karting",
  },
  {
    title: "Gran Premio Capitalino",
    date: "26 de septiembre de 2026",
    location: "Ciudad de México",
    description:
      "Competencia nocturna con sesiones de práctica, clasificación y carrera final.",
    action: "Ver detalles",
    image: "/images/events/race-track.jpg",
    imageAlt: "Vehículos compitiendo en un circuito",
  },
  {
    title: "Karting Challenge Veracruz",
    date: "10 de octubre de 2026",
    location: "Veracruz, Veracruz",
    description:
      "Encuentro regional de karting con actividades para pilotos y acompañantes.",
    action: "Ver detalles",
  },
  {
    title: "Inscripciones abiertas",
    date: "Cierre: 5 de septiembre de 2026",
    location: "Ciudad de México y Veracruz",
    description:
      "Consulta las convocatorias y registra tu participación en las carreras disponibles.",
    action: "Consultar inscripciones",
  },
];

export function EventsSection() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Próximos eventos
          </h2>
          <p className="text-muted-foreground">
            Carreras e inscripciones disponibles próximamente.
          </p>
        </div>
        <Button type="button" variant="outline" className="self-start sm:self-auto">
          Ver más
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {events.map((event) => (
          <Card key={event.title} className="h-full pt-0">
            <div className="relative aspect-video overflow-hidden bg-muted">
              {event.image ? (
                <Image
                  src={event.image}
                  alt={event.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-muted-foreground">
                  <ImageIcon className="size-10" aria-hidden="true" />
                  <span className="sr-only">Imagen no disponible</span>
                </div>
              )}
            </div>

            <CardHeader>
              <CardDescription>Próximo evento · Ejemplo</CardDescription>
              <CardTitle>{event.title}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CalendarDays className="size-4 text-muted-foreground" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-muted-foreground" />
                  <span>{event.location}</span>
                </div>
              </div>
              <CardDescription>{event.description}</CardDescription>
            </CardContent>

            <CardFooter className="mt-auto">
              <Button type="button" variant="outline" className="w-full">
                {event.action}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
