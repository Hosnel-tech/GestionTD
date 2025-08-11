import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT name, bank, account_number, subjects, type
      FROM personnel
      WHERE type = 'Enseignant'
    `);

    const users = (rows as any[]).map((row) => {
      const banks = String(row.bank ?? "").split(",").map((b) => b.trim()).filter(Boolean);
      const accounts = String(row.account_number ?? "").split(",").map((a) => a.trim()).filter(Boolean);

      const issues = [];
      if (banks.length > 1) issues.push("plusieurs banques");
      if (accounts.length > 1) issues.push("plusieurs numéros de compte");

      return {
        name: row.name,
        type: row.type,
        banks,
        accounts,
        subjects: row.subjects,
        issues,
      };
    }).filter((user) => user.issues.length > 0);

    return NextResponse.json({ users });
  } catch (err) {
    console.error("❌ Conflict check error:", err);
    return NextResponse.json({ error: "Erreur de récupération." }, { status: 500 });
  }
}
