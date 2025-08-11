import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

type TDRow = {
  "Nom et prénoms"?: string;
  "Matière"?: string;
  "Date séance"?: string | number | Date;
  "Nombre d'heure 3ème"?: string | number;
  "Nombre d'heure Tle"?: string | number;
  "Centre"?: string;
  "Banques"?: string;
  "N° de Compte"?: string;
};

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
  if (cleaned.startsWith("co")) return "Com. Écrite";
  if (cleaned.startsWith("ce")) return "Com. Écrite";
  if (cleaned.startsWith("le")) return "Lecture";
  if (cleaned.startsWith("phy")) return "PCT";
  if (cleaned.startsWith("pc")) return "PCT";
  if (cleaned.startsWith("sv")) return "SVT";
  if (cleaned.startsWith("fra")) return "Français";
  if (cleaned.startsWith("espa")) return "Espagnol";
  if (cleaned.startsWith("allem")) return "Allemand";
  if (cleaned.startsWith("math")) return "Maths";
  if (cleaned.startsWith("eco")) return "Economie";
  if (cleaned.startsWith("hist")) return "Histoire-Géo";
  if (cleaned.startsWith("h")) return "Histoire-Géo";
  return raw;
}

export async function POST(req: NextRequest) {
  try {
    const rows: TDRow[] = await req.json();
    let inserted = 0;

    await pool.query("DELETE FROM tds");

    for (const row of rows) {
      const name = row["Nom et prénoms"]?.trim();
      const subject = normalizeSubject(row["Matière"]);
      const rawDate = row["Date séance"];
      let date: Date | null = null;

      // Date parsing
      if (Object.prototype.toString.call(rawDate) === "[object Date]") {
        date = rawDate as Date;
      } else if (typeof rawDate === "number") {
        date = new Date(Math.round((rawDate - 25569) * 86400 * 1000));
      } else if (typeof rawDate === "string") {
        const parts = rawDate.split("/");
        if (parts.length === 3) {
          const [day, month, year] = parts.map(Number);
          if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            date = new Date(year, month - 1, day);
          }
        } else {
          const parsed = new Date(rawDate);
          if (!isNaN(parsed.getTime())) {
            date = parsed;
          }
        }
      }

      const h3eme = Number(row["Nombre d'heure 3ème"] || 0);
      const hTle = Number(row["Nombre d'heure Tle"] || 0);

      let duration = 0;
      let tdClass = "";

      if (h3eme > 0) {
        duration = h3eme;
        tdClass = "3ème";
      } else if (hTle > 0) {
        duration = hTle;
        tdClass = "Tle";
      } else {
        console.log("❌ Skipped: no hours:", row);
        continue;
      }

      if (!name || !subject || !date) {
        console.log("⚠️ Skipped: missing fields:", row);
        continue;
      }

      const bank = row["Banques"]?.trim() || "";
      const accountNumber = row["N° de Compte"]?.trim() || "";
      const school = String(row["Centre"] ?? "").trim();

      const id = `td_${uuidv4()}`;
      const createdAt = new Date();

      await pool.query(
        `INSERT INTO tds (
          id, teacher, subject, class, duration, date, created_at, school, bank, account_number
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, name, subject, tdClass, duration, date, createdAt, school, bank, accountNumber]
      );

      inserted++;
    }

    return NextResponse.json({ message: `${inserted} TDs importés.` });
  } catch (err) {
    console.error("❌ Import error:", err);
    return NextResponse.json(
      { error: "Erreur lors de l'importation." },
      { status: 500 }
    );
  }
}
