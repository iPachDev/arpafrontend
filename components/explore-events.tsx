"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarSearch, Search, TriangleAlert } from "lucide-react";

import { EventCard } from "@/components/event-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { apiUrl, type ApiEvent } from "@/lib/event-api";

export function ExploreEvents() {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${apiUrl}/events`, {
      credentials: "include",
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        return (await response.json()) as ApiEvent[];
      })
      .then(setEvents)
      .catch((loadError) => {
        if ((loadError as Error).name !== "AbortError") {
          setError("No pudimos cargar los eventos disponibles.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, []);

  const filteredEvents = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("es-MX");
    if (!normalized) return events;
    return events.filter((event) =>
      [
        event.title,
        event.description,
        event.discipline,
        event.type,
        event.location?.name,
        event.location?.city,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLocaleLowerCase("es-MX").includes(normalized),
        ),
    );
  }, [events, query]);

  return (
    <div className="space-y-6">
      <div className="relative max-w-2xl">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar por nombre, disciplina o ubicación..."
          className="pl-9"
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>No se cargaron los eventos</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" role="status">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-96 rounded-xl motion-reduce:animate-none" />
          ))}
        </div>
      ) : filteredEvents.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <CalendarSearch className="size-10 text-muted-foreground" />
            <div>
              <p className="font-medium">No encontramos eventos</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Prueba otra búsqueda o vuelve más tarde.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
