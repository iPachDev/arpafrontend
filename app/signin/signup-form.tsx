"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, LoaderCircle, TriangleAlert } from "lucide-react";
import {
  getCountryCallingCode,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type RequestStatus = "idle" | "loading" | "success" | "error";

type ApiError = {
  message?: string | string[];
};

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";
const defaultCountry: CountryCode = "MX";
const countries: Array<{
  code: CountryCode;
  flag: string;
  label: string;
}> = [
  { code: "MX", flag: "🇲🇽", label: "México" },
  { code: "US", flag: "🇺🇸", label: "Estados Unidos" },
  { code: "VE", flag: "🇻🇪", label: "Venezuela" },
  { code: "GT", flag: "🇬🇹", label: "Guatemala" },
];

function getErrorMessage(error: ApiError): string {
  if (Array.isArray(error.message)) {
    return error.message.join(" ");
  }

  return error.message ?? "No pudimos crear tu cuenta. Inténtalo nuevamente.";
}

export function SignupForm({
  invitationToken,
  invitedEmail,
}: {
  invitationToken?: string;
  invitedEmail?: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<RequestStatus>("idle");
  const [message, setMessage] = useState("");
  const [country, setCountry] = useState<CountryCode>(defaultCountry);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const nationalPhone = String(formData.get("nationalPhone") ?? "");
    const parsedPhone = parsePhoneNumberFromString(nationalPhone, country);

    if (!parsedPhone?.isValid()) {
      setStatus("error");
      setMessage(
        "Revisa el número de teléfono. Escribe únicamente el número correspondiente al país seleccionado.",
      );
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: parsedPhone.number,
          password: formData.get("password"),
        }),
      });

      if (!response.ok) {
        const error = (await response.json().catch(() => ({}))) as ApiError;
        throw new Error(getErrorMessage(error));
      }

      form.reset();
      setCountry(defaultCountry);
      setStatus("success");
      setMessage("Tu cuenta fue creada. Te llevaremos al inicio de sesión.");
      const next = invitationToken
        ? `/invitations/${encodeURIComponent(invitationToken)}`
        : undefined;
      const loginUrl = next
        ? `/login?registered=true&next=${encodeURIComponent(next)}`
        : "/login?registered=true";
      window.setTimeout(() => router.push(loginUrl), 1200);
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "No pudimos crear tu cuenta. Inténtalo nuevamente.",
      );
    }
  }

  const isLoading = status === "loading";

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Tu nombre completo"
          minLength={2}
          maxLength={100}
          disabled={isLoading}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="nombre@ejemplo.com"
          defaultValue={invitedEmail}
          readOnly={Boolean(invitedEmail)}
          maxLength={254}
          disabled={isLoading}
          required
        />
        {invitedEmail && (
          <p className="text-xs text-muted-foreground">
            Debes registrarte con el correo que recibió la invitación.
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="nationalPhone">Teléfono</Label>
        <div className="grid grid-cols-[6rem_minmax(0,1fr)] gap-2">
          <select
            id="phoneCountry"
            aria-label="País del teléfono"
            autoComplete="tel-country-code"
            value={country}
            onChange={(event) =>
              setCountry(event.target.value as CountryCode)
            }
            disabled={isLoading}
            className="h-8 w-24 rounded-lg border border-input bg-transparent px-2 text-center text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
          >
            {countries.map((countryOption) => (
              <option
                key={countryOption.code}
                value={countryOption.code}
                aria-label={countryOption.label}
              >
                {countryOption.flag} +{getCountryCallingCode(countryOption.code)}
              </option>
            ))}
          </select>
          <Input
            id="nationalPhone"
            name="nationalPhone"
            type="tel"
            autoComplete="tel-national"
            inputMode="tel"
            placeholder="55 1234 5678"
            aria-describedby="phone-help"
            disabled={isLoading}
            required
          />
        </div>
        <p id="phone-help" className="text-xs text-muted-foreground">
          El código +{getCountryCallingCode(country)} se agrega automáticamente.
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
          minLength={8}
          maxLength={72}
          disabled={isLoading}
          required
        />
      </div>

      {status === "error" && (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>No se pudo crear la cuenta</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {status === "success" && (
        <Alert>
          <CheckCircle2 />
          <AlertTitle>Cuenta creada</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        size="lg"
        className="mt-1 w-full"
        disabled={isLoading || status === "success"}
      >
        {isLoading && <LoaderCircle className="animate-spin" />}
        {isLoading ? "Creando cuenta..." : "Crear cuenta"}
      </Button>
    </form>
  );
}
