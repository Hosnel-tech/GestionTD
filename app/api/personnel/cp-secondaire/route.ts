import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

type ExcelRow = {
  IFU?: string | number | null;
  "NOM ET PRENOMS"?: string | number | null;
  QUALITE?: string | number | null;
  FORFAIT?: string | number | null;
  "NUMERO DE COMPTE"?: string | number | null;
  BANQUE?: string | number | null;
};

export async function POST(req: NextRequest) {
  try {
    const rows: ExcelRow[] = await req.json();
    let inserted = 0;
    const now = new Date();
    await pool.query("DELETE FROM cpsecondaire");

    for (const row of rows) {
      const name = String(row["NOM ET PRENOMS"] ?? "").trim();
      const type = String(row["QUALITE"] ?? "").trim();
      const ifu = String(row["IFU"] ?? "").trim();
      const forfait = String(row["FORFAIT"] ?? "").trim();
      const accountNumber = String(row["NUMERO DE COMPTE"] ?? "").trim();
      const bank = String(row["BANQUE"] ?? "").trim();
      
      // Skip empty critical fields
      if (!name || !type || !ifu) continue;

      // Check for duplicate IFU
      const [existingRows] = await pool.query(
        `SELECT id FROM cpsecondaire WHERE ifu = ?`,
        [ifu]
      );

      if (Array.isArray(existingRows) && existingRows.length > 0) {
        console.log(`Skipping duplicate ROW:`, ifu);
        continue;
      }

      const id = `cps_${uuidv4()}`;

      await pool.query(
        `INSERT INTO cpsecondaire 
         (id, name, type, ifu, forfait, account_number, bank, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, name, type, ifu, forfait, accountNumber, bank, now]
      );

      inserted++;
    }

    return NextResponse.json({
      message: `${inserted} CPs Secondaire importés.`,
    });
  } catch (err) {
    console.error("❌ Erreur import cp secondaire:", err);
    return NextResponse.json(
      { error: "Erreur lors de l'importation des Cps Secondaire." },
      { status: 500 }
    );
  }
}
