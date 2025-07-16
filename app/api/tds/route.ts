import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const course = url.searchParams.get("subject");
    const teacher = url.searchParams.get("teacherId");
    const status = url.searchParams.get("status");

    let query = "SELECT * FROM tds WHERE 1=1";
    const params: any[] = [];

    if (course) {
      query += " AND subject = ?";
      params.push(course);
    }

    if (teacher) {
      query += " AND teacher_id = ?";
      params.push(teacher);
    }

    if (status) {
      query += " AND status = ?";
      params.push(status);
    }

    query += " ORDER BY date DESC";

    const [rows] = await pool.query(query, params);

    return NextResponse.json({ tds: rows, total: rows.length });
  } catch (err) {
    console.error("GET /tds error:", err);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des TDs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Body: ', body);

    const {
      subject,
      class: tdClass,
      teacher,
      date,
      duration,
    } = body;

    const id = `td_${uuidv4()}`;
    const createdAt = new Date();

    await pool.query(
      `INSERT INTO tds (id, subject, class, teacher, date, duration, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, subject, tdClass, teacher, date, duration, createdAt]
    );

    return NextResponse.json(
      { message: "TD créé avec succès", id },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /tds error:", err);
    return NextResponse.json(
      { error: "Erreur lors de la création du TD" },
      { status: 500 }
    );
  }
}
