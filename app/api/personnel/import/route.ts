import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

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

    for (const row of rows) {
      const name =
        typeof row["Nom et prénoms"] === "string"
          ? row["Nom et prénoms"].trim()
          : String(row["Nom et prénoms"] ?? "").trim();

      const typeRaw = row["Qualité"];
      const type =
        typeof typeRaw === "string"
          ? typeRaw.trim()
          : String(typeRaw ?? "Inconnu").trim();

      const ifuRaw = row["N° IFU"];
      const ifu =
        typeof ifuRaw === "string"
          ? ifuRaw.trim()
          : String(ifuRaw ?? "").trim();

      const accountNumber =
        typeof row["N° de Compte"] === "string"
          ? row["N° de Compte"].trim()
          : String(row["N° de Compte"] ?? "").trim();

      const bank =
        typeof row["Banques"] === "string"
          ? row["Banques"].trim()
          : String(row["Banques"] ?? "").trim();

      const school =
        typeof row["Centre"] === "string"
          ? row["Centre"].trim()
          : String(row["Centre"] ?? "").trim();

      const subjects =
        type.toLowerCase() === "enseignant"
          ? typeof row["Matière"] === "string"
            ? row["Matière"].trim()
            : String(row["Matière"] ?? "").trim()
          : "UNDEFINED";

      if (!name || !ifu || !type) {
        console.log("⚠️ Skipped row (missing name/type/ifu):", row);
        continue;
      }

      const [existing] = await pool.query(
        "SELECT id FROM personnel WHERE ifu = ?",
        [ifu]
      );
      if ((existing as any[]).length > 0) {
        console.log("↩️ Already exists:", ifu);
        continue;
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
