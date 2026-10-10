import type { Metadata } from "next";

import { TeamCreateForm } from "@/components/team-create-form";

export const metadata: Metadata = {
  title: "Crear equipo | ARPA",
  description: "Configura un nuevo equipo deportivo",
};

export default function CreateTeamPage() {
  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <TeamCreateForm />
    </div>
  );
}
