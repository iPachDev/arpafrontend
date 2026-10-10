"use client";

import Image from "next/image";
import { useState } from "react";
import { Maximize, Pause, Play, Radio, Users, Volume2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type LiveStreamSectionProps = {
  title: string;
  channel: string;
  viewers: number;
  image: string;
};

export function LiveStreamSection({
  title,
  channel,
  viewers,
  image,
}: LiveStreamSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section aria-labelledby="live-stream-title">
      <Card className="overflow-hidden py-0">
        <div className="grid lg:grid-cols-[22rem_minmax(0,1fr)]">
          <div className="relative aspect-video overflow-hidden bg-black lg:h-52 lg:aspect-auto">
            {!isPlaying && (
              <Image
                src={image}
                alt={`Vista previa de ${title}`}
                fill
                sizes="(min-width: 1024px) 760px, 100vw"
                className="object-cover opacity-70"
              />
            )}
            <div className="absolute inset-0 bg-black/25" />

            <div className="absolute top-3 left-3 flex items-center gap-2 rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
              <span className="size-2 rounded-full bg-white" />
              EN VIVO
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              {isPlaying ? (
                <div className="flex flex-col items-center gap-3 text-center text-white">
                  <Radio className="size-10 animate-pulse" />
                  <div>
                    <p className="font-semibold">Transmisión en vivo</p>
                    <p className="text-sm text-white/70">Reproductor de muestra</p>
                  </div>
                </div>
              ) : (
                <Button
                  type="button"
                  size="icon-lg"
                  className="size-14 rounded-full shadow-lg"
                  aria-label="Reproducir transmisión"
                  onClick={() => setIsPlaying(true)}
                >
                  <Play className="size-6 fill-current" />
                </Button>
              )}
            </div>

            {isPlaying && (
              <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-black/75 p-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-white hover:bg-white/15 hover:text-white"
                  aria-label="Pausar transmisión"
                  onClick={() => setIsPlaying(false)}
                >
                  <Pause />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-white hover:bg-white/15 hover:text-white"
                  aria-label="Volumen"
                >
                  <Volume2 />
                </Button>
                <div className="h-1 flex-1 rounded-full bg-white/30">
                  <div className="h-full w-2/3 rounded-full bg-red-500" />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-white hover:bg-white/15 hover:text-white"
                  aria-label="Pantalla completa"
                >
                  <Maximize />
                </Button>
              </div>
            )}
          </div>

          <CardContent className="flex flex-col justify-center space-y-3 p-5">
            <CardHeader className="p-0">
              <CardDescription className="flex items-center gap-2">
                <Radio className="size-4 text-red-500" /> Transmisión disponible
              </CardDescription>
              <CardTitle id="live-stream-title">{title}</CardTitle>
            </CardHeader>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
              <p className="text-muted-foreground">Transmitido por</p>
              <p className="font-medium">{channel}</p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Users className="size-4" />
                {viewers.toLocaleString("es-MX")} espectadores ahora
              </p>
            </div>
            <Button
              type="button"
              className="w-fit"
              onClick={() => setIsPlaying(true)}
            >
              <Play data-icon="inline-start" />
              Ver transmisión
            </Button>
          </CardContent>
        </div>
      </Card>
    </section>
  );
}
