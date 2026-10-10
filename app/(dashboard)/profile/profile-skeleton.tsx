import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function FieldSkeleton({ wide = false }: { wide?: boolean }) {
  return (
    <div className={wide ? "grid gap-2 sm:col-span-2" : "grid gap-2"}>
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-full rounded-lg" />
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Cargando información del perfil"
      className="grid gap-6 [&_[data-slot=skeleton]]:motion-reduce:animate-none"
    >
      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <Skeleton className="h-40 w-full rounded-none sm:h-52" />
        <div className="relative px-5 pb-5 sm:px-8 sm:pb-7">
          <div className="-mt-12 flex items-end gap-4 sm:-mt-14">
            <Skeleton className="size-24 shrink-0 rounded-full border-4 border-card sm:size-28" />
            <div className="grid flex-1 gap-2 pb-2">
              <Skeleton className="h-7 w-36 sm:w-48" />
              <Skeleton className="h-4 w-full max-w-72" />
            </div>
          </div>
          <Skeleton className="mt-4 h-3 w-64 max-w-full" />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(19rem,0.85fr)]">
        <Card>
          <CardHeader className="grid gap-2">
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-4 w-full max-w-md" />
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <FieldSkeleton />
            <FieldSkeleton />
            <FieldSkeleton wide />
            <FieldSkeleton wide />
            <div className="grid gap-2 sm:col-span-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-28 w-full rounded-lg" />
            </div>
            <FieldSkeleton />
            <FieldSkeleton />
            <FieldSkeleton />
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader className="grid gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="grid gap-5">
            <div className="grid gap-3">
              <Skeleton className="h-4 w-32" />
              <div className="flex flex-wrap gap-2">
                {[5, 6, 4, 5].map((width, index) => (
                  <Skeleton
                    key={index}
                    className="h-8 rounded-lg"
                    style={{ width: `${width}rem` }}
                  />
                ))}
              </div>
            </div>
            <FieldSkeleton />
            <FieldSkeleton />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>

      <Card>
        <CardHeader className="grid gap-2">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-4 w-full max-w-md" />
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-3">
          <FieldSkeleton />
          <FieldSkeleton />
          <FieldSkeleton />
        </CardContent>
      </Card>
      <span className="sr-only">Cargando información del perfil...</span>
    </div>
  );
}
