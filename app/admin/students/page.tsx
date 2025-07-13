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
  UserRound,
  Users,
} from "lucide-react";

export default function AdminStudentsPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    parentName: "",
    email: "",
    phone: "",
    school: "",
    class: "",
  });
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editStudent, setEditStudent] = useState<any>(null);

  const students = [
    {
      id: 1,
      name: "Kouadio Marie",
      parentName: "Kouadio Robert",
      email: "kouadio.parent@gmail.com",
      phone: "+225 07 12 34 56",
      school: "Collège Moderne de Cocody",
      class: "3ème",
      status: "active",
    },
    {
      id: 2,
      name: "Koné Ibrahim",
      parentName: "Koné Amadou",
      email: "kone.parent@gmail.com",
      phone: "+225 05 67 89 01",
      school: "Lycée Technique d'Abidjan",
      class: "Tle",
      status: "active",
    },
    {
      id: 3,
      name: "Bamba Fatou",
      parentName: "Bamba Mariam",
      email: "bamba.parent@gmail.com",
      phone: "+225 01 23 45 67",
      school: "École Primaire Les Palmiers",
      class: "CM2",
      status: "active",
    },
    {
      id: 4,
      name: "Diallo Moussa",
      parentName: "Diallo Oumar",
      email: "diallo.parent@gmail.com",
      phone: "+225 07 89 01 23",
      school: "Collège Sainte-Marie",
      class: "3ème",
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

  const handleCreateStudent = () => {
    console.log("Création apprenant:", newStudent);
    setShowCreateDialog(false);
    setNewStudent({
      name: "",
      parentName: "",
      email: "",
      phone: "",
      school: "",
      class: "",
    });
  };

  const handleEditStudent = () => {
    console.log("Modification apprenant:", editStudent);
    setShowEditDialog(false);
    setEditStudent(null);
  };

  const sendCredentials = (userId: number) => {
    console.log(`Envoi des identifiants pour l'apprenant ${userId}`);
  };

  return (
    <SidebarProvider>
      <AppSidebar userRole="admin" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Gestion des Apprenants</h1>
            <p className="text-sm text-muted-foreground">
              Ajouter et gérer les apprenants de la plateforme
            </p>
          </div>
        </header>

        <div className="flex-1 space-y-6 p-6">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un apprenant..."
                className="pl-10 w-64"
              />
            </div>

            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un apprenant
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Ajouter un nouvel apprenant</DialogTitle>
                  <DialogDescription>
                    Créez un compte pour un apprenant
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom et prénom de l'apprenant</Label>
                      <Input
                        id="name"
                        value={newStudent.name}
                        onChange={(e) =>
                          setNewStudent({ ...newStudent, name: e.target.value })
                        }
                        placeholder="Ex: Kouadio Marie"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="parentName">
                        Nom et prénom du parent
                      </Label>
                      <Input
                        id="parentName"
                        value={newStudent.parentName}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            parentName: e.target.value,
                          })
                        }
                        placeholder="Ex: Kouadio Robert"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email du parent</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newStudent.email}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            email: e.target.value,
                          })
                        }
                        placeholder="email@exemple.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Numéro de téléphone du parent
                      </Label>
                      <Input
                        id="phone"
                        value={newStudent.phone}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
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
                      value={newStudent.school}
                      onValueChange={(value) =>
                        setNewStudent({ ...newStudent, school: value })
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
                      value={newStudent.class}
                      onValueChange={(value) =>
                        setNewStudent({ ...newStudent, class: value })
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

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateDialog(false)}
                  >
                    Annuler
                  </Button>
                  <Button onClick={handleCreateStudent}>
                    Créer l'apprenant
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Students Table */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des apprenants</CardTitle>
              <CardDescription>
                Gérez tous les apprenants de la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Apprenant</TableHead>
                    <TableHead>Parent</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Établissement</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <UserRound className="h-4 w-4" />
                          {student.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {student.parentName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span>{student.email}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Phone className="h-3 w-3" />
                            <span>{student.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          <span>{student.school}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getClassBadge(student.class)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditStudent(student);
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

          {/* Dialog pour édition apprenant */}
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Modifier l'apprenant</DialogTitle>
                <DialogDescription>
                  Modifiez les informations de l'apprenant
                </DialogDescription>
              </DialogHeader>
              {editStudent && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom et prénom de l'apprenant</Label>
                      <Input
                        id="name"
                        value={editStudent.name}
                        onChange={(e) =>
                          setEditStudent({
                            ...editStudent,
                            name: e.target.value,
                          })
                        }
                        placeholder="Ex: Kouadio Marie"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="parentName">
                        Nom et prénom du parent
                      </Label>
                      <Input
                        id="parentName"
                        value={editStudent.parentName}
                        onChange={(e) =>
                          setEditStudent({
                            ...editStudent,
                            parentName: e.target.value,
                          })
                        }
                        placeholder="Ex: Kouadio Robert"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email du parent</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editStudent.email}
                        onChange={(e) =>
                          setEditStudent({
                            ...editStudent,
                            email: e.target.value,
                          })
                        }
                        placeholder="email@exemple.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Numéro de téléphone du parent
                      </Label>
                      <Input
                        id="phone"
                        value={editStudent.phone}
                        onChange={(e) =>
                          setEditStudent({
                            ...editStudent,
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
                      value={editStudent.school}
                      onValueChange={(value) =>
                        setEditStudent({ ...editStudent, school: value })
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
                      value={editStudent.class}
                      onValueChange={(value) =>
                        setEditStudent({ ...editStudent, class: value })
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
              )}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowEditDialog(false)}
                >
                  Annuler
                </Button>
                <Button onClick={handleEditStudent}>
                  Modifier l'apprenant
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
