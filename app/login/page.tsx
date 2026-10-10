import type { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "@/app/login/login-form";
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
  title: "Iniciar sesión | ARPA",
  description: "Accede a tu cuenta de ARPA",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-10 sm:px-6">
      <Card className="w-full max-w-2xl">
        <CardHeader className="gap-2 px-6 pt-8 sm:px-10 sm:pt-10">
          <CardTitle className="text-3xl">Iniciar sesión</CardTitle>
          <CardDescription>
            Ingresa tus datos para acceder a tu cuenta.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 sm:px-10">
          <LoginForm />
        </CardContent>

        <CardFooter className="justify-center gap-1 px-6 pb-8 sm:px-10 sm:pb-10">
          <CardDescription>¿Aún no tienes una cuenta?</CardDescription>
          <Button
            variant="link"
            className="h-auto px-1"
            nativeButton={false}
            render={<Link href="/signin" />}
          >
            Registrarse
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
