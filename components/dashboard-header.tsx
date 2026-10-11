"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserMenu } from "@/components/user-menu";
import { teams } from "@/lib/teams";

type HeaderContext = {
  title: string;
  parent?: {
    href: string;
    label: string;
  };
};

function fallbackLabel(pathname: string) {
  const segment = pathname.split("/").filter(Boolean).at(-1);

  if (!segment) return "Inicio";

  return decodeURIComponent(segment)
    .replaceAll("-", " ")
    .replace(/^./, (character) => character.toUpperCase());
}

function getHeaderContext(pathname: string): HeaderContext {
  const directRoutes: Record<string, HeaderContext> = {
    "/home": { title: "Inicio" },
    "/profile": { title: "Mi perfil" },
    "/explore": { title: "Explorar eventos" },
    "/registrations": { title: "Mis inscripciones" },
    "/events": { title: "Mis eventos" },
    "/events/create": {
      title: "Crear evento",
      parent: { href: "/events", label: "Mis eventos" },
    },
    "/teams": { title: "Mis equipos" },
    "/teams/create": {
      title: "Crear equipo",
      parent: { href: "/teams", label: "Mis equipos" },
    },
    "/locations": { title: "Mis ubicaciones" },
    "/locations/create": {
      title: "Crear ubicación",
      parent: { href: "/locations", label: "Mis ubicaciones" },
    },
    "/checkout": {
      title: "Finalizar inscripción",
      parent: { href: "/registrations", label: "Mis inscripciones" },
    },
  };

  if (directRoutes[pathname]) return directRoutes[pathname];

  if (pathname.startsWith("/registrations/")) {
    return {
      title: fallbackLabel(pathname),
      parent: { href: "/registrations", label: "Mis inscripciones" },
    };
  }

  if (pathname.startsWith("/events/")) {
    return {
      title: pathname.endsWith("/edit")
        ? "Editar evento"
        : fallbackLabel(pathname),
      parent: { href: "/events", label: "Mis eventos" },
    };
  }

  if (pathname.startsWith("/teams/")) {
    const slug = pathname.replace("/teams/", "");
    const team = teams.find((item) => item.slug === slug);

    return {
      title:
        team?.personalization?.alias ?? team?.name ?? fallbackLabel(pathname),
      parent: { href: "/teams", label: "Mis equipos" },
    };
  }

  if (pathname.startsWith("/locations/")) {
    return {
      title: fallbackLabel(pathname),
      parent: { href: "/locations", label: "Mis ubicaciones" },
    };
  }

  return { title: fallbackLabel(pathname) };
}

export function DashboardHeader() {
  const pathname = usePathname();
  const context = getHeaderContext(pathname);

  return (
    <header className="sticky top-0 z-20 flex h-[4.5rem] shrink-0 items-center gap-3 border-b border-border/70 bg-background/85 px-4 backdrop-blur-xl supports-[backdrop-filter]:bg-background/75 sm:px-6">
      <SidebarTrigger
        aria-label="Mostrar u ocultar menú"
        className="size-9 cursor-pointer rounded-xl border border-border bg-background shadow-sm transition-colors duration-200 hover:border-[#ff3630]/30 hover:bg-[#ff3630]/8 hover:text-[#d90802]"
      />

      <div className="h-6 w-px bg-border" aria-hidden="true" />

      <nav
        aria-label="Ruta de navegación"
        className="flex min-w-0 items-center gap-1.5 text-sm"
      >
        {context.parent ? (
          <>
            <Link
              href={context.parent.href}
              className="hidden truncate text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:block"
            >
              {context.parent.label}
            </Link>
            <ChevronRight
              className="hidden size-3.5 shrink-0 text-muted-foreground/60 sm:block"
              aria-hidden="true"
            />
          </>
        ) : null}
        <span
          className="truncate font-semibold tracking-tight text-foreground"
          aria-current="page"
        >
          {context.title}
        </span>
      </nav>

      <div className="ml-auto shrink-0">
        <UserMenu />
      </div>
    </header>
  );
}
