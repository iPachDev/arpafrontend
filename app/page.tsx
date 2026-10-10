import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-svh items-center justify-center px-6 py-16">
      <section className="flex max-w-md flex-col items-center gap-5 text-center">
        <span className="rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
          Next.js + shadcn/ui
        </span>
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight">ARPA</h1>
          <p className="text-balance text-muted-foreground">
            El proyecto está limpio y listo para empezar a construir.
          </p>
        </div>
        <Button>
          Comenzar
          <ArrowRight data-icon="inline-end" />
        </Button>
      </section>
    </main>
  );
}
