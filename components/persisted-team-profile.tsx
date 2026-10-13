"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  MapPin,
  LockKeyhole,
  Share2,
  ShieldCheck,
  TriangleAlert,
  Users,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TeamRoster } from "@/components/team-roster";
import { TeamSettings } from "@/components/team-settings";
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
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null,
  );
  const [shareStatus, setShareStatus] = useState<"idle" | "copied">("idle");

  useEffect(() => {
    const controller = new AbortController();

    async function loadTeam() {
      try {
        const response = await fetch(
          `${apiUrl}/teams/${encodeURIComponent(slug)}`,
          {
            credentials: "include",
            cache: "no-store",
            signal: controller.signal,
          },
        );

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

  useEffect(() => {
    if (selectedPhotoIndex === null || !team || team.photoUrls.length < 2) {
      return;
    }
    const photoCount = team.photoUrls.length;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        setSelectedPhotoIndex((current) =>
          current === null
            ? null
            : (current - 1 + photoCount) % photoCount,
        );
      }
      if (event.key === "ArrowRight") {
        setSelectedPhotoIndex((current) =>
          current === null ? null : (current + 1) % photoCount,
        );
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhotoIndex, team]);

  function getProfileUrl() {
    return `${window.location.origin}/teams/${encodeURIComponent(slug)}`;
  }

  async function copyProfileLink() {
    await navigator.clipboard.writeText(getProfileUrl());
    setShareStatus("copied");
    window.setTimeout(() => setShareStatus("idle"), 2000);
  }

  async function shareProfile() {
    if (!navigator.share) {
      await copyProfileLink();
      return;
    }

    try {
      await navigator.share({
        title: team?.name ?? "Equipo en ARPA",
        text: `Conoce el perfil de ${team?.name ?? "este equipo"} en ARPA.`,
        url: getProfileUrl(),
      });
    } catch (shareError) {
      if ((shareError as Error).name !== "AbortError") {
        await copyProfileLink();
      }
    }
  }

  if (isLoading) return <TeamProfileSkeleton />;

  if (!team || error) {
    return (
      <div className="space-y-5">
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/teams" />}
        >
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="outline"
          className="cursor-pointer"
          nativeButton={false}
          render={<Link href="/teams" />}
        >
          <ArrowLeft /> Mis equipos
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
              />
            }
          >
            {shareStatus === "copied" ? <Check /> : <Share2 />}
            {shareStatus === "copied" ? "Enlace copiado" : "Compartir perfil"}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => void copyProfileLink()}>
              {shareStatus === "copied" ? <Check /> : <Copy />}
              {shareStatus === "copied" ? "Enlace copiado" : "Copiar link"}
            </DropdownMenuItem>
            {typeof navigator !== "undefined" && "share" in navigator && (
              <DropdownMenuItem onClick={() => void shareProfile()}>
                <Share2 /> Compartir en...
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <section className="relative min-h-72 overflow-hidden rounded-2xl bg-muted shadow-sm">
        {team.coverImageUrl ? (
          <div
            role="img"
            aria-label={`Portada de ${team.name}`}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url("${team.coverImageUrl}")` }}
          />
        ) : (
          <Image
            src={disciplineCovers[team.discipline]}
            alt={`Portada de ${team.name}`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
        <div className="relative flex min-h-72 flex-col justify-end p-6 text-white sm:p-8">
          <div className="mb-3 flex flex-wrap gap-2">
            {!team.isPrivateView && (
              <Badge className="border-white/30 bg-black/30 text-white backdrop-blur">
                {disciplineLabels[team.discipline]}
              </Badge>
            )}
            <Badge className="border-white/30 bg-black/30 text-white backdrop-blur">
              {privacyLabels[team.privacy]}
            </Badge>
            {team.membershipRole && (
              <Badge className="border-emerald-300/40 bg-emerald-950/50 text-emerald-100 backdrop-blur">
                <ShieldCheck aria-hidden="true" />{" "}
                {team.membershipRole === "owner"
                  ? "Owner"
                  : team.membershipRole === "editor"
                    ? "Editor"
                    : "Lector"}
              </Badge>
            )}
          </div>
          <div className="flex items-end gap-4">
            {team.logoImageUrl && (
              <div
                role="img"
                aria-label={`Logo de ${team.name}`}
                className="size-16 shrink-0 rounded-xl border-2 border-white/80 bg-white bg-cover bg-center shadow-sm sm:size-20"
                style={{ backgroundImage: `url("${team.logoImageUrl}")` }}
              />
            )}
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {team.name}
            </h1>
          </div>
          {!team.isPrivateView && (
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/85">
              {team.location && (
                <span className="flex items-center gap-2">
                  <MapPin className="size-4" aria-hidden="true" />{" "}
                  {team.location}
                </span>
              )}
              {team.memberCount !== null && (
                <span className="flex items-center gap-2">
                  <Users className="size-4" aria-hidden="true" />{" "}
                  {team.memberCount} integrante
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {team.isPrivateView ? (
        <Card className="border-amber-300 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30">
          <CardContent className="flex gap-3 py-6">
            <LockKeyhole className="mt-0.5 size-5 shrink-0 text-amber-700 dark:text-amber-300" />
            <div>
              <p className="font-medium text-amber-950 dark:text-amber-100">
                Este equipo es privado
              </p>
              <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">
                Solo sus integrantes pueden consultar la descripción, las fotos
                y la información interna del equipo.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
      <Card>
        <CardHeader>
          <CardTitle>Acerca del equipo</CardTitle>
          <CardDescription>
            Creado el{" "}
            {new Intl.DateTimeFormat("es-MX", { dateStyle: "long" }).format(
              new Date(team.createdAt),
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="max-w-4xl text-sm leading-6 text-muted-foreground">
            {team.description}
          </p>
        </CardContent>
      </Card>
      )}

      {!team.isPrivateView && team.photoUrls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Fotos del equipo</CardTitle>
            <CardDescription>
              Imágenes privadas compartidas por el equipo.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {team.photoUrls.map((url, index) => (
              <button
                key={url}
                aria-label={`Foto ${index + 1} de ${team.name}`}
                type="button"
                onClick={() => setSelectedPhotoIndex(index)}
                className="aspect-video cursor-zoom-in rounded-lg bg-muted bg-cover bg-center outline-none transition-transform hover:scale-[1.02] focus-visible:ring-3 focus-visible:ring-ring motion-reduce:transition-none"
                style={{ backgroundImage: `url("${url}")` }}
              />
            ))}
          </CardContent>
        </Card>
      )}

      <Dialog
        open={selectedPhotoIndex !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedPhotoIndex(null);
        }}
      >
        <DialogContent className="w-[min(96vw,72rem)] max-w-none gap-0 overflow-hidden bg-black p-0 text-white sm:max-w-none">
          <DialogTitle className="sr-only">
            Visor de fotos de {team.name}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Usa los botones o las flechas del teclado para cambiar de foto.
          </DialogDescription>

          {selectedPhotoIndex !== null && (
            <div className="relative flex min-h-[65svh] items-center justify-center bg-black sm:min-h-[75svh]">
              <div
                role="img"
                aria-label={`Foto ${selectedPhotoIndex + 1} de ${team.name}`}
                className="absolute inset-4 bg-contain bg-center bg-no-repeat sm:inset-8"
                style={{
                  backgroundImage: `url("${team.photoUrls[selectedPhotoIndex]}")`,
                }}
              />

              {team.photoUrls.length > 1 && (
                <>
                  <Button
                    type="button"
                    size="icon-lg"
                    variant="secondary"
                    aria-label="Foto anterior"
                    className="absolute left-3 z-10 cursor-pointer rounded-full bg-black/60 text-white hover:bg-black/80 sm:left-5"
                    onClick={() =>
                      setSelectedPhotoIndex(
                        (selectedPhotoIndex - 1 + team.photoUrls.length) %
                          team.photoUrls.length,
                      )
                    }
                  >
                    <ChevronLeft />
                  </Button>
                  <Button
                    type="button"
                    size="icon-lg"
                    variant="secondary"
                    aria-label="Foto siguiente"
                    className="absolute right-3 z-10 cursor-pointer rounded-full bg-black/60 text-white hover:bg-black/80 sm:right-5"
                    onClick={() =>
                      setSelectedPhotoIndex(
                        (selectedPhotoIndex + 1) % team.photoUrls.length,
                      )
                    }
                  >
                    <ChevronRight />
                  </Button>
                </>
              )}

              <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/65 px-3 py-1 text-xs tabular-nums">
                {selectedPhotoIndex + 1} / {team.photoUrls.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {(team.membershipRole ||
        (team.allowNonMembers && team.showMembers)) && (
        <TeamRoster team={team} />
      )}

      {team.membershipRole === "owner" && (
        <TeamSettings team={team} onUpdated={setTeam} />
      )}
    </div>
  );
}
