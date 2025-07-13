import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import React from "react";
import { Badge } from "@/components/ui/badge";

const mockTDs = [
  {
    titre: "TD 1 - Fonctions",
    matiere: "Mathématiques",
    classe: "2nde A",
    date: "2024-05-10",
    duree: "2h",
    statut: "En cours",
  },
  {
    titre: "TD 2 - Fonctions",
    matiere: "Physique",
    classe: "1ère S",
    date: "2024-05-12",
    duree: "1h30",
    statut: "En cours",
  },
  {
    titre: "TD 3 - Fonctions",
    matiere: "SVT",
    classe: "Terminale C",
    date: "2024-05-15",
    duree: "2h",
    statut: "En cours",
  },
];

export default function TeacherTDPage() {
  return (
    <SidebarProvider>
      <AppSidebar userRole="teacher" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Mes Travaux Dirigés</h1>
            <p className="text-sm text-muted-foreground">
              Retrouvez ici tous vos TD à gérer en tant qu'enseignant.
            </p>
          </div>
        </header>
        <div className="flex-1 p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border">Titre</th>
                  <th className="px-4 py-2 border">Matière</th>
                  <th className="px-4 py-2 border">Classe</th>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Durée</th>
                  <th className="px-4 py-2 border">Statut</th>
                </tr>
              </thead>
              <tbody>
                {mockTDs.map((td, idx) => (
                  <tr key={idx} className="text-center">
                    <td className="px-4 py-2 border">{td.titre}</td>
                    <td className="px-4 py-2 border">{td.matiere}</td>
                    <td className="px-4 py-2 border">{td.classe}</td>
                    <td className="px-4 py-2 border">{td.date}</td>
                    <td className="px-4 py-2 border">{td.duree}</td>
                    <td className="px-4 py-2 border">
                      {td.statut === "En cours" && (
                        <Badge className="bg-blue-500 text-white">
                          En cours
                        </Badge>
                      )}
                      {td.statut === "En attente" && (
                        <Badge variant="secondary">En attente</Badge>
                      )}
                      {td.statut === "Terminé" && (
                        <Badge className="bg-green-500 text-white">
                          Terminé
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
