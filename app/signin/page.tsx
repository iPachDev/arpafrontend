import type { Metadata } from "next";
import Link from "next/link";

import { SignupForm } from "@/app/signin/signup-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Crear cuenta | ARPA",
  description: "Regístrate en ARPA",
};

export default async function SigninPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const invitationToken =
    typeof query.invitation === "string" ? query.invitation : undefined;
  const invitedEmail =
    typeof query.email === "string" ? query.email : undefined;

  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-10 sm:px-6">
      <Card className="w-full max-w-2xl">
        <CardHeader className="gap-2 px-6 pt-8 sm:px-10 sm:pt-10">
          <CardTitle className="text-3xl">Crear una cuenta</CardTitle>
          <CardDescription>
            Completa tus datos para registrarte en ARPA.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 sm:px-10">
          <SignupForm
            invitationToken={invitationToken}
            invitedEmail={invitedEmail}
          />
        </CardContent>

        <CardFooter className="justify-center gap-1 px-6 pb-8 sm:px-10 sm:pb-10">
          <CardDescription>¿Ya tienes una cuenta?</CardDescription>
          <Button
            variant="link"
            className="h-auto px-1"
            nativeButton={false}
            render={
              <Link
                href={
                  invitationToken
                    ? `/login?next=${encodeURIComponent(`/invitations/${invitationToken}`)}`
                    : "/login"
                }
              />
            }
          >
            Iniciar sesión
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
