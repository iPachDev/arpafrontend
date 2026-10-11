export type TeamDiscipline = "karting" | "running" | "cycling" | "motorsport";

export type TeamPrivacy = "public" | "private";

export type ApiTeam = {
  id: string;
  slug: string;
  name: string;
  discipline: TeamDiscipline;
  privacy: TeamPrivacy;
  location: string;
  description: string;
  logoImageUrl: string | null;
  coverImageUrl: string | null;
  status: "active" | "archived";
  membershipRole: "owner" | "editor" | "reader";
  memberCount: number;
  createdAt: string;
  updatedAt: string;
};

export type TeamRosterEntry = {
  id: string;
  name: string;
  email: string;
  sportsRole: string;
  membershipRole: "owner" | "editor" | "reader";
  status: "owner" | "accepted" | "pending" | "cancelled" | "expired" | "failed";
  invitedAt: string | null;
  joinedAt: string | null;
  isCurrentUser: boolean;
};

export type TeamInvitationPreview = {
  teamName: string;
  teamSlug: string;
  email: string;
  invitedName: string;
  sportsRole: string;
  membershipRole: "editor" | "reader";
  status: "pending" | "accepted" | "cancelled" | "expired" | "failed";
  expiresAt: string;
  requiresRegistration: boolean;
};

export type TeamOwnershipTransferPreview = {
  teamName: string;
  teamSlug: string;
  email: string;
  newOwnerName: string;
  status: "pending" | "accepted" | "cancelled" | "expired" | "failed";
  expiresAt: string;
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
