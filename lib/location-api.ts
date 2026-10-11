import { apiUrl } from "@/lib/event-api";

export type LocationDiscipline =
  "karting" | "running" | "cycling" | "motorsport";

export type ApiLocation = {
  id: string;
  slug: string;
  name: string;
  business: string;
  discipline: LocationDiscipline;
  address: string;
  city: string;
  description: string;
  coverImageUrl: string | null;
  circuitMapImageUrl: string | null;
  photoUrls: string[];
  ownerId: string;
  status: "active" | "archived";
  canEdit: boolean;
  createdAt: string;
  updatedAt: string;
};

export type LocationOwnershipTransferPreview = {
  locationName: string;
  locationSlug: string;
  email: string;
  newOwnerName: string;
  status: "pending" | "accepted" | "cancelled" | "expired" | "failed";
  expiresAt: string;
};

export const locationDisciplineLabels: Record<LocationDiscipline, string> = {
  karting: "Karting",
  running: "Running",
  cycling: "Ciclismo",
  motorsport: "Automovilismo",
};

export const locationFallbackImages: Record<LocationDiscipline, string> = {
  karting: "/images/events/kart-track.jpg",
  running: "/images/events/race-track.jpg",
  cycling: "/images/events/race-track.jpg",
  motorsport: "/images/events/race-track.jpg",
};

export { apiUrl };
