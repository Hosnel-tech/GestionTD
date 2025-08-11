import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

type ExcelRow = {
  "MATRICULE/IFU"?: string | number | null;
  "NOM ET PRENOMS"?: string | number | null;
  QUALITE?: string | number | null;
  MONTANT?: string | number | null;
  "NUMERO DE COMPTE"?: string | number | null;
  BANQUE?: string | number | null;
  "NBRE JOURS"?: string | number | null;
  INDICE?: string | number | null;
  "PRIME  JOURNALIERE"?: string | number | null;
};

export async function POST(req: NextRequest) {
  try {
    const rows: ExcelRow[] = await req.json();
    let inserted = 0;
    const now = new Date();
    await pool.query("DELETE FROM mcoord");

    for (const row of rows) {
      const name = String(row["NOM ET PRENOMS"] ?? "").trim();
      const type = String(row["QUALITE"] ?? "").trim();
      const ifu = String(row["MATRICULE/IFU"] ?? "").trim();
      const forfait = String(row["MONTANT"] ?? "").trim();
      const accountNumber = String(row["NUMERO DE COMPTE"] ?? "").trim();
      const bank = String(row["BANQUE"] ?? "").trim();
      const indice = String(row["INDICE"] ?? "").trim();
      const n_days = String(row["NBRE JOURS"] ?? "").trim();
      const daily_p = String(row["PRIME  JOURNALIERE"] ?? "").trim();
      // Skip empty critical fields
      if (!name || !type || !ifu) continue;

    // Check for duplicate IFU
      const [existingRows] = await pool.query(
        `SELECT id FROM mcoord WHERE ifu = ?`,
        [ifu]
      );

      if (Array.isArray(existingRows) && existingRows.length > 0) {
        console.log(`Skipping duplicate ROW:`, ifu);
        continue;
      }

      const id = `coord_${uuidv4()}`;

      await pool.query(
        `INSERT INTO mcoord 
         (id, name, type, ifu, montant, account_number, bank, indice, n_days, daily_p, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, name, type, ifu, forfait, accountNumber, bank, indice, n_days, daily_p, now]
      );

      inserted++;
    }

    return NextResponse.json({
      message: `${inserted} Membres de la Coordination importés.`,
    });
  } catch (err) {
    console.error("❌ Erreur import membres coordination:", err);
    return NextResponse.json(
      { error: "Erreur lors de l'importation des Membres de la Coordination." },
      { status: 500 }
    );
  }
}
