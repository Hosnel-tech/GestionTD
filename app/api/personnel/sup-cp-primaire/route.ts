import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

type ExcelRow = {
  IFU?: string | number | null;
  "NOM ET PRENOMS"?: string | number | null;
  QUALITE?: string | number | null;
  MONTANT?: string | number | null;
  "NUMERO DE COMPTE"?: string | number | null;
  BANQUE?: string | number | null;
  "CIRCONSCRIPTION SCOLAIRE"?: string | number | null;
};

export async function POST(req: NextRequest) {
  try {
    const rows: ExcelRow[] = await req.json();
    let inserted = 0;
    const now = new Date();
    await pool.query("DELETE FROM supcpprim");

    for (const row of rows) {
      const name = String(row["NOM ET PRENOMS"] ?? "").trim();
      const type = String(row["QUALITE"] ?? "").trim();
      const ifu = String(row["IFU"] ?? "").trim();
      const forfait = String(row["MONTANT"] ?? "").trim();
      const accountNumber = String(row["NUMERO DE COMPTE"] ?? "").trim();
      const bank = String(row["BANQUE"] ?? "").trim();
      const centre = String(row["CIRCONSCRIPTION SCOLAIRE"] ?? "").trim();
      
      // Skip empty critical fields
      if (!name || !type || !ifu) continue;

      // Check for duplicate IFU
      const [existingRows] = await pool.query(
        `SELECT id FROM supcpprim WHERE ifu = ?`,
        [ifu]
      );

      if (Array.isArray(existingRows) && existingRows.length > 0) {
        console.log(`Skipping duplicate ROW:`, ifu);
        continue;
      }

      const id = `prim_${uuidv4()}`;

      await pool.query(
        `INSERT INTO supcpprim 
         (id, name, type, ifu, montant, account_number, bank, cs, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, name, type, ifu, forfait, accountNumber, bank, centre, now]
      );

      inserted++;
    }

    return NextResponse.json({
      message: `${inserted} superviseurs et CPs primaires importés.`,
    });
  } catch (err) {
    console.error("❌ Erreur import primaire:", err);
    return NextResponse.json(
      { error: "Erreur lors de l'importation des enseignants primaires." },
      { status: 500 }
    );
  }
}
