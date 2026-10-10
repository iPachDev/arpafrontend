import type { Metadata } from "next";

import { EventsSection } from "@/components/events-section";
import { LatestResultsSection } from "@/components/latest-results-section";
import { NewsSection } from "@/components/news-section";

export const metadata: Metadata = {
  title: "Home | ARPA",
  description: "Panel principal de ARPA",
};

export default function HomePage() {
  return (
    <div className="space-y-12 p-6 sm:p-8 lg:p-10">
      <LatestResultsSection />
      <NewsSection />
      <EventsSection />
    </div>
  );
}
