"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Plus, Search, Eye, Edit, Trash2 } from "lucide-react";

export default function AdminTDPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTD, setNewTD] = useState<{
    subject: string;
    class: string;
    teacher: string;
    date: string;
    time: string;
    duration: string;
    description: string;
    examFile: File | null;
  }>({
    subject: "",
    class: "",
    teacher: "",
    date: "",
    time: "",
    duration: "",
    description: "",
    examFile: null,
  });

  const tdList = [
    {
      id: 1,
      subject: "Mathématiques",
      class: "3ème",
      teacher: "M. Kouassi Jean",
      date: "2024-01-20",
      time: "14:00",
      duration: "2h",
      status: "en_attente",
      students: 25,
    },
    {
      id: 2,
      subject: "Français",
      class: "Tle",
      teacher: "Mme Diabaté Marie",
      date: "2024-01-21",
      time: "10:00",
      duration: "3h",
      status: "confirme",
      students: 30,
    },
    {
      id: 3,
      subject: "Sciences",
      class: "CM2",
      teacher: "M. Traoré Paul",
      date: "2024-01-22",
      time: "15:00",
      duration: "1h30",
      status: "termine",
      students: 20,
    },
  ];

  const teachers = [
    {
      id: 1,
      name: "M. Kouassi Jean",
      level: "secondaire",
      subjects: ["Mathématiques", "Physique"],
    },
    {
      id: 2,
      name: "Mme Diabaté Marie",
      level: "secondaire",
      subjects: ["Français", "Littérature"],
    },
    {
      id: 3,
      name: "M. Traoré Paul",
      level: "primaire",
      subjects: ["Sciences", "Mathématiques"],
    },
    {
      id: 4,
      name: "Mme Koné Fatou",
      level: "secondaire",
      subjects: ["Histoire", "Géographie"],
    },
  ];

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
      case "rejete":
        return <Badge variant="destructive">Rejeté</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleCreateTD = () => {
    console.log("Création TD:", newTD);
    setShowCreateDialog(false);
    setNewTD({
      subject: "",
      class: "",
      teacher: "",
      date: "",
      time: "",
      duration: "",
      description: "",
      examFile: null,
    });
  };

  return (
    <SidebarProvider>
      <AppSidebar userRole="admin" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Gestion des TD</h1>
            <p className="text-sm text-muted-foreground">
              Créer et gérer les travaux dirigés
            </p>
          </div>
        </header>

        <div className="flex-1 space-y-6 p-6">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher un TD..." className="pl-10 w-64" />
            </div>

            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un TD
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Créer un nouveau TD</DialogTitle>
                  <DialogDescription>
                    Remplissez les informations pour créer un nouveau travail
                    dirigé
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Matière</Label>
                      <Input
                        id="subject"
                        value={newTD.subject}
                        onChange={(e) =>
                          setNewTD({ ...newTD, subject: e.target.value })
                        }
                        placeholder="Ex: Mathématiques"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="class">Classe</Label>
                      <Select
                        value={newTD.class}
                        onValueChange={(value) =>
                          setNewTD({ ...newTD, class: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une classe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CM2">CM2</SelectItem>
                          <SelectItem value="3ème">3ème</SelectItem>
                          <SelectItem value="Tle">Terminale</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teacher">Enseignant</Label>
                    <Select
                      value={newTD.teacher}
                      onValueChange={(value) =>
                        setNewTD({ ...newTD, teacher: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un enseignant" />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.name}>
                            {teacher.name} - {teacher.level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newTD.date}
                        onChange={(e) =>
                          setNewTD({ ...newTD, date: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Heure</Label>
                      <Input
                        id="time"
                        type="time"
                        value={newTD.time}
                        onChange={(e) =>
                          setNewTD({ ...newTD, time: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Durée</Label>
                      <Input
                        id="duration"
                        value={newTD.duration}
                        onChange={(e) =>
                          setNewTD({ ...newTD, duration: e.target.value })
                        }
                        placeholder="Ex: 2h"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newTD.description}
                      onChange={(e) =>
                        setNewTD({ ...newTD, description: e.target.value })
                      }
                      placeholder="Description du TD..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="examFile">Épreuve (fichier PDF)</Label>
                    <Input
                      id="examFile"
                      type="file"
                      accept=".pdf"
                      onChange={(e) =>
                        setNewTD({
                          ...newTD,
                          examFile:
                            (e.target as HTMLInputElement).files?.[0] || null,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateDialog(false)}
                  >
                    Annuler
                  </Button>
                  <Button onClick={handleCreateTD}>Créer le TD</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* TD List */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des TD</CardTitle>
              <CardDescription>
                Gérez tous les travaux dirigés de la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tdList.map((td) => (
                  <div
                    key={td.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div>
                          <h4 className="font-medium">{td.subject}</h4>
                          <p className="text-sm text-muted-foreground">
                            {td.class} • {td.teacher}
                          </p>
                        </div>
                        <div className="text-sm">
                          <p>
                            {td.date} à {td.time}
                          </p>
                          <p className="text-muted-foreground">
                            {td.duration} • {td.students} élèves
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(td.status)}
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
