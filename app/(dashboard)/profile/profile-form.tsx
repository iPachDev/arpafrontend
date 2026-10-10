"use client";

import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  CheckCircle2,
  LoaderCircle,
  LockKeyhole,
  Save,
  TriangleAlert,
  UserRound,
} from "lucide-react";
import {
  getCountryCallingCode,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ChangePasswordForm } from "@/app/(dashboard)/profile/change-password-form";
import { ProfileSkeleton } from "@/app/(dashboard)/profile/profile-skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Textarea } from "@/components/ui/textarea";

type RacingInterest =
  | "karting"
  | "formula"
  | "gt"
  | "rally"
  | "off-road"
  | "sim-racing";

type Profile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  alias: string | null;
  bio: string | null;
  city: string | null;
  country: string | null;
  racingNumber: number | null;
  favoriteCategories: RacingInterest[];
  favoriteDriver: string | null;
  favoriteTrack: string | null;
  avatarUrl: string | null;
  coverUrl: string | null;
};

type FormState = Omit<Profile, "id" | "phone" | "racingNumber"> & {
  racingNumber: string;
};

type ApiError = { message?: string | string[] };

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

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

const interests: Array<{ value: RacingInterest; label: string }> = [
  { value: "karting", label: "Karting" },
  { value: "formula", label: "Fórmula" },
  { value: "gt", label: "GT" },
  { value: "rally", label: "Rally" },
  { value: "off-road", label: "Off-road" },
  { value: "sim-racing", label: "Sim racing" },
];

const emptyForm: FormState = {
  name: "",
  email: "",
  alias: null,
  bio: null,
  city: null,
  country: null,
  racingNumber: "",
  favoriteCategories: [],
  favoriteDriver: null,
  favoriteTrack: null,
  avatarUrl: null,
  coverUrl: null,
};

function nullable(value: string | null): string | null {
  const trimmed = value?.trim() ?? "";
  return trimmed || null;
}

function errorMessage(error: ApiError): string {
  if (Array.isArray(error.message)) return error.message.join(" ");
  return error.message ?? "No pudimos guardar los cambios.";
}

export function ProfileForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [phoneCountry, setPhoneCountry] = useState<CountryCode>("MX");
  const [nationalPhone, setNationalPhone] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProfile() {
      try {
        const response = await fetch(`${apiUrl}/profile`, {
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        });

        if (response.status === 401) {
          router.replace("/login?next=/profile");
          return;
        }
        if (!response.ok) throw new Error("No pudimos cargar tu perfil.");

        const profile = (await response.json()) as Profile;
        const parsedPhone = parsePhoneNumberFromString(profile.phone);
        setForm({
          ...profile,
          racingNumber: profile.racingNumber?.toString() ?? "",
        });
        if (parsedPhone?.country) setPhoneCountry(parsedPhone.country);
        setNationalPhone(parsedPhone?.nationalNumber ?? profile.phone);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setStatus("error");
          setMessage("No pudimos cargar tu perfil.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    void loadProfile();
    return () => controller.abort();
  }, [router]);

  useEffect(
    () => () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    },
    [avatarPreview],
  );

  useEffect(
    () => () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    },
    [coverPreview],
  );

  function updateField<K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
    setStatus("idle");
  }

  function toggleInterest(interest: RacingInterest) {
    updateField(
      "favoriteCategories",
      form.favoriteCategories.includes(interest)
        ? form.favoriteCategories.filter((item) => item !== interest)
        : [...form.favoriteCategories, interest],
    );
  }

  function selectImage(
    event: ChangeEvent<HTMLInputElement>,
    setter: (value: string | null) => void,
  ) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      setStatus("error");
      setMessage("Selecciona una imagen válida de máximo 5 MB.");
      return;
    }
    setter(URL.createObjectURL(file));
    setStatus("idle");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedPhone = parsePhoneNumberFromString(
      nationalPhone,
      phoneCountry,
    );
    if (!parsedPhone?.isValid()) {
      setStatus("error");
      setMessage("Revisa el número de teléfono.");
      return;
    }

    setIsSaving(true);
    setStatus("idle");

    try {
      const response = await fetch(`${apiUrl}/profile`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          alias: nullable(form.alias),
          phone: parsedPhone.number,
          bio: nullable(form.bio),
          city: nullable(form.city),
          country: nullable(form.country),
          racingNumber: form.racingNumber
            ? Number(form.racingNumber)
            : null,
          favoriteCategories: form.favoriteCategories,
          favoriteDriver: nullable(form.favoriteDriver),
          favoriteTrack: nullable(form.favoriteTrack),
        }),
      });

      if (response.status === 401) {
        router.replace("/login?next=/profile");
        return;
      }
      if (!response.ok) {
        const error = (await response.json().catch(() => ({}))) as ApiError;
        throw new Error(errorMessage(error));
      }

      setStatus("success");
      setMessage("Tu perfil se actualizó correctamente.");
      router.refresh();
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "No pudimos guardar los cambios.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  const initials =
    form.name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "AR";

  return (
    <div className="grid gap-6">
      <form className="grid gap-6" onSubmit={handleSubmit}>
      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div
          className="relative h-40 bg-gradient-to-br from-[#ff3630] via-[#d91f1a] to-[#3b1514] sm:h-52"
          style={
            coverPreview || form.coverUrl
              ? {
                  backgroundImage: `url(${coverPreview ?? form.coverUrl})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }
              : undefined
          }
        >
          <Label
            htmlFor="coverPhoto"
            className="absolute right-4 top-4 inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-background/90 px-3 text-sm font-medium text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background focus-within:ring-2 focus-within:ring-ring"
          >
            <Camera className="size-4" /> Cambiar portada
          </Label>
          <Input
            id="coverPhoto"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            onChange={(event) => selectImage(event, setCoverPreview)}
          />
        </div>

        <div className="relative px-5 pb-5 sm:px-8 sm:pb-7">
          <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end">
            <div className="relative w-fit">
              <Avatar className="size-24 border-4 border-card shadow-md sm:size-28">
                {(avatarPreview || form.avatarUrl) && (
                  <AvatarImage
                    src={avatarPreview ?? form.avatarUrl ?? undefined}
                    alt={`Foto de ${form.name}`}
                  />
                )}
                <AvatarFallback className="bg-muted text-xl font-semibold">
                  {initials || <UserRound />}
                </AvatarFallback>
              </Avatar>
              <Label
                htmlFor="avatarPhoto"
                aria-label="Cambiar foto de perfil"
                className="absolute bottom-0 right-0 flex size-9 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm ring-2 ring-card transition-colors hover:bg-primary/80 focus-within:ring-4 focus-within:ring-ring"
              >
                <Camera className="size-4" />
              </Label>
              <Input
                id="avatarPhoto"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={(event) => selectImage(event, setAvatarPreview)}
              />
            </div>

            <div className="min-w-0 pb-1">
              <h1 className="truncate text-2xl font-semibold tracking-tight">
                {form.alias ? `@${form.alias}` : form.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                Personaliza cómo te ven dentro de ARPA.
              </p>
            </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Las fotografías son una vista previa local y todavía no se guardan.
          </p>
        </div>
      </section>

      {status !== "idle" && (
        <Alert
          className={
            status === "success"
              ? "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200 [&_[data-slot=alert-description]]:text-emerald-800 dark:[&_[data-slot=alert-description]]:text-emerald-300"
              : "border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200 [&_[data-slot=alert-description]]:text-red-800 dark:[&_[data-slot=alert-description]]:text-red-300"
          }
        >
          {status === "error" ? <TriangleAlert /> : <CheckCircle2 />}
          <AlertTitle>
            {status === "error" ? "No se guardaron los cambios" : "Perfil actualizado"}
          </AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(19rem,0.85fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Información personal</CardTitle>
            <CardDescription>
              Tu correo identifica la cuenta y no puede editarse aquí.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="profileName">Nombre</Label>
              <Input
                id="profileName"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                minLength={2}
                maxLength={100}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="profileAlias">Alias</Label>
              <Input
                id="profileAlias"
                value={form.alias ?? ""}
                onChange={(event) => updateField("alias", event.target.value)}
                placeholder="ipach"
                maxLength={30}
                pattern="[a-zA-Z0-9._-]+"
              />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="profileEmail">Correo electrónico</Label>
              <div className="relative">
                <Input
                  id="profileEmail"
                  value={form.email}
                  className="pr-10"
                  disabled
                  readOnly
                  suppressHydrationWarning
                />
                <LockKeyhole className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="profilePhone">Teléfono</Label>
              <div className="grid grid-cols-[6rem_minmax(0,1fr)] gap-2">
                <select
                  aria-label="País del teléfono"
                  value={phoneCountry}
                  onChange={(event) =>
                    setPhoneCountry(event.target.value as CountryCode)
                  }
                  className="h-8 w-24 rounded-lg border border-input bg-transparent px-2 text-center text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                >
                  {countries.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.flag} +{getCountryCallingCode(item.code)}
                    </option>
                  ))}
                </select>
                <Input
                  id="profilePhone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  value={nationalPhone}
                  onChange={(event) => setNationalPhone(event.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <div className="flex items-center justify-between gap-4">
                <Label htmlFor="profileBio">Acerca de ti</Label>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {(form.bio ?? "").length}/280
                </span>
              </div>
              <Textarea
                id="profileBio"
                value={form.bio ?? ""}
                onChange={(event) => updateField("bio", event.target.value)}
                placeholder="Cuéntanos un poco sobre tu relación con el automovilismo."
                maxLength={280}
                className="min-h-28 resize-y"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="profileCity">Ciudad</Label>
              <Input
                id="profileCity"
                value={form.city ?? ""}
                onChange={(event) => updateField("city", event.target.value)}
                placeholder="Ciudad de México"
                maxLength={80}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="profileCountry">País</Label>
              <Input
                id="profileCountry"
                value={form.country ?? ""}
                onChange={(event) => updateField("country", event.target.value)}
                placeholder="México"
                maxLength={80}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="racingNumber">Número de competencia</Label>
              <Input
                id="racingNumber"
                type="number"
                inputMode="numeric"
                min={1}
                max={999}
                value={form.racingNumber}
                onChange={(event) =>
                  updateField("racingNumber", event.target.value)
                }
                placeholder="27"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Gustos</CardTitle>
            <CardDescription>
              Ayúdanos a recomendarte eventos relevantes.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <fieldset className="grid gap-2">
              <legend className="mb-2 text-sm font-medium">Categorías favoritas</legend>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => {
                  const selected = form.favoriteCategories.includes(
                    interest.value,
                  );
                  return (
                    <Button
                      key={interest.value}
                      type="button"
                      size="sm"
                      variant={selected ? "secondary" : "outline"}
                      aria-pressed={selected}
                      onClick={() => toggleInterest(interest.value)}
                      className="cursor-pointer"
                    >
                      {interest.label}
                    </Button>
                  );
                })}
              </div>
            </fieldset>
            <div className="grid gap-2">
              <Label htmlFor="favoriteDriver">Piloto favorito</Label>
              <Input
                id="favoriteDriver"
                value={form.favoriteDriver ?? ""}
                onChange={(event) =>
                  updateField("favoriteDriver", event.target.value)
                }
                placeholder="Ayrton Senna"
                maxLength={100}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="favoriteTrack">Circuito favorito</Label>
              <Input
                id="favoriteTrack"
                value={form.favoriteTrack ?? ""}
                onChange={(event) =>
                  updateField("favoriteTrack", event.target.value)
                }
                placeholder="Autódromo Hermanos Rodríguez"
                maxLength={100}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="sticky bottom-4 z-10 flex justify-end">
        <Button
          type="submit"
          size="lg"
          disabled={isSaving}
          className="min-w-40 cursor-pointer shadow-lg"
        >
          {isSaving ? <LoaderCircle className="animate-spin" /> : <Save />}
          {isSaving ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
      </form>

      <ChangePasswordForm />
    </div>
  );
}
