"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  MapPin,
  Pencil,
  TriangleAlert,
  Users,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  apiUrl,
  eventDisciplineLabels,
  eventFallbackImages,
  eventTypeLabels,
  formatEventDate,
  type ApiEvent,
} from "@/lib/event-api";

type ApiError = { message?: string | string[] };

function getErrorMessage(error: ApiError, fallback: string) {
  return Array.isArray(error.message)
    ? error.message.join(" ")
    : (error.message ?? fallback);
}

export function EventDetail({ slug }: { slug: string }) {
  const router = useRouter();
  const [event, setEvent] = useState<ApiEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${apiUrl}/events/${encodeURIComponent(slug)}`, {
      credentials: "include",
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (response.status === 401) {
          router.replace(`/login?next=/events/${encodeURIComponent(slug)}`);
          return null;
        }
        if (!response.ok) throw new Error("El evento no existe.");
        return (await response.json()) as ApiEvent;
      })
      .then((data) => data && setEvent(data))
      .catch((loadError) => {
        if ((loadError as Error).name !== "AbortError") {
          setError("No pudimos cargar el evento.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, [router, slug]);

  async function changeRegistration(register: boolean) {
    setIsSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch(
        `${apiUrl}/events/${encodeURIComponent(slug)}/registrations${register ? "" : "/me"}`,
        {
          method: register ? "POST" : "DELETE",
          credentials: "include",
        },
      );
      if (!response.ok) {
        const apiError = (await response.json().catch(() => ({}))) as ApiError;
        throw new Error(
          getErrorMessage(
            apiError,
            register
              ? "No pudimos completar la inscripción."
              : "No pudimos cancelar la inscripción.",
          ),
        );
      }
      setEvent((current) =>
        current
          ? {
              ...current,
              isRegistered: register,
              registrationCount: Math.max(
                0,
                current.registrationCount + (register ? 1 : -1),
              ),
            }
          : current,
      );
      setSuccess(
        register ? "Inscripción confirmada." : "Inscripción cancelada.",
      );
      window.dispatchEvent(new Event("arpa:registrations-changed"));
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No pudimos completar la operación.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-5" role="status">
        <Skeleton className="h-10 w-32 motion-reduce:animate-none" />
        <Skeleton className="h-72 w-full rounded-2xl motion-reduce:animate-none" />
        <Skeleton className="h-48 w-full rounded-xl motion-reduce:animate-none" />
      </div>
    );
  }

  if (!event) {
    return (
      <Alert variant="destructive">
        <TriangleAlert />
        <AlertTitle>Evento no disponible</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const image = event.imageUrl ?? eventFallbackImages[event.discipline];
  const full =
    event.maxParticipants !== null &&
    event.registrationCount >= event.maxParticipants;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="outline"
          className="cursor-pointer"
          nativeButton={false}
          render={<Link href="/explore" />}
        >
          <ArrowLeft /> Explorar
        </Button>
        {event.canEdit && (
          <Button
            className="cursor-pointer"
            nativeButton={false}
            render={<Link href={`/events/${event.slug}/edit`} />}
          >
            <Pencil /> Editar evento
          </Button>
        )}
      </div>

      <section className="relative min-h-72 overflow-hidden rounded-2xl bg-muted">
        <div
          role="img"
          aria-label={`Imagen de ${event.title}`}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${image}")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
        <div className="relative flex min-h-72 flex-col justify-end p-6 text-white sm:p-8">
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge className="border-white/30 bg-black/30 text-white">
              {eventTypeLabels[event.type]}
            </Badge>
            <Badge className="border-white/30 bg-black/30 text-white">
              {eventDisciplineLabels[event.discipline]}
            </Badge>
          </div>
          <h1 className="max-w-4xl text-3xl font-semibold tracking-tight sm:text-4xl">
            {event.title}
          </h1>
        </div>
      </section>

      {success && (
        <Alert className="border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
          <CheckCircle2 />
          <AlertTitle>Operación completada</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>No se completó la operación</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Card>
          <CardHeader>
            <CardTitle>Acerca del evento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="leading-7 text-muted-foreground">
              {event.description}
            </p>
            <div className="space-y-3">
              <h2 className="text-sm font-semibold">
                {event.sessions.length > 1
                  ? "Agenda del evento"
                  : "Fecha del evento"}
              </h2>
              {(event.sessions.length
                ? event.sessions
                : [
                    {
                      name: "Fecha #1",
                      startsAt: event.startsAt,
                      endsAt: event.endsAt,
                      location: event.location,
                    },
                  ]
              ).map((session, index) => (
                <div
                  key={`${session.startsAt}-${index}`}
                  className="grid gap-3 rounded-xl border p-4 text-sm sm:grid-cols-2"
                >
                  <p className="flex gap-3">
                    <CalendarDays className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <span>
                      <strong className="block">
                        {session.name || `Fecha #${index + 1}`}
                      </strong>
                      {formatEventDate(session.startsAt)}
                    </span>
                  </p>
                  <p className="flex gap-3">
                    <Clock3 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <span>
                      <strong className="block">Finaliza</strong>
                      {formatEventDate(session.endsAt)}
                    </span>
                  </p>
                  <p className="flex gap-3 sm:col-span-2">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <span>
                      <strong className="block">Ubicación</strong>
                      {session.location
                        ? `${session.location.name} · ${session.location.address}, ${session.location.city}`
                        : "Sin ubicación asociada"}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Inscripción</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="size-4" />
              {event.registrationCount}
              {event.maxParticipants ? ` de ${event.maxParticipants}` : ""}{" "}
              inscritos
            </p>
            {event.registrationDeadline && (
              <p className="text-sm text-muted-foreground">
                Cierre: {formatEventDate(event.registrationDeadline)}
              </p>
            )}
            <Button
              className="w-full cursor-pointer"
              variant={event.isRegistered ? "outline" : "default"}
              disabled={isSubmitting || (!event.isRegistered && full)}
              onClick={() => void changeRegistration(!event.isRegistered)}
            >
              {isSubmitting && (
                <LoaderCircle className="animate-spin motion-reduce:animate-none" />
              )}
              {isSubmitting
                ? "Procesando..."
                : event.isRegistered
                  ? "Cancelar inscripción"
                  : full
                    ? "Cupo completo"
                    : "Inscribirme"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
