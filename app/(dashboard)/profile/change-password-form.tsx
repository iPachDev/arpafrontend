"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ApiError = { message?: string | string[] };
type PasswordFieldName =
  | "currentPassword"
  | "newPassword"
  | "confirmPassword";

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

function getErrorMessage(error: ApiError): string {
  if (Array.isArray(error.message)) return error.message.join(" ");
  return error.message ?? "No pudimos cambiar la contraseña.";
}

function PasswordField({
  id,
  label,
  autoComplete,
  minLength,
  visible,
  disabled,
  onToggle,
}: {
  id: PasswordFieldName;
  label: string;
  autoComplete: "current-password" | "new-password";
  minLength: number;
  visible: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          minLength={minLength}
          maxLength={72}
          disabled={disabled}
          className="pr-10"
          required
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="absolute right-0.5 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
          onClick={onToggle}
          disabled={disabled}
          aria-label={visible ? `Ocultar ${label.toLowerCase()}` : `Mostrar ${label.toLowerCase()}`}
          aria-pressed={visible}
        >
          {visible ? <EyeOff /> : <Eye />}
        </Button>
      </div>
    </div>
  );
}

export function ChangePasswordForm() {
  const router = useRouter();
  const [visibleFields, setVisibleFields] = useState<
    Record<PasswordFieldName, boolean>
  >({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  function toggleVisibility(field: PasswordFieldName) {
    setVisibleFields((current) => ({
      ...current,
      [field]: !current[field],
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    const currentPassword = String(formData.get("currentPassword") ?? "");
    const newPassword = String(formData.get("newPassword") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (newPassword !== confirmPassword) {
      setStatus("error");
      setMessage("Las contraseñas nuevas no coinciden.");
      return;
    }

    if (currentPassword === newPassword) {
      setStatus("error");
      setMessage("La nueva contraseña debe ser diferente a la actual.");
      return;
    }

    setIsSaving(true);
    setStatus("idle");

    try {
      const response = await fetch(`${apiUrl}/profile/password`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      if (!response.ok) {
        const error = (await response.json().catch(() => ({}))) as ApiError;
        const responseMessage = getErrorMessage(error);
        if (response.status === 401 && responseMessage.toLowerCase().includes("sesión")) {
          router.replace("/login?next=/profile");
          return;
        }
        throw new Error(responseMessage);
      }

      formElement.reset();
      setVisibleFields({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
      });
      setStatus("success");
      setMessage(
        "Tu contraseña se actualizó y las demás sesiones fueron cerradas.",
      );
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "No pudimos cambiar la contraseña.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck className="size-5" />
          </span>
          <div className="grid gap-1">
            <CardTitle>Seguridad</CardTitle>
            <CardDescription>
              Cambia tu contraseña y protege el acceso a tu cuenta.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form className="grid gap-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-3">
            <PasswordField
              id="currentPassword"
              label="Contraseña actual"
              autoComplete="current-password"
              minLength={8}
              visible={visibleFields.currentPassword}
              disabled={isSaving}
              onToggle={() => toggleVisibility("currentPassword")}
            />
            <PasswordField
              id="newPassword"
              label="Nueva contraseña"
              autoComplete="new-password"
              minLength={12}
              visible={visibleFields.newPassword}
              disabled={isSaving}
              onToggle={() => toggleVisibility("newPassword")}
            />
            <PasswordField
              id="confirmPassword"
              label="Confirmar contraseña"
              autoComplete="new-password"
              minLength={12}
              visible={visibleFields.confirmPassword}
              disabled={isSaving}
              onToggle={() => toggleVisibility("confirmPassword")}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            Usa al menos 12 caracteres. Al guardar, las demás sesiones se cerrarán por seguridad.
          </p>

          {status !== "idle" && (
            <Alert
              className={
                status === "success"
                  ? "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200 [&_[data-slot=alert-description]]:text-emerald-800 dark:[&_[data-slot=alert-description]]:text-emerald-300"
                  : "border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200 [&_[data-slot=alert-description]]:text-red-800 dark:[&_[data-slot=alert-description]]:text-red-300"
              }
            >
              {status === "success" ? <CheckCircle2 /> : <TriangleAlert />}
              <AlertTitle>
                {status === "success"
                  ? "Contraseña actualizada"
                  : "No se cambió la contraseña"}
              </AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSaving}
              className="w-full cursor-pointer sm:w-auto"
            >
              {isSaving ? (
                <LoaderCircle className="animate-spin motion-reduce:animate-none" />
              ) : (
                <KeyRound />
              )}
              {isSaving ? "Actualizando..." : "Cambiar contraseña"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

