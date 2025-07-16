"use client";
import { ExcelRow } from "@/types/personnel";
import * as XLSX from "xlsx";
import { useState, useEffect } from "react";
import { useRef } from "react";
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
  const [personnels, setPersonnels] = useState<any[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newPersonnel, setNewPersonnel] = useState({
    type: "",
    name: "",
    email: "",
    phone: "",
    school: "",
    class: "",
    subjects: "",
    ifu: "",
    accountNumber: "",
    level: "",
    bank: "",
  });
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editTeacher, setEditTeacher] = useState<any>(null);
  // Ajout de l'état pour le filtre de type de personnel
  const [selectedType, setSelectedType] = useState<string>("Enseignant");
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importError, setImportError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pour la démo, on suppose que tous les éléments de 'teachers' sont des 'Enseignant'.
  // Pour un vrai usage, il faudrait un champ 'type' dans chaque objet.
  // On adapte la démo pour permettre le filtre.
  //const personnels = teachers;

  useEffect(() => {
  const fetchPersonnels = async () => {
    try {
      const res = await fetch("/api/personnel");
      const data = await res.json();
      setPersonnels(data.personnel);
    } catch (error) {
      console.error("Erreur lors du chargement du personnel", error);
    }
  };

  fetchPersonnels();
}, []);


  const filteredPersonnels = selectedType
    ? personnels.filter((p) => p.type === selectedType)
    : personnels;

  const schools = [
    "Collège Moderne de Cocody",
    "Lycée Technique d'Abidjan",
    "École Primaire Les Palmiers",
    "Collège Sainte-Marie",
    "Groupe Scolaire Excellence",
  ];

  const personnelTypes = [
    "Conseiller pédagogique",
    "Enseignant",
    "Surveillant général",
    "Censeur",
    "Directeur",
  ];

  const banks = ["Banque Atlantique", "SGBCI", "Ecobank"];

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
  }


  const handleCreatePersonnel = async () => {
  try {
    const res = await fetch("/api/personnel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: newPersonnel.type,
        name: newPersonnel.name,
        phone: newPersonnel.phone,
        school: newPersonnel.school,
        class: newPersonnel.class,
        subjects: newPersonnel.subjects,
        ifu: newPersonnel.ifu,
        accountNumber: newPersonnel.accountNumber,
        level: newPersonnel.level,
        bank: newPersonnel.bank,
      }),
    });

    if (!res.ok) throw new Error("Erreur création");

    const data = await res.json();
    console.log("Personnel créé:", data);

    // Optional: refresh list
    setPersonnels((prev) => [...prev, { id: data.id, ...newPersonnel }]);

    // Close modal & reset form
    setShowCreateDialog(false);
    setNewPersonnel({
      type: "",
      name: "",
      email:"",
      phone: "",
      school: "",
      class: "",
      subjects: "",
      ifu: "",
      accountNumber: "",
      level: "",
      bank: "",
    });
  } catch (err) {
    console.error("Erreur lors de la création du personnel", err);
  }
};

const handleUpload = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("/api/personnel/import", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Erreur lors de l'importation");
    }

    const result = await res.json();
    alert(`Importation réussie\nAjoutés: ${result.inserted}\nIgnorés (doublons): ${result.skipped}`);
    setImportFile(null);
  } catch (err: any) {
    setImportError(err.message);
  }
};

const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (event) => {
    const data = new Uint8Array(event.target?.result as ArrayBuffer);
    const workbook = XLSX.read(data, { type: "array" });

    // Combine all rows from all sheets
    const allRows: any[] = [];
    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet);
      allRows.push(...json);
    });

    console.log("All combined rows from all sheets:", allRows);

    // Send JSON directly
    try {
      const res = await fetch("/api/personnel/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(allRows),
      });

      const result = await res.json();
      console.log("Importation réussie:", result);
    } catch (err) {
      console.error("Erreur réseau:", err);
    }
  };

  reader.readAsArrayBuffer(file);
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
            <h1 className="text-xl font-semibold">Gestion du Personnel</h1>
            <p className="text-sm text-muted-foreground">
              Ajouter et gérer les personnels de la plateforme
            </p>
          </div>
        </header>

        <div className="flex-1 space-y-6 p-6">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un membre..."
                  className="pl-10 w-64"
                />
              </div>
              {/* Filtre par type de personnel */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Filtrer par type de personnel" />
                </SelectTrigger>
                <SelectContent>
                  {personnelTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                type="file"
                accept=".csv, .xls, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Importer CSV/Excel
              </Button>
              <input type="file" accept=".xlsx,.xls,.csv" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }}/>
              {importFile && (
                <span className="text-xs text-muted-foreground">
                  Fichier sélectionné : {importFile.name}
                </span>
              )}
              {importError && (
                <span className="text-xs text-destructive">{importError}</span>
              )}
            </div>

            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un personnel
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle>Ajouter un personnel</DialogTitle>
                  <DialogDescription>
                    Créez un compte pour un personnel de l'établissement
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 overflow-y-auto flex-1 p-6">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type de personnel</Label>
                    <Select
                      value={newPersonnel.type}
                      onValueChange={(value) =>
                        setNewPersonnel({ ...newPersonnel, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type de personnel" />
                      </SelectTrigger>
                      <SelectContent>
                        {personnelTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Champs dynamiques selon le type de personnel */}
                  {newPersonnel.type === "Enseignant" ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom et prénom</Label>
                        <Input
                          id="name"
                          value={newPersonnel.name}
                          onChange={(e) =>
                            setNewPersonnel({
                              ...newPersonnel,
                              name: e.target.value,
                            })
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
                            value={newPersonnel.email}
                            onChange={(e) =>
                              setNewPersonnel({
                                ...newPersonnel,
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
                            value={newPersonnel.phone}
                            onChange={(e) =>
                              setNewPersonnel({
                                ...newPersonnel,
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
                          value={newPersonnel.school}
                          onValueChange={(value) =>
                            setNewPersonnel({ ...newPersonnel, school: value })
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
                        <Label htmlFor="bank">Banque</Label>
                        <Select
                          value={newPersonnel.bank}
                          onValueChange={(value) =>
                            setNewPersonnel({ ...newPersonnel, bank: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une banque" />
                          </SelectTrigger>
                          <SelectContent>
                            {banks.map((bank) => (
                              <SelectItem key={bank} value={bank}>
                                {bank}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="level">Niveau</Label>
                        <Select
                          value={newPersonnel.level}
                          onValueChange={(value) =>
                            setNewPersonnel({ ...newPersonnel, level: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un niveau" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="secondaire">
                              Secondaire
                            </SelectItem>
                            <SelectItem value="primaire">Primaire</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subjects">Matière enseignée</Label>
                        <Select
                          value={newPersonnel.subjects}
                          onValueChange={(value) =>
                            setNewPersonnel({
                              ...newPersonnel,
                              subjects: value,
                            })
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
                            <SelectItem value="Géographie">
                              Géographie
                            </SelectItem>
                            <SelectItem value="Anglais">Anglais</SelectItem>
                            <SelectItem value="Littérature">
                              Littérature
                            </SelectItem>
                            <SelectItem value="Philosophie">
                              Philosophie
                            </SelectItem>
                            <SelectItem value="Éducation Physique">
                              Éducation Physique
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ifu">IFU</Label>
                        <Input
                          id="ifu"
                          value={newPersonnel.ifu}
                          onChange={(e) =>
                            setNewPersonnel({
                              ...newPersonnel,
                              ifu: e.target.value,
                            })
                          }
                          placeholder="Numéro IFU"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Numéro de compte</Label>
                        <Input
                          id="accountNumber"
                          value={newPersonnel.accountNumber}
                          onChange={(e) =>
                            setNewPersonnel({
                              ...newPersonnel,
                              accountNumber: e.target.value,
                            })
                          }
                          placeholder="Numéro de compte bancaire"
                        />
                      </div>
                    </>
                  ) : newPersonnel.type ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom et prénom</Label>
                        <Input
                          id="name"
                          value={newPersonnel.name}
                          onChange={(e) =>
                            setNewPersonnel({
                              ...newPersonnel,
                              name: e.target.value,
                            })
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
                            value={newPersonnel.email}
                            onChange={(e) =>
                              setNewPersonnel({
                                ...newPersonnel,
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
                            value={newPersonnel.phone}
                            onChange={(e) =>
                              setNewPersonnel({
                                ...newPersonnel,
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
                          value={newPersonnel.school}
                          onValueChange={(value) =>
                            setNewPersonnel({ ...newPersonnel, school: value })
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
                        <Label htmlFor="bank">Banque</Label>
                        <Select
                          value={newPersonnel.bank}
                          onValueChange={(value) =>
                            setNewPersonnel({ ...newPersonnel, bank: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une banque" />
                          </SelectTrigger>
                          <SelectContent>
                            {banks.map((bank) => (
                              <SelectItem key={bank} value={bank}>
                                {bank}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ifu">IFU</Label>
                        <Input
                          id="ifu"
                          value={newPersonnel.ifu}
                          onChange={(e) =>
                            setNewPersonnel({
                              ...newPersonnel,
                              ifu: e.target.value,
                            })
                          }
                          placeholder="Numéro IFU"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Numéro de compte</Label>
                        <Input
                          id="accountNumber"
                          value={newPersonnel.accountNumber}
                          onChange={(e) =>
                            setNewPersonnel({
                              ...newPersonnel,
                              accountNumber: e.target.value,
                            })
                          }
                          placeholder="Numéro de compte bancaire"
                        />
                      </div>
                    </>
                  ) : null}
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateDialog(false)}
                  >
                    Annuler
                  </Button>
                  <Button onClick={handleCreatePersonnel}>
                    Créer le personnel
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Table des personnels */}
          <Card>
            <CardHeader>
              <CardTitle>
                Liste des{" "}
                {selectedType ? selectedType.toLowerCase() + "s" : "personnels"}
              </CardTitle>
              <CardDescription>
                Gérez tous les{" "}
                {selectedType ? selectedType.toLowerCase() + "s" : "personnels"}{" "}
                de la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Établissement</TableHead>
                    <TableHead>Banque</TableHead>
                    {selectedType === "" || selectedType === "Enseignant" ? (
                      <>
                        <TableHead>Niveau</TableHead>
                        <TableHead>Matières</TableHead>
                      </>
                    ) : null}
                    <TableHead>IFU</TableHead>
                    <TableHead>Numéro de compte</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPersonnels.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={
                          selectedType === "" || selectedType === "Enseignant"
                            ? 9
                            : 7
                        }
                        className="text-center text-muted-foreground"
                      >
                        Aucun personnel trouvé pour ce type.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPersonnels.map((teacher) => (
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
                        <TableCell>{teacher.bank || "-"}</TableCell>
                        {selectedType === "" ||
                        selectedType === "Enseignant" ? (
                          <>
                            <TableCell>
                              {getLevelBadge(teacher.level || "")}
                            </TableCell>
                            <TableCell>{teacher.subjects}</TableCell>
                          </>
                        ) : null}
                        <TableCell>{teacher.ifu || "-"}</TableCell>
                        <TableCell>{teacher.accountNumber || "-"}</TableCell>
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
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
      {/* Dialog pour édition enseignant */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Modifier l'enseignant</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'enseignant
            </DialogDescription>
          </DialogHeader>
          {editTeacher && (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid gap-4 h-full">
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
                        setEditTeacher({
                          ...editTeacher,
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
                      value={editTeacher.phone}
                      onChange={(e) =>
                        setEditTeacher({
                          ...editTeacher,
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
                  <Label htmlFor="level">Niveau</Label>
                  <Select
                    value={editTeacher.level}
                    onValueChange={(value) =>
                      setEditTeacher({ ...editTeacher, level: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="secondaire">Secondaire</SelectItem>
                      <SelectItem value="primaire">Primaire</SelectItem>
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
                <div className="space-y-2">
                  <Label htmlFor="ifu">IFU</Label>
                  <Input
                    id="ifu"
                    value={editTeacher.ifu}
                    onChange={(e) =>
                      setEditTeacher({ ...editTeacher, ifu: e.target.value })
                    }
                    placeholder="Numéro IFU"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Numéro de compte</Label>
                  <Input
                    id="accountNumber"
                    value={editTeacher.accountNumber}
                    onChange={(e) =>
                      setEditTeacher({
                        ...editTeacher,
                        accountNumber: e.target.value,
                      })
                    }
                    placeholder="Numéro de compte bancaire"
                  />
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 p-6 border-t bg-background">
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
