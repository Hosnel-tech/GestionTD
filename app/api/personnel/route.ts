import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  try {
    const [rows] = await pool.query("SELECT * FROM personnel");
    console.log("Rows: ", rows);
    return NextResponse.json({ personnel: rows });
  } catch (err) {
    console.error("GET /personnel error:", err);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du personnel" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      type,
      name,
      phone,
      school,
      class: className,
      subjects,
      ifu,
      accountNumber,
      level,
      bank,
    } = body;

    const id = `pers_${uuidv4()}`;
    const createdAt = new Date();

    await pool.query(
      `INSERT INTO personnel 
        (id, type, name, phone, school, class, subjects, ifu, account_number, level, bank, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        type,
        name,
        phone,
        school,
        className,
        subjects,
        ifu,
        accountNumber,
        level,
        bank,
        createdAt,
      ]
    );

    return NextResponse.json({ message: "Personnel créé", id }, { status: 201 });
  } catch (err) {
    console.error("POST /personnel error:", err);
    return NextResponse.json(
      { error: "Erreur lors de la création du personnel" },
      { status: 500 }
    );
  }
}
