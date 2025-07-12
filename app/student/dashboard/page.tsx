"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Calendar, Download, Clock } from "lucide-react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function StudentDashboard() {
  const stats = [
    { title: "TD cette semaine", value: "4", icon: Calendar, color: "bg-blue-500" },
    { title: "TD terminés", value: "12", icon: BookOpen, color: "bg-green-500" },
    { title: "Épreuves disponibles", value: "8", icon: Download, color: "bg-purple-500" },
    { title: "Prochains TD", value: "2", icon: Clock, color: "bg-orange-500" },
  ]

  const upcomingTD = [
    {
      id: 1,
      subject: "Mathématiques",
      teacher: "M. Kouassi Jean",
      date: "2024-01-20",
      time: "14:00",
      duration: "2h",
      status: "confirme",
      hasExam: true,
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
    },
  ]

  const completedTD = [
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
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "en_attente":
        return <Badge variant="secondary">En attente</Badge>
      case "confirme":
        return <Badge variant="default">Confirmé</Badge>
      case "en_cours":
        return <Badge className="bg-orange-500">En cours</Badge>
      case "termine":
        return (
          <Badge variant="outline" className="text-green-600">
            Terminé
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleDownloadExam = (tdId: number) => {
    console.log(`Téléchargement épreuve TD ${tdId}`)
  }

  return (
    <SidebarProvider>
      <AppSidebar userRole="student" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Dashboard Apprenant</h1>
            <p className="text-sm text-muted-foreground">Bienvenue Kouadio Marie - Classe de 3ème</p>
          </div>
        </header>

        <div className="flex-1 space-y-6 p-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-full ${stat.color}`}>
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* TD à venir */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Prochains TD
                </CardTitle>
                <CardDescription>Vos travaux dirigés programmés</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingTD.map((td) => (
                    <div key={td.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">{td.subject}</h4>
                          <p className="text-sm text-muted-foreground">{td.teacher}</p>
                        </div>
                        {getStatusBadge(td.status)}
                      </div>
                      <div className="text-sm mb-3">
                        <p>
                          <strong>Date:</strong> {td.date} à {td.time}
                        </p>
                        <p>
                          <strong>Durée:</strong> {td.duration}
                        </p>
                      </div>
                      {td.hasExam && (
                        <Button size="sm" variant="outline" onClick={() => handleDownloadExam(td.id)}>
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger l'épreuve
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* TD terminés */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-green-500" />
                  TD Terminés
                </CardTitle>
                <CardDescription>Historique de vos TD avec épreuves disponibles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completedTD.map((td) => (
                    <div key={td.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">{td.subject}</h4>
                          <p className="text-sm text-muted-foreground">{td.teacher}</p>
                        </div>
                        {getStatusBadge(td.status)}
                      </div>
                      <div className="text-sm mb-3">
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
                          {td.examDownloaded ? "Téléchargé" : "Télécharger l'épreuve"}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Planning de la semaine */}
          <Card>
            <CardHeader>
              <CardTitle>Planning de la semaine</CardTitle>
              <CardDescription>Vos TD programmés pour cette semaine</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-7">
                {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"].map((day, index) => (
                  <div key={day} className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm mb-2">{day}</h4>
                    {index === 0 || index === 2 ? (
                      <div className="space-y-2">
                        <div className="text-xs p-2 bg-blue-50 rounded">
                          <p className="font-medium">Mathématiques</p>
                          <p>14:00-16:00</p>
                        </div>
                      </div>
                    ) : index === 4 ? (
                      <div className="space-y-2">
                        <div className="text-xs p-2 bg-green-50 rounded">
                          <p className="font-medium">Français</p>
                          <p>10:00-13:00</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">Aucun TD</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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
                    <p>Téléchargez les épreuves à l'avance pour vous préparer</p>
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

            <Card>
              <CardHeader>
                <CardTitle>Statistiques personnelles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">TD suivis ce mois</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Taux de présence</span>
                    <span className="font-medium">95%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Matière favorite</span>
                    <span className="font-medium">Mathématiques</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Épreuves téléchargées</span>
                    <span className="font-medium">8/12</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
