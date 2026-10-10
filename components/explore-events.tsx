"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Bike,
  Bookmark,
  CalendarDays,
  Car,
  CheckCircle2,
  Clock3,
  CreditCard,
  DollarSign,
  ExternalLink,
  Flag,
  LayoutGrid,
  List,
  Map,
  MapPin,
  PersonStanding,
  Search,
  Share2,
  Star,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Discipline = "Karting" | "Running" | "Ciclismo" | "Automovilismo";

type ExploreEvent = {
  title: string;
  discipline: Discipline;
  date: string;
  location: string;
  description: string;
  image: string;
  imageAlt: string;
  address: string;
  schedule: string;
  cost: string;
  position: { left: string; top: string };
};

const organizer = {
  name: "ARPA Sports México",
  initials: "AS",
  rating: "4.8",
};

const disciplines: Discipline[] = [
  "Karting",
  "Running",
  "Ciclismo",
  "Automovilismo",
];

const events: ExploreEvent[] = [
  {
    title: "Copa Metropolitana de Karting",
    discipline: "Karting",
    date: "12 de septiembre de 2026",
    location: "Ciudad de México",
    description:
      "Jornada de velocidad con categorías para pilotos principiantes y avanzados.",
    image: "/images/events/kart-track.jpg",
    imageAlt: "Vista aérea de una pista de karting",
    address: "Av. Granjas 800, Azcapotzalco, Ciudad de México",
    schedule: "Registro 08:00 · Inicio 10:00",
    cost: "$850 MXN por participante",
    position: { left: "28%", top: "35%" },
  },
  {
    title: "Karting Challenge Veracruz",
    discipline: "Karting",
    date: "10 de octubre de 2026",
    location: "Veracruz, Veracruz",
    description:
      "Encuentro regional con sesiones de práctica, clasificación y carrera final.",
    image: "/images/events/race-track.jpg",
    imageAlt: "Vehículos compitiendo en un circuito",
    address: "Blvd. Adolfo Ruiz Cortines 3497, Boca del Río, Veracruz",
    schedule: "Prácticas 09:00 · Carrera 12:30",
    cost: "$950 MXN por participante",
    position: { left: "72%", top: "62%" },
  },
  {
    title: "10K Reforma",
    discipline: "Running",
    date: "20 de septiembre de 2026",
    location: "Ciudad de México",
    description:
      "Carrera urbana de diez kilómetros con salida y meta sobre Paseo de la Reforma.",
    image: "/images/events/race-track.jpg",
    imageAlt: "Circuito deportivo",
    address: "Paseo de la Reforma 222, Cuauhtémoc, Ciudad de México",
    schedule: "Salida 07:00 · Cierre de ruta 10:00",
    cost: "Gratuito",
    position: { left: "42%", top: "52%" },
  },
  {
    title: "Medio Maratón del Puerto",
    discipline: "Running",
    date: "18 de octubre de 2026",
    location: "Veracruz, Veracruz",
    description:
      "Recorrido de medio maratón junto a la costa para corredores de distintos niveles.",
    image: "/images/events/kart-track.jpg",
    imageAlt: "Circuito visto desde el aire",
    address: "Blvd. Manuel Ávila Camacho, Veracruz, Veracruz",
    schedule: "Salida 06:30 · Premiación 10:30",
    cost: "$650 MXN por participante",
    position: { left: "78%", top: "45%" },
  },
  {
    title: "Gran Fondo Capital",
    discipline: "Ciclismo",
    date: "4 de octubre de 2026",
    location: "Ciudad de México",
    description:
      "Ruta ciclista de fondo con categorías recreativas y competitivas.",
    image: "/images/events/kart-track.jpg",
    imageAlt: "Trazado de un circuito",
    address: "Av. de los Insurgentes Sur 1602, Ciudad de México",
    schedule: "Salida 06:00 · Meta abierta hasta 13:00",
    cost: "$720 MXN por participante",
    position: { left: "35%", top: "68%" },
  },
  {
    title: "Rally del Golfo",
    discipline: "Automovilismo",
    date: "24 de octubre de 2026",
    location: "Veracruz, Veracruz",
    description:
      "Evento de automovilismo con etapas cronometradas y exhibición para aficionados.",
    image: "/images/events/race-track.jpg",
    imageAlt: "Autos de competencia en una pista",
    address: "Carretera Federal 140, Xalapa, Veracruz",
    schedule: "Revisión 08:00 · Primera etapa 11:00",
    cost: "$1,500 MXN por vehículo",
    position: { left: "65%", top: "28%" },
  },
];

function EventDrawer({ event }: { event: ExploreEvent }) {
  const [registrationStatus, setRegistrationStatus] = useState<
    "idle" | "payment-required" | "registered"
  >("idle");
  const requiresPayment = event.cost !== "Gratuito";
  const relatedEvents = events
    .filter((relatedEvent) => relatedEvent.title !== event.title)
    .slice(0, 3);

  return (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline" />}>
        Ver detalle
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col overflow-y-auto">
          <DrawerHeader>
            <div className="flex w-full items-start justify-between gap-4 text-left">
              <div className="space-y-1">
                <DrawerTitle className="text-xl">{event.title}</DrawerTitle>
                <DrawerDescription>{event.discipline}</DrawerDescription>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="rounded-full"
                  aria-label="Guardar evento"
                  title="Guardar evento"
                >
                  <Bookmark />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="rounded-full"
                  aria-label="Compartir evento"
                  title="Compartir evento"
                >
                  <Share2 />
                </Button>
              </div>
            </div>
          </DrawerHeader>

          <div className="space-y-7 p-4">
            <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
              <Image
                src={event.image}
                alt={event.imageAlt}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 768px, 100vw"
              />
            </div>
            <section className="space-y-3">
              <h3 className="font-semibold">Información</h3>
              <p className="text-muted-foreground">{event.description}</p>
              <div className="flex items-center gap-2 text-sm">
                <CalendarDays className="size-4 text-muted-foreground" />
                <span>{event.date}</span>
              </div>
            </section>

            <Separator />

            <section className="grid gap-5 sm:grid-cols-3">
              <div className="space-y-2">
                <h3 className="flex items-center gap-2 font-semibold">
                  <MapPin className="size-4" />
                  Dirección
                </h3>
                <p className="text-sm text-muted-foreground">
                  {event.address}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="flex items-center gap-2 font-semibold">
                  <Clock3 className="size-4" />
                  Horarios
                </h3>
                <p className="text-sm text-muted-foreground">
                  {event.schedule}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="flex items-center gap-2 font-semibold">
                  <DollarSign className="size-4" />
                  Costos
                </h3>
                <p className="text-sm text-muted-foreground">{event.cost}</p>
              </div>
            </section>

            <Separator />

            <section className="space-y-3">
              <h3 className="font-semibold">Datos del organizador</h3>
              <Card size="sm">
                <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Avatar size="lg">
                    <AvatarFallback>{organizer.initials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="font-medium">{organizer.name}</p>
                    <div
                      className="flex items-center gap-1"
                      aria-label={`${organizer.rating} de 5 estrellas`}
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={
                            star < 5
                              ? "size-4 fill-foreground"
                              : "size-4 text-muted-foreground"
                          }
                        />
                      ))}
                      <span className="ml-1 text-sm text-muted-foreground">
                        {organizer.rating}
                      </span>
                    </div>
                  </div>
                  <Link
                    href="#"
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                    Ver perfil
                    <ExternalLink data-icon="inline-end" />
                  </Link>
                </CardContent>
              </Card>
            </section>

            <Separator />

            <section className="space-y-3">
              <h3 className="font-semibold">
                Otros eventos del organizador
              </h3>
              <div className="grid gap-3 sm:grid-cols-3">
                {relatedEvents.map((relatedEvent) => (
                  <Card key={relatedEvent.title} size="sm" className="pt-0">
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      <Image
                        src={relatedEvent.image}
                        alt={relatedEvent.imageAlt}
                        fill
                        className="object-cover"
                        sizes="(min-width: 640px) 220px, 100vw"
                      />
                    </div>
                    <CardContent className="space-y-1">
                      <CardDescription>
                        {relatedEvent.discipline}
                      </CardDescription>
                      <CardTitle className="text-sm">
                        {relatedEvent.title}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {relatedEvent.date}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {registrationStatus === "payment-required" && (
              <Alert>
                <CreditCard />
                <AlertTitle>Este evento tiene costo</AlertTitle>
                <AlertDescription>
                  Serás enviado a la pasarela de pago para completar tu
                  inscripción de forma segura.
                </AlertDescription>
              </Alert>
            )}

            {registrationStatus === "registered" && (
              <Alert className="border-green-600/30 bg-green-600/5">
                <CheckCircle2 className="text-green-600" />
                <AlertTitle>Inscripción completada</AlertTitle>
                <AlertDescription>
                  Te has inscrito correctamente a este evento gratuito.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DrawerFooter className="sm:flex-row sm:justify-end">
            <DrawerClose render={<Button variant="outline" />}>
              Cerrar
            </DrawerClose>
            {registrationStatus === "payment-required" ? (
              <Link
                href={{
                  pathname: "/checkout",
                  query: { event: event.title, amount: event.cost },
                }}
                className={buttonVariants({ variant: "default" })}
              >
                Continuar al pago
                <CreditCard data-icon="inline-end" />
              </Link>
            ) : (
              <Button
                type="button"
                disabled={registrationStatus === "registered"}
                onClick={() =>
                  setRegistrationStatus(
                    requiresPayment ? "payment-required" : "registered"
                  )
                }
              >
                {registrationStatus === "registered"
                  ? "Ya estás inscrito"
                  : "Inscribirme"}
              </Button>
            )}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function EventList({ items }: { items: ExploreEvent[] }) {
  return (
    <div className="space-y-4">
      {items.map((event) => (
        <Card key={event.title} size="sm" className="py-0">
          <CardContent className="flex flex-col p-0 sm:flex-row">
            <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-muted sm:aspect-auto sm:min-h-40 sm:w-56">
              <Image
                src={event.image}
                alt={event.imageAlt}
                fill
                className="object-cover"
                sizes="(min-width: 640px) 224px, 100vw"
              />
            </div>
            <div className="flex flex-1 flex-col gap-4 p-5">
              <div className="space-y-1">
                <CardDescription>{event.discipline}</CardDescription>
                <CardTitle className="text-lg">{event.title}</CardTitle>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <CalendarDays className="size-4" />
                  {event.date}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="size-4" />
                  {event.location}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {event.description}
              </p>
              <div className="mt-auto">
                <EventDrawer event={event} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EventsMap({ items }: { items: ExploreEvent[] }) {
  return (
    <Card className="overflow-hidden py-0">
      <CardContent className="relative min-h-[520px] bg-muted/30 p-0">
        <div className="absolute inset-0 bg-[#ff3630]/5" />
        <div className="absolute top-5 left-5 rounded-lg bg-background/90 px-3 py-2 shadow-sm ring-1 ring-border">
          <p className="text-sm font-medium">Mapa de eventos</p>
          <p className="text-xs text-muted-foreground">Vista demostrativa</p>
        </div>
        {items.map((event) => (
          <Button
            key={event.title}
            type="button"
            size="sm"
            variant="secondary"
            className="absolute -translate-x-1/2 -translate-y-1/2 shadow-md"
            style={event.position}
            title={event.title}
          >
            <MapPin />
            <span className="hidden lg:inline">{event.title}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

function CategoryContent({
  items,
  viewMode,
}: {
  items: ExploreEvent[];
  viewMode: "list" | "map";
}) {
  return viewMode === "list" ? (
    <EventList items={items} />
  ) : (
    <EventsMap items={items} />
  );
}

export function ExploreEvents() {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar eventos, disciplinas o ubicaciones..."
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={viewMode === "list" ? "default" : "outline"}
            onClick={() => setViewMode("list")}
          >
            <List />
            Modo lista
          </Button>
          <Button
            type="button"
            variant={viewMode === "map" ? "default" : "outline"}
            onClick={() => setViewMode("map")}
          >
            <Map />
            Modo mapa
          </Button>
        </div>
      </div>

      <Tabs defaultValue="todos" className="gap-6">
        <TabsList variant="line" className="max-w-full justify-start overflow-x-auto">
          <TabsTrigger value="todos">
            <LayoutGrid />
            Todos
          </TabsTrigger>
          <TabsTrigger value="karting">
            <Flag />
            Karting
          </TabsTrigger>
          <TabsTrigger value="running">
            <PersonStanding />
            Running
          </TabsTrigger>
          <TabsTrigger value="ciclismo">
            <Bike />
            Ciclismo
          </TabsTrigger>
          <TabsTrigger value="automovilismo">
            <Car />
            Automovilismo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="space-y-8">
          {viewMode === "map" ? (
            <EventsMap items={events} />
          ) : (
            disciplines.map((discipline) => {
              const disciplineEvents = events.filter(
                (event) => event.discipline === discipline
              );

              return (
                <section
                  key={discipline}
                  className="space-y-4 border-t pt-7 first:border-0 first:pt-0"
                >
                  <h2 className="text-xl font-semibold">{discipline}</h2>
                  <EventList items={disciplineEvents} />
                </section>
              );
            })
          )}
        </TabsContent>

        {disciplines.map((discipline) => (
          <TabsContent key={discipline} value={discipline.toLowerCase()}>
            <CategoryContent
              items={events.filter((event) => event.discipline === discipline)}
              viewMode={viewMode}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
