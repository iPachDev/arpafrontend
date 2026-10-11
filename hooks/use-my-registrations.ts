"use client";

import { useEffect, useState } from "react";

import {
  apiUrl,
  type ApiEventRegistration,
} from "@/lib/event-api";

export function useMyRegistrations(refreshKey = "") {
  const [registrations, setRegistrations] = useState<ApiEventRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRegistrations() {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch(`${apiUrl}/event-registrations/mine`, {
          credentials: "include",
          cache: "no-store",
        });
        if (!response.ok) throw new Error();
        setRegistrations((await response.json()) as ApiEventRegistration[]);
      } catch {
        setError("No pudimos cargar tus inscripciones.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadRegistrations();
    window.addEventListener("arpa:registrations-changed", loadRegistrations);
    return () =>
      window.removeEventListener("arpa:registrations-changed", loadRegistrations);
  }, [refreshKey]);

  return { registrations, isLoading, error };
}
