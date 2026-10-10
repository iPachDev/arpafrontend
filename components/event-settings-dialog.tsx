"use client";

import { useState } from "react";
import {
  BellRing,
  Bike,
  CalendarClock,
  CalendarDays,
  Car,
  Flag,
  Gauge,
  Mail,
  MapPin,
  Medal,
  MessageCircle,
  Palette,
  PersonStanding,
  RefreshCcw,
  Settings,
  Star,
  Tag,
  Timer,
  Trophy,
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
  { name: "Bandera", icon: Flag },
  { name: "Trofeo", icon: Trophy },
  { name: "Medalla", icon: Medal },
  { name: "Cronómetro", icon: Timer },
  { name: "Velocidad", icon: Gauge },
  { name: "Ciclismo", icon: Bike },
  { name: "Running", icon: PersonStanding },
  { name: "Automovilismo", icon: Car },
  { name: "Ubicación", icon: MapPin },
  { name: "Calendario", icon: CalendarDays },
  { name: "Favorito", icon: Star },
  { name: "Energía", icon: Zap },
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
    id: "email-notifications",
    title: "Email",
    description: "Recibe avisos en tu correo electrónico.",
    icon: Mail,
  },
  {
    id: "whatsapp-notifications",
    title: "WhatsApp",
    description: "Recibe mensajes en tu número registrado.",
    icon: MessageCircle,
  },
  {
    id: "push-notifications",
    title: "Notificaciones push",
    description: "Recibe avisos directamente en este dispositivo.",
    icon: BellRing,
  },
];

const notificationEvents = [
  {
    id: "event-changes",
    title: "Cambios en el evento",
    description: "Horarios, ubicación o información importante.",
    icon: RefreshCcw,
  },
  {
    id: "event-reminder",
    title: "1 día antes del evento",
    description: "Recordatorio previo al inicio de la actividad.",
    icon: CalendarClock,
  },
  {
    id: "new-results",
    title: "Nuevos resultados",
    description: "Aviso cuando se publiquen tiempos y posiciones.",
    icon: Trophy,
  },
];

function SwitchRow({
  id,
  title,
  description,
  icon: Icon,
  defaultChecked = true,
}: {
  id: string;
  title: string;
  description: string;
  icon: typeof BellRing;
  defaultChecked?: boolean;
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
      <Switch id={id} defaultChecked={defaultChecked} />
    </div>
  );
}

export function EventSettingsDialog({ eventName }: { eventName: string }) {
  const [selectedIcon, setSelectedIcon] = useState("Bandera");
  const [selectedColor, setSelectedColor] = useState("Azul");
  const SelectedIcon =
    iconOptions.find((option) => option.name === selectedIcon)?.icon ?? Flag;
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
            aria-label="Configurar evento"
            title="Configurar evento"
          />
        }
      >
        <Settings />
      </DialogTrigger>

      <DialogContent className="max-h-[88dvh] overflow-hidden bg-background sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Configuración personal del evento</DialogTitle>
          <DialogDescription>
            Personaliza cómo ves el evento y qué notificaciones deseas recibir.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="general"
          orientation="vertical"
          className="min-h-0 flex-1 flex-row gap-5 overflow-hidden"
        >
          <TabsList
            variant="line"
            className="h-auto w-40 shrink-0 flex-col items-stretch justify-start border-r pr-4"
          >
            <TabsTrigger value="general" className="w-full justify-start">
              <Palette />
              General
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="w-full justify-start"
            >
              <BellRing />
              Notificaciones
            </TabsTrigger>
          </TabsList>

          <div className="min-w-0 flex-1 overflow-y-auto pr-1">
            <TabsContent value="general" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="event-alias">Alias del evento</Label>
                <Input
                  id="event-alias"
                  defaultValue={eventName}
                  placeholder="Nombre personalizado"
                />
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
                        variant={
                          selectedIcon === option.name ? "default" : "outline"
                        }
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
                <Label>Color de la etiqueta</Label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((option) => (
                    <Button
                      key={option.name}
                      type="button"
                      size="icon"
                      variant="outline"
                      className={
                        selectedColor === option.name
                          ? "rounded-full ring-2 ring-ring ring-offset-2"
                          : "rounded-full"
                      }
                      aria-label={option.name}
                      title={option.name}
                      onClick={() => setSelectedColor(option.name)}
                    >
                      <span
                        className={`size-5 rounded-full ${option.className}`}
                      />
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Vista previa</Label>
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <span
                    className={`flex size-9 items-center justify-center rounded-lg text-white ${selectedColorClass}`}
                  >
                    <SelectedIcon className="size-4" />
                  </span>
                  <div>
                    <p className="font-medium">{eventName}</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Tag className="size-3" /> Etiqueta personalizada
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <section className="space-y-3">
                <div>
                  <h3 className="font-medium">Canales</h3>
                  <p className="text-sm text-muted-foreground">
                    Elige por dónde quieres recibir los avisos.
                  </p>
                </div>
                <div className="space-y-2">
                  {notificationChannels.map((item) => (
                    <SwitchRow key={item.id} {...item} />
                  ))}
                </div>
              </section>

              <section className="space-y-3">
                <div>
                  <h3 className="font-medium">Tipos de notificación</h3>
                  <p className="text-sm text-muted-foreground">
                    Selecciona los eventos que quieres seguir.
                  </p>
                </div>
                <div className="space-y-2">
                  {notificationEvents.map((item) => (
                    <SwitchRow key={item.id} {...item} />
                  ))}
                </div>
              </section>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancelar
          </DialogClose>
          <DialogClose render={<Button />}>
            Guardar cambios
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
