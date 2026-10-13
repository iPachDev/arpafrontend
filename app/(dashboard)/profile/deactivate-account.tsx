"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Trash2, TriangleAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CollapsibleSettingsCard } from "@/components/collapsible-settings-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ApiError = { message?: string | string[] };

const confirmationPhrase = "eliminar cuenta";
const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

function errorMessage(error: ApiError): string {
  if (Array.isArray(error.message)) return error.message.join(" ");
  return error.message ?? "No pudimos dar de baja tu cuenta.";
}

export function DeactivateAccount() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [message, setMessage] = useState("");

  async function deactivate() {
    if (confirmation !== confirmationPhrase) return;

    setIsDeactivating(true);
    setMessage("");

    try {
      const response = await fetch(`${apiUrl}/profile`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmation }),
      });

      if (!response.ok) {
        const error = (await response.json().catch(() => ({}))) as ApiError;
        throw new Error(errorMessage(error));
      }

      router.replace("/login?account=disabled");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "No pudimos dar de baja tu cuenta.",
      );
      setIsDeactivating(false);
    }
  }

  return (
    <CollapsibleSettingsCard
      danger
      title="Zona de peligro"
      description="La baja cerrará todas tus sesiones y ya no podrás iniciar sesión."
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="font-medium text-red-900 dark:text-red-200">
            Dar de baja la cuenta
          </p>
          <p className="text-sm text-red-800 dark:text-red-300">
            Tu cuenta quedará desactivada.
          </p>
        </div>

        <AlertDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            if (isDeactivating) return;
            setDialogOpen(open);
            if (!open) {
              setConfirmation("");
              setMessage("");
            }
          }}
        >
          <AlertDialogTrigger
            render={<Button variant="destructive" className="cursor-pointer" />}
          >
            <Trash2 /> Dar de baja
          </AlertDialogTrigger>

          <AlertDialogContent className="sm:max-w-md">
            <AlertDialogHeader>
              <AlertDialogMedia className="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                <TriangleAlert />
              </AlertDialogMedia>
              <AlertDialogTitle>Dar de baja mi cuenta</AlertDialogTitle>
              <AlertDialogDescription>
                Se cerrarán todas tus sesiones y ya no podrás iniciar sesión.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-2">
              <Label htmlFor="deactivate-account-confirmation">
                Escribe{" "}
                <span className="font-semibold text-foreground">
                  {confirmationPhrase}
                </span>{" "}
                para confirmar
              </Label>
              <Input
                id="deactivate-account-confirmation"
                value={confirmation}
                onChange={(event) => {
                  setConfirmation(event.target.value);
                  setMessage("");
                }}
                autoComplete="off"
                disabled={isDeactivating}
                placeholder={confirmationPhrase}
              />
            </div>

            {message && (
              <Alert className="border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200">
                <TriangleAlert />
                <AlertTitle>No se pudo dar de baja la cuenta</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={isDeactivating}
                className="cursor-pointer"
              >
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                className="cursor-pointer"
                disabled={confirmation !== confirmationPhrase || isDeactivating}
                onClick={() => void deactivate()}
              >
                {isDeactivating && (
                  <LoaderCircle className="animate-spin motion-reduce:animate-none" />
                )}
                {isDeactivating ? "Dando de baja..." : "Confirmar baja"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </CollapsibleSettingsCard>
  );
}
