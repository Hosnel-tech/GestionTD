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
};

export async function POST(req: NextRequest) {
  try {
    const rows: TDRow[] = await req.json();
    let inserted = 0;

    for (const row of rows) {
      const name = row["Nom et prénoms"]?.trim();
      const subject = row["Matière"]?.trim();
      const rawDate = row["Date séance"];
      let date: Date | null = null;

      // Parse date from Excel or string format
      if (Object.prototype.toString.call(rawDate) === "[object Date]") {
        date = rawDate as Date;
      } else if (typeof rawDate === "number") {
        // Excel serial date format
        date = new Date(Math.round((rawDate - 25569) * 86400 * 1000));
      } else if (typeof rawDate === "string") {
        // Handle DD/MM/YYYY format
        const parts = rawDate.split("/");
        if (parts.length === 3) {
          const [day, month, year] = parts.map(Number);
          if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            date = new Date(year, month - 1, day); // JS months = 0-indexed
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
        console.log("❌ Skipped: no hours provided:", row);
        continue;
      }

      if (!name || !subject || !date) {
        console.log("⚠️ Skipped: missing fields:", row);
        continue;
      }

      const id = `td_${uuidv4()}`;
      const createdAt = new Date();
      const school = String(row["Centre"]);

      await pool.query(
        `INSERT INTO tds (id, teacher, subject, class, duration, date, created_at, school)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, name, subject, tdClass, duration, date, createdAt, school]
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
