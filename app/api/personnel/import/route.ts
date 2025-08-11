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
    let updated = 0;
    const now = new Date();

    // Clear table if necessary
    await pool.query("DELETE FROM personnel");

    for (const row of rows) {
      const name = String(row["Nom et prénoms"] ?? "").trim();
      const typeRaw = row["Qualité"];
      const type = String(typeRaw ?? "Inconnu").trim();
      const ifu = String(row["N° IFU"] ?? "").trim();

      if (!name || !type || !ifu) continue;

      const accountNumber = String(row["N° de Compte"] ?? "").trim();
      const bank = String(row["Banques"] ?? "").trim();
      const school = String(row["Centre"] ?? "").trim();

      let subjects = "UNDEFINED";
      if (type.toLowerCase() === "enseignant") {
        const rawSubject = String(row["Matière"] ?? "").trim();
        subjects = normalizeSubject(rawSubject) ?? rawSubject;
      }

      // Check existing IFU
      const [rowsExist] = await pool.query(
        `SELECT bank, account_number FROM personnel WHERE ifu = ?`,
        [ifu]
      );

      if (Array.isArray(rowsExist) && rowsExist.length > 0) {
        const existing = rowsExist[0] as any;
        const existingBanks = existing.bank ? String(existing.bank).split(",").map(b => b.trim()) : [];
        const existingAccounts = existing.account_number
          ? String(existing.account_number).split(",").map(a => a.trim())
          : [];

        let updatedBanks = [...existingBanks];
        let updatedAccounts = [...existingAccounts];
        let needsUpdate = false;

        if (!existingBanks.includes(bank)) {
          // New bank → add bank + account
          updatedBanks.push(bank);
          updatedAccounts.push(accountNumber);
          needsUpdate = true;
        } else if (!existingAccounts.includes(accountNumber)) {
          // Same bank, new account → add account only
          updatedAccounts.push(accountNumber);
          needsUpdate = true;
        }

        if (needsUpdate) {
          await pool.query(
            `UPDATE personnel SET bank = ?, account_number = ? WHERE ifu = ?`,
            [updatedBanks.join(", "), updatedAccounts.join(", "), ifu]
          );
          updated++;
        }

        continue; // skip insert
      }

      // Insert new record
      const id = `pers_${uuidv4()}`;
      await pool.query(
        `INSERT INTO personnel 
         (id, type, name, subjects, ifu, account_number, bank, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, type, name, subjects, ifu, accountNumber, bank, now]
      );
      inserted++;
    }

    return NextResponse.json({
      message: `${inserted} personnels importés, ${updated} mises à jour.`,
    });
  } catch (err) {
    console.error("❌ Erreur import:", err);
    return NextResponse.json(
      { error: "Erreur lors de l'importation." },
      { status: 500 }
    );
  }
}
