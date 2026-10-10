"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock3,
  Flag,
  Gauge,
  Maximize,
  Rows3,
  Radio,
  Trophy,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { BusinessLocation } from "@/lib/locations";
import { RaceSectorsView } from "@/components/race-sectors-view";
import { RaceCircuitView } from "@/components/race-circuit-view";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function LiveRaceDisplay({ location }: { location: BusinessLocation }) {
  const race = location.liveRace;
  const [view, setView] = useState("positions");

  if (!race) return null;

  async function toggleFullscreen() {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    await document.documentElement.requestFullscreen();
  }

  return (
    <main className="h-screen w-full overflow-auto bg-background p-2 sm:p-3 lg:p-4">
      <div className="flex min-h-full w-full flex-col gap-4">
        <header className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-b pb-3">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              nativeButton={false}
              render={<Link href={`/locations/${location.slug}`} aria-label="Volver a la ubicación" />}
            >
              <ArrowLeft />
            </Button>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{race.name}</h1>
                <Badge variant="destructive" className="gap-2">
                  <span className="size-2 animate-pulse rounded-full bg-current" /> EN VIVO
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{location.name} · {location.city}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={view} onValueChange={(value) => setView(value as string)}>
              <SelectTrigger className="h-9 w-52">
                <Rows3 className="size-4 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="positions">Lista de posiciones</SelectItem>
                <SelectItem value="sectors">Vueltas y sectores</SelectItem>
                <SelectItem value="circuit">Circuito</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={toggleFullscreen}>
              <Maximize data-icon="inline-start" /> Pantalla completa
            </Button>
          </div>
        </header>

        {view === "positions" && <section className="grid shrink-0 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card size="sm">
            <CardHeader>
              <CardDescription className="flex items-center gap-2"><Flag className="size-4" /> Vuelta actual</CardDescription>
              <CardTitle className="text-3xl tabular-nums">{race.currentLap} / {race.totalLaps}</CardTitle>
            </CardHeader>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardDescription className="flex items-center gap-2"><Clock3 className="size-4" /> Tiempo de carrera</CardDescription>
              <CardTitle className="text-3xl tabular-nums">{race.elapsedTime}</CardTitle>
            </CardHeader>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardDescription className="flex items-center gap-2"><Trophy className="size-4" /> Mejor vuelta</CardDescription>
              <CardTitle className="text-3xl tabular-nums">{race.participants.reduce((best, item) => item.bestLapTime < best ? item.bestLapTime : best, race.participants[0].bestLapTime)} s</CardTitle>
            </CardHeader>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardDescription className="flex items-center gap-2"><Users className="size-4" /> Participantes</CardDescription>
              <CardTitle className="text-3xl tabular-nums">{race.participants.length}</CardTitle>
            </CardHeader>
          </Card>
        </section>}

        {view === "positions" ? <Card className="min-h-0 flex-1 overflow-hidden">
          <CardHeader className="border-b">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2"><Gauge className="size-5" /> Posiciones en curso</CardTitle>
                <CardDescription>Clasificación y tiempos de la vuelta actual.</CardDescription>
              </div>
              <p className="flex items-center gap-2 text-sm text-muted-foreground"><Radio className="size-4 text-red-500" /> Actualización en tiempo real</p>
            </div>
          </CardHeader>
          <CardContent className="min-h-0 flex-1 p-0">
            <div className="h-full overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="h-12">
                    <TableHead className="w-20 text-center">Pos.</TableHead>
                    <TableHead className="w-24 text-center">Número</TableHead>
                    <TableHead>Piloto / corredor</TableHead>
                    <TableHead>Equipo</TableHead>
                    <TableHead className="text-right">Vuelta actual</TableHead>
                    <TableHead className="text-right">Mejor vuelta</TableHead>
                    <TableHead className="text-right">Diferencia</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {race.participants.map((participant) => (
                    <TableRow key={participant.number} className="h-20 text-base">
                      <TableCell className="text-center text-2xl font-bold tabular-nums">{participant.position}</TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex size-11 items-center justify-center rounded-lg bg-foreground text-lg font-bold text-background tabular-nums">{participant.number}</span>
                      </TableCell>
                      <TableCell className="font-semibold">{participant.name}</TableCell>
                      <TableCell className="text-muted-foreground">{participant.team}</TableCell>
                      <TableCell className="text-right font-mono text-lg">{participant.currentLapTime} s</TableCell>
                      <TableCell className="text-right font-mono text-lg font-semibold">{participant.bestLapTime} s</TableCell>
                      <TableCell className="text-right font-mono">{participant.gap}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card> : view === "sectors" ? <RaceSectorsView race={race} /> : <RaceCircuitView race={race} />}
      </div>
    </main>
  );
}
