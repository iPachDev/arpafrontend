export type BusinessLocation = {
  slug: string;
  name: string;
  business: string;
  discipline: "Karting" | "Running" | "Ciclismo" | "Automovilismo";
  address: string;
  city: string;
  description: string;
  coverImage: string;
  circuitMap: string;
  liveRace?: {
    name: string;
    currentLap: number;
    totalLaps: number;
    elapsedTime: string;
    participants: Array<{
      position: number;
      number: string;
      name: string;
      team: string;
      currentLapTime: string;
      bestLapTime: string;
      completedLaps: number;
      sectors: [string, string, string];
      gap: string;
    }>;
  };
  photos: Array<{ src: string; alt: string; height: "short" | "medium" | "tall" }>;
};

export const locations: BusinessLocation[] = [
  {
    slug: "gm-carso",
    name: "GM Carso",
    business: "Grupo Motor ARPA",
    discipline: "Karting",
    address: "Lago Zúrich 245, Ampliación Granada",
    city: "Ciudad de México",
    description:
      "Circuito de karting para entrenamientos, competencias privadas y fechas de campeonato.",
    coverImage: "/images/events/race-track.jpg",
    circuitMap: "/images/events/kart-track.jpg",
    liveRace: {
      name: "Copa Metropolitana · Carrera 5",
      currentLap: 18,
      totalLaps: 30,
      elapsedTime: "18:42.810",
      participants: [
        { position: 1, number: "14", name: "Diego Ramírez", team: "Velocity Racing", currentLapTime: "48.621", bestLapTime: "48.104", completedLaps: 18, sectors: ["15.842", "17.104", "15.675"], gap: "Líder" },
        { position: 2, number: "27", name: "Nombre del usuario", team: "ARPA Racing Team", currentLapTime: "48.740", bestLapTime: "48.362", completedLaps: 18, sectors: ["15.910", "17.221", "15.609"], gap: "+1.284" },
        { position: 3, number: "08", name: "Sofía Torres", team: "Orion Motorsport", currentLapTime: "49.012", bestLapTime: "48.710", completedLaps: 18, sectors: ["16.002", "17.188", "15.822"], gap: "+3.120" },
        { position: 4, number: "31", name: "Emilio Cruz", team: "CRZ Kart", currentLapTime: "49.405", bestLapTime: "48.955", completedLaps: 18, sectors: ["16.104", "17.402", "15.899"], gap: "+5.842" },
        { position: 5, number: "05", name: "Mariana López", team: "Apex México", currentLapTime: "49.801", bestLapTime: "49.106", completedLaps: 18, sectors: ["16.208", "17.510", "16.083"], gap: "+8.409" },
        { position: 6, number: "22", name: "Luis Hernández", team: "Independiente", currentLapTime: "50.114", bestLapTime: "49.382", completedLaps: 17, sectors: ["16.311", "17.604", "16.199"], gap: "+1 vuelta" },
      ],
    },
    photos: [
      { src: "/images/events/race-track.jpg", alt: "Pista principal", height: "medium" },
      { src: "/images/events/kart-track.jpg", alt: "Vista del circuito", height: "tall" },
      { src: "/images/events/race-track.jpg", alt: "Zona de competencia", height: "short" },
    ],
  },
  {
    slug: "k1-coapa",
    name: "K1 Coapa",
    business: "K1 Speed México",
    discipline: "Karting",
    address: "Calzada del Hueso 519, Coapa",
    city: "Ciudad de México",
    description:
      "Pista cubierta con áreas para pilotos, espectadores y organización de carreras.",
    coverImage: "/images/events/kart-track.jpg",
    circuitMap: "/images/events/kart-track.jpg",
    liveRace: {
      name: "K1 Challenge · Clasificación",
      currentLap: 9,
      totalLaps: 15,
      elapsedTime: "09:16.205",
      participants: [
        { position: 1, number: "07", name: "Andrea Silva", team: "K1 Factory", currentLapTime: "50.104", bestLapTime: "49.890", completedLaps: 9, sectors: ["16.204", "17.802", "16.098"], gap: "Líder" },
        { position: 2, number: "18", name: "Carlos Vega", team: "Veracruz Racing", currentLapTime: "50.322", bestLapTime: "50.012", completedLaps: 9, sectors: ["16.310", "17.901", "16.111"], gap: "+0.884" },
        { position: 3, number: "27", name: "Nombre del usuario", team: "ARPA Racing Team", currentLapTime: "50.615", bestLapTime: "50.104", completedLaps: 9, sectors: ["16.402", "17.995", "16.218"], gap: "+2.041" },
        { position: 4, number: "11", name: "Fernando Díaz", team: "K1 Academy", currentLapTime: "51.008", bestLapTime: "50.470", completedLaps: 8, sectors: ["16.518", "18.201", "16.289"], gap: "+1 vuelta" },
      ],
    },
    photos: [
      { src: "/images/events/kart-track.jpg", alt: "Mapa de pista", height: "medium" },
      { src: "/images/events/race-track.jpg", alt: "Actividad en pista", height: "short" },
    ],
  },
];

export function getLocation(slug: string) {
  return locations.find((location) => location.slug === slug);
}
