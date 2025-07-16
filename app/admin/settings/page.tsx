"use client";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import React, { useState } from "react";

export default function AdminSettingsPage() {
  return (
    <SidebarProvider>
      <AppSidebar userRole="admin" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Paramètres Admin</h1>
            <p className="text-sm text-muted-foreground">
              Bienvenue sur la page des paramètres administrateur.
            </p>
          </div>
        </header>
        <div className="flex-1 p-6 space-y-10">
          {/* Section 1: Add New Items */}
          <section className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Ajouter des éléments</h2>
            <AddListField label="Classe" placeholder="Ajouter une classe" />
            <AddListField label="Matière" placeholder="Ajouter une matière" />
            <AddListField label="Qualité" placeholder="Ajouter une qualité" />
          </section>

          {/* Section 2: Update Existing Fields */}
          <section className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">
              Mettre à jour les informations
            </h2>
            <UpdateFields />
          </section>

          {/* Section 3: Add Third Party */}
          <section className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Ajouter un Tiers</h2>
            <AddThirdParty />
          </section>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function AddListField({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  const [input, setInput] = useState<string>("");
  const [items, setItems] = useState<string[]>([]);

  const handleAdd = () => {
    if (input.trim()) {
      setItems([...items, input.trim()]);
      setInput("");
    }
  };

  return (
    <div className="mb-4">
      <label className="block font-medium mb-1">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          className="border rounded px-3 py-2 flex-1"
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="button"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleAdd}
        >
          Ajouter
        </button>
      </div>
      <ul className="mt-2 list-disc list-inside text-sm text-gray-700 dark:text-gray-200">
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function UpdateFields() {
  const [matricule, setMatricule] = useState<string>(
    "N° / MCOT/DSEF/DASEF/DLIAA11"
  );
  const [titrePaiement, setTitrePaiement] = useState<string>(
    "ETAT DE PAIEMENT DES FRAIS D'ORGANISATION DES TRAVAUX DIRIGES AUX CANDIDATS DES EXAMENS DU CEP, BEPC ET BACCALAUREAT ANIMES PAR LES ENSEIGNANTS AU TITRE DE L'ANNEE 20215"
  );
  const [titreVirement, setTitreVirement] = useState<string>(
    "ETAT DE VIREMENT DES FRAIS D'ORGANISATION DES TRAVAUX DIRIGES AUX CANDIDATS DES EXAMENS DU CEP, BEPC ET BACCALAUREAT ANIMES PAR LES ENSEIGNANTS AU TITRE DE L'ANNEE 20215"
  );
  const [message, setMessage] = useState<string>("");

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate update
    setMessage("Informations mises à jour !");
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-4">
      <div>
        <label className="block font-medium mb-1">Numéro Matricule</label>
        <input
          type="text"
          className="border rounded px-3 py-2 w-full"
          placeholder="Entrer le numéro matricule"
          value={matricule}
          onChange={(e) => setMatricule(e.target.value.toUpperCase())}
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Titre Paiement</label>
        <input
          type="text"
          className="border rounded px-3 py-2 w-full"
          placeholder="Entrer le titre paiement"
          value={titrePaiement}
          onChange={(e) => setTitrePaiement(e.target.value.toUpperCase())}
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Titre Virement</label>
        <input
          type="text"
          className="border rounded px-3 py-2 w-full"
          placeholder="Entrer le titre virement"
          value={titreVirement}
          onChange={(e) => setTitreVirement(e.target.value.toUpperCase())}
        />
      </div>
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Mettre à jour
      </button>
      {message && <div className="text-green-600 mt-2">{message}</div>}
    </form>
  );
}

function AddThirdParty() {
  const [fonction, setFonction] = useState("");
  const [nomComplet, setNomComplet] = useState("");
  const [tiers, setTiers] = useState<
    { fonction: string; nomComplet: string }[]
  >([]);

  const handleAdd = () => {
    if (fonction.trim() && nomComplet.trim()) {
      setTiers([
        ...tiers,
        { fonction: fonction.trim(), nomComplet: nomComplet.trim() },
      ]);
      setFonction("");
      setNomComplet("");
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-2 mb-2">
        <input
          type="text"
          className="border rounded px-3 py-2 flex-1"
          placeholder="Fonction"
          value={fonction}
          onChange={(e) => setFonction(e.target.value)}
        />
        <input
          type="text"
          className="border rounded px-3 py-2 flex-1"
          placeholder="Nom complet"
          value={nomComplet}
          onChange={(e) => setNomComplet(e.target.value)}
        />
        <button
          type="button"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleAdd}
        >
          Ajouter
        </button>
      </div>
      <ul className="mt-2 list-disc list-inside text-sm text-gray-700 dark:text-gray-200">
        {tiers.map((t, idx) => (
          <li key={idx}>
            {t.fonction} - {t.nomComplet}
          </li>
        ))}
      </ul>
    </div>
  );
}
