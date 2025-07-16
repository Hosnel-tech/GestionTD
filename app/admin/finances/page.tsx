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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DollarSign,
  FileSpreadsheet,
  FileText,
  Building2,
  Banknote,
} from "lucide-react";

// Ajout des types explicites

type SecondaryTeacher = {
  name: string;
  subject: string;
  hours: {
    lundi: { "3ème": number; Tle: number };
    mardi: { "3ème": number; Tle: number };
    mercredi: { "3ème": number; Tle: number };
    jeudi: { "3ème": number; Tle: number };
    vendredi: { "3ème": number; Tle: number };
    samedi: { "3ème": number; Tle: number };
    total: { "3ème": number; Tle: number };
  };
  rates: { "3ème": number; Tle: number };
  amount: { "3ème": number; Tle: number; total: number };
  paid: boolean;
  school?: string;
};

type PrimaryTeacher = {
  name: string;
  amount: number;
  paid: boolean;
  school?: string;
};

type School = {
  secondaryTeachers: SecondaryTeacher[];
  primaryTeachers: PrimaryTeacher[];
};

type Bank = {
  schools: { [schoolName: string]: School };
};

export default function AdminFinancesPage() {
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");

  // Données organisées par banque et école
  const bankData: { [bankName: string]: Bank } = {
    "Banque Atlantique": {
      schools: {
        "Collège Moderne de Cocody": {
          secondaryTeachers: [
            {
              name: "M. Kouassi Jean",
              subject: "Mathématiques",
              hours: {
                lundi: { "3ème": 2, Tle: 0 },
                mardi: { "3ème": 0, Tle: 3 },
                mercredi: { "3ème": 2, Tle: 2 },
                jeudi: { "3ème": 1, Tle: 0 },
                vendredi: { "3ème": 0, Tle: 2 },
                samedi: { "3ème": 1, Tle: 1 },
                total: { "3ème": 6, Tle: 8 },
              },
              rates: { "3ème": 6000, Tle: 7000 },
              amount: { "3ème": 36000, Tle: 56000, total: 92000 },
              paid: false,
            },
            {
              name: "Mme Diabaté Marie",
              subject: "Français",
              hours: {
                lundi: { "3ème": 1, Tle: 2 },
                mardi: { "3ème": 2, Tle: 1 },
                mercredi: { "3ème": 0, Tle: 0 },
                jeudi: { "3ème": 2, Tle: 2 },
                vendredi: { "3ème": 1, Tle: 3 },
                samedi: { "3ème": 0, Tle: 0 },
                total: { "3ème": 6, Tle: 8 },
              },
              rates: { "3ème": 6000, Tle: 7000 },
              amount: { "3ème": 36000, Tle: 56000, total: 92000 },
              paid: true,
            },
          ],
          primaryTeachers: [
            { name: "M. Traoré Paul", amount: 50000, paid: false },
            { name: "Mme Koné Fatou", amount: 50000, paid: true },
          ],
        },
        "Lycée Technique d'Abidjan": {
          secondaryTeachers: [
            {
              name: "M. Yao Pierre",
              subject: "Physique-Chimie",
              hours: {
                lundi: { "3ème": 1, Tle: 1 },
                mardi: { "3ème": 2, Tle: 2 },
                mercredi: { "3ème": 1, Tle: 1 },
                jeudi: { "3ème": 0, Tle: 2 },
                vendredi: { "3ème": 2, Tle: 1 },
                samedi: { "3ème": 0, Tle: 1 },
                total: { "3ème": 6, Tle: 8 },
              },
              rates: { "3ème": 6000, Tle: 7000 },
              amount: { "3ème": 36000, Tle: 56000, total: 92000 },
              paid: false,
            },
          ],
          primaryTeachers: [],
        },
      },
    },
    SGBCI: {
      schools: {
        "École Primaire Les Palmiers": {
          secondaryTeachers: [],
          primaryTeachers: [
            { name: "M. Ouattara Ibrahim", amount: 50000, paid: false },
            { name: "Mme Bamba Aïcha", amount: 50000, paid: true },
            { name: "M. Doumbia Sekou", amount: 50000, paid: false },
          ],
        },
        "Collège Sainte-Marie": {
          secondaryTeachers: [
            {
              name: "Mme Koffi Adjoua",
              subject: "Histoire-Géographie",
              hours: {
                lundi: { "3ème": 2, Tle: 1 },
                mardi: { "3ème": 1, Tle: 2 },
                mercredi: { "3ème": 1, Tle: 1 },
                jeudi: { "3ème": 1, Tle: 2 },
                vendredi: { "3ème": 1, Tle: 2 },
                samedi: { "3ème": 0, Tle: 0 },
                total: { "3ème": 6, Tle: 8 },
              },
              rates: { "3ème": 6000, Tle: 7000 },
              amount: { "3ème": 36000, Tle: 56000, total: 92000 },
              paid: false,
            },
          ],
          primaryTeachers: [],
        },
      },
    },
    Ecobank: {
      schools: {
        "Groupe Scolaire Excellence": {
          secondaryTeachers: [
            {
              name: "M. Assi Kouamé",
              subject: "Anglais",
              hours: {
                lundi: { "3ème": 1, Tle: 2 },
                mardi: { "3ème": 2, Tle: 1 },
                mercredi: { "3ème": 1, Tle: 2 },
                jeudi: { "3ème": 1, Tle: 1 },
                vendredi: { "3ème": 1, Tle: 2 },
                samedi: { "3ème": 0, Tle: 0 },
                total: { "3ème": 6, Tle: 8 },
              },
              rates: { "3ème": 6000, Tle: 7000 },
              amount: { "3ème": 36000, Tle: 56000, total: 92000 },
              paid: true,
            },
          ],
          primaryTeachers: [
            { name: "Mme Coulibaly Mariam", amount: 50000, paid: false },
          ],
        },
      },
    },
  };

  const banks = Object.keys(bankData);
  const schools = selectedBank
    ? Object.keys(bankData[selectedBank]?.schools || {})
    : [];

  const getCurrentData = (): {
    secondaryTeachers: SecondaryTeacher[];
    primaryTeachers: PrimaryTeacher[];
  } => {
    if (!selectedBank) return { secondaryTeachers: [], primaryTeachers: [] };

    // Correction : gérer explicitement le cas 'all' pour selectedSchool
    if (selectedSchool && selectedSchool !== "all") {
      return (
        bankData[selectedBank].schools[selectedSchool] || {
          secondaryTeachers: [],
          primaryTeachers: [],
        }
      );
    }

    // Agrégation de toutes les écoles de la banque
    const allSecondaryTeachers: SecondaryTeacher[] = [];
    const allPrimaryTeachers: PrimaryTeacher[] = [];

    Object.entries(bankData[selectedBank].schools).forEach(
      ([schoolName, schoolData]: [string, School]) => {
        (schoolData as School).secondaryTeachers.forEach(
          (teacher: SecondaryTeacher) => {
            allSecondaryTeachers.push({ ...teacher, school: schoolName });
          }
        );
        (schoolData as School).primaryTeachers.forEach(
          (teacher: PrimaryTeacher) => {
            allPrimaryTeachers.push({ ...teacher, school: schoolName });
          }
        );
      }
    );

    return {
      secondaryTeachers: allSecondaryTeachers,
      primaryTeachers: allPrimaryTeachers,
    };
  };

  const currentData = getCurrentData();

  const handlePayment = (teacherName: string) => {
    console.log(`Paiement effectué pour ${teacherName}`);
  };

  const exportData = (format: string) => {
    const exportInfo = {
      bank: selectedBank,
      school: selectedSchool || "Toutes les écoles",
      level: selectedLevel,
      format: format,
    };
    console.log(`Export en format ${format}:`, exportInfo);
  };

  const getTotalsByBank = () => {
    if (!selectedBank)
      return { total: 0, paid: 0, pending: 0, teachersCount: 0 };

    let total = 0,
      paid = 0,
      pending = 0,
      teachersCount = 0;

    Object.values(bankData[selectedBank].schools).forEach((school: School) => {
      school.secondaryTeachers.forEach((teacher: SecondaryTeacher) => {
        total += teacher.amount.total;
        if (teacher.paid) paid += teacher.amount.total;
        else pending += teacher.amount.total;
        teachersCount++;
      });
      school.primaryTeachers.forEach((teacher: PrimaryTeacher) => {
        total += teacher.amount;
        if (teacher.paid) paid += teacher.amount;
        else pending += teacher.amount;
        teachersCount++;
      });
    });

    return { total, paid, pending, teachersCount };
  };

  const bankStats = selectedBank
    ? getTotalsByBank()
    : { total: 0, paid: 0, pending: 0, teachersCount: 0 };

  return (
    <SidebarProvider>
      <AppSidebar userRole="admin" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Gestion Financière</h1>
            <p className="text-sm text-muted-foreground">
              Paiements par banque et école
            </p>
          </div>
        </header>

        <div className="flex-1 space-y-6 p-6">
          {/* Boutons état de paiement et état de virement */}
          <div className="flex gap-4 mb-2">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-6 py-3 text-base font-semibold flex items-center gap-2 shadow"
              type="button"
            >
              <DollarSign className="h-5 w-5" />
              État de paiement
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 text-base font-semibold flex items-center gap-2 shadow"
              type="button"
            >
              <Banknote className="h-5 w-5" />
              État de virement
            </Button>
          </div>
          {/* Filtres et Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex gap-4">
              <Select value={selectedBank} onValueChange={setSelectedBank}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sélectionner la banque" />
                </SelectTrigger>
                <SelectContent>
                  {banks.map((bank) => (
                    <SelectItem key={bank} value={bank}>
                      <div className="flex items-center gap-2">
                        <Banknote className="h-4 w-4" />
                        {bank}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedBank && (
                <Select
                  value={selectedSchool}
                  onValueChange={setSelectedSchool}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Toutes les écoles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les écoles</SelectItem>
                    {schools.map((school) => (
                      <SelectItem key={school} value={school}>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          {school}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {selectedBank && (
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Tous les niveaux" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les niveaux</SelectItem>
                    <SelectItem value="primaire">Primaire</SelectItem>
                    <SelectItem value="secondaire">Secondaire</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* Statistiques par banque */}
          {/*
          {selectedBank && (
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total {selectedBank}
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {bankStats.total.toLocaleString()} FCFA
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Montant total à payer
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Payé
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {bankStats.paid.toLocaleString()} FCFA
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Montant déjà payé
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    En attente
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {bankStats.pending.toLocaleString()} FCFA
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Montant en attente de paiement
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Nombre de bénéficiaires
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {bankStats.teachersCount}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enseignants concernés
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
*/}

          {/* Tableau Secondaire */}
          {selectedBank &&
            (!selectedLevel ||
              selectedLevel === "secondaire" ||
              selectedLevel === "all") &&
            currentData.secondaryTeachers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Paiements Enseignants - Secondaire</CardTitle>
                  <CardDescription>
                    {selectedBank}{" "}
                    {selectedSchool
                      ? `- ${selectedSchool}`
                      : "- Toutes les écoles"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead rowSpan={3} className="border-r">
                            École
                          </TableHead>
                          <TableHead rowSpan={3} className="border-r">
                            Enseignant
                          </TableHead>
                          <TableHead
                            colSpan={14}
                            className="text-center border-r"
                          >
                            Nombre d'heures
                          </TableHead>
                          <TableHead rowSpan={3} className="border-r">
                            Matière
                          </TableHead>
                          <TableHead
                            colSpan={2}
                            className="text-center border-r"
                          >
                            Taux horaire
                          </TableHead>
                          <TableHead
                            rowSpan={3}
                            className="text-center border-r"
                          >
                            Montant total
                          </TableHead>
                        </TableRow>
                        <TableRow>
                          <TableHead className="text-center">3ème</TableHead>
                          <TableHead className="text-center border-r">
                            Tle
                          </TableHead>
                          <TableHead className="text-center">3ème</TableHead>
                          <TableHead className="text-center border-r">
                            Tle
                          </TableHead>
                          <TableHead className="text-center">3ème</TableHead>
                          <TableHead className="text-center border-r">
                            Tle
                          </TableHead>
                          <TableHead className="text-center">3ème</TableHead>
                          <TableHead className="text-center border-r">
                            Tle
                          </TableHead>
                          <TableHead className="text-center">3ème</TableHead>
                          <TableHead className="text-center border-r">
                            Tle
                          </TableHead>
                          <TableHead className="text-center">3ème</TableHead>
                          <TableHead className="text-center border-r">
                            Tle
                          </TableHead>
                          <TableHead className="text-center">3ème</TableHead>
                          <TableHead className="text-center border-r">
                            Tle
                          </TableHead>
                          <TableHead className="text-center">6000</TableHead>
                          <TableHead className="text-center border-r">
                            7000
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentData.secondaryTeachers.map(
                          (teacher: SecondaryTeacher, index: number) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium border-r text-sm">
                                {teacher.school || selectedSchool}
                              </TableCell>
                              <TableCell className="font-medium border-r">
                                {teacher.name}
                              </TableCell>
                              <TableCell className="text-center">
                                {teacher.hours?.lundi?.["3ème"] ?? 0}
                              </TableCell>
                              <TableCell className="text-center border-r">
                                {teacher.hours?.lundi?.["Tle"] ?? 0}
                              </TableCell>
                              <TableCell className="text-center">
                                {teacher.hours?.mardi?.["3ème"] ?? 0}
                              </TableCell>
                              <TableCell className="text-center border-r">
                                {teacher.hours?.mardi?.["Tle"] ?? 0}
                              </TableCell>
                              <TableCell className="text-center">
                                {teacher.hours?.mercredi?.["3ème"] ?? 0}
                              </TableCell>
                              <TableCell className="text-center border-r">
                                {teacher.hours?.mercredi?.["Tle"] ?? 0}
                              </TableCell>
                              <TableCell className="text-center">
                                {teacher.hours?.jeudi?.["3ème"] ?? 0}
                              </TableCell>
                              <TableCell className="text-center border-r">
                                {teacher.hours?.jeudi?.["Tle"] ?? 0}
                              </TableCell>
                              <TableCell className="text-center">
                                {teacher.hours?.vendredi?.["3ème"] ?? 0}
                              </TableCell>
                              <TableCell className="text-center border-r">
                                {teacher.hours?.vendredi?.["Tle"] ?? 0}
                              </TableCell>
                              <TableCell className="text-center">
                                {teacher.hours?.samedi?.["3ème"] ?? 0}
                              </TableCell>
                              <TableCell className="text-center border-r">
                                {teacher.hours?.samedi?.["Tle"] ?? 0}
                              </TableCell>
                              <TableCell className="text-center font-medium">
                                {teacher.hours?.total?.["3ème"] ?? 0}
                              </TableCell>
                              <TableCell className="text-center font-medium border-r">
                                {teacher.hours?.total?.["Tle"] ?? 0}
                              </TableCell>
                              <TableCell className="border-r">
                                {teacher.subject}
                              </TableCell>
                              <TableCell className="text-center">
                                {teacher.rates?.["3ème"]?.toLocaleString?.() ??
                                  0}
                              </TableCell>
                              <TableCell className="text-center border-r">
                                {teacher.rates?.["Tle"]?.toLocaleString?.() ??
                                  0}
                              </TableCell>
                              <TableCell className="text-center border-r font-bold">
                                {teacher.amount?.total?.toLocaleString?.() ?? 0}{" "}
                                FCFA
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                    {/* Bouton paiement global */}
                    <div className="flex justify-end mt-4">
                      <Button
                        variant="default"
                        onClick={() => {
                          currentData.secondaryTeachers.forEach((teacher) =>
                            handlePayment(teacher.name)
                          );
                        }}
                        disabled={currentData.secondaryTeachers.every(
                          (teacher) => teacher.paid
                        )}
                      >
                        Payer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Tableau Primaire */}
          {selectedBank &&
            (!selectedLevel ||
              selectedLevel === "primaire" ||
              selectedLevel === "all") &&
            currentData.primaryTeachers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Paiements Enseignants - Primaire</CardTitle>
                  <CardDescription>
                    {selectedBank}{" "}
                    {selectedSchool
                      ? `- ${selectedSchool}`
                      : "- Toutes les écoles"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>École</TableHead>
                        <TableHead>Enseignant</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Paiement</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentData.primaryTeachers.map(
                        (teacher: PrimaryTeacher, index: number) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium text-sm">
                              {teacher.school || selectedSchool}
                            </TableCell>
                            <TableCell className="font-medium">
                              {teacher.name}
                            </TableCell>
                            <TableCell>
                              {teacher.amount?.toLocaleString?.() ?? 0} FCFA
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant={teacher.paid ? "secondary" : "default"}
                                disabled={teacher.paid}
                                onClick={() => handlePayment(teacher.name)}
                              >
                                {teacher.paid ? "Payé" : "Payer"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

          {/* Message si aucune banque sélectionnée */}
          {!selectedBank && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Banknote className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Sélectionnez une banque
                </h3>
                <p className="text-muted-foreground text-center">
                  Choisissez une banque pour voir les paiements des enseignants
                  et exporter les données
                </p>
              </CardContent>
            </Card>
          )}

          {/* Message si aucune donnée */}
          {selectedBank &&
            currentData.secondaryTeachers.length === 0 &&
            currentData.primaryTeachers.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Aucune donnée disponible
                  </h3>
                  <p className="text-muted-foreground text-center">
                    Aucun enseignant trouvé pour les critères sélectionnés
                  </p>
                </CardContent>
              </Card>
            )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
