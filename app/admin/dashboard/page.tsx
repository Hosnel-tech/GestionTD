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
import {
  BookOpen,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  UserRound,
  ArrowRight,
} from "lucide-react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Link from "next/link";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminDashboard() {
  const stats = [
    { title: "Total TD", value: "24", icon: BookOpen, color: "bg-blue-500" },
    { title: "Enseignants", value: "12", icon: Users, color: "bg-green-500" },
    { title: "Apprenants", value: "156", icon: Users, color: "bg-purple-500" },
    {
      title: "À payer",
      value: "45,000 FCFA",
      icon: DollarSign,
      color: "bg-orange-500",
    },
  ];

  const recentTD = [
    {
      id: 1,
      subject: "Mathématiques",
      class: "3ème",
      teacher: "M. Kouassi",
      status: "en_cours",
      date: "2024-01-15",
    },
    {
      id: 2,
      subject: "Français",
      class: "Tle",
      teacher: "Mme Diabaté",
      status: "termine",
      date: "2024-01-14",
    },
    {
      id: 3,
      subject: "Sciences",
      class: "CM2",
      teacher: "M. Traoré",
      status: "en_attente",
      date: "2024-01-16",
    },
    {
      id: 4,
      subject: "Histoire",
      class: "3ème",
      teacher: "Mme Koné",
      status: "en_cours",
      date: "2024-01-15",
    },
  ];

  const recentTeachers = [
    {
      id: 1,
      name: "M. Kouassi Jean",
      subject: "Mathématiques",
      school: "Collège Moderne de Cocody",
      class: "3ème, Tle",
      status: "active",
    },
    {
      id: 2,
      name: "Mme Diabaté Marie",
      subject: "Français",
      school: "Lycée Technique d'Abidjan",
      class: "3ème",
      status: "active",
    },
    {
      id: 3,
      name: "M. Traoré Paul",
      subject: "Sciences",
      school: "École Primaire Les Palmiers",
      class: "CM2",
      status: "active",
    },
    {
      id: 4,
      name: "Mme Koné Fatou",
      subject: "Histoire",
      school: "Collège Sainte-Marie",
      class: "Tle",
      status: "inactive",
    },
  ];

  const recentStudents = [
    {
      id: 1,
      name: "Kouadio Marie",
      class: "3ème",
      school: "Collège Moderne de Cocody",
      parent: "Kouadio Robert",
      status: "active",
    },
    {
      id: 2,
      name: "Koné Ibrahim",
      class: "Tle",
      school: "Lycée Technique d'Abidjan",
      parent: "Koné Amadou",
      status: "active",
    },
    {
      id: 3,
      name: "Bamba Fatou",
      class: "CM2",
      school: "École Primaire Les Palmiers",
      parent: "Bamba Mariam",
      status: "active",
    },
    {
      id: 4,
      name: "Diallo Moussa",
      class: "3ème",
      school: "Collège Sainte-Marie",
      parent: "Diallo Oumar",
      status: "inactive",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "en_attente":
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            En attente
          </Badge>
        );
      case "en_cours":
        return (
          <Badge variant="default">
            <AlertCircle className="h-3 w-3 mr-1" />
            En cours
          </Badge>
        );
      case "termine":
        return (
          <Badge variant="outline" className="text-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Terminé
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getUserStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-600">Actif</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactif</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getClassBadge = (className: string) => {
    switch (className) {
      case "CM2":
        return <Badge variant="secondary">CM2</Badge>;
      case "3ème":
        return <Badge variant="default">3ème</Badge>;
      case "Tle":
        return <Badge className="bg-blue-600">Tle</Badge>;
      default:
        return <Badge variant="outline">{className}</Badge>;
    }
  };

  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedTD, setSelectedTD] = useState<any>(null);

  return (
    <SidebarProvider>
      <AppSidebar userRole="admin" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Dashboard Administrateur</h1>
            <p className="text-sm text-muted-foreground">
              Vue d'ensemble de la plateforme
            </p>
          </div>
        </header>

        <div className="flex-1 space-y-6 p-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
          </div>

          {/* Recent TD */}
          <Card>
            <CardHeader>
              <CardTitle>TD Récents</CardTitle>
              <CardDescription>
                Aperçu des derniers travaux dirigés créés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTD.map((td) => (
                  <div
                    key={td.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <h4 className="font-medium">{td.subject}</h4>
                          <p className="text-sm text-muted-foreground">
                            {td.class} • {td.teacher} • {td.date}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(td.status)}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedTD(td);
                          setShowDetailDialog(true);
                        }}
                      >
                        Voir détails
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Dialog pour détails TD */}
          <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Détails du TD</DialogTitle>
                <DialogDescription>
                  Informations sur le travail dirigé sélectionné
                </DialogDescription>
              </DialogHeader>
              {selectedTD && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Matière</Label>
                      <Input value={selectedTD.subject} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>Classe</Label>
                      <Input value={selectedTD.class} readOnly />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Enseignant</Label>
                    <Input value={selectedTD.teacher} readOnly />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input value={selectedTD.date} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>Statut</Label>
                      <Input value={selectedTD.status} readOnly />
                    </div>
                  </div>
                  {/* Ajoute d'autres champs si besoin */}
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDetailDialog(false)}
                >
                  Fermer
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Enseignants et Apprenants */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Enseignants récents */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-green-500" />
                    Enseignants récents
                  </CardTitle>
                  <CardDescription>
                    Derniers enseignants ajoutés à la plateforme
                  </CardDescription>
                </div>
                <Link href="/admin/personnels">
                  <Button variant="outline" size="sm">
                    Voir plus
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTeachers.map((teacher) => (
                    <div
                      key={teacher.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <GraduationCap className="h-8 w-8 p-2 bg-green-100 rounded-full text-green-600" />
                          <div>
                            <h4 className="font-medium">{teacher.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {teacher.subject} • {teacher.class}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {teacher.school}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getUserStatusBadge(teacher.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Apprenants récents */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <UserRound className="h-5 w-5 text-purple-500" />
                    Apprenants récents
                  </CardTitle>
                  <CardDescription>
                    Derniers apprenants inscrits sur la plateforme
                  </CardDescription>
                </div>
                <Link href="/admin/students">
                  <Button variant="outline" size="sm">
                    Voir plus
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <UserRound className="h-8 w-8 p-2 bg-purple-100 rounded-full text-purple-600" />
                          <div>
                            <h4 className="font-medium">{student.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Parent: {student.parent}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {student.school}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getClassBadge(student.class)}
                        {getUserStatusBadge(student.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
