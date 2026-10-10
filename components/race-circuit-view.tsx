"use client";

import { useState } from "react";
import { Flag } from "lucide-react";

import {
  CircuitTrackerMap,
  circuitDriverColors,
} from "@/components/circuit-tracker-map";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { BusinessLocation } from "@/lib/locations";

type LiveRace = NonNullable<BusinessLocation["liveRace"]>;

export function RaceCircuitView({ race }: { race: LiveRace }) {
  const [hoveredNumber, setHoveredNumber] = useState<string | null>(null);

  return (
    <Card className="min-h-0 flex-1 overflow-hidden py-0">
      <div className="grid min-h-0 flex-1 lg:grid-cols-[21rem_minmax(0,1fr)]">
        <aside className="min-h-0 overflow-auto border-b lg:border-r lg:border-b-0">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Flag className="size-5" /> Posiciones
            </CardTitle>
            <CardDescription>
              Vuelta {race.currentLap} de {race.totalLaps}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-1 p-2">
            {race.participants.map((participant, index) => (
              <button
                key={participant.number}
                type="button"
                onMouseEnter={() => setHoveredNumber(participant.number)}
                onMouseLeave={() => setHoveredNumber(null)}
                onFocus={() => setHoveredNumber(participant.number)}
                onBlur={() => setHoveredNumber(null)}
                className="grid w-full grid-cols-[2rem_2.75rem_1fr_auto] items-center gap-2 rounded-lg px-2 py-2.5 text-left outline-none hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="text-center text-lg font-bold tabular-nums">
                  {participant.position}
                </span>
                <span
                  className="flex size-9 items-center justify-center rounded-md text-sm font-bold text-white tabular-nums"
                  style={{
                    backgroundColor:
                      circuitDriverColors[index % circuitDriverColors.length],
                  }}
                >
                  {participant.number}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">
                    {participant.name}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {participant.team}
                  </span>
                </span>
                <span className="text-xs font-medium tabular-nums text-muted-foreground">
                  {participant.gap}
                </span>
              </button>
            ))}
          </CardContent>
        </aside>

        <CircuitTrackerMap
          race={race}
          hoveredNumber={hoveredNumber}
          onHoveredNumberChange={setHoveredNumber}
        />
      </div>
    </Card>
  );
}
