import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_STUDENTS,
  MOCK_COURSES,
  getGradesByStudent,
} from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const searchParams = request.nextUrl.searchParams;
    const class_filter = searchParams.get("class");
    const level_filter = searchParams.get("level");

    let students = MOCK_STUDENTS;

    // Apply filters
    if (class_filter) {
      students = students.filter((student) => student.class === class_filter);
    }
    if (level_filter) {
      students = students.filter((student) => student.level === level_filter);
    }

    // Add grade statistics for each student
    const studentsWithStats = students.map((student) => {
      const grades = getGradesByStudent(student.id);
      const totalPoints = grades.reduce((sum, grade) => sum + grade.score, 0);
      const maxPossiblePoints = grades.reduce(
        (sum, grade) => sum + grade.maxScore,
        0,
      );
      const averageGrade =
        maxPossiblePoints > 0 ? (totalPoints / maxPossiblePoints) * 20 : 0;

      const enrolledCourses = MOCK_COURSES.filter((course) =>
        course.enrolledStudents.includes(student.id),
      );

      return {
        ...student,
        statistics: {
          averageGrade: Math.round(averageGrade * 100) / 100,
          totalGrades: grades.length,
          enrolledCourses: enrolledCourses.length,
        },
      };
    });

    return NextResponse.json({
      students: studentsWithStats,
      total: studentsWithStats.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des étudiants" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const newStudent = await request.json();

    // Simulate creating a new student
    const student = {
      id: `stu${Date.now()}`,
      ...newStudent,
      enrollmentDate: new Date().toISOString().split("T")[0],
      status: "active" as const,
      grades: [],
    };

    // In a real app, this would be saved to a database
    MOCK_STUDENTS.push(student);

    return NextResponse.json(
      { student, message: "Étudiant créé avec succès" },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la création de l'étudiant" },
      { status: 500 },
    );
  }
}
