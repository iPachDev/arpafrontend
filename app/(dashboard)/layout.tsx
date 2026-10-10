import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TooltipProvider>
      <SidebarProvider
        className="bg-[#f8f8f9] dark:bg-background"
        style={
          {
            "--sidebar-width": "18rem",
            "--sidebar-width-icon": "4rem",
          } as React.CSSProperties
        }
      >
        <a
          href="#contenido-principal"
          className="sr-only z-50 rounded-lg bg-background px-4 py-2 font-medium shadow-lg focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:ring-2 focus:ring-ring"
        >
          Saltar al contenido principal
        </a>
        <AppSidebar />
        <SidebarInset
          id="contenido-principal"
          tabIndex={-1}
          className="min-w-0 overflow-x-clip bg-[#f8f8f9] dark:bg-background"
        >
          <DashboardHeader />
          <div className="relative isolate flex flex-1">
            <div className="mx-auto w-full max-w-[100rem]">
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
