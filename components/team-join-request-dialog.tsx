"use client";

import { FormEvent, useState } from "react";
import { Check, Send, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function TeamJoinRequestDialog({ teamName }: { teamName: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [requested, setRequested] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRequested(true);
    setOpen(false);
  }

  if (requested) {
    return (
      <Button variant="secondary" disabled>
        <Check data-icon="inline-start" /> Solicitud enviada
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <UserPlus data-icon="inline-start" /> Solicitar unirme
      </DialogTrigger>
      <DialogContent className="bg-background sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Solicitar unirme al equipo</DialogTitle>
            <DialogDescription>
              Tu solicitud será enviada a los administradores de {teamName}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-5">
            <Label htmlFor="join-request-reason">
              ¿Por qué quieres formar parte del equipo?
            </Label>
            <Textarea
              id="join-request-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Cuéntales sobre tu experiencia, objetivos y cómo te gustaría participar."
              rows={5}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              <Send data-icon="inline-start" /> Enviar solicitud
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
