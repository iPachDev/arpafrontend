"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TeamRoster } from "@/components/team-roster";
import {
  apiUrl,
  disciplineCovers,
  disciplineLabels,
  privacyLabels,
  type ApiTeam,
} from "@/lib/team-api";

function TeamProfileSkeleton() {
  return (
    <div className="space-y-6" aria-label="Cargando equipo" role="status">
      <Skeleton className="h-9 w-32 motion-reduce:animate-none" />
      <Skeleton className="h-72 w-full rounded-2xl motion-reduce:animate-none" />
      <Skeleton className="h-40 w-full rounded-2xl motion-reduce:animate-none" />
    </div>
  );
}

export function PersistedTeamProfile({ slug }: { slug: string }) {
  const router = useRouter();
  const [team, setTeam] = useState<ApiTeam | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadTeam() {
      try {
        const response = await fetch(`${apiUrl}/teams/${encodeURIComponent(slug)}`, {
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        });

        if (response.status === 401) {
          router.replace(`/login?next=/teams/${encodeURIComponent(slug)}`);
          return;
        }
        if (!response.ok) throw new Error("No pudimos cargar este equipo.");
        setTeam((await response.json()) as ApiTeam);
      } catch (loadError) {
        if ((loadError as Error).name !== "AbortError") {
          setError("El equipo no existe o no tienes acceso.");
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    void loadTeam();
    return () => controller.abort();
  }, [router, slug]);

  if (isLoading) return <TeamProfileSkeleton />;

  if (!team || error) {
    return (
      <div className="space-y-5">
        <Button variant="outline" nativeButton={false} render={<Link href="/teams" />}>
          <ArrowLeft /> Mis equipos
        </Button>
        <Alert className="border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200 [&_[data-slot=alert-description]]:text-red-800 dark:[&_[data-slot=alert-description]]:text-red-300">
          <TriangleAlert />
          <AlertTitle>No se encontró el equipo</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button
        variant="outline"
        className="cursor-pointer"
        nativeButton={false}
        render={<Link href="/teams" />}
      >
        <ArrowLeft /> Mis equipos
      </Button>

      <section className="relative min-h-72 overflow-hidden rounded-2xl bg-muted shadow-sm">
        <Image
          src={disciplineCovers[team.discipline]}
          alt={`Portada de ${team.name}`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
        <div className="relative flex min-h-72 flex-col justify-end p-6 text-white sm:p-8">
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge className="border-white/30 bg-black/30 text-white backdrop-blur">
              {disciplineLabels[team.discipline]}
            </Badge>
            <Badge className="border-white/30 bg-black/30 text-white backdrop-blur">
              {privacyLabels[team.privacy]}
            </Badge>
            <Badge className="border-emerald-300/40 bg-emerald-950/50 text-emerald-100 backdrop-blur">
              <ShieldCheck aria-hidden="true" /> {team.membershipRole === "owner" ? "Owner" : team.membershipRole === "editor" ? "Editor" : "Lector"}
            </Badge>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {team.name}
          </h1>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/85">
            <span className="flex items-center gap-2">
              <MapPin className="size-4" aria-hidden="true" /> {team.location}
            </span>
            <span className="flex items-center gap-2">
              <Users className="size-4" aria-hidden="true" /> {team.memberCount}{" "}
              integrante
            </span>
          </div>
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Acerca del equipo</CardTitle>
          <CardDescription>
            Creado el {new Intl.DateTimeFormat("es-MX", { dateStyle: "long" }).format(new Date(team.createdAt))}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="max-w-4xl text-sm leading-6 text-muted-foreground">
            {team.description}
          </p>
        </CardContent>
      </Card>

      <TeamRoster team={team} />
    </div>
  );
}
