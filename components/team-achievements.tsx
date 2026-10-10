import { Sparkles, Trophy } from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Team } from "@/lib/teams";

const achievementBackgrounds = [
  "bg-purple-100/80 dark:bg-purple-950/45",
  "bg-amber-100/80 dark:bg-amber-950/45",
  "bg-sky-100/80 dark:bg-sky-950/45",
  "bg-rose-100/80 dark:bg-rose-950/45",
  "bg-emerald-100/80 dark:bg-emerald-950/45",
];

export function TeamAchievements({
  achievements,
}: {
  achievements: Team["achievements"];
}) {
  const totalPoints = achievements.reduce(
    (total, achievement) => total + achievement.points,
    0,
  );

  return (
    <section className="space-y-4" aria-labelledby="team-achievements-title">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id="team-achievements-title"
            className="flex items-center gap-2 text-2xl font-semibold tracking-tight"
          >
            <Trophy className="size-5" /> Logros del equipo
          </h2>
          <p className="text-sm text-muted-foreground">
            Insignias obtenidas por el desempeño y actividad del equipo.
          </p>
        </div>
        <p className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="size-4" /> {totalPoints.toLocaleString("es-MX")} puntos
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        {achievements.map((achievement, index) => {
          const x = achievement.spriteColumn * (100 / 7);
          const y = achievement.spriteRow * 50;

          return (
            <Tooltip key={achievement.title}>
              <TooltipTrigger
                render={
                  <Card
                    size="sm"
                    tabIndex={0}
                    className={`min-h-56 w-[calc(50%-0.5rem)] cursor-help overflow-hidden rounded-2xl border-0 shadow-none ring-0 transition-[filter,transform] hover:-translate-y-0.5 hover:brightness-95 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-40 ${achievementBackgrounds[index % achievementBackgrounds.length]}`}
                  />
                }
              >
                <CardContent className="flex h-full flex-col items-center justify-center gap-3 px-4 py-4 text-center">
                  <div
                    role="img"
                    aria-label={`Insignia ${achievement.title}`}
                    className="aspect-[143/120] w-28 bg-no-repeat"
                    style={{
                      backgroundImage:
                        "url('/images/badges/team-achievements.png')",
                      backgroundPosition: `${x}% ${y}%`,
                      backgroundSize: "800% 300%",
                    }}
                  />
                  <div className="space-y-0.5">
                    <p className="font-semibold">{achievement.title}</p>
                    <p className="text-xs font-medium text-muted-foreground">
                      +{achievement.points} puntos
                    </p>
                  </div>
                </CardContent>
              </TooltipTrigger>
              <TooltipContent className="max-w-64 flex-col items-start gap-1 p-3 text-left">
                <p>{achievement.description}</p>
                <p className="text-background/70">
                  Obtenida en {achievement.unlockedAt}
                </p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </section>
  );
}
