"use client";

import Link from "next/link";
import { CalendarPlus, Plus } from "lucide-react";

import { EventCard } from "@/components/event-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyEvents } from "@/hooks/use-my-events";

export function MyEventsList() {
  const { events, isLoading, canManage } = useMyEvents();

  if (isLoading) {
    return (
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" role="status">
        {[1, 2, 3].map((item) => (
          <Skeleton
            key={item}
            className="h-96 rounded-xl motion-reduce:animate-none"
          />
        ))}
      </div>
    );
  }

  if (!canManage) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <CalendarPlus className="size-9 text-muted-foreground" />
          <div>
            <p className="font-medium">Acceso de consulta</p>
            <p className="mt-1 text-sm text-muted-foreground">
              El rol lector puede explorar eventos e inscribirse, pero no administrarlos.
            </p>
          </div>
          <Button nativeButton={false} render={<Link href="/explore" />}>
            Explorar eventos
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!events.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <CalendarPlus className="size-10 text-muted-foreground" />
          <div>
            <p className="font-medium">Aún no tienes eventos</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Crea el primero y comienza a recibir inscripciones.
            </p>
          </div>
          <Button nativeButton={false} render={<Link href="/events/create" />}>
            <Plus /> Crear evento
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
