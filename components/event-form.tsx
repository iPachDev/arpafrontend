"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarRange,
  LoaderCircle,
  Plus,
  Save,
  Trash2,
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
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  apiUrl,
  eventDisciplineLabels,
  eventTypeLabels,
  type ApiEvent,
  type EventDiscipline,
  type EventSession,
  type EventType,
} from "@/lib/event-api";
import { useMyLocations } from "@/hooks/use-my-locations";

type ApiError = { message?: string | string[] };
type EditableSession = {
  id: string;
  name: string;
  date: string;
  startsAt: string;
  endsAt: string;
  locationSlug: string;
};

function errorMessage(error: ApiError): string {
  if (Array.isArray(error.message)) return error.message.join(" ");
  return error.message ?? "No pudimos guardar el evento.";
}

function localDateParts(value?: string | null) {
  if (!value) return { date: "", time: "" };
  const date = new Date(value);
  return {
    date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
    time: `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`,
  };
}

function toIso(date: string, time: string): string {
  const value = new Date(`${date}T${time}:00`);
  if (!date || !time || Number.isNaN(value.getTime())) {
    throw new Error("Completa la fecha y los horarios de cada fecha.");
  }
  return value.toISOString();
}

function editableSessions(event?: ApiEvent): EditableSession[] {
  const source: EventSession[] = event?.sessions?.length
    ? event.sessions
    : event
      ? [
          {
            name: "Fecha #1",
            startsAt: event.startsAt,
            endsAt: event.endsAt,
            location: event.location,
          },
        ]
      : [];
  if (!source.length) {
    return [
      {
        id: "session-0",
        name: "Fecha #1",
        date: "",
        startsAt: "",
        endsAt: "",
        locationSlug: "none",
      },
    ];
  }
  return source.map((session, index) => ({
    id: `session-${index}`,
    name: session.name?.trim() || `Fecha #${index + 1}`,
    date: localDateParts(session.startsAt).date,
    startsAt: localDateParts(session.startsAt).time,
    endsAt: localDateParts(session.endsAt).time,
    locationSlug: session.location?.referenceSlug ?? "none",
  }));
}

export function EventForm({ event }: { event?: ApiEvent }) {
  const { locations } = useMyLocations();
  const router = useRouter();
  const initialDeadline = localDateParts(event?.registrationDeadline);
  const [type, setType] = useState<EventType>(event?.type ?? "competition");
  const [discipline, setDiscipline] = useState<EventDiscipline>(
    event?.discipline ?? "karting",
  );
  const [sessions, setSessions] = useState(() => editableSessions(event));
  const [deadlineDate, setDeadlineDate] = useState(initialDeadline.date);
  const [deadlineTime, setDeadlineTime] = useState(initialDeadline.time);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  function updateSession(id: string, patch: Partial<EditableSession>) {
    setSessions((current) =>
      current.map((session) =>
        session.id === id ? { ...session, ...patch } : session,
      ),
    );
  }

  function addSession() {
    if (sessions.length >= 50) return;
    setSessions((current) => {
      let number = 1;
      while (current.some((session) => session.name === `Fecha #${number}`)) {
        number += 1;
      }
      return [
        ...current,
        {
          id: `session-${current.length}-${Date.now()}`,
          name: `Fecha #${number}`,
          date: "",
          startsAt: "",
          endsAt: "",
          locationSlug: "none",
        },
      ];
    });
  }

  async function submit(eventSubmit: FormEvent<HTMLFormElement>) {
    eventSubmit.preventDefault();
    setIsSaving(true);
    setError("");
    const formData = new FormData(eventSubmit.currentTarget);

    try {
      const schedule = sessions.map((session) => {
        const selectedLocation = locations.find(
          (location) => location.slug === session.locationSlug,
        );
        return {
          name: session.name,
          startsAt: toIso(session.date, session.startsAt),
          endsAt: toIso(session.date, session.endsAt),
          location: selectedLocation
            ? {
                referenceSlug: selectedLocation.slug,
                name: selectedLocation.name,
                address: selectedLocation.address,
                city: selectedLocation.city,
              }
            : null,
        };
      });
      const registrationDeadline =
        deadlineDate || deadlineTime ? toIso(deadlineDate, deadlineTime) : null;
      const response = await fetch(
        event
          ? `${apiUrl}/events/${encodeURIComponent(event.slug)}`
          : `${apiUrl}/events`,
        {
          method: event ? "PATCH" : "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formData.get("title"),
            type,
            discipline,
            description: formData.get("description"),
            sessions: schedule,
            registrationDeadline,
            maxParticipants: formData.get("maxParticipants"),
            imageUrl: formData.get("imageUrl"),
          }),
        },
      );
      if (!response.ok) {
        const apiError = (await response.json().catch(() => ({}))) as ApiError;
        throw new Error(errorMessage(apiError));
      }
      const saved = (await response.json()) as ApiEvent;
      window.dispatchEvent(new Event("arpa:events-changed"));
      router.push(`/events/${saved.slug}`);
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No pudimos guardar el evento.",
      );
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información del evento</CardTitle>
          <CardDescription>
            Define el nombre, tipo y los datos generales.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="event-title">Nombre del evento</Label>
            <Input
              id="event-title"
              name="title"
              defaultValue={event?.title}
              minLength={3}
              maxLength={120}
              disabled={isSaving}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as EventType)}
              disabled={isSaving}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(eventTypeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Disciplina</Label>
            <Select
              value={discipline}
              onValueChange={(value) => setDiscipline(value as EventDiscipline)}
              disabled={isSaving}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(eventDisciplineLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="event-description">Descripción</Label>
            <Textarea
              id="event-description"
              name="description"
              defaultValue={event?.description}
              minLength={10}
              maxLength={1000}
              rows={5}
              disabled={isSaving}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="registration-deadline">
              Cierre de inscripciones
            </Label>
            <DatePicker
              id="registration-deadline"
              value={deadlineDate}
              onValueChange={(value) => {
                setDeadlineDate(value);
                if (!deadlineTime) setDeadlineTime("23:59");
              }}
              disabled={isSaving}
              placeholder="Sin fecha límite"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="registration-deadline-time">Hora de cierre</Label>
            <Input
              id="registration-deadline-time"
              type="time"
              value={deadlineTime}
              onChange={(change) => setDeadlineTime(change.target.value)}
              disabled={isSaving || !deadlineDate}
            />
          </div>
          {deadlineDate && (
            <div className="sm:col-span-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDeadlineDate("");
                  setDeadlineTime("");
                }}
                disabled={isSaving}
              >
                Quitar cierre de inscripciones
              </Button>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="event-capacity">Cupo máximo</Label>
            <Input
              id="event-capacity"
              name="maxParticipants"
              type="number"
              min={1}
              max={100000}
              defaultValue={event?.maxParticipants ?? ""}
              placeholder="Sin límite"
              disabled={isSaving}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="event-image">URL de imagen</Label>
            <Input
              id="event-image"
              name="imageUrl"
              type="url"
              defaultValue={event?.imageUrl ?? ""}
              placeholder="https://..."
              disabled={isSaving}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarRange className="size-5" />
              Fechas y ubicaciones
            </CardTitle>
            <CardDescription className="mt-1.5">
              Agrega todas las fechas del evento. Cada una puede tener una
              ubicación distinta.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={addSession}
            disabled={isSaving || sessions.length >= 50}
          >
            <Plus /> Agregar fecha
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {sessions.map((session) => (
            <fieldset key={session.id} className="rounded-xl border p-4">
              <legend className="px-1 text-sm font-semibold">
                {session.name}
              </legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor={`${session.id}-name`}>
                    Nombre de la fecha
                  </Label>
                  <Input
                    id={`${session.id}-name`}
                    value={session.name}
                    onChange={(change) =>
                      updateSession(session.id, { name: change.target.value })
                    }
                    minLength={1}
                    maxLength={80}
                    disabled={isSaving}
                    required
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor={`${session.id}-date`}>Fecha</Label>
                  <DatePicker
                    id={`${session.id}-date`}
                    value={session.date}
                    onValueChange={(value) =>
                      updateSession(session.id, { date: value })
                    }
                    disabled={isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${session.id}-start`}>Hora de inicio</Label>
                  <Input
                    id={`${session.id}-start`}
                    type="time"
                    value={session.startsAt}
                    onChange={(change) =>
                      updateSession(session.id, {
                        startsAt: change.target.value,
                      })
                    }
                    disabled={isSaving}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${session.id}-end`}>Hora de fin</Label>
                  <Input
                    id={`${session.id}-end`}
                    type="time"
                    value={session.endsAt}
                    onChange={(change) =>
                      updateSession(session.id, { endsAt: change.target.value })
                    }
                    disabled={isSaving}
                    required
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor={`${session.id}-location`}>Ubicación</Label>
                  <Select
                    value={session.locationSlug}
                    onValueChange={(value) =>
                      updateSession(session.id, {
                        locationSlug: value ?? "none",
                      })
                    }
                    disabled={isSaving}
                  >
                    <SelectTrigger
                      id={`${session.id}-location`}
                      className="w-full"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin ubicación</SelectItem>
                      {locations.map((location) => (
                        <SelectItem key={location.slug} value={location.slug}>
                          {location.name} · {location.city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {sessions.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="mt-4"
                  onClick={() =>
                    setSessions((current) =>
                      current.filter((item) => item.id !== session.id),
                    )
                  }
                  disabled={isSaving}
                >
                  <Trash2 /> Quitar fecha
                </Button>
              )}
            </fieldset>
          ))}
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>No se guardó el evento</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSaving}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <LoaderCircle className="animate-spin motion-reduce:animate-none" />
          ) : (
            <Save />
          )}
          {isSaving
            ? "Guardando..."
            : event
              ? "Guardar cambios"
              : "Crear evento"}
        </Button>
      </div>
    </form>
  );
}
