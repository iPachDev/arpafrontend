import { ArrowRight, Newspaper } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

const news = [
  {
    title: "Nueva temporada de karting",
    description:
      "La próxima temporada contará con nuevas categorías y jornadas para pilotos de distintos niveles.",
  },
  {
    title: "Preparación antes de competir",
    description:
      "Conoce las recomendaciones generales de seguridad y preparación para tu siguiente carrera.",
  },
];

export function NewsSection() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Noticias</h2>
          <p className="text-muted-foreground">
            Novedades y contenido reciente de karting.
          </p>
        </div>
        <Button type="button" variant="outline" className="self-start sm:self-auto">
          Ver más
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {news.map((item) => (
          <Card key={item.title} size="sm">
            <CardContent className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Newspaper className="size-4" />
              </div>
              <div className="space-y-1">
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
