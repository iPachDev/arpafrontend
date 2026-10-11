"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";

import { EventForm } from "@/components/event-form";
import { EventAdministration } from "@/components/event-administration";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { apiUrl, type ApiEvent } from "@/lib/event-api";

export function EventEdit({ slug }: { slug: string }) {
  const router = useRouter();
  const [event, setEvent] = useState<ApiEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${apiUrl}/events/${encodeURIComponent(slug)}`, {
      credentials: "include",
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        return (await response.json()) as ApiEvent;
      })
      .then((data) => {
        if (!data.canEdit) {
          router.replace(`/events/${encodeURIComponent(slug)}`);
          return;
        }
        setEvent(data);
      })
      .catch((loadError) => {
        if ((loadError as Error).name !== "AbortError") {
          setError("No pudimos cargar este evento.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, [router, slug]);

  if (isLoading) {
    return (
      <Skeleton className="mx-auto h-[42rem] max-w-3xl rounded-xl motion-reduce:animate-none" />
    );
  }
  if (!event) {
    return (
      <Alert variant="destructive" className="mx-auto max-w-3xl">
        <TriangleAlert />
        <AlertTitle>Evento no disponible</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  return (
    <div className="space-y-6">
      <EventForm event={event} />
      <EventAdministration event={event} />
    </div>
  );
}
