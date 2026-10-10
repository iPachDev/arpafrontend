"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { apiUrl, type ApiTeam } from "@/lib/team-api";

export function useMyTeams(refreshKey = "") {
  const router = useRouter();
  const [teams, setTeams] = useState<ApiTeam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadTeams() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(`${apiUrl}/teams/mine`, {
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        });

        if (response.status === 401) {
          router.replace("/login");
          return;
        }
        if (!response.ok) throw new Error("No pudimos cargar tus equipos.");

        setTeams((await response.json()) as ApiTeam[]);
      } catch (loadError) {
        if ((loadError as Error).name !== "AbortError") {
          setError("No pudimos cargar tus equipos.");
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    void loadTeams();
    window.addEventListener("arpa:teams-changed", loadTeams);

    return () => {
      controller.abort();
      window.removeEventListener("arpa:teams-changed", loadTeams);
    };
  }, [refreshKey, router]);

  return { teams, isLoading, error };
}

