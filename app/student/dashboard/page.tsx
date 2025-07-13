"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, Download, Clock } from "lucide-react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import React, { useState } from "react";

export default function StudentDashboard() {
  const stats = [
    {
      title: "TD cette semaine",
      value: "4",
      icon: Calendar,
      color: "bg-blue-500",
    },
    {
      title: "TD terminés",
      value: "12",
      icon: BookOpen,
      color: "bg-green-500",
    },
    {
      title: "Épreuves disponibles",
      value: "8",
      icon: Download,
      color: "bg-purple-500",
    },
    { title: "Prochains TD", value: "2", icon: Clock, color: "bg-orange-500" },
  ];

  const tdList = [
    {
      id: 1,
      subject: "Mathématiques",
      teacher: "M. Kouassi Jean",
      date: "2024-01-20",
      time: "14:00",
      duration: "2h",
      status: "confirme",
      hasExam: true,
      examDownloaded: false,
    },
    {
      id: 2,
      subject: "Français",
      teacher: "Mme Diabaté Marie",
      date: "2024-01-22",
      time: "10:00",
      duration: "3h",
      status: "en_attente",
      hasExam: false,
      examDownloaded: false,
    },
    {
      id: 3,
      subject: "Sciences",
      teacher: "M. Traoré Paul",
      date: "2024-01-15",
      time: "15:00",
      duration: "1h30",
      status: "termine",
      hasExam: true,
      examDownloaded: false,
    },
    {
      id: 4,
      subject: "Histoire",
      teacher: "Mme Koné Fatou",
      date: "2024-01-12",
      time: "16:00",
      duration: "2h",
      status: "termine",
      hasExam: true,
      examDownloaded: true,
    },
  ];

  const [selectedDate, setSelectedDate] = useState<string>("");

  // Filtrer les TD selon la date sélectionnée
  const filteredTD = selectedDate
    ? tdList.filter((td) => td.date === selectedDate)
    : tdList;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "en_attente":
        return <Badge variant="secondary">En attente</Badge>;
      case "confirme":
        return <Badge variant="default">Confirmé</Badge>;
      case "en_cours":
        return <Badge className="bg-orange-500">En cours</Badge>;
      case "termine":
        return (
          <Badge variant="outline" className="text-green-600">
            Terminé
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleDownloadExam = (tdId: number) => {
    console.log(`Téléchargement épreuve TD ${tdId}`);
  };

  return (
    <SidebarProvider>
      <AppSidebar userRole="student" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Dashboard Apprenant</h1>
            <p className="text-sm text-muted-foreground">
              Bienvenue Kouadio Marie - Classe de 3ème
            </p>
          </div>
        </header>

        <div className="flex-1 space-y-6 p-6">
          {/* Stats Cards */}
          {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-full ${stat.color}`}>
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div> */}

          {/* Champ de filtre par date */}
          <div className="mb-4 flex items-center gap-2">
            <label htmlFor="date-filter" className="text-sm font-medium">
              Filtrer par date :
            </label>
            <input
              id="date-filter"
              type="date"
              className="border rounded px-2 py-1 text-sm"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            {selectedDate && (
              <Button
                type="button"
                size="sm"
                className="ml-2 bg-blue-500 text-white hover:bg-blue-600"
                onClick={() => setSelectedDate("")}
              >
                Réinitialiser
              </Button>
            )}
          </div>

          {/* Grille de TD */}
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredTD.length === 0 ? (
              <div className="col-span-full text-center text-muted-foreground">
                Aucun TD disponible à cette date.
              </div>
            ) : (
              filteredTD.map((td) => (
                <Card key={td.id}>
                  <CardHeader>
                    <CardTitle className="text-base font-medium">
                      {td.subject}
                    </CardTitle>
                    <CardDescription>{td.teacher}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm mb-2">
                      <p>
                        <strong>Date:</strong> {td.date} à {td.time}
                      </p>
                      <p>
                        <strong>Durée:</strong> {td.duration}
                      </p>
                    </div>
                    {td.hasExam && (
                      <Button
                        size="sm"
                        variant={td.examDownloaded ? "secondary" : "default"}
                        onClick={() => handleDownloadExam(td.id)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {td.examDownloaded
                          ? "Téléchargé"
                          : "Télécharger l'épreuve"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Conseils et informations */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Conseils de préparation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <p>
                      Téléchargez les épreuves à l'avance pour vous préparer
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <p>Arrivez 10 minutes avant l'heure prévue</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <p>Apportez tout le matériel nécessaire</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
