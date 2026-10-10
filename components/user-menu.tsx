"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  ChevronDown,
  Gauge,
  LogOut,
  UserRound,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  role: "owner" | "editor" | "reader";
};

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

const roleLabels: Record<AuthenticatedUser["role"], string> = {
  owner: "Propietario",
  editor: "Editor",
  reader: "Lector",
};

export function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<AuthenticatedUser | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadUser() {
      const response = await fetch(`${apiUrl}/auth/me`, {
        credentials: "include",
        cache: "no-store",
        signal: controller.signal,
      });

      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      if (response.ok) {
        setUser((await response.json()) as AuthenticatedUser);
      }
    }

    void loadUser().catch(() => undefined);
    return () => controller.abort();
  }, [router]);

  async function handleLogout() {
    try {
      const response = await fetch(`${apiUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) return;

      router.replace("/login");
      router.refresh();
    } catch {
      // Se conserva la sesión visible si el servidor no confirmó la revocación.
    }
  }

  const initials =
    user?.name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "AR";
  const displayName = user?.name ?? "Usuario";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="h-auto gap-3 rounded-full px-2 py-1.5 transition-colors hover:bg-[#ff3630]/10 data-popup-open:bg-[#ff3630]/10"
          />
        }
      >
        <Avatar className="ring-2 ring-[#ff3630]/15">
          <AvatarFallback className="bg-[#ff3630] text-xs font-semibold text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="hidden text-sm font-medium sm:inline">
          {displayName}
        </span>
        <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 in-data-popup-open:rotate-180" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-[min(21rem,calc(100vw-2rem))] overflow-hidden rounded-[2rem] border-0 bg-popover p-0 shadow-[0_24px_65px_-20px_rgba(41,27,21,0.45)] ring-1 ring-black/5"
      >
        <div className="relative h-52 overflow-hidden text-white">
          <div className="absolute inset-x-0 top-0 h-[11.25rem] bg-[#ff3630]" />
          <svg
            aria-hidden="true"
            viewBox="0 0 336 32"
            preserveAspectRatio="none"
            className="absolute inset-x-0 top-[11.2rem] h-8 w-full fill-[#ff3630]"
          >
            <path d="M0 0H336V2Q168 58 0 2Z" />
          </svg>

          <div className="relative flex items-center gap-2 px-6 pt-5">
            <span className="flex size-8 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
              <Building2 className="size-4" />
            </span>
            <span className="text-base font-semibold tracking-tight">ARPA</span>
          </div>

          <div className="relative mt-5 flex flex-col items-center px-6 text-center">
            <Avatar className="size-14 border-2 border-white/75 shadow-lg">
              <AvatarFallback className="bg-[#ffe7e6] text-base font-semibold text-[#b91c1c]">
                {initials}
              </AvatarFallback>
            </Avatar>
            <p className="mt-3 text-lg font-semibold tracking-tight">
              {displayName}
            </p>
            <p className="mt-0.5 text-xs text-white/80">
              {user ? roleLabels[user.role] : "Cargando perfil..."}
            </p>
          </div>
        </div>

        <DropdownMenuGroup className="px-4 pb-3 pt-2">
          <DropdownMenuLabel className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            General
          </DropdownMenuLabel>
          <DropdownMenuItem
            render={<Link href="/home" />}
            className="mb-1 min-h-12 gap-3 rounded-2xl border border-border/80 px-3 py-2.5 shadow-sm transition-colors focus:bg-[#ff3630]/10 focus:text-foreground"
          >
            <span className="flex size-8 items-center justify-center rounded-xl bg-[#ff3630]/10 text-[#d90802] dark:text-[#ff8a86]">
              <Gauge className="size-4" />
            </span>
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="font-medium">Panel principal</span>
              <span className="text-xs text-muted-foreground">
                Resumen de tu actividad
              </span>
            </span>
          </DropdownMenuItem>

          <DropdownMenuItem
            render={<Link href="/profile" />}
            className="min-h-12 gap-3 rounded-2xl px-3 py-2.5 transition-colors focus:bg-[#ff3630]/10 focus:text-foreground"
          >
            <span className="flex size-8 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <UserRound className="size-4" />
            </span>
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="font-medium">Mi perfil</span>
              <span className="text-xs text-muted-foreground">
                Información personal
              </span>
            </span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="mx-6 my-0" />

        <DropdownMenuGroup className="p-4">
          <DropdownMenuItem
            onClick={() => void handleLogout()}
            variant="destructive"
            className="min-h-11 gap-3 rounded-2xl px-3 py-2.5"
          >
            <span className="flex size-8 items-center justify-center rounded-xl bg-destructive/10">
              <LogOut className="size-4" />
            </span>
            <span className="font-medium">Cerrar sesión</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
