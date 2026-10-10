import type { Metadata } from "next";

import { ProfileForm } from "@/app/(dashboard)/profile/profile-form";

export const metadata: Metadata = {
  title: "Mi perfil | ARPA",
  description: "Administra tu información personal y gustos en ARPA",
};

export default function ProfilePage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <ProfileForm />
    </main>
  );
}
