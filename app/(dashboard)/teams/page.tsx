import type { Metadata } from "next";

import { TeamsList } from "@/components/teams-list";

export const metadata: Metadata = {
  title: "Mis equipos | ARPA",
  description: "Crea equipos e invita a otros usuarios",
};

export default function TeamsPage() {
  return (
    <div className="space-y-6 p-6 sm:p-8 lg:p-10">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Mis equipos</h1>
        <p className="text-muted-foreground">
          Crea equipos, reúne integrantes y administra sus funciones.
        </p>
      </div>
      <TeamsList />
    </div>
  );
}
