import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_TDS,
  MOCK_COURSES,
  MOCK_TEACHERS,
  MOCK_SUBMISSIONS,
} from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const searchParams = request.nextUrl.searchParams;
    const course_filter = searchParams.get("courseId");
    const teacher_filter = searchParams.get("teacherId");
    const status_filter = searchParams.get("status");

    let tds = MOCK_TDS;

    // Apply filters
    if (course_filter) {
      tds = tds.filter((td) => td.courseId === course_filter);
    }
    if (teacher_filter) {
      tds = tds.filter((td) => td.teacherId === teacher_filter);
    }
    if (status_filter) {
      tds = tds.filter((td) => td.status === status_filter);
    }

    // Add course and teacher info for each TD
    const tdsWithDetails = tds.map((td) => {
      const course = MOCK_COURSES.find((c) => c.id === td.courseId);
      const teacher = MOCK_TEACHERS.find((t) => t.id === td.teacherId);
      const submissions = MOCK_SUBMISSIONS.filter((s) => s.tdId === td.id);

      return {
        ...td,
        course: course
          ? {
              id: course.id,
              name: course.name,
              code: course.code,
              level: course.level,
            }
          : null,
        teacher: teacher
          ? {
              id: teacher.id,
              name: `${teacher.firstName} ${teacher.lastName}`,
              email: teacher.email,
            }
          : null,
        statistics: {
          totalSubmissions: submissions.length,
          gradedSubmissions: submissions.filter((s) => s.status === "graded")
            .length,
          averageScore:
            submissions.length > 0
              ? submissions
                  .filter((s) => s.score !== undefined)
                  .reduce((sum, s) => sum + (s.score || 0), 0) /
                submissions.filter((s) => s.score !== undefined).length
              : 0,
        },
      };
    });

    return NextResponse.json({
      tds: tdsWithDetails,
      total: tdsWithDetails.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des TDs" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const newTD = await request.json();

    // Simulate creating a new TD
    const td = {
      id: `td${Date.now()}`,
      ...newTD,
      createdAt: new Date().toISOString(),
      submissions: [],
    };

    // In a real app, this would be saved to a database
    MOCK_TDS.push(td);

    return NextResponse.json(
      { td, message: "TD créé avec succès" },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la création du TD" },
      { status: 500 },
    );
  }
}
