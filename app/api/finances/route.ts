import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const [rows] = await pool.query(
      `
      SELECT 
        p.name AS name,
        p.bank AS bank,
        t.school AS school,
        t.subject,
        t.class,
        t.duration,
        t.date
      FROM tds t
      JOIN personnel p ON t.teacher = p.name
      WHERE p.type = 'Enseignant'
      `
    );

    const bankData: any = {};
    const teacherMap = new Map();
    const allDatesSet = new Set<string>();

    const ensureSchool = (bank: string, school: string) => {
      if (!bankData[bank]) bankData[bank] = { schools: {} };
      if (!bankData[bank].schools[school]) {
        bankData[bank].schools[school] = {
          secondaryTeachers: [],
        };
      }
    };

    for (const row of rows as any[]) {
      const dateKey = new Date(row.date).toLocaleDateString("fr-FR");
      const classKey = row.class === "3ème" ? "3ème" : "Tle";
      const duration = Number(row.duration); // ✅ ensure numeric duration
      const key = `${row.bank}::${row.school}::${row.name}`;

      allDatesSet.add(dateKey);
      ensureSchool(row.bank, row.school);

      if (!teacherMap.has(key)) {
        teacherMap.set(key, {
          name: row.name,
          subjectSet: new Set<string>(),
          hours: {
            total: { "3ème": 0, Tle: 0 },
          },
          rates: { "3ème": 6000, Tle: 7000 },
          amount: { "3ème": 0, Tle: 0, total: 0 },
          paid: false,
        });
      }

      const teacher = teacherMap.get(key);
      teacher.subjectSet.add(row.subject);

      // Initialize date if needed
      if (!teacher.hours[dateKey]) {
        teacher.hours[dateKey] = { "3ème": 0, Tle: 0 };
      }

      // ✅ Safely increment numbers
      teacher.hours[dateKey][classKey] += duration;
      teacher.hours.total[classKey] += duration;
      teacher.amount[classKey] += duration * teacher.rates[classKey];

      // ✅ Final total (safe addition)
      teacher.amount.total =
        Number(teacher.amount["3ème"]) + Number(teacher.amount["Tle"]);
    }

    // Finalize each teacher
    for (const [key, teacher] of teacherMap.entries()) {
      const [bank, school] = key.split("::");

      teacher.subject = Array.from(teacher.subjectSet).join(", ");
      delete teacher.subjectSet;

      bankData[bank].schools[school].secondaryTeachers.push(teacher);
    }

    return NextResponse.json({
      banks: bankData,
      dates: Array.from(allDatesSet).sort((a, b) => {
        const [d1, m1, y1] = a.split("/").map(Number);
        const [d2, m2, y2] = b.split("/").map(Number);
        return new Date(y1, m1 - 1, d1).getTime() - new Date(y2, m2 - 1, d2).getTime();
      }),
    });
  } catch (err) {
    console.error("❌ Error building finances data:", err);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des données." },
      { status: 500 }
    );
  }
}
