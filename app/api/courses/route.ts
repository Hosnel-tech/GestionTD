import { NextRequest, NextResponse } from "next/server";
import { MOCK_COURSES, MOCK_TEACHERS, MOCK_TDS } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const searchParams = request.nextUrl.searchParams;
    const level_filter = searchParams.get("level");
    const teacher_filter = searchParams.get("teacherId");

    let courses = MOCK_COURSES;

    // Apply filters
    if (level_filter) {
      courses = courses.filter((course) => course.level === level_filter);
    }
    if (teacher_filter) {
      courses = courses.filter((course) => course.teacherId === teacher_filter);
    }

    // Add teacher info and statistics for each course
    const coursesWithDetails = courses.map((course) => {
      const teacher = MOCK_TEACHERS.find((t) => t.id === course.teacherId);
      const tds = MOCK_TDS.filter((td) => td.courseId === course.id);

      return {
        ...course,
        teacher: teacher
          ? {
              id: teacher.id,
              name: `${teacher.firstName} ${teacher.lastName}`,
              email: teacher.email,
              subject: teacher.subject,
            }
          : null,
        statistics: {
          totalStudents: course.enrolledStudents.length,
          totalTDs: tds.length,
          activeTDs: tds.filter((td) => td.status === "published").length,
        },
      };
    });

    return NextResponse.json({
      courses: coursesWithDetails,
      total: coursesWithDetails.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des cours" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const newCourse = await request.json();

    // Simulate creating a new course
    const course = {
      id: `course${Date.now()}`,
      ...newCourse,
      enrolledStudents: [],
    };

    // In a real app, this would be saved to a database
    MOCK_COURSES.push(course);

    return NextResponse.json(
      { course, message: "Cours créé avec succès" },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la création du cours" },
      { status: 500 },
    );
  }
}
