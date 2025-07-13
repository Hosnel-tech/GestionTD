import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function TeacherProfilePage() {
  return (
    <SidebarProvider>
      <AppSidebar userRole="teacher" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Profil enseignant</h1>
            <p className="text-sm text-muted-foreground">
              Gérez ici les informations de votre profil enseignant.
            </p>
          </div>
        </header>
        <div className="flex-1 p-6">
          {/* Informations du profil à compléter */}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
