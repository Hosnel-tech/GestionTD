"use client";
import * as XLSX from "xlsx";
import { useState, useEffect } from "react";
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

  const [tdList, setTDList] = useState<any[]>([]);

  useEffect(() => {
  const fetchTDs = async () => {
    try {
      const res = await fetch("/api/tds");
      const data = await res.json();
      setTDList(data.tds || []);
    } catch (err) {
      console.error("Erreur lors de la récupération des TDs", err);
    }
  };
  fetchTDs();
}, []);


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

  const handleCreateTD = async () => {
  try {
    const payload = {
      subject: newTD.subject,
      class: newTD.class,
      teacher: newTD.teacher,
      date: newTD.date,
      duration: newTD.duration,
    };

    const res = await fetch("/api/tds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Erreur création");

    const data = await res.json();
    console.log("TD créé:", data);

    // refresh list
    setTDList((prev) => [
      ...prev,
      { ...payload, id: data.id, status: "en_attente", students: 0 },
    ]);

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
  } catch (err) {
    console.error("Erreur lors de la création du TD", err);
  }
};


  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedTD, setSelectedTD] = useState<any>(null);

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editTD, setEditTD] = useState<any>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (event) => {
    const arrayBuffer = event.target?.result;
    if (!arrayBuffer) return;

    const workbook = XLSX.read(arrayBuffer, { type: "array" });

    // Combine rows from all sheets
    const allRows: any[] = [];
    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet);
      allRows.push(...rows);
    });

    console.log("All combined rows from all sheets:", allRows);

    try {
      const res = await fetch("/api/tds/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(allRows),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Échec import.");

      alert(result.message);
    } catch (err: any) {
      console.error("Import failed:", err);
      alert("Erreur: " + err.message);
    }
  };

  reader.readAsArrayBuffer(file);
};

  const handleEditTD = () => {
    console.log("Modification TD:", editTD);
    setShowEditDialog(false);
    setEditTD(null);
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
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange}  className="hidden" id="excel-upload"/>
          <Button asChild variant="default">
          <label htmlFor="excel-upload" className="cursor-pointer">
          Importer un fichier Excel
          </label>
          </Button>
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
                          <SelectItem key={teacher.id} value={String(teacher.name)}>
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
                            {new Date(td.date).toLocaleDateString("fr-FR")}
                          </p>
                          <p className="text-muted-foreground">
                            {td.duration}h
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(td.status)}
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedTD(td);
                            setShowDetailDialog(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditTD({ ...td, examFile: null });
                            setShowEditDialog(true);
                          }}
                        >
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
                      <Label>Heure</Label>
                      <Input value={selectedTD.time} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>Durée</Label>
                      <Input value={selectedTD.duration} readOnly />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Statut</Label>
                    <Input value={selectedTD.status} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Nombre d'élèves</Label>
                    <Input value={selectedTD.students} readOnly />
                  </div>
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

          {/* Dialog pour édition TD */}
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Modifier le TD</DialogTitle>
                <DialogDescription>
                  Modifiez les informations du travail dirigé
                </DialogDescription>
              </DialogHeader>
              {editTD && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Matière</Label>
                      <Input
                        id="subject"
                        value={editTD.subject}
                        onChange={(e) =>
                          setEditTD({ ...editTD, subject: e.target.value })
                        }
                        placeholder="Ex: Mathématiques"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="class">Classe</Label>
                      <Select
                        value={editTD.class}
                        onValueChange={(value) =>
                          setEditTD({ ...editTD, class: value })
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
                      value={editTD.teacher}
                      onValueChange={(value) =>
                        setEditTD({ ...editTD, teacher: value })
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
                        value={editTD.date}
                        onChange={(e) =>
                          setEditTD({ ...editTD, date: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Heure</Label>
                      <Input
                        id="time"
                        type="time"
                        value={editTD.time}
                        onChange={(e) =>
                          setEditTD({ ...editTD, time: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Durée</Label>
                      <Input
                        id="duration"
                        value={editTD.duration}
                        onChange={(e) =>
                          setEditTD({ ...editTD, duration: e.target.value })
                        }
                        placeholder="Ex: 2h"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editTD.description || ""}
                      onChange={(e) =>
                        setEditTD({ ...editTD, description: e.target.value })
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
                        setEditTD({
                          ...editTD,
                          examFile:
                            (e.target as HTMLInputElement).files?.[0] || null,
                        })
                      }
                    />
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowEditDialog(false)}
                >
                  Annuler
                </Button>
                <Button onClick={handleEditTD}>Modifier le TD</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
