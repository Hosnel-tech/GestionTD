import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function AdminSettingsPage() {
  return (
    <SidebarProvider>
      <AppSidebar userRole="admin" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Paramètres Admin</h1>
            <p className="text-sm text-muted-foreground">
              Bienvenue sur la page des paramètres administrateur.
            </p>
          </div>
        </header>
        <div className="flex-1 p-6">{/* Contenu des paramètres ici */}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
