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

    const ensureSecondarySchool = (bank: string, school: string) => {
      if (!bankData[bank]) bankData[bank] = { secondarySchools: {}, primarySchools: {} };
      if (!bankData[bank].secondarySchools[school]) {
        bankData[bank].secondarySchools[school] = {
          secondaryTeachers: [],
        };
      }
    };

    const ensurePrimarySchool = (bank: string, school: string) => {
      if (!bankData[bank]) bankData[bank] = { secondarySchools: {}, primarySchools: {} };
      if (!bankData[bank].primarySchools[school]) {
        bankData[bank].primarySchools[school] = {
          primaryTeachers: [],
        };
      }
    };

    // secondary teachers
    for (const row of rows as any[]) {
      const dateKey = new Date(row.date).toLocaleDateString("fr-FR");
      const classKey = row.class === "3ème" ? "3ème" : "Tle";
      const duration = Number(row.duration);
      const key = `${row.bank}::${row.school}::${row.name}`;

      allDatesSet.add(dateKey);
      ensureSecondarySchool(row.bank, row.school);

      if (!teacherMap.has(key)) {
        teacherMap.set(key, {
          name: row.name,
          subjectSet: new Set<string>(),
          hours: {
            total: { "3ème": 0, Tle: 0 },
          },
          rates: { "3ème": 6000, Tle: 7000 },
          amount: { "3ème": 0, Tle: 0, total: 0 },
        });
      }

      const teacher = teacherMap.get(key);
      teacher.subjectSet.add(row.subject);

      if (!teacher.hours[dateKey]) {
        teacher.hours[dateKey] = { "3ème": 0, Tle: 0 };
      }

      teacher.hours[dateKey][classKey] += duration;
      teacher.hours.total[classKey] += duration;
      teacher.amount[classKey] += duration * teacher.rates[classKey];
      teacher.amount.total =
        Number(teacher.amount["3ème"]) + Number(teacher.amount["Tle"]);
    }

    for (const [key, teacher] of teacherMap.entries()) {
      const [bank, school] = key.split("::");
      teacher.subject = Array.from(teacher.subjectSet).join(", ");
      delete teacher.subjectSet;

      bankData[bank].secondarySchools[school].secondaryTeachers.push(teacher);
    }

    // primary teachers
    const [primaryRows] = await pool.query(
      `SELECT name, bank, centre AS school, forfait, type FROM primaire`
    );

    for (const row of primaryRows as any[]) {
      const bank = row.bank || "INCONNU";
      const school = row.school || "INCONNU";
      const type = row.type || "INCONNU";
      ensurePrimarySchool(bank, school);

      const forfait = Number(row.forfait) || 0;

      bankData[bank].primarySchools[school].primaryTeachers.push({
        name: row.name,
        forfait,
        type,
      });
    }

    //supervisors and CPs (primaire)

    const [supcpRows] = await pool.query(
      `SELECT name, bank, cs AS school, montant, type FROM supcpprim`
    );

    for (const row of supcpRows as any[]) {
      const bank = row.bank || "INCONNU";
      const school = row.school || "INCONNU";
      const type = row.type || "INCONNU";
      ensurePrimarySchool(bank, school);

      const montant = Number(row.montant) || 0;

      if (!bankData[bank].primarySchools[school].supervisors) {
        bankData[bank].primarySchools[school].supervisors = [];
      }

      bankData[bank].primarySchools[school].supervisors.push({
        name: row.name,
        montant,
        type,
      });
    }

    // directeurs, censeurs, surveillants (secondaire)
    const [dirCensSuvRows] = await pool.query(
      `SELECT name, type, forfait, bank, school FROM dircenssuv`
    );

    for (const row of dirCensSuvRows as any[]) {
      const bank = row.bank || "INCONNU";
      const school = row.school || "INCONNU";
      const type = row.type || "INCONNU";
      ensureSecondarySchool(bank, school);

      if (!bankData[bank].secondarySchools[school].dirCensSuv) {
        bankData[bank].secondarySchools[school].dirCensSuv = [];
      }

      bankData[bank].secondarySchools[school].dirCensSuv.push({
        name: row.name,
        forfait: Number(row.forfait) || 0,
        type,
      });
    }

    // CPs Secondaire (no school, grouped by bank only)
    const [cpSecRows] = await pool.query(
      `SELECT name, type, forfait, bank FROM cpsecondaire`
    );

    for (const row of cpSecRows as any[]) {
      const bank = row.bank || "INCONNU";
      const type = row.type || "INCONNU";
      const forfait = Number(row.forfait) || 0;

      if (!bankData[bank]) {
        bankData[bank] = { secondarySchools: {}, primarySchools: {} };
      }

      if (!bankData[bank].secondaryCp) {
        bankData[bank].secondaryCp = [];
      }

      bankData[bank].secondaryCp.push({
        name: row.name,
        type,
        forfait,
      });
    }

    // Membres de la Coordination (no school, grouped by bank only)
    const [mcoordRows] = await pool.query(
      `SELECT name, type, montant, bank, indice, n_days, daily_p FROM mcoord`
    );

    for (const row of mcoordRows as any[]) {
      const bank = row.bank || "INCONNU";
      const type = row.type || "INCONNU";
      const montant = Number(row.montant) || 0;
      const indice = row.indice || 0;
      const n_days = row.n_days  || 0;
      const daily_p = row.daily_p || 0;

      if (!bankData[bank]) {
        bankData[bank] = { secondarySchools: {}, primarySchools: {} };
      }

      if (!bankData[bank].mcoord) {
        bankData[bank].mcoord = [];
      }

      bankData[bank].mcoord.push({
        name: row.name,
        type,
        montant,
        indice,
        n_days,
        daily_p
      });
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
