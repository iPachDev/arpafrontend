"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  CalendarDays,
  ChartNoAxesCombined,
  Clock3,
  Flag,
  Gauge,
  MapPin,
  Medal,
  Timer,
  Trophy,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

import { buttonVariants } from "@/components/ui/button";
import { EventSettingsDialog } from "@/components/event-settings-dialog";
import { LiveStreamSection } from "@/components/live-stream-section";
import { ParticipantProfileCard } from "@/components/participant-profile-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Registration } from "@/lib/registrations";

const lapTimeConfig = {
  time: {
    label: "Tiempo",
    color: "var(--chart-1)",
  },
  average: {
    label: "Promedio",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

const positionConfig = {
  position: {
    label: "Posición",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function RegistrationStatistics({
  registration,
}: {
  registration: Registration;
}) {
  return (
    <div className="space-y-8">
      <div className="space-y-5">
        <Link
          href="/registrations"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <ArrowLeft data-icon="inline-start" />
          Mis inscripciones
        </Link>

        <div className="relative isolate min-h-64 overflow-hidden rounded-xl border bg-muted sm:min-h-72">
          <Image
            src={registration.image}
            alt={`Portada de ${registration.title}`}
            fill
            priority
            sizes="(min-width: 1280px) 1100px, (min-width: 768px) calc(100vw - 18rem), 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />

          {registration.isLive && (
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full border border-white/20 bg-background/95 px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm backdrop-blur-sm">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-70" />
                <span className="relative inline-flex size-2 rounded-full bg-red-500" />
              </span>
              En vivo
            </div>
          )}

          <div className="absolute top-4 right-4 z-10">
            <EventSettingsDialog eventName={registration.title} />
          </div>

          <div className="absolute inset-x-0 bottom-0 space-y-2 p-5 text-white sm:p-6">
            <p className="text-sm font-medium text-white/80">
              {registration.discipline}
            </p>
            <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
              {registration.title}
            </h1>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/85">
              <span className="flex items-center gap-2">
                <CalendarDays className="size-4" />
                {registration.date}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="size-4" />
                {registration.location}
              </span>
            </div>
          </div>
        </div>
      </div>

      <ParticipantProfileCard participant={registration.participant} />

      {registration.liveStream && (
        <LiveStreamSection
          title={registration.liveStream.title}
          channel={registration.liveStream.channel}
          viewers={registration.liveStream.viewers}
          image={registration.image}
        />
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card size="sm">
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <Trophy className="size-4" /> Posición actual
            </CardDescription>
            <CardTitle className="text-2xl">
              {registration.currentPosition}.º
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            de {registration.totalParticipants} participantes
          </CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <Medal className="size-4" /> Puntaje
            </CardDescription>
            <CardTitle className="text-2xl">
              {registration.points} pts
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Clasificación acumulada
          </CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <Timer className="size-4" /> Mejor tiempo
            </CardDescription>
            <CardTitle className="text-2xl">
              {registration.bestTime}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Carrera actual
          </CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <Flag className="size-4" /> Carreras
            </CardDescription>
            <CardTitle className="text-2xl">
              {registration.completedRaces}/{registration.totalRaces}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Completadas en el evento
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock3 className="size-5" /> Tiempos por vuelta
            </CardTitle>
            <CardDescription>
              Comparación con el promedio de la carrera actual.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={lapTimeConfig}
              className="h-[280px] w-full aspect-auto"
            >
              <LineChart data={registration.lapTimes} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="lap" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} domain={["auto", "auto"]} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Line
                  dataKey="average"
                  type="monotone"
                  stroke="var(--color-average)"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey="time"
                  type="monotone"
                  stroke="var(--color-time)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartNoAxesCombined className="size-5" /> Evolución de posición
            </CardTitle>
            <CardDescription>
              Posición obtenida durante el avance de la carrera.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={positionConfig}
              className="h-[280px] w-full aspect-auto"
            >
              <LineChart
                data={registration.positionHistory}
                accessibilityLayer
              >
                <CartesianGrid vertical={false} />
                <XAxis dataKey="lap" tickLine={false} axisLine={false} />
                <YAxis
                  reversed
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  domain={[1, registration.totalParticipants]}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Line
                  dataKey="position"
                  type="monotone"
                  stroke="var(--color-position)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="size-5" /> Carrera actual
            </CardTitle>
            <CardDescription>Resumen de tiempos registrados.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between gap-4 border-b pb-3">
              <span className="text-muted-foreground">Tiempo total</span>
              <span className="font-mono font-medium">
                {registration.totalTime}
              </span>
            </div>
            <div className="flex justify-between gap-4 border-b pb-3">
              <span className="text-muted-foreground">Tiempo promedio</span>
              <span className="font-mono font-medium">
                {registration.averageTime}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Mejor registro</span>
              <span className="font-mono font-medium">
                {registration.bestTime}
              </span>
            </div>
          </CardContent>
        </Card>

        {registration.standings ? (
          <Card>
            <CardHeader>
              <CardTitle>Tabla de puntaje</CardTitle>
              <CardDescription>
                Clasificación acumulada del evento por carreras.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Posición</TableHead>
                    <TableHead>Piloto</TableHead>
                    <TableHead className="text-center">Carreras</TableHead>
                    <TableHead className="text-center">Victorias</TableHead>
                    <TableHead className="text-right">Puntos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registration.standings.map((standing) => (
                    <TableRow
                      key={standing.participant}
                      className={
                        standing.isCurrentUser ? "bg-muted/60 font-medium" : ""
                      }
                    >
                      <TableCell>{standing.position}.º</TableCell>
                      <TableCell>{standing.participant}</TableCell>
                      <TableCell className="text-center">
                        {standing.races}
                      </TableCell>
                      <TableCell className="text-center">
                        {standing.wins}
                      </TableCell>
                      <TableCell className="text-right">
                        {standing.points}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Resultado individual</CardTitle>
              <CardDescription>
                Este evento se compone de una sola carrera, por lo que no tiene
                tabla de puntaje acumulado.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </section>
    </div>
  );
}
