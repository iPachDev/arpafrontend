import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ChartNoAxesCombined, MapPin } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { registrations } from "@/lib/registrations";

export function RegistrationsList() {
  return (
    <div className="space-y-4">
      {registrations.map((registration) => (
        <Card key={registration.slug} className="py-0">
          <CardContent className="flex flex-col p-0 sm:flex-row">
            <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-muted sm:aspect-auto sm:min-h-44 sm:w-64">
              <Image
                src={registration.image}
                alt={registration.title}
                fill
                className="object-cover"
                sizes="(min-width: 640px) 256px, 100vw"
              />
            </div>
            <div className="flex flex-1 flex-col gap-4 p-5">
              <div className="space-y-1">
                <CardDescription>{registration.discipline}</CardDescription>
                <CardTitle className="text-xl">
                  {registration.title}
                </CardTitle>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <CalendarDays className="size-4" />
                  {registration.date}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="size-4" />
                  {registration.location}
                </span>
              </div>
              <div className="mt-auto flex items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  Posición actual: {registration.currentPosition} de{" "}
                  {registration.totalParticipants}
                </p>
                <Link
                  href={`/registrations/${registration.slug}`}
                  className={buttonVariants({ variant: "outline" })}
                >
                  <ChartNoAxesCombined data-icon="inline-start" />
                  Ver estadísticas
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
