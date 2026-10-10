export type Registration = {
  slug: string;
  title: string;
  discipline: string;
  date: string;
  location: string;
  image: string;
  participant: {
    name: string;
    number: string;
    team: string;
    category: string;
    hometown: string;
    license: string;
  };
  currentPosition: number;
  totalParticipants: number;
  points: number;
  bestTime: string;
  totalTime: string;
  averageTime: string;
  completedRaces: number;
  totalRaces: number;
  isLive?: boolean;
  liveStream?: {
    title: string;
    channel: string;
    viewers: number;
  };
  personalization?: {
    alias: string;
    icon: "trophy";
    color: "purple";
  };
  lapTimes: Array<{ lap: string; time: number; average: number }>;
  positionHistory: Array<{ lap: string; position: number }>;
  standings?: Array<{
    position: number;
    participant: string;
    races: number;
    wins: number;
    points: number;
    isCurrentUser?: boolean;
  }>;
};

export const registrations: Registration[] = [
  {
    slug: "copa-metropolitana-karting",
    title: "Copa Metropolitana de Karting",
    discipline: "Karting",
    date: "12 de septiembre de 2026",
    location: "Ciudad de México",
    image: "/images/events/kart-track.jpg",
    participant: {
      name: "Nombre del usuario",
      number: "27",
      team: "ARPA Racing Team",
      category: "Senior",
      hometown: "Ciudad de México",
      license: "ARP-2026-027",
    },
    currentPosition: 2,
    totalParticipants: 18,
    points: 86,
    bestTime: "48.362 s",
    totalTime: "24:18.420",
    averageTime: "49.105 s",
    completedRaces: 4,
    totalRaces: 6,
    isLive: true,
    liveStream: {
      title: "Carrera 5 · Copa Metropolitana",
      channel: "ARPA Racing TV",
      viewers: 1248,
    },
    personalization: {
      alias: "Mi Copa ARPA",
      icon: "trophy",
      color: "purple",
    },
    lapTimes: [
      { lap: "V1", time: 51.2, average: 49.8 },
      { lap: "V2", time: 49.8, average: 49.8 },
      { lap: "V3", time: 49.1, average: 49.8 },
      { lap: "V4", time: 48.7, average: 49.8 },
      { lap: "V5", time: 48.362, average: 49.8 },
      { lap: "V6", time: 49.0, average: 49.8 },
      { lap: "V7", time: 48.8, average: 49.8 },
      { lap: "V8", time: 49.4, average: 49.8 },
    ],
    positionHistory: [
      { lap: "Salida", position: 6 },
      { lap: "V2", position: 5 },
      { lap: "V4", position: 3 },
      { lap: "V6", position: 2 },
      { lap: "V8", position: 2 },
    ],
    standings: [
      { position: 1, participant: "Diego Ramírez", races: 4, wins: 2, points: 94 },
      {
        position: 2,
        participant: "Nombre del usuario",
        races: 4,
        wins: 1,
        points: 86,
        isCurrentUser: true,
      },
      { position: 3, participant: "Sofía Torres", races: 4, wins: 1, points: 79 },
      { position: 4, participant: "Luis Hernández", races: 4, wins: 0, points: 68 },
      { position: 5, participant: "Mariana López", races: 4, wins: 0, points: 61 },
    ],
  },
  {
    slug: "karting-challenge-veracruz",
    title: "Karting Challenge Veracruz",
    discipline: "Karting",
    date: "10 de octubre de 2026",
    location: "Veracruz, Veracruz",
    image: "/images/events/race-track.jpg",
    participant: {
      name: "Nombre del usuario",
      number: "27",
      team: "ARPA Racing Team",
      category: "Senior",
      hometown: "Ciudad de México",
      license: "ARP-2026-027",
    },
    currentPosition: 4,
    totalParticipants: 16,
    points: 58,
    bestTime: "50.104 s",
    totalTime: "25:42.810",
    averageTime: "51.420 s",
    completedRaces: 3,
    totalRaces: 5,
    lapTimes: [
      { lap: "V1", time: 53.1, average: 51.8 },
      { lap: "V2", time: 52.0, average: 51.8 },
      { lap: "V3", time: 51.2, average: 51.8 },
      { lap: "V4", time: 50.104, average: 51.8 },
      { lap: "V5", time: 51.5, average: 51.8 },
      { lap: "V6", time: 51.0, average: 51.8 },
    ],
    positionHistory: [
      { lap: "Salida", position: 8 },
      { lap: "V2", position: 7 },
      { lap: "V4", position: 5 },
      { lap: "V6", position: 4 },
    ],
    standings: [
      { position: 1, participant: "Carlos Vega", races: 3, wins: 2, points: 75 },
      { position: 2, participant: "Andrea Silva", races: 3, wins: 1, points: 69 },
      { position: 3, participant: "Emilio Cruz", races: 3, wins: 0, points: 62 },
      {
        position: 4,
        participant: "Nombre del usuario",
        races: 3,
        wins: 0,
        points: 58,
        isCurrentUser: true,
      },
    ],
  },
  {
    slug: "10k-reforma",
    title: "10K Reforma",
    discipline: "Running",
    date: "20 de septiembre de 2026",
    location: "Ciudad de México",
    image: "/images/events/kart-track.jpg",
    participant: {
      name: "Nombre del usuario",
      number: "1184",
      team: "Corredores ARPA",
      category: "Libre varonil",
      hometown: "Ciudad de México",
      license: "ARP-RUN-1184",
    },
    currentPosition: 12,
    totalParticipants: 240,
    points: 0,
    bestTime: "04:38 min/km",
    totalTime: "47:12",
    averageTime: "04:43 min/km",
    completedRaces: 1,
    totalRaces: 1,
    lapTimes: [
      { lap: "KM 2", time: 4.9, average: 4.72 },
      { lap: "KM 4", time: 4.78, average: 4.72 },
      { lap: "KM 6", time: 4.65, average: 4.72 },
      { lap: "KM 8", time: 4.7, average: 4.72 },
      { lap: "KM 10", time: 4.63, average: 4.72 },
    ],
    positionHistory: [
      { lap: "Salida", position: 28 },
      { lap: "KM 2", position: 22 },
      { lap: "KM 4", position: 18 },
      { lap: "KM 6", position: 15 },
      { lap: "KM 8", position: 13 },
      { lap: "Meta", position: 12 },
    ],
  },
];

export function getRegistration(slug: string) {
  return registrations.find((registration) => registration.slug === slug);
}
