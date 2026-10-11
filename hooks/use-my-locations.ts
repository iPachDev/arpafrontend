"use client";

import { useEffect, useState } from "react";
import { apiUrl, type ApiLocation } from "@/lib/location-api";

export function useMyLocations(refreshKey = "") {
  const [locations, setLocations] = useState<ApiLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLocations() {
      setIsLoading(true);
      try {
        const response = await fetch(`${apiUrl}/locations/mine`, {
          credentials: "include",
          cache: "no-store",
        });
        if (!response.ok) throw new Error();
        setLocations((await response.json()) as ApiLocation[]);
      } catch {
        setLocations([]);
      } finally {
        setIsLoading(false);
      }
    }
    void loadLocations();
    window.addEventListener("arpa:locations-changed", loadLocations);
    return () =>
      window.removeEventListener("arpa:locations-changed", loadLocations);
  }, [refreshKey]);

  return { locations, isLoading };
}
