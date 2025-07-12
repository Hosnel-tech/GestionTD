"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle, AlertCircle, Calendar } from "lucide-react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function TeacherDashboard() {
  const stats = [
    { title: "TD en attente", value: "3", icon: Clock, color: "bg-orange-500" },
    { title: "TD en cours", value: "2", icon: AlertCircle, color: "bg-blue-500" },
    { title: "TD terminés", value: "8", icon: CheckCircle, color: "bg-green-500" },
    { title: "Cette semaine", value: "5", icon: Calendar, color: "bg-purple-500" },
  ]

  const pendingTD = [
    {
      id: 1,
      subject: "Mathématiques",
      class: "3ème",
      date: "2024-01-20",
      time: "14:00",
      duration: "2h",
      students: 25,
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      subject: "Mathématiques",
      class: "Tle",
      date: "2024-01-22",
      time: "10:00",
      duration: "3h",
      students: 30,
      createdAt: "2024-01-16",
    },
  ]

  const activeTD = [
    {
      id: 3,
      subject: "Mathématiques",
      class: "3ème",
      date: "2024-01-18",
      time: "15:00",
      duration: "2h",
      students: 22,
      status: "en_cours",
    },
  ]

  const handleConfirmTD = (id: number) => {
    console.log(`TD ${id} confirmé`)
  }

  const handleRejectTD = (id: number) => {
    console.log(`TD ${id} rejeté`)
  }

  const handleCompleteTD = (id: number) => {
    console.log(`TD ${id} terminé`)
  }

  return (
    <SidebarProvider>
      <AppSidebar userRole="teacher" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Dashboard Enseignant</h1>
            <p className="text-sm text-muted-foreground">Bienvenue M. Kouassi Jean</p>
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
            {/* TD en attente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  TD en attente de confirmation
                </CardTitle>
                <CardDescription>Confirmez ou rejetez les TD qui vous sont assignés</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingTD.map((td) => (
                    <div key={td.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">{td.subject}</h4>
                          <p className="text-sm text-muted-foreground">
                            {td.class} • {td.students} élèves
                          </p>
                        </div>
                        <Badge variant="secondary">En attente</Badge>
                      </div>
                      <div className="text-sm mb-3">
                        <p>
                          <strong>Date:</strong> {td.date} à {td.time}
                        </p>
                        <p>
                          <strong>Durée:</strong> {td.duration}
                        </p>
                        <p>
                          <strong>Créé le:</strong> {td.createdAt}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleConfirmTD(td.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Confirmer
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleRejectTD(td.id)}>
                          Rejeter
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* TD en cours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-500" />
                  TD en cours
                </CardTitle>
                <CardDescription>Marquez comme terminé une fois le TD fini</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeTD.map((td) => (
                    <div key={td.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">{td.subject}</h4>
                          <p className="text-sm text-muted-foreground">
                            {td.class} • {td.students} élèves
                          </p>
                        </div>
                        <Badge className="bg-blue-500">En cours</Badge>
                      </div>
                      <div className="text-sm mb-3">
                        <p>
                          <strong>Date:</strong> {td.date} à {td.time}
                        </p>
                        <p>
                          <strong>Durée:</strong> {td.duration}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleCompleteTD(td.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Marquer comme terminé
                      </Button>
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
                    {index < 3 ? (
                      <div className="space-y-2">
                        <div className="text-xs p-2 bg-blue-50 rounded">
                          <p className="font-medium">Mathématiques</p>
                          <p>3ème • 14:00-16:00</p>
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
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
