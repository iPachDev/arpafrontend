"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Plus,
  ShieldCheck,
  TriangleAlert,
  Users,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useMyTeams } from "@/hooks/use-my-teams";
import {
  disciplineCovers,
  disciplineLabels,
  privacyLabels,
} from "@/lib/team-api";

function TeamsSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {[0, 1].map((item) => (
        <Card key={item} size="sm">
          <Skeleton className="h-28 w-full rounded-none motion-reduce:animate-none" />
          <CardHeader className="gap-2">
            <Skeleton className="h-5 w-40 motion-reduce:animate-none" />
            <Skeleton className="h-4 w-24 motion-reduce:animate-none" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full motion-reduce:animate-none" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function TeamsList() {
  const { teams, isLoading, error } = useMyTeams();

  if (isLoading) return <TeamsSkeleton />;

  return (
    <div className="space-y-5">
      {error && (
        <Alert className="border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200 [&_[data-slot=alert-description]]:text-red-800 dark:[&_[data-slot=alert-description]]:text-red-300">
          <TriangleAlert />
          <AlertTitle>No se cargaron los equipos</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {teams.map((team) => (
          <Card key={team.id} size="sm">
            <div className="relative h-28 overflow-hidden bg-muted">
              <Image
                src={disciplineCovers[team.discipline]}
                alt={`Portada de ${team.name}`}
                fill
                sizes="(min-width: 1280px) 30vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover transition-opacity duration-200 hover:opacity-90"
              />
            </div>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <CardTitle className="truncate">{team.name}</CardTitle>
                  <CardDescription>
                    {disciplineLabels[team.discipline]}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="shrink-0">
                  <ShieldCheck aria-hidden="true" /> Owner
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <p className="flex items-center gap-2">
                <MapPin className="size-4" aria-hidden="true" /> {team.location}
              </p>
              <p className="flex items-center gap-2">
                <Users className="size-4" aria-hidden="true" /> {team.memberCount}{" "}
                integrante
              </p>
              <Badge variant="outline">{privacyLabels[team.privacy]}</Badge>
            </CardContent>
            <CardFooter>
              <Button
                size="sm"
                className="w-full cursor-pointer"
                variant="outline"
                nativeButton={false}
                render={<Link href={`/teams/${team.slug}`} />}
              >
                Ver equipo <ArrowRight data-icon="inline-end" />
              </Button>
            </CardFooter>
          </Card>
        ))}

        <Card size="sm" className="border-dashed">
          <CardContent className="flex min-h-60 flex-col items-center justify-center gap-3 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted">
              <Plus className="size-5" aria-hidden="true" />
            </div>
            <div>
              <p className="font-semibold">
                {teams.length === 0 ? "Crea tu primer equipo" : "Crea otro equipo"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Reúne integrantes y administra sus roles.
              </p>
            </div>
            <Button
              className="cursor-pointer"
              nativeButton={false}
              render={<Link href="/teams/create" />}
            >
              <Plus data-icon="inline-start" /> Crear equipo
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

