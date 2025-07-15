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
import { Plus, Search, Filter, Edit, Trash2, Mail } from "lucide-react";

export default function AdminUsersPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    class: "",
    level: "",
    paymentMethod: "",
    subjects: "",
  });

  const users = [
    {
      id: 1,
      name: "M. Kouassi Jean",
      email: "kouassi@edutd.com",
      role: "teacher",
      level: "secondaire",
      subjects: ["Mathématiques", "Physique"],
      paymentMethod: "banque",
      status: "active",
    },
    {
      id: 2,
      name: "Mme Diabaté Marie",
      email: "diabate@edutd.com",
      role: "teacher",
      level: "secondaire",
      subjects: ["Français", "Littérature"],
      paymentMethod: "electronique",
      status: "active",
    },
    {
      id: 3,
      name: "Kouadio Marie",
      email: "marie.k@edutd.com",
      role: "student",
      class: "3ème",
      level: "secondaire",
      status: "active",
    },
    {
      id: 4,
      name: "M. Traoré Paul",
      email: "traore@edutd.com",
      role: "teacher",
      level: "primaire",
      subjects: ["Sciences", "Mathématiques"],
      paymentMethod: "banque",
      status: "active",
    },
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "teacher":
        return <Badge variant="default">Enseignant</Badge>;
      case "student":
        return <Badge variant="secondary">Apprenant</Badge>;
      case "admin":
        return <Badge className="bg-purple-600">Administrateur</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const handleCreateUser = () => {
    console.log("Création utilisateur:", newUser);
    setShowCreateDialog(false);
    setNewUser({
      name: "",
      email: "",
      role: "",
      class: "",
      level: "",
      paymentMethod: "",
      subjects: "",
    });
  };

  const sendCredentials = (userId: number) => {
    console.log(`Envoi des identifiants pour l'utilisateur ${userId}`);
  };

  return (
    <SidebarProvider>
      <AppSidebar userRole="admin" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Gestion des Utilisateurs</h1>
            <p className="text-sm text-muted-foreground">
              Ajouter et gérer les enseignants et apprenants
            </p>
          </div>
        </header>

        <div className="flex-1 space-y-6 p-6">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un utilisateur..."
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtrer
              </Button>
            </div>

            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un utilisateur
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
                  <DialogDescription>
                    Créez un compte pour un enseignant ou un apprenant
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet</Label>
                      <Input
                        id="name"
                        value={newUser.name}
                        onChange={(e) =>
                          setNewUser({ ...newUser, name: e.target.value })
                        }
                        placeholder="Ex: M. Kouassi Jean"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) =>
                          setNewUser({ ...newUser, email: e.target.value })
                        }
                        placeholder="email@exemple.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Rôle</Label>
                    <Select
                      value={newUser.role}
                      onValueChange={(value) =>
                        setNewUser({ ...newUser, role: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="teacher">Enseignant</SelectItem>
                        <SelectItem value="student">Apprenant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {newUser.role === "teacher" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="level">Niveau d'enseignement</Label>
                        <Select
                          value={newUser.level}
                          onValueChange={(value) =>
                            setNewUser({ ...newUser, level: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner le niveau" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="primaire">
                              Primaire (CM2)
                            </SelectItem>
                            <SelectItem value="secondaire">
                              Secondaire (3ème, Tle)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subjects">Matières enseignées</Label>
                        <Input
                          id="subjects"
                          value={newUser.subjects}
                          onChange={(e) =>
                            setNewUser({ ...newUser, subjects: e.target.value })
                          }
                          placeholder="Ex: Mathématiques, Physique"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="paymentMethod">Mode de paiement</Label>
                        <Select
                          value={newUser.paymentMethod}
                          onValueChange={(value) =>
                            setNewUser({ ...newUser, paymentMethod: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner le mode de paiement" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="banque">Par banque</SelectItem>
                            <SelectItem value="electronique">
                              Paiement électronique
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {newUser.role === "student" && (
                    <div className="space-y-2">
                      <Label htmlFor="class">Classe</Label>
                      <Select
                        value={newUser.class}
                        onValueChange={(value) =>
                          setNewUser({ ...newUser, class: value })
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
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateDialog(false)}
                  >
                    Annuler
                  </Button>
                  <Button onClick={handleCreateUser}>
                    Créer l'utilisateur
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des utilisateurs</CardTitle>
              <CardDescription>
                Gérez tous les utilisateurs de la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Niveau/Classe</TableHead>
                    <TableHead>Informations</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        {user.role === "teacher" ? user.level : user.class}
                      </TableCell>
                      <TableCell>
                        {user.role === "teacher" ? (
                          <div className="text-sm">
                            <p>
                              <strong>Matières:</strong>{" "}
                              {user.subjects?.join(", ")}
                            </p>
                            <p>
                              <strong>Paiement:</strong> {user.paymentMethod}
                            </p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => sendCredentials(user.id)}
                          >
                            <Mail className="h-4 w-4" />
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Total utilisateurs</span>
                    <span className="font-medium">{users.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Enseignants</span>
                    <span className="font-medium">
                      {users.filter((u) => u.role === "teacher").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Apprenants</span>
                    <span className="font-medium">
                      {users.filter((u) => u.role === "student").length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Répartition par niveau
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Primaire</span>
                    <span className="font-medium">1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Secondaire</span>
                    <span className="font-medium">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Apprenants actifs</span>
                    <span className="font-medium">156</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  size="sm"
                >
                  Envoyer identifiants en masse
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  size="sm"
                >
                  Exporter la liste
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  size="sm"
                >
                  Import depuis Excel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
