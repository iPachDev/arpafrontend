import { ArrowRight, Clock3, Flag, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const results = [
  {
    position: "2.º lugar",
    event: "Sprint Nocturno",
    location: "GM Carso",
    date: "15 de agosto de 2026",
    bestLap: "48.362 s",
  },
  {
    position: "1.er lugar",
    event: "Copa de Verano",
    location: "K1 Coapa",
    date: "2 de agosto de 2026",
    bestLap: "46.918 s",
  },
  {
    position: "4.º lugar",
    event: "Reto Metropolitano",
    location: "GM Tlanelpantla",
    date: "19 de julio de 2026",
    bestLap: "50.104 s",
  },
];

export function LatestResultsSection() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            Mis últimos resultados
          </h1>
          <p className="text-muted-foreground">
            Resumen de tus carreras más recientes.
          </p>
        </div>
        <Button type="button" variant="outline" className="self-start sm:self-auto">
          Ver más
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {results.map((result) => (
          <Card key={`${result.event}-${result.date}`}>
            <CardHeader>
              <CardDescription>{result.date} · Ejemplo</CardDescription>
              <CardTitle className="flex items-center gap-2">
                <Flag className="size-5" />
                {result.position}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="font-medium">{result.event}</p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-4" />
                <span>{result.location}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock3 className="size-4" />
                <span>Mejor vuelta: {result.bestLap}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
