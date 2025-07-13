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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Mail,
  Phone,
  Building,
} from "lucide-react";

export default function AdminTeachersPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    phone: "",
    school: "",
    class: "",
    subjects: "",
  });
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editTeacher, setEditTeacher] = useState<any>(null);

  const teachers = [
    {
      id: 1,
      name: "M. Kouassi Jean",
      email: "kouassi@edutd.com",
      phone: "+225 07 12 34 56",
      school: "Collège Moderne de Cocody",
      class: "3ème, Tle",
      level: "secondaire",
      subjects: "Mathématiques, Physique",
      paymentMethod: "banque",
      status: "active",
    },
    {
      id: 2,
      name: "Mme Diabaté Marie",
      email: "diabate@edutd.com",
      phone: "+225 05 67 89 01",
      school: "Lycée Technique d'Abidjan",
      class: "3ème",
      level: "secondaire",
      subjects: "Français, Littérature",
      paymentMethod: "electronique",
      status: "active",
    },
    {
      id: 3,
      name: "M. Traoré Paul",
      email: "traore@edutd.com",
      phone: "+225 01 23 45 67",
      school: "École Primaire Les Palmiers",
      class: "CM2",
      level: "primaire",
      subjects: "Sciences, Mathématiques",
      paymentMethod: "banque",
      status: "active",
    },
    {
      id: 4,
      name: "Mme Koné Fatou",
      email: "kone@edutd.com",
      phone: "+225 07 89 01 23",
      school: "Collège Sainte-Marie",
      class: "Tle",
      level: "secondaire",
      subjects: "Histoire, Géographie",
      paymentMethod: "electronique",
      status: "inactive",
    },
  ];

  const schools = [
    "Collège Moderne de Cocody",
    "Lycée Technique d'Abidjan",
    "École Primaire Les Palmiers",
    "Collège Sainte-Marie",
    "Groupe Scolaire Excellence",
  ];

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "primaire":
        return <Badge variant="secondary">Primaire</Badge>;
      case "secondaire":
        return <Badge variant="default">Secondaire</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-600">Actif</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactif</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleCreateTeacher = () => {
    console.log("Création enseignant:", newTeacher);
    setShowCreateDialog(false);
    setNewTeacher({
      name: "",
      email: "",
      phone: "",
      school: "",
      class: "",
      subjects: "",
    });
  };

  const handleEditTeacher = () => {
    console.log("Modification enseignant:", editTeacher);
    setShowEditDialog(false);
    setEditTeacher(null);
  };

  const sendCredentials = (userId: number) => {
    console.log(`Envoi des identifiants pour l'enseignant ${userId}`);
  };

  return (
    <SidebarProvider>
      <AppSidebar userRole="admin" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Gestion des Enseignants</h1>
            <p className="text-sm text-muted-foreground">
              Ajouter et gérer les enseignants de la plateforme
            </p>
          </div>
        </header>

        <div className="flex-1 space-y-6 p-6">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un enseignant..."
                className="pl-10 w-64"
              />
            </div>

            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un enseignant
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Ajouter un nouvel enseignant</DialogTitle>
                  <DialogDescription>
                    Créez un compte pour un enseignant
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom et prénom</Label>
                    <Input
                      id="name"
                      value={newTeacher.name}
                      onChange={(e) =>
                        setNewTeacher({ ...newTeacher, name: e.target.value })
                      }
                      placeholder="Ex: M. Kouassi Jean"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newTeacher.email}
                        onChange={(e) =>
                          setNewTeacher({
                            ...newTeacher,
                            email: e.target.value,
                          })
                        }
                        placeholder="email@exemple.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Numéro de téléphone</Label>
                      <Input
                        id="phone"
                        value={newTeacher.phone}
                        onChange={(e) =>
                          setNewTeacher({
                            ...newTeacher,
                            phone: e.target.value,
                          })
                        }
                        placeholder="+225 XX XX XX XX"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="school">Établissement</Label>
                    <Select
                      value={newTeacher.school}
                      onValueChange={(value) =>
                        setNewTeacher({ ...newTeacher, school: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un établissement" />
                      </SelectTrigger>
                      <SelectContent>
                        {schools.map((school) => (
                          <SelectItem key={school} value={school}>
                            {school}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="class">Classe</Label>
                    <Select
                      value={newTeacher.class}
                      onValueChange={(value) =>
                        setNewTeacher({ ...newTeacher, class: value })
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

                  <div className="space-y-2">
                    <Label htmlFor="subjects">Matière enseignée</Label>
                    <Select
                      value={newTeacher.subjects}
                      onValueChange={(value) =>
                        setNewTeacher({ ...newTeacher, subjects: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une matière" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mathématiques">
                          Mathématiques
                        </SelectItem>
                        <SelectItem value="Français">Français</SelectItem>
                        <SelectItem value="Physique">Physique</SelectItem>
                        <SelectItem value="Chimie">Chimie</SelectItem>
                        <SelectItem value="Sciences">Sciences</SelectItem>
                        <SelectItem value="Histoire">Histoire</SelectItem>
                        <SelectItem value="Géographie">Géographie</SelectItem>
                        <SelectItem value="Anglais">Anglais</SelectItem>
                        <SelectItem value="Littérature">Littérature</SelectItem>
                        <SelectItem value="Philosophie">Philosophie</SelectItem>
                        <SelectItem value="Éducation Physique">
                          Éducation Physique
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateDialog(false)}
                  >
                    Annuler
                  </Button>
                  <Button onClick={handleCreateTeacher}>
                    Créer l'enseignant
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Teachers Table */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des enseignants</CardTitle>
              <CardDescription>
                Gérez tous les enseignants de la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Établissement</TableHead>
                    <TableHead>Niveau</TableHead>
                    <TableHead>Classe(s)</TableHead>
                    <TableHead>Matières</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell className="font-medium">
                        {teacher.name}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span>{teacher.email}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Phone className="h-3 w-3" />
                            <span>{teacher.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          <span>{teacher.school}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getLevelBadge(teacher.level)}</TableCell>
                      <TableCell>{teacher.class}</TableCell>
                      <TableCell>{teacher.subjects}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditTeacher(teacher);
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
      {/* Dialog pour édition enseignant */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier l'enseignant</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'enseignant
            </DialogDescription>
          </DialogHeader>
          {editTeacher && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom et prénom</Label>
                <Input
                  id="name"
                  value={editTeacher.name}
                  onChange={(e) =>
                    setEditTeacher({ ...editTeacher, name: e.target.value })
                  }
                  placeholder="Ex: M. Kouassi Jean"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editTeacher.email}
                    onChange={(e) =>
                      setEditTeacher({ ...editTeacher, email: e.target.value })
                    }
                    placeholder="email@exemple.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Numéro de téléphone</Label>
                  <Input
                    id="phone"
                    value={editTeacher.phone}
                    onChange={(e) =>
                      setEditTeacher({ ...editTeacher, phone: e.target.value })
                    }
                    placeholder="+225 XX XX XX XX"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="school">Établissement</Label>
                <Select
                  value={editTeacher.school}
                  onValueChange={(value) =>
                    setEditTeacher({ ...editTeacher, school: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un établissement" />
                  </SelectTrigger>
                  <SelectContent>
                    {schools.map((school) => (
                      <SelectItem key={school} value={school}>
                        {school}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="class">Classe</Label>
                <Select
                  value={editTeacher.class}
                  onValueChange={(value) =>
                    setEditTeacher({ ...editTeacher, class: value })
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
              <div className="space-y-2">
                <Label htmlFor="subjects">Matière enseignée</Label>
                <Select
                  value={editTeacher.subjects}
                  onValueChange={(value) =>
                    setEditTeacher({ ...editTeacher, subjects: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une matière" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mathématiques">Mathématiques</SelectItem>
                    <SelectItem value="Français">Français</SelectItem>
                    <SelectItem value="Physique">Physique</SelectItem>
                    <SelectItem value="Chimie">Chimie</SelectItem>
                    <SelectItem value="Sciences">Sciences</SelectItem>
                    <SelectItem value="Histoire">Histoire</SelectItem>
                    <SelectItem value="Géographie">Géographie</SelectItem>
                    <SelectItem value="Anglais">Anglais</SelectItem>
                    <SelectItem value="Littérature">Littérature</SelectItem>
                    <SelectItem value="Philosophie">Philosophie</SelectItem>
                    <SelectItem value="Éducation Physique">
                      Éducation Physique
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleEditTeacher}>Modifier l'enseignant</Button>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
