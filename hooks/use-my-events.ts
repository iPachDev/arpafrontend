"use client";

import { useEffect, useState } from "react";

import { apiUrl, type ApiEvent } from "@/lib/event-api";

export function useMyEvents(refreshKey = "") {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [canManage, setCanManage] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      setIsLoading(true);
      try {
        const response = await fetch(`${apiUrl}/events/mine`, {
          credentials: "include",
          cache: "no-store",
        });
        if (response.status === 403) {
          setCanManage(false);
          setEvents([]);
          return;
        }
        if (!response.ok) throw new Error();
        setCanManage(true);
        setEvents((await response.json()) as ApiEvent[]);
      } catch {
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    }

    void loadEvents();
    window.addEventListener("arpa:events-changed", loadEvents);
    return () => window.removeEventListener("arpa:events-changed", loadEvents);
  }, [refreshKey]);

  return { events, isLoading, canManage };
}
