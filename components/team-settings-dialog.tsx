"use client";

import { useState } from "react";
import {
  BellRing,
  Bike,
  Car,
  Flag,
  Gauge,
  Mail,
  MessageCircle,
  Palette,
  PersonStanding,
  Settings,
  Shield,
  Star,
  Tag,
  Trophy,
  UserPlus,
  Users,
  Wrench,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const iconOptions = [
  { name: "Escudo", icon: Shield },
  { name: "Equipo", icon: Users },
  { name: "Trofeo", icon: Trophy },
  { name: "Bandera", icon: Flag },
  { name: "Velocidad", icon: Gauge },
  { name: "Automovilismo", icon: Car },
  { name: "Ciclismo", icon: Bike },
  { name: "Running", icon: PersonStanding },
  { name: "Mecánica", icon: Wrench },
  { name: "Favorito", icon: Star },
  { name: "Impulso", icon: Zap },
  { name: "Integrantes", icon: UserPlus },
];

const colorOptions = [
  { name: "Azul", className: "bg-blue-500" },
  { name: "Verde", className: "bg-green-500" },
  { name: "Rojo", className: "bg-red-500" },
  { name: "Ámbar", className: "bg-amber-500" },
  { name: "Morado", className: "bg-purple-500" },
  { name: "Naranja", className: "bg-orange-500" },
  { name: "Cian", className: "bg-cyan-500" },
  { name: "Rosa", className: "bg-pink-500" },
];

const notificationChannels = [
  {
    id: "team-email-notifications",
    title: "Email",
    description: "Recibe avisos en tu correo electrónico.",
    icon: Mail,
  },
  {
    id: "team-whatsapp-notifications",
    title: "WhatsApp",
    description: "Recibe mensajes en tu número registrado.",
    icon: MessageCircle,
  },
  {
    id: "team-push-notifications",
    title: "Notificaciones push",
    description: "Recibe avisos directamente en este dispositivo.",
    icon: BellRing,
  },
];

const notificationEvents = [
  {
    id: "team-new-invitations",
    title: "Invitaciones y solicitudes",
    description: "Nuevas invitaciones o solicitudes para unirse.",
    icon: UserPlus,
  },
  {
    id: "team-member-changes",
    title: "Cambios en los integrantes",
    description: "Altas, bajas, roles y permisos del equipo.",
    icon: Users,
  },
  {
    id: "team-achievements",
    title: "Nuevos logros",
    description: "Insignias y puntos desbloqueados por el equipo.",
    icon: Trophy,
  },
];

function SwitchRow({
  id,
  title,
  description,
  icon: Icon,
}: {
  id: string;
  title: string;
  description: string;
  icon: typeof BellRing;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
        <Icon className="size-4" />
      </div>
      <Label htmlFor={id} className="min-w-0 flex-1 cursor-pointer space-y-1">
        <span className="block font-medium">{title}</span>
        <span className="block text-xs font-normal text-muted-foreground">
          {description}
        </span>
      </Label>
      <Switch id={id} defaultChecked />
    </div>
  );
}

export function TeamSettingsDialog({ teamName }: { teamName: string }) {
  const [selectedIcon, setSelectedIcon] = useState("Escudo");
  const [selectedColor, setSelectedColor] = useState("Azul");
  const SelectedIcon =
    iconOptions.find((option) => option.name === selectedIcon)?.icon ?? Shield;
  const selectedColorClass =
    colorOptions.find((option) => option.name === selectedColor)?.className ??
    "bg-blue-500";

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            aria-label="Configurar equipo"
            title="Configurar equipo"
          />
        }
      >
        <Settings />
      </DialogTrigger>

      <DialogContent className="max-h-[88dvh] overflow-hidden bg-background sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Configuración del equipo</DialogTitle>
          <DialogDescription>
            Personaliza el equipo y elige las notificaciones que deseas recibir.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="general"
          orientation="vertical"
          className="min-h-0 flex-1 flex-col gap-5 overflow-hidden sm:flex-row"
        >
          <TabsList
            variant="line"
            className="h-auto w-full shrink-0 items-stretch justify-start border-b pb-3 sm:w-40 sm:flex-col sm:border-r sm:border-b-0 sm:pr-4 sm:pb-0"
          >
            <TabsTrigger value="general" className="justify-start sm:w-full">
              <Palette /> General
            </TabsTrigger>
            <TabsTrigger value="notifications" className="justify-start sm:w-full">
              <BellRing /> Notificaciones
            </TabsTrigger>
          </TabsList>

          <div className="min-w-0 flex-1 overflow-y-auto pr-1">
            <TabsContent value="general" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="team-alias">Alias del equipo</Label>
                <Input id="team-alias" defaultValue={teamName} placeholder="Nombre personalizado" />
              </div>

              <div className="space-y-3">
                <Label>Icono personalizado</Label>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                  {iconOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <Button
                        key={option.name}
                        type="button"
                        size="icon"
                        variant={selectedIcon === option.name ? "default" : "outline"}
                        aria-label={option.name}
                        title={option.name}
                        onClick={() => setSelectedIcon(option.name)}
                      >
                        <Icon />
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Color del equipo</Label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((option) => (
                    <Button
                      key={option.name}
                      type="button"
                      size="icon"
                      variant="outline"
                      className={selectedColor === option.name ? "rounded-full ring-2 ring-ring ring-offset-2" : "rounded-full"}
                      aria-label={option.name}
                      title={option.name}
                      onClick={() => setSelectedColor(option.name)}
                    >
                      <span className={`size-5 rounded-full ${option.className}`} />
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Vista previa</Label>
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <span className={`flex size-10 items-center justify-center rounded-lg text-white ${selectedColorClass}`}>
                    <SelectedIcon className="size-5" />
                  </span>
                  <div>
                    <p className="font-medium">{teamName}</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Tag className="size-3" /> Equipo personalizado
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <section className="space-y-3">
                <div>
                  <h3 className="font-medium">Canales</h3>
                  <p className="text-sm text-muted-foreground">Elige por dónde quieres recibir los avisos.</p>
                </div>
                <div className="space-y-2">
                  {notificationChannels.map((item) => <SwitchRow key={item.id} {...item} />)}
                </div>
              </section>

              <section className="space-y-3">
                <div>
                  <h3 className="font-medium">Tipos de notificación</h3>
                  <p className="text-sm text-muted-foreground">Selecciona la actividad del equipo que deseas seguir.</p>
                </div>
                <div className="space-y-2">
                  {notificationEvents.map((item) => <SwitchRow key={item.id} {...item} />)}
                </div>
              </section>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancelar</DialogClose>
          <DialogClose render={<Button />}>Guardar cambios</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
