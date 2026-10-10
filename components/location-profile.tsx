import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Building2, Map, MapPin, MonitorPlay } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BusinessLocation } from "@/lib/locations";

const photoHeights = {
  short: "h-36 sm:h-44",
  medium: "h-52 sm:h-60",
  tall: "h-64 sm:h-80",
};

export function LocationProfile({ location }: { location: BusinessLocation }) {
  return (
    <div className="space-y-8">
      <Link href="/locations" className={buttonVariants({ variant: "outline", size: "sm" })}>
        <ArrowLeft data-icon="inline-start" /> Mis ubicaciones
      </Link>

      <div className="relative isolate min-h-64 overflow-hidden rounded-xl border bg-muted sm:min-h-72">
        <Image
          src={location.coverImage}
          alt={`Portada de ${location.name}`}
          fill
          priority
          sizes="(min-width: 1280px) 1100px, (min-width: 768px) calc(100vw - 18rem), 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        {location.liveRace && (
          <div className="absolute top-4 right-4 z-10">
            <Button
              nativeButton={false}
              render={<Link href={`/live/${location.slug}`} />}
            >
              <MonitorPlay data-icon="inline-start" /> Abrir carrera en vivo
            </Button>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 space-y-2 p-5 text-white sm:p-6">
          <p className="text-sm font-medium text-white/80">{location.discipline}</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{location.name}</h1>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/80">
            <span className="flex items-center gap-2"><Building2 className="size-4" /> {location.business}</span>
            <span className="flex items-center gap-2"><MapPin className="size-4" /> {location.address}, {location.city}</span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Acerca de la ubicación</CardTitle></CardHeader>
        <CardContent>
          <p className="max-w-4xl text-sm leading-6 text-muted-foreground">{location.description}</p>
        </CardContent>
      </Card>

      <section className="space-y-4" aria-labelledby="circuit-map-title">
        <div>
          <h2 id="circuit-map-title" className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <Map className="size-5" /> Mapa del circuito
          </h2>
          <p className="text-sm text-muted-foreground">Plano general del recorrido de esta ubicación.</p>
        </div>
        <Card className="overflow-hidden py-0">
          <div className="relative aspect-[16/7] min-h-64 bg-muted">
            <Image
              src={location.circuitMap}
              alt={`Mapa del circuito de ${location.name}`}
              fill
              sizes="(min-width: 1280px) 1100px, 100vw"
              className="object-contain"
            />
          </div>
        </Card>
      </section>

      {location.photos.length > 0 && (
        <section className="space-y-4" aria-labelledby="location-gallery-title">
          <div>
            <h2 id="location-gallery-title" className="text-2xl font-semibold tracking-tight">Galería</h2>
            <p className="text-sm text-muted-foreground">Instalaciones y espacios de la ubicación.</p>
          </div>
          <div className="columns-2 gap-3 md:columns-3 lg:gap-4">
            {location.photos.map((photo, index) => (
              <div key={`${photo.alt}-${index}`} className={`relative mb-3 break-inside-avoid overflow-hidden rounded-xl bg-muted lg:mb-4 ${photoHeights[photo.height]}`}>
                <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 30vw, 50vw" className="object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
