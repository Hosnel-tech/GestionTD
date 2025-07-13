"use client";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Badge } from "@/components/ui/badge";
import React, { useState } from "react";

const mockTDs = [
  {
    titre: "TD 1 - Fonctions",
    matiere: "Mathématiques",
    classe: "2nde A",
    date: "2024-05-10",
    duree: "2h",
    statut: "Terminé",
    paiement: "payé",
  },
  {
    titre: "TD 2 - Fonctions",
    matiere: "Physique",
    classe: "1ère S",
    date: "2024-05-12",
    duree: "1h30",
    statut: "Terminé",
    paiement: "non payé",
  },
  {
    titre: "TD 3 - Fonctions",
    matiere: "SVT",
    classe: "Terminale C",
    date: "2024-05-15",
    duree: "2h",
    statut: "Terminé",
    paiement: "payé",
  },
];

export default function TeacherFinancesPage() {
  const [filtrePaiement, setFiltrePaiement] = useState("tous");

  const tdsFiltres =
    filtrePaiement === "tous"
      ? mockTDs
      : mockTDs.filter((td) => td.paiement === filtrePaiement);

  return (
    <SidebarProvider>
      <AppSidebar userRole="teacher" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Finance</h1>
            <p className="text-sm text-muted-foreground">
              Retrouvez ici les TD liés aux finances.
            </p>
          </div>
        </header>
        <div className="flex-1 p-6">
          <div className="mb-4 flex items-center gap-2">
            <label htmlFor="filtre-paiement" className="font-medium">
              Filtrer par paiement :
            </label>
            <select
              id="filtre-paiement"
              className="border rounded px-2 py-1"
              value={filtrePaiement}
              onChange={(e) => setFiltrePaiement(e.target.value)}
            >
              <option value="tous">Tous</option>
              <option value="payé">Payé</option>
              <option value="non payé">Non payé</option>
            </select>
          </div>
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
                  <th className="px-4 py-2 border">Paiement</th>
                </tr>
              </thead>
              <tbody>
                {tdsFiltres.map((td, idx) => (
                  <tr key={idx} className="text-center">
                    <td className="px-4 py-2 border">{td.titre}</td>
                    <td className="px-4 py-2 border">{td.matiere}</td>
                    <td className="px-4 py-2 border">{td.classe}</td>
                    <td className="px-4 py-2 border">{td.date}</td>
                    <td className="px-4 py-2 border">{td.duree}</td>
                    <td className="px-4 py-2 border">
                      <Badge className="bg-green-500 text-white">Terminé</Badge>
                    </td>
                    <td className="px-4 py-2 border">
                      {td.paiement === "payé" ? (
                        <Badge className="bg-blue-500 text-white">Payé</Badge>
                      ) : (
                        <Badge variant="secondary">Non payé</Badge>
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
