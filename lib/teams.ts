export type TeamMember = {
  name: string;
  email: string;
  role: string;
  permission: "Administrador" | "Miembro";
  status: "Aceptada" | "Enviada" | "Pendiente de aceptar" | "Cancelada";
};

export type Team = {
  slug: string;
  name: string;
  discipline: "Karting" | "Running" | "Ciclismo" | "Automovilismo";
  privacy: "Público" | "Privado";
  location: string;
  coverImage: string;
  description: string;
  personalization?: {
    alias: string;
    icon: "car";
    color: "orange";
  };
  achievements: Array<{
    title: string;
    description: string;
    points: number;
    unlockedAt: string;
    spriteColumn: number;
    spriteRow: number;
  }>;
  photos: Array<{ src: string; alt: string; height: "short" | "medium" | "tall" }>;
  members: TeamMember[];
};

export const teams: Team[] = [
  {
    slug: "arpa-racing-team",
    name: "ARPA Racing Team",
    discipline: "Karting",
    privacy: "Privado",
    location: "Ciudad de México",
    coverImage: "/images/events/race-track.jpg",
    description:
      "Equipo enfocado en competencias de karting, desarrollo de pilotos y preparación técnica para campeonatos regionales.",
    personalization: {
      alias: "Escudería ARPA",
      icon: "car",
      color: "orange",
    },
    achievements: [
      {
        title: "Racha de victorias",
        description: "3 victorias consecutivas como equipo.",
        points: 500,
        unlockedAt: "Agosto 2026",
        spriteColumn: 3,
        spriteRow: 0,
      },
      {
        title: "4 carreras",
        description: "El equipo completó sus primeras 4 carreras.",
        points: 200,
        unlockedAt: "Julio 2026",
        spriteColumn: 1,
        spriteRow: 0,
      },
      {
        title: "Equipo completo",
        description: "Piloto, mecánico e ingeniería en una alineación.",
        points: 350,
        unlockedAt: "Julio 2026",
        spriteColumn: 5,
        spriteRow: 0,
      },
      {
        title: "Vuelta perfecta",
        description: "Mejor tiempo de vuelta en una fecha oficial.",
        points: 300,
        unlockedAt: "Agosto 2026",
        spriteColumn: 6,
        spriteRow: 1,
      },
    ],
    photos: [
      { src: "/images/events/kart-track.jpg", alt: "Circuito del equipo", height: "tall" },
      { src: "/images/events/race-track.jpg", alt: "Entrenamiento en pista", height: "short" },
      { src: "/images/events/race-track.jpg", alt: "Competencia del equipo", height: "medium" },
      { src: "/images/events/kart-track.jpg", alt: "Reconocimiento del circuito", height: "short" },
      { src: "/images/events/kart-track.jpg", alt: "Preparación para carrera", height: "medium" },
    ],
    members: [
      {
        name: "Nombre del usuario",
        email: "usuario@ejemplo.com",
        role: "Piloto",
        permission: "Administrador",
        status: "Aceptada",
      },
      {
        name: "Diego Ramírez",
        email: "diego@ejemplo.com",
        role: "Piloto",
        permission: "Miembro",
        status: "Pendiente de aceptar",
      },
      {
        name: "Sofía Torres",
        email: "sofia@ejemplo.com",
        role: "Ingeniera de pista",
        permission: "Administrador",
        status: "Enviada",
      },
      {
        name: "Luis Hernández",
        email: "luis@ejemplo.com",
        role: "Mecánico",
        permission: "Miembro",
        status: "Cancelada",
      },
    ],
  },
  {
    slug: "corredores-arpa",
    name: "Corredores ARPA",
    discipline: "Running",
    privacy: "Público",
    location: "Ciudad de México",
    coverImage: "/images/events/kart-track.jpg",
    description: "Comunidad de corredores y entrenadores para rutas urbanas y carreras de fondo.",
    achievements: [
      {
        title: "4 carreras",
        description: "El equipo participó en cuatro carreras oficiales.",
        points: 200,
        unlockedAt: "Agosto 2026",
        spriteColumn: 1,
        spriteRow: 1,
      },
      {
        title: "Meta compartida",
        description: "Cinco integrantes terminaron una misma carrera.",
        points: 300,
        unlockedAt: "Agosto 2026",
        spriteColumn: 5,
        spriteRow: 2,
      },
    ],
    photos: [
      { src: "/images/events/race-track.jpg", alt: "Entrenamiento del equipo", height: "medium" },
      { src: "/images/events/kart-track.jpg", alt: "Ruta de entrenamiento", height: "short" },
    ],
    members: [
      {
        name: "Nombre del usuario",
        email: "usuario@ejemplo.com",
        role: "Corredor",
        permission: "Administrador",
        status: "Aceptada",
      },
      {
        name: "Mariana López",
        email: "mariana@ejemplo.com",
        role: "Entrenadora",
        permission: "Miembro",
        status: "Pendiente de aceptar",
      },
    ],
  },
];

export function getTeam(slug: string) {
  return teams.find((team) => team.slug === slug);
}
