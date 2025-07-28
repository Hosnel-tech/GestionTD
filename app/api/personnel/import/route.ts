import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

// Subject normalization map
const subjectMap: { [key: string]: string } = {
  maths: "Maths",
  math: "Maths",
  "mathématiques": "Maths",
  "mathématique": "Maths",
  "français": "Français",
  philo: "Philosophie",
  philosophie: "Philosophie",
  svt: "SVT",
  pct: "PCT",
  anglais: "Anglais",
  economie: "Economie",
  économie: "Economie",
  allemand: "Allemand",
  "histoire-géo": "Histoire-Géo",
  "histoire": "Histoire-Géo",
};

function normalizeSubject(raw: string | undefined): string | null {
  if (!raw) return null;
  const cleaned = raw.trim().toLowerCase();

  if (subjectMap[cleaned]) return subjectMap[cleaned];

  if (cleaned.startsWith("espa")) return "Espagnol";
  if (cleaned.startsWith("allem")) return "Allemand";
  if (cleaned.startsWith("math")) return "Maths";
  if (cleaned.startsWith("eco")) return "Economie";
  if (cleaned.startsWith("hist")) return "Histoire-Géo";
  if (cleaned.startsWith("h")) return "Histoire-Géo";
  return raw;
}

type ExcelRow = {
  "Nom et prénoms"?: string | number | null;
  Qualité?: string | number | null;
  "N° IFU"?: string | number | null;
  Matière?: string | number | null;
  "N° de Compte"?: string | number | null;
  Banques?: string | number | null;
  Centre?: string | number | null;
};

export async function POST(req: NextRequest) {
  try {
    const rows: ExcelRow[] = await req.json();
    let inserted = 0;

    const seenIfus = new Set<string>();

    await pool.query("DELETE FROM personnel");

    for (const row of rows) {
      const name = String(row["Nom et prénoms"] ?? "").trim();
      const typeRaw = row["Qualité"];
      const type = String(typeRaw ?? "Inconnu").trim();
      const ifu = String(row["N° IFU"] ?? "").trim();

      if (!name || !ifu || !type) {
        console.log("⚠️ Skipped row (missing name/type/ifu):", row);
        continue;
      }

      if (seenIfus.has(ifu)) {
        console.log("↩️ Skipped duplicate IFU:", ifu);
        continue;
      }
      seenIfus.add(ifu);

      const accountNumber = String(row["N° de Compte"] ?? "").trim();
      const bank = String(row["Banques"] ?? "").trim();
      const school = String(row["Centre"] ?? "").trim();

      let subjects = "UNDEFINED";
      if (type.toLowerCase() === "enseignant") {
        const rawSubject = String(row["Matière"] ?? "").trim();
        subjects = normalizeSubject(rawSubject) ?? rawSubject;
      }

      const id = `pers_${uuidv4()}`;
      const createdAt = new Date();

      await pool.query(
        `INSERT INTO personnel 
         (id, type, name, subjects, ifu, account_number, bank, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, type, name, subjects, ifu, accountNumber, bank, createdAt]
      );

      inserted++;
    }

    return NextResponse.json({ message: `${inserted} personnels importés.` });
  } catch (err) {
    console.error("❌ Erreur import:", err);
    return NextResponse.json(
      { error: "Erreur lors de l'importation." },
      { status: 500 }
    );
  }
}
