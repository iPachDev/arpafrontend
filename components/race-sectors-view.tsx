import type { BusinessLocation } from "@/lib/locations";
import { Card } from "@/components/ui/card";

type LiveRace = NonNullable<BusinessLocation["liveRace"]>;

const driverColors = [
  "bg-cyan-400",
  "bg-violet-400",
  "bg-amber-400",
  "bg-red-400",
  "bg-emerald-400",
  "bg-blue-400",
];

export function RaceSectorsView({ race }: { race: LiveRace }) {
  const bestSectors = [0, 1, 2].map((sector) =>
    race.participants.reduce(
      (best, participant) =>
        participant.sectors[sector] < best
          ? participant.sectors[sector]
          : best,
      race.participants[0].sectors[sector],
    ),
  );

  return (
    <Card className="min-h-0 flex-1 overflow-hidden py-0 font-mono">
      <header className="grid border-b lg:grid-cols-[13rem_1fr_13rem]">
        <div className="border-b px-5 py-4 text-xl font-bold lg:border-r lg:border-b-0">
          Vuelta {race.currentLap}/{race.totalLaps}
        </div>
        <div className="px-5 py-4 text-center text-lg font-semibold uppercase tracking-wide">
          {race.name}
        </div>
        <div className="flex items-center justify-center gap-2 border-t px-5 py-4 text-sm font-semibold lg:border-t-0 lg:border-l">
          <span className="size-2 animate-pulse rounded-full bg-red-500" />
          EN CURSO
        </div>
      </header>

      <div className="grid min-h-0 flex-1 xl:grid-cols-[minmax(0,1fr)_25rem]">
        <div className="min-w-0 overflow-x-auto xl:border-r">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-[3.5rem_4.5rem_minmax(12rem,1fr)_7rem_minmax(22rem,2fr)] border-b bg-muted/50 px-3 py-2 text-xs uppercase tracking-wider text-muted-foreground">
              <span className="text-center">Pos.</span>
              <span className="text-center">N.º</span>
              <span>Piloto / corredor</span>
              <span className="text-right">Última</span>
              <span className="pl-8">Progreso de vueltas</span>
            </div>

            {race.participants.map((participant, index) => {
              const progress = Math.max(
                5,
                (participant.completedLaps / race.totalLaps) * 100,
              );

              return (
                <div
                  key={participant.number}
                  className="grid grid-cols-[3.5rem_4.5rem_minmax(12rem,1fr)_7rem_minmax(22rem,2fr)] items-center border-b px-3 py-2.5 transition-colors last:border-b-0 hover:bg-muted/40"
                >
                  <span className="text-center text-lg font-bold tabular-nums">
                    {participant.position}
                  </span>
                  <span className="flex items-center justify-center gap-2 text-lg font-bold tabular-nums">
                    <span
                      className={`h-7 w-1 ${driverColors[index % driverColors.length]}`}
                    />
                    {participant.number}
                  </span>
                  <div className="min-w-0 pl-2">
                    <p className="truncate font-bold uppercase">
                      {participant.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {participant.team}
                    </p>
                  </div>
                  <span className="text-right text-sm tabular-nums text-muted-foreground">
                    {participant.currentLapTime}
                  </span>
                  <div className="relative ml-8 h-8 overflow-hidden border-x bg-muted/30">
                    <div className="absolute inset-y-1 left-0 flex items-center" style={{ width: `${progress}%` }}>
                      <div className="h-1.5 flex-1 bg-red-500/80" />
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-red-500/40 bg-red-500/10 text-[10px] font-bold text-red-600 dark:text-red-400">
                        {participant.completedLaps}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t px-5 py-4">
            <p className="mb-4 text-xs uppercase tracking-wider text-muted-foreground">
              Posición relativa en pista
            </p>
            <div className="relative h-12 rounded-md bg-muted">
              <div className="absolute inset-x-4 top-1/2 h-px bg-border" />
              {race.participants.map((participant, index) => {
                const position =
                  6 +
                  ((participant.completedLaps * 13 + index * 9) % 88);
                return (
                  <div
                    key={participant.number}
                    className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
                    style={{ left: `${position}%` }}
                  >
                    <span
                      className={`block size-3 rounded-full ring-2 ring-background ${driverColors[index % driverColors.length]}`}
                    />
                    <span className="mt-1 block text-[9px] font-bold">
                      {participant.number}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="border-t xl:border-t-0">
          <div className="border-b px-4 py-3 text-sm font-bold uppercase tracking-wider">
            Sectores
          </div>
          <div className="grid grid-cols-[1fr_repeat(3,4.6rem)] border-b bg-muted/50 px-4 py-2 text-xs uppercase text-muted-foreground">
            <span>Piloto</span>
            <span className="text-right text-amber-400">S1</span>
            <span className="text-right text-red-400">S2</span>
            <span className="text-right text-sky-400">S3</span>
          </div>
          {race.participants.map((participant) => (
            <div
              key={participant.number}
              className="grid grid-cols-[1fr_repeat(3,4.6rem)] border-b px-4 py-2.5 text-sm last:border-b-0 hover:bg-muted/40"
            >
              <span className="truncate pr-2 font-bold uppercase">
                {participant.name.split(" ").at(-1)}
              </span>
              {participant.sectors.map((sector, index) => (
                <span
                  key={`${participant.number}-${index}`}
                  className={`text-right tabular-nums ${sector === bestSectors[index] ? "font-bold text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}
                >
                  {sector}
                </span>
              ))}
            </div>
          ))}
          <div className="m-4 rounded-lg bg-muted p-4">
            <p className="text-xs uppercase text-muted-foreground">Tiempo de carrera</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">{race.elapsedTime}</p>
          </div>
        </aside>
      </div>
    </Card>
  );
}
