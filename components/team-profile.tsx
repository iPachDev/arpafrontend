"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";
import {
  ArrowLeft,
  Lock,
  MailPlus,
  MapPin,
  Shield,
  UserCog,
  Users,
} from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Team, TeamMember } from "@/lib/teams";
import { TeamAchievements } from "@/components/team-achievements";
import { TeamSettingsDialog } from "@/components/team-settings-dialog";
import { TeamJoinRequestDialog } from "@/components/team-join-request-dialog";

const statusVariants: Record<TeamMember["status"], "default" | "secondary" | "outline" | "destructive"> = {
  Aceptada: "default",
  Enviada: "outline",
  "Pendiente de aceptar": "secondary",
  Cancelada: "destructive",
};

const photoHeights = {
  short: "h-36 sm:h-44",
  medium: "h-52 sm:h-60",
  tall: "h-64 sm:h-80",
};

function TeamInviteDialog({
  discipline,
  onInvite,
}: {
  discipline: Team["discipline"];
  onInvite: (member: TeamMember) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState<"Administrador" | "Miembro">("Miembro");
  const roles = useMemo(() => {
    if (discipline === "Running") return ["Corredor", "Entrenador", "Preparador físico"];
    if (discipline === "Ciclismo") return ["Ciclista", "Entrenador", "Mecánico", "Director deportivo"];
    return ["Piloto", "Mecánico", "Ingeniero de pista", "Jefe de equipo"];
  }, [discipline]);
  const [role, setRole] = useState(roles[0]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onInvite({ name, email, permission, role, status: "Enviada" });
    setName("");
    setEmail("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <MailPlus data-icon="inline-start" /> Invitar integrante
      </DialogTrigger>
      <DialogContent className="bg-background sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Invitar al equipo</DialogTitle>
            <DialogDescription>
              Define la función deportiva y el nivel de acceso del usuario.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-5">
            <div className="space-y-2">
              <Label htmlFor="invite-name">Nombre</Label>
              <Input id="invite-name" value={name} onChange={(event) => setName(event.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-email">Correo electrónico</Label>
              <Input id="invite-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Rol en el equipo</Label>
                <Select value={role} onValueChange={(value) => setRole(value as string)}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {roles.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Permiso</Label>
                <Select value={permission} onValueChange={(value) => setPermission(value as "Administrador" | "Miembro")}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administrador">Administrador</SelectItem>
                    <SelectItem value="Miembro">Miembro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
              Los administradores pueden editar el equipo e invitar integrantes. Los miembros tienen acceso de consulta.
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit">Enviar invitación</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function TeamProfile({ team }: { team: Team }) {
  const [members, setMembers] = useState(team.members);

  return (
    <div className="space-y-8">
      <Link href="/teams" className={buttonVariants({ variant: "outline", size: "sm" })}>
        <ArrowLeft data-icon="inline-start" /> Mis equipos
      </Link>

      <div className="relative isolate min-h-64 overflow-hidden rounded-xl border bg-muted sm:min-h-72">
        <Image
          src={team.coverImage}
          alt={`Portada de ${team.name}`}
          fill
          priority
          sizes="(min-width: 1280px) 1100px, (min-width: 768px) calc(100vw - 18rem), 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />

        <div className="absolute top-4 right-4 z-10 flex flex-wrap items-center justify-end gap-2">
            {team.privacy === "Público" && (
              <TeamJoinRequestDialog teamName={team.name} />
            )}
            <TeamSettingsDialog teamName={team.name} />
            <TeamInviteDialog discipline={team.discipline} onInvite={(member) => setMembers((current) => [...current, member])} />
        </div>

        <div className="absolute inset-x-0 bottom-0 flex items-end gap-4 p-5 text-white sm:p-6">
          <div className="hidden size-14 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm sm:flex">
            <Shield className="size-6" />
          </div>
          <div className="min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {team.name}
              </h1>
              <Badge
                variant="outline"
                className="border-white/25 bg-black/25 text-white"
              >
                {team.privacy === "Privado" && <Lock />} {team.privacy}
              </Badge>
            </div>
            <p className="text-sm font-medium text-white/80">{team.discipline}</p>
            <p className="flex items-center gap-2 text-sm text-white/80">
              <MapPin className="size-4" /> {team.location}
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Acerca del equipo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="max-w-4xl text-sm leading-6 text-muted-foreground">{team.description}</p>
        </CardContent>
      </Card>

      <TeamAchievements achievements={team.achievements} />

      {team.photos.length > 0 && (
        <section className="space-y-4" aria-labelledby="team-gallery-title">
          <div>
            <h2 id="team-gallery-title" className="text-2xl font-semibold tracking-tight">Galería</h2>
            <p className="text-sm text-muted-foreground">Fotos compartidas por el equipo.</p>
          </div>
          <div className="columns-2 gap-3 md:columns-3 lg:gap-4">
            {team.photos.map((photo, index) => (
              <div key={`${photo.alt}-${index}`} className={`relative mb-3 break-inside-avoid overflow-hidden rounded-xl bg-muted lg:mb-4 ${photoHeights[photo.height]}`}>
                <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 30vw, 50vw" className="object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="size-5" /> Integrantes e invitaciones</CardTitle>
          <CardDescription>Roles deportivos, permisos y estado de cada invitación.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Permiso</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.email}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar><AvatarFallback>{member.name.split(" ").map((word) => word[0]).slice(0, 2).join("")}</AvatarFallback></Avatar>
                        <div><p className="font-medium">{member.name}</p><p className="text-xs text-muted-foreground">{member.email}</p></div>
                      </div>
                    </TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell><span className="flex items-center gap-2"><UserCog className="size-4 text-muted-foreground" /> {member.permission}</span></TableCell>
                    <TableCell><Badge variant={statusVariants[member.status]}>{member.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
