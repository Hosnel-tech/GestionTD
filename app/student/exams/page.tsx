import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function StudentExamsPage() {
  return (
    <SidebarProvider>
      <AppSidebar userRole="student" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Épreuves</h1>
            <p className="text-sm text-muted-foreground">
              Téléchargez vos épreuves de TD ici.
            </p>
          </div>
        </header>
        <div className="flex-1 p-6">{/* Liste des épreuves à compléter */}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
