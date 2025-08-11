import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

type ExcelRow = {
  IFU?: string | number | null;
  "Nom et prénoms"?: string | number | null;
  Qualité?: string | number | null;
  Forfait?: string | number | null;
  "N° de Compte"?: string | number | null;
  Banques?: string | number | null;
  Centre?: string | number | null;
};

export async function POST(req: NextRequest) {
  try {
    const rows: ExcelRow[] = await req.json();
    let inserted = 0;
    const now = new Date();
    await pool.query("DELETE FROM dircenssuv");

    for (const row of rows) {
      const name = String(row["Nom et prénoms"] ?? "").trim();
      const type = String(row["Qualité"] ?? "").trim();
      const ifu = String(row["IFU"] ?? "").trim();
      const forfait = String(row["Forfait"] ?? "").trim();
      const accountNumber = String(row["N° de Compte"] ?? "").trim();
      const bank = String(row["Banques"] ?? "").trim();
      const centre = String(row["Centre"] ?? "").trim();
      
      // Skip empty critical fields
      if (!name || !type || !ifu) continue;

      // Check for duplicate IFU
      const [existingRows] = await pool.query(
        `SELECT id FROM dircenssuv WHERE ifu = ?`,
        [ifu]
      );

      if (Array.isArray(existingRows) && existingRows.length > 0) {
        console.log(`Skipping duplicate ROW:`, ifu);
        continue;
      }

      const id = `dcs_${uuidv4()}`;

      await pool.query(
        `INSERT INTO dircenssuv 
         (id, name, type, ifu, forfait, account_number, bank, school, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, name, type, ifu, forfait, accountNumber, bank, centre, now]
      );

      inserted++;
    }

    return NextResponse.json({
      message: `${inserted} Directeurs, Censeurs et Surveillants importés.`,
    });
  } catch (err) {
    console.error("❌ Erreur import dir-cens-surv:", err);
    return NextResponse.json(
      { error: "Erreur lors de l'importation des directeurs, censeurs et surveillants." },
      { status: 500 }
    );
  }
}
