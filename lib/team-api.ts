export type TeamDiscipline =
  | "karting"
  | "running"
  | "cycling"
  | "motorsport";

export type TeamPrivacy = "public" | "private";

export type ApiTeam = {
  id: string;
  slug: string;
  name: string;
  discipline: TeamDiscipline;
  privacy: TeamPrivacy;
  location: string;
  description: string;
  status: "active" | "archived";
  membershipRole: "owner" | "editor" | "reader";
  memberCount: number;
  createdAt: string;
};

export const disciplineLabels: Record<TeamDiscipline, string> = {
  karting: "Karting",
  running: "Running",
  cycling: "Ciclismo",
  motorsport: "Automovilismo",
};

export const privacyLabels: Record<TeamPrivacy, string> = {
  public: "Público",
  private: "Privado",
};

export const disciplineCovers: Record<TeamDiscipline, string> = {
  karting: "/images/events/kart-track.jpg",
  running: "/images/events/race-track.jpg",
  cycling: "/images/events/race-track.jpg",
  motorsport: "/images/events/race-track.jpg",
};

export const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

