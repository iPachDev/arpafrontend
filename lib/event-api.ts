export type EventType = "competition" | "training" | "meetup" | "championship";

export type EventDiscipline = "karting" | "running" | "cycling" | "motorsport";

export type EventLocation = {
  referenceSlug: string | null;
  name: string;
  address: string;
  city: string;
};

export type EventSession = {
  name: string;
  startsAt: string;
  endsAt: string;
  location: EventLocation | null;
};

export type ApiEvent = {
  id: string;
  slug: string;
  title: string;
  type: EventType;
  discipline: EventDiscipline;
  description: string;
  startsAt: string;
  endsAt: string;
  registrationDeadline: string | null;
  location: EventLocation | null;
  sessions: EventSession[];
  maxParticipants: number | null;
  imageUrl: string | null;
  status: "published" | "archived";
  createdByUserId: string;
  registrationCount: number;
  isRegistered: boolean;
  canEdit: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ApiEventRegistration = {
  id: string;
  status: "registered" | "cancelled";
  registeredAt: string;
  event: ApiEvent;
};

export type EventOwnershipTransferPreview = {
  eventName: string;
  eventSlug: string;
  email: string;
  newOwnerName: string;
  status: "pending" | "accepted" | "cancelled" | "expired" | "failed";
  expiresAt: string;
};

export const eventTypeLabels: Record<EventType, string> = {
  competition: "Competencia",
  training: "Entrenamiento",
  meetup: "Encuentro",
  championship: "Campeonato",
};

export const eventDisciplineLabels: Record<EventDiscipline, string> = {
  karting: "Karting",
  running: "Running",
  cycling: "Ciclismo",
  motorsport: "Automovilismo",
};

export const eventFallbackImages: Record<EventDiscipline, string> = {
  karting: "/images/events/kart-track.jpg",
  running: "/images/events/race-track.jpg",
  cycling: "/images/events/race-track.jpg",
  motorsport: "/images/events/race-track.jpg",
};

export const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

export function formatEventDate(value: string): string {
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
