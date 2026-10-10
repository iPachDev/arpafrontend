"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Car,
  ChevronRight,
  ClipboardCheck,
  Compass,
  Flag,
  House,
  MapPinned,
  Plus,
  Trophy,
  Users,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { useMyTeams } from "@/hooks/use-my-teams";
import { locations } from "@/lib/locations";
import { registrations } from "@/lib/registrations";

const mainButtonClass =
  "h-10 cursor-pointer rounded-xl px-3 text-sidebar-foreground/75 transition-colors duration-200 hover:bg-[#ff3630]/10 hover:text-sidebar-foreground data-active:bg-[#ff3630]/12 data-active:font-semibold data-active:text-[#d90802] dark:data-active:text-[#ff8a86]";

const subButtonClass =
  "h-8 cursor-pointer rounded-lg text-sidebar-foreground/70 transition-colors duration-200 hover:bg-[#ff3630]/10 hover:text-sidebar-foreground data-active:bg-[#ff3630]/12 data-active:font-medium data-active:text-[#d90802] dark:data-active:text-[#ff8a86]";

function matchesSection(pathname: string, section: string) {
  return pathname === section || pathname.startsWith(`${section}/`);
}

export function AppSidebar() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile, state, setOpen } = useSidebar();
  const { teams: myTeams, isLoading: teamsLoading } = useMyTeams(pathname);

  const registrationsActive = matchesSection(pathname, "/registrations");
  const teamsActive = matchesSection(pathname, "/teams");
  const locationsActive = matchesSection(pathname, "/locations");

  const finishNavigation = () => {
    if (isMobile) setOpenMobile(false);
  };

  const revealCollapsedSection = () => {
    if (!isMobile && state === "collapsed") setOpen(true);
  };

  return (
    <Sidebar
      collapsible="icon"
      aria-label="Navegación principal de ARPA"
    >
      <SidebarHeader className="p-3 group-data-[collapsible=icon]:p-2">
        <Link
          href="/home"
          onClick={finishNavigation}
          aria-label="ARPA, ir al inicio"
          className="flex h-12 items-center gap-3 overflow-hidden rounded-xl px-2 outline-none transition-colors duration-200 hover:bg-[#ff3630]/10 focus-visible:ring-2 focus-visible:ring-sidebar-ring group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#ff3630] text-white shadow-sm shadow-[#ff3630]/25">
            <Flag className="size-4" aria-hidden="true" />
          </span>
          <span className="flex min-w-0 flex-col leading-none">
            <span className="text-sm font-bold tracking-[0.16em]">ARPA</span>
            <span className="mt-1 truncate text-[10px] font-medium uppercase tracking-[0.12em] text-sidebar-foreground/55">
              Automovilismo
            </span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="py-2">
        <SidebarGroup className="px-3 py-2 group-data-[collapsible=icon]:px-2">
          <SidebarGroupLabel className="px-3 text-[10px] font-semibold uppercase tracking-[0.16em]">
            Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === "/home"}
                  tooltip="Inicio"
                  className={mainButtonClass}
                  render={
                    <Link
                      href="/home"
                      onClick={finishNavigation}
                      aria-current={pathname === "/home" ? "page" : undefined}
                    />
                  }
                >
                  <House aria-hidden="true" />
                  <span>Inicio</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === "/explore"}
                  tooltip="Explorar eventos"
                  className={mainButtonClass}
                  render={
                    <Link
                      href="/explore"
                      onClick={finishNavigation}
                      aria-current={
                        pathname === "/explore" ? "page" : undefined
                      }
                    />
                  }
                >
                  <Compass aria-hidden="true" />
                  <span>Explorar eventos</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="px-3 py-2 group-data-[collapsible=icon]:px-2">
          <SidebarGroupLabel className="px-3 text-[10px] font-semibold uppercase tracking-[0.16em]">
            Tu actividad
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              <Collapsible
                defaultOpen={registrationsActive}
                className="group/registrations"
                render={<SidebarMenuItem />}
              >
                <CollapsibleTrigger
                  onClick={revealCollapsedSection}
                  aria-label={`Mis inscripciones, ${registrations.length} elementos`}
                  render={
                    <SidebarMenuButton
                      isActive={registrationsActive}
                      tooltip="Mis inscripciones"
                      className={mainButtonClass}
                    />
                  }
                >
                  <ClipboardCheck aria-hidden="true" />
                  <span>Mis inscripciones</span>
                  <span
                    aria-hidden="true"
                    className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-md bg-sidebar-accent px-1 text-[10px] font-medium tabular-nums group-data-[collapsible=icon]:hidden"
                  >
                    {registrations.length}
                  </span>
                  <ChevronRight className="transition-transform duration-200 group-data-open/registrations:rotate-90 motion-reduce:transition-none" aria-hidden="true" />
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarMenuSub className="my-1 gap-0.5">
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={pathname === "/registrations"}
                        className={subButtonClass}
                        render={
                          <Link
                            href="/registrations"
                            onClick={finishNavigation}
                            aria-current={
                              pathname === "/registrations" ? "page" : undefined
                            }
                          />
                        }
                      >
                        <span>Todas</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    {registrations.map((registration) => {
                      const href = `/registrations/${registration.slug}`;
                      const isActive = pathname === href;

                      return (
                        <SidebarMenuSubItem key={registration.slug}>
                          <SidebarMenuSubButton
                            isActive={isActive}
                            className={subButtonClass}
                            render={
                              <Link
                                href={href}
                                onClick={finishNavigation}
                                aria-current={isActive ? "page" : undefined}
                              />
                            }
                          >
                            {registration.personalization ? (
                              <span className="flex min-w-0 items-center gap-2">
                                <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-purple-500/15 text-purple-600 dark:text-purple-400">
                                  <Trophy className="size-3.5" aria-hidden="true" />
                                </span>
                                <span className="truncate">
                                  {registration.personalization.alias}
                                </span>
                              </span>
                            ) : (
                              <span>{registration.title}</span>
                            )}
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible
                defaultOpen={teamsActive}
                className="group/teams"
                render={<SidebarMenuItem />}
              >
                <CollapsibleTrigger
                  onClick={revealCollapsedSection}
                  aria-label={`Mis equipos, ${myTeams.length} elementos`}
                  render={
                    <SidebarMenuButton
                      isActive={teamsActive}
                      tooltip="Mis equipos"
                      className={mainButtonClass}
                    />
                  }
                >
                  <Users aria-hidden="true" />
                  <span>Mis equipos</span>
                  <span
                    aria-hidden="true"
                    className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-md bg-sidebar-accent px-1 text-[10px] font-medium tabular-nums group-data-[collapsible=icon]:hidden"
                  >
                    {teamsLoading ? "…" : myTeams.length}
                  </span>
                  <ChevronRight className="transition-transform duration-200 group-data-open/teams:rotate-90 motion-reduce:transition-none" aria-hidden="true" />
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarMenuSub className="my-1 gap-0.5">
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={pathname === "/teams"}
                        className={subButtonClass}
                        render={
                          <Link
                            href="/teams"
                            onClick={finishNavigation}
                            aria-current={
                              pathname === "/teams" ? "page" : undefined
                            }
                          />
                        }
                      >
                        <span>Todos los equipos</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    {myTeams.map((team) => {
                      const href = `/teams/${team.slug}`;
                      const isActive = pathname === href;

                      return (
                        <SidebarMenuSubItem key={team.slug}>
                          <SidebarMenuSubButton
                            isActive={isActive}
                            className={subButtonClass}
                            render={
                              <Link
                                href={href}
                                onClick={finishNavigation}
                                aria-current={isActive ? "page" : undefined}
                              />
                            }
                          >
                            <span className="flex min-w-0 items-center gap-2">
                              <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-orange-500/15 text-orange-600 dark:text-orange-400">
                                <Car className="size-3.5" aria-hidden="true" />
                              </span>
                              <span className="truncate">{team.name}</span>
                            </span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={pathname === "/teams/create"}
                        className={subButtonClass}
                        render={
                          <Link
                            href="/teams/create"
                            onClick={finishNavigation}
                            aria-current={
                              pathname === "/teams/create" ? "page" : undefined
                            }
                          />
                        }
                      >
                        <Plus aria-hidden="true" />
                        <span>Crear equipo</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible
                defaultOpen={locationsActive}
                className="group/locations"
                render={<SidebarMenuItem />}
              >
                <CollapsibleTrigger
                  onClick={revealCollapsedSection}
                  aria-label={`Mis ubicaciones, ${locations.length} elementos`}
                  render={
                    <SidebarMenuButton
                      isActive={locationsActive}
                      tooltip="Mis ubicaciones"
                      className={mainButtonClass}
                    />
                  }
                >
                  <MapPinned aria-hidden="true" />
                  <span>Mis ubicaciones</span>
                  <span
                    aria-hidden="true"
                    className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-md bg-sidebar-accent px-1 text-[10px] font-medium tabular-nums group-data-[collapsible=icon]:hidden"
                  >
                    {locations.length}
                  </span>
                  <ChevronRight className="transition-transform duration-200 group-data-open/locations:rotate-90 motion-reduce:transition-none" aria-hidden="true" />
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarMenuSub className="my-1 gap-0.5">
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={pathname === "/locations"}
                        className={subButtonClass}
                        render={
                          <Link
                            href="/locations"
                            onClick={finishNavigation}
                            aria-current={
                              pathname === "/locations" ? "page" : undefined
                            }
                          />
                        }
                      >
                        <span>Todas las ubicaciones</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    {locations.map((location) => {
                      const href = `/locations/${location.slug}`;
                      const isActive = pathname === href;

                      return (
                        <SidebarMenuSubItem key={location.slug}>
                          <SidebarMenuSubButton
                            isActive={isActive}
                            className={subButtonClass}
                            render={
                              <Link
                                href={href}
                                onClick={finishNavigation}
                                aria-current={isActive ? "page" : undefined}
                              />
                            }
                          >
                            <span>{location.name}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        isActive={pathname === "/locations/create"}
                        className={subButtonClass}
                        render={
                          <Link
                            href="/locations/create"
                            onClick={finishNavigation}
                            aria-current={
                              pathname === "/locations/create"
                                ? "page"
                                : undefined
                            }
                          />
                        }
                      >
                        <Plus aria-hidden="true" />
                        <span>Crear ubicación</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 group-data-[collapsible=icon]:hidden">
        <div className="flex items-center justify-between rounded-xl border border-sidebar-border bg-sidebar-accent/50 px-3 py-2 text-[11px] text-sidebar-foreground/60">
          <span>Mostrar u ocultar menú</span>
          <kbd className="rounded-md border border-sidebar-border bg-sidebar px-1.5 py-0.5 font-mono text-[10px] text-sidebar-foreground/70">
            ⌘ B
          </kbd>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
