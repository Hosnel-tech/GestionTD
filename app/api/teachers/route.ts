import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_TEACHERS,
  MOCK_COURSES,
  getStudentsByTeacher,
  getTDsByTeacher,
} from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const searchParams = request.nextUrl.searchParams;
    const department_filter = searchParams.get("department");
    const subject_filter = searchParams.get("subject");

    let teachers = MOCK_TEACHERS;

    // Apply filters
    if (department_filter) {
      teachers = teachers.filter(
        (teacher) => teacher.department === department_filter,
      );
    }
    if (subject_filter) {
      teachers = teachers.filter(
        (teacher) => teacher.subject === subject_filter,
      );
    }

    // Add statistics for each teacher
    const teachersWithStats = teachers.map((teacher) => {
      const students = getStudentsByTeacher(teacher.id);
      const tds = getTDsByTeacher(teacher.id);
      const courses = MOCK_COURSES.filter(
        (course) => course.teacherId === teacher.id,
      );

      return {
        ...teacher,
        statistics: {
          totalStudents: students.length,
          totalCourses: courses.length,
          totalTDs: tds.length,
          activeTDs: tds.filter((td) => td.status === "published").length,
        },
      };
    });

    return NextResponse.json({
      teachers: teachersWithStats,
      total: teachersWithStats.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des enseignants" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const newTeacher = await request.json();

    // Simulate creating a new teacher
    const teacher = {
      id: `teach${Date.now()}`,
      ...newTeacher,
      hireDate: new Date().toISOString().split("T")[0],
      status: "active" as const,
      courses: [],
    };

    // In a real app, this would be saved to a database
    MOCK_TEACHERS.push(teacher);

    return NextResponse.json(
      { teacher, message: "Enseignant créé avec succès" },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la création de l'enseignant" },
      { status: 500 },
    );
  }
}
