import type { Metadata } from "next";

import { ExploreEvents } from "@/components/explore-events";

export const metadata: Metadata = {
  title: "Explorar | ARPA",
  description: "Explora e inscríbete a eventos deportivos",
};

export default function ExplorePage() {
  return (
    <div className="space-y-6 p-6 sm:p-8 lg:p-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Explorar eventos</h1>
        <p className="mt-1 text-muted-foreground">
          Encuentra eventos disponibles y reserva tu lugar.
        </p>
      </div>
      <ExploreEvents />
    </div>
  );
}
