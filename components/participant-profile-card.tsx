import {
  BadgeCheck,
  Flag,
  MapPin,
  Shield,
  UserRound,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Registration } from "@/lib/registrations";

export function ParticipantProfileCard({
  participant,
}: {
  participant: Registration["participant"];
}) {
  const initials = participant.name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("");

  const details = [
    { label: "Equipo", value: participant.team, icon: Shield },
    { label: "Categoría", value: participant.category, icon: Flag },
    { label: "Origen", value: participant.hometown, icon: MapPin },
    { label: "Licencia", value: participant.license, icon: BadgeCheck },
  ];

  return (
    <section aria-labelledby="participant-profile-title">
      <Card>
        <CardHeader className="border-b">
          <CardTitle id="participant-profile-title" className="flex items-center gap-2">
            <UserRound className="size-5" /> Perfil del participante
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-[auto_minmax(0,1fr)] md:items-center">
          <div className="flex items-center gap-4">
            <Avatar className="size-14">
              <AvatarFallback className="text-base font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-muted-foreground">Participante</p>
              <p className="text-lg font-semibold">{participant.name}</p>
            </div>
            <div className="ml-auto flex min-w-16 flex-col items-center rounded-lg bg-muted px-3 py-2 md:ml-4">
              <span className="text-xs text-muted-foreground">Número</span>
              <span className="text-2xl font-bold tabular-nums">
                {participant.number}
              </span>
            </div>
          </div>

          <dl className="grid gap-4 border-t pt-5 sm:grid-cols-2 md:border-t-0 md:border-l md:pt-0 md:pl-6 xl:grid-cols-4">
            {details.map(({ label, value, icon: Icon }) => (
              <div key={label} className="min-w-0 space-y-1">
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Icon className="size-3.5" /> {label}
                </dt>
                <dd className="truncate text-sm font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </section>
  );
}
