"use client";

import { type FormEvent, useEffect, useState } from "react";
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

type PendingVerification = {
  email: string;
  sentAt: number;
  invitationToken?: string;
};

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";
const pendingVerificationKey = "arpa_pending_email_verification";
const resendCooldownSeconds = 60;
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
  const [errorTitle, setErrorTitle] = useState("");
  const [country, setCountry] = useState<CountryCode>(defaultCountry);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [verificationInvitationToken, setVerificationInvitationToken] =
    useState(invitationToken);
  const [secondsUntilResend, setSecondsUntilResend] = useState(0);
  const [recoveryMode, setRecoveryMode] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(pendingVerificationKey);
      if (!stored) return;

      const pending = JSON.parse(stored) as Partial<PendingVerification>;
      if (typeof pending.email !== "string" || !pending.email) return;

      const timer = window.setTimeout(() => {
        setVerificationEmail(pending.email as string);
        setVerificationInvitationToken(
          typeof pending.invitationToken === "string"
            ? pending.invitationToken
            : invitationToken,
        );
        setSecondsUntilResend(
          Math.max(
            0,
            Math.ceil(
              ((typeof pending.sentAt === "number" ? pending.sentAt : 0) +
                resendCooldownSeconds * 1000 -
                Date.now()) /
                1000,
            ),
          ),
        );
        setMessage(
          "Retomamos tu registro pendiente. Ingresa el código que recibiste o solicita uno nuevo.",
        );
      }, 0);

      return () => window.clearTimeout(timer);
    } catch {
      sessionStorage.removeItem(pendingVerificationKey);
    }
  }, [invitationToken]);

  useEffect(() => {
    if (secondsUntilResend <= 0) return;
    const timer = window.setTimeout(
      () => setSecondsUntilResend((seconds) => Math.max(0, seconds - 1)),
      1000,
    );
    return () => window.clearTimeout(timer);
  }, [secondsUntilResend]);

  function rememberPendingVerification(email: string, sentAt = Date.now()) {
    const pending: PendingVerification = {
      email,
      sentAt,
      ...(invitationToken ? { invitationToken } : {}),
    };
    sessionStorage.setItem(pendingVerificationKey, JSON.stringify(pending));
    setVerificationInvitationToken(invitationToken);
  }

  function clearPendingVerification() {
    sessionStorage.removeItem(pendingVerificationKey);
    setVerificationEmail("");
    setVerificationComplete(false);
    setVerificationInvitationToken(invitationToken);
    setSecondsUntilResend(0);
    setRecoveryMode(false);
    setStatus("idle");
    setMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    setErrorTitle("No se pudo crear la cuenta");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
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
        if (response.status === 502 || response.status === 503) {
          rememberPendingVerification(email, 0);
          setVerificationEmail(email);
          setStatus("error");
          setErrorTitle("No pudimos enviar el código");
          setMessage(
            "Tu cuenta quedó creada, pero el correo no pudo enviarse. Usa Reenviar código para intentarlo nuevamente.",
          );
          return;
        }
        throw new Error(getErrorMessage(error));
      }

      form.reset();
      setCountry(defaultCountry);
      rememberPendingVerification(email);
      setVerificationEmail(email);
      setSecondsUntilResend(resendCooldownSeconds);
      setStatus("idle");
      setMessage(
        "Te enviamos un código de 6 dígitos. Escríbelo para activar tu cuenta.",
      );
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "No pudimos crear tu cuenta. Inténtalo nuevamente.",
      );
    }
  }

  async function handleVerification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    setErrorTitle("No se pudo confirmar la cuenta");

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch(`${apiUrl}/users/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: verificationEmail,
          code: formData.get("code"),
        }),
      });

      if (!response.ok) {
        const error = (await response.json().catch(() => ({}))) as ApiError;
        throw new Error(getErrorMessage(error));
      }

      setVerificationComplete(true);
      sessionStorage.removeItem(pendingVerificationKey);
      setStatus("success");
      setMessage("Tu correo fue confirmado. Te llevaremos al inicio de sesión.");
      const next = verificationInvitationToken
        ? `/invitations/${encodeURIComponent(verificationInvitationToken)}`
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

  async function handleResend() {
    setStatus("loading");
    setMessage("");
    setErrorTitle("No se pudo reenviar el código");

    try {
      const response = await fetch(`${apiUrl}/users/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: verificationEmail }),
      });

      if (!response.ok) {
        const error = (await response.json().catch(() => ({}))) as ApiError;
        throw new Error(getErrorMessage(error));
      }

      setStatus("success");
      setMessage("Enviamos un código nuevo a tu correo.");
      rememberPendingVerification(verificationEmail);
      setSecondsUntilResend(resendCooldownSeconds);
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "No pudimos reenviar el código. Inténtalo nuevamente.",
      );
    }
  }

  function handleRecovery(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("recoveryEmail") ?? "")
      .trim()
      .toLowerCase();
    rememberPendingVerification(email, 0);
    setVerificationEmail(email);
    setRecoveryMode(false);
    setStatus("idle");
    setMessage("Ingresa el código que recibiste o solicita uno nuevo.");
  }

  const isLoading = status === "loading";

  if (recoveryMode && !verificationEmail) {
    return (
      <form className="grid gap-5" onSubmit={handleRecovery}>
        <div className="grid gap-2 text-center">
          <h2 className="text-xl font-semibold">Retomar verificación</h2>
          <p className="text-sm text-muted-foreground">
            Escribe el correo con el que comenzaste tu registro.
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="recovery-email">Correo electrónico</Label>
          <Input
            id="recovery-email"
            name="recoveryEmail"
            type="email"
            autoComplete="email"
            defaultValue={invitedEmail}
            maxLength={254}
            autoFocus
            required
          />
        </div>

        <Button type="submit" size="lg" className="w-full">
          Continuar con mi código
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => setRecoveryMode(false)}
        >
          Volver al registro
        </Button>
      </form>
    );
  }

  if (verificationEmail) {
    return (
      <form className="grid gap-5" onSubmit={handleVerification}>
        <div className="grid gap-2 text-center">
          <h2 className="text-xl font-semibold">Confirma tu correo</h2>
          <p className="text-sm text-muted-foreground">
            Enviamos el código a <strong>{verificationEmail}</strong>.
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="verification-code">Código de verificación</Label>
          <Input
            id="verification-code"
            name="code"
            type="text"
            autoComplete="one-time-code"
            inputMode="numeric"
            pattern="[0-9]{6}"
            minLength={6}
            maxLength={6}
            placeholder="123456"
            className="h-14 text-center text-2xl font-semibold tracking-[0.35em]"
            disabled={isLoading || verificationComplete}
            autoFocus
            required
          />
          <p className="text-xs text-muted-foreground">
            El código vence en 10 minutos.
          </p>
        </div>

        {message && status !== "error" && (
          <Alert>
            <CheckCircle2 />
            <AlertTitle>
              {verificationComplete ? "Cuenta confirmada" : "Revisa tu correo"}
            </AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {status === "error" && (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>{errorTitle}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isLoading || verificationComplete}
        >
          {isLoading && <LoaderCircle className="animate-spin" />}
          {isLoading ? "Confirmando..." : "Confirmar cuenta"}
        </Button>

        {!verificationComplete && (
          <Button
            type="button"
            variant="ghost"
            onClick={handleResend}
            disabled={isLoading || secondsUntilResend > 0}
          >
            {secondsUntilResend > 0
              ? `Reenviar código (${secondsUntilResend}s)`
              : "Reenviar código"}
          </Button>
        )}
        {!verificationComplete && (
          <Button
            type="button"
            variant="link"
            onClick={clearPendingVerification}
            disabled={isLoading}
          >
            Usar otro correo
          </Button>
        )}
      </form>
    );
  }

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
          <AlertTitle>{errorTitle}</AlertTitle>
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

      <Button
        type="button"
        variant="ghost"
        onClick={() => setRecoveryMode(true)}
        disabled={isLoading}
      >
        Ya tengo un código de verificación
      </Button>
    </form>
  );
}
