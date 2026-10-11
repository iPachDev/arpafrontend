import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  eventDisciplineLabels,
  eventFallbackImages,
  eventTypeLabels,
  formatEventDate,
  type ApiEvent,
} from "@/lib/event-api";

export function EventCard({ event }: { event: ApiEvent }) {
  const image = event.imageUrl ?? eventFallbackImages[event.discipline];

  return (
    <Card className="overflow-hidden py-0 transition-colors duration-200 hover:border-primary/30">
      <div
        role="img"
        aria-label={`Imagen de ${event.title}`}
        className="aspect-[16/8] bg-muted bg-cover bg-center"
        style={{ backgroundImage: `url("${image}")` }}
      />
      <CardHeader className="gap-3 px-5 pt-5">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{eventTypeLabels[event.type]}</Badge>
          <Badge variant="outline">
            {eventDisciplineLabels[event.discipline]}
          </Badge>
          {event.isRegistered && (
            <Badge className="bg-emerald-600 text-white">Inscrito</Badge>
          )}
        </div>
        <div>
          <CardTitle className="line-clamp-2 text-xl">{event.title}</CardTitle>
          <CardDescription className="mt-2 line-clamp-2">
            {event.description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 px-5 text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
          {formatEventDate(event.startsAt)}
        </p>
        <p className="flex items-center gap-2">
          <MapPin className="size-4 shrink-0" aria-hidden="true" />
          {event.location
            ? `${event.location.name}, ${event.location.city}`
            : "Sin ubicación asociada"}
        </p>
        <p className="flex items-center gap-2">
          <Users className="size-4 shrink-0" aria-hidden="true" />
          {event.registrationCount}
          {event.maxParticipants ? ` de ${event.maxParticipants}` : ""} inscritos
        </p>
      </CardContent>
      <CardFooter className="justify-end border-t bg-muted/30 px-5 py-4">
        <Button
          variant="outline"
          className="cursor-pointer"
          nativeButton={false}
          render={<Link href={`/events/${event.slug}`} />}
        >
          Ver evento
        </Button>
      </CardFooter>
    </Card>
  );
}
