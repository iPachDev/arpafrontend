"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  LoaderCircle,
  TriangleAlert,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ApiError = {
  message?: string | string[];
};

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

function getErrorMessage(error: ApiError): string {
  if (Array.isArray(error.message)) return error.message.join(" ");
  return error.message ?? "No pudimos iniciar sesión. Inténtalo nuevamente.";
}

function getSafeDestination(): string {
  const destination = new URLSearchParams(window.location.search).get("next");
  return destination?.startsWith("/") && !destination.startsWith("//")
    ? destination
    : "/home";
}

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });

      if (!response.ok) {
        const error = (await response.json().catch(() => ({}))) as ApiError;
        throw new Error(getErrorMessage(error));
      }

      router.replace(getSafeDestination());
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof TypeError
          ? "No pudimos conectar con el servidor. Inténtalo nuevamente."
          : error instanceof Error
            ? error.message
            : "No pudimos iniciar sesión. Inténtalo nuevamente.",
      );
      setIsLoading(false);
    }
  }

  return (
    <form className="grid gap-6" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="nombre@ejemplo.com"
          maxLength={254}
          disabled={isLoading}
          suppressHydrationWarning
          required
        />
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="password">Contraseña</Label>
          <Button
            variant="link"
            className="h-auto px-0"
            nativeButton={false}
            render={<Link href="/forgot-password" />}
          >
            ¿Olvidaste tu contraseña?
          </Button>
        </div>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Ingresa tu contraseña"
            minLength={8}
            maxLength={72}
            disabled={isLoading}
            className="pr-10"
            suppressHydrationWarning
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute right-0.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setShowPassword((visible) => !visible)}
            disabled={isLoading}
            aria-label={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
            aria-pressed={showPassword}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </Button>
        </div>
      </div>

      {errorMessage && (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>No se pudo iniciar sesión</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading && <LoaderCircle className="animate-spin" />}
        {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
      </Button>
    </form>
  );
}
