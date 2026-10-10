import { ProfileSkeleton } from "@/app/(dashboard)/profile/profile-skeleton";

export default function ProfileLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <ProfileSkeleton />
    </main>
  );
}

