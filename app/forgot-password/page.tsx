import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
  title: "Olvidé mi contraseña | ARPA",
  description: "Recupera el acceso a tu cuenta de ARPA",
};

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-10 sm:px-6">
      <Card className="w-full max-w-2xl">
        <CardHeader className="gap-2 px-6 pt-8 sm:px-10 sm:pt-10">
          <CardTitle className="text-3xl">Olvidé mi contraseña</CardTitle>
          <CardDescription>
            Ingresa tu correo electrónico y te enviaremos instrucciones para
            recuperar tu cuenta.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 sm:px-10">
          <form className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="nombre@ejemplo.com"
                required
              />
            </div>

            <Button type="submit" size="lg" className="w-full">
              Enviar instrucciones
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center px-6 pb-8 sm:px-10 sm:pb-10">
          <Button
            variant="link"
            className="h-auto px-1"
            nativeButton={false}
            render={<Link href="/login" />}
          >
            Volver a iniciar sesión
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
