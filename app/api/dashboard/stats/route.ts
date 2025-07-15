import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_STUDENTS,
  MOCK_TEACHERS,
  MOCK_COURSES,
  MOCK_TDS,
  MOCK_SUBMISSIONS,
  MOCK_GRADES,
  getTDsByTeacher,
  getSubmissionsByStudent,
  getGradesByStudent,
} from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get("role");
    const userId = searchParams.get("userId");

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (role === "admin") {
      // Admin dashboard stats
      const totalStudents = MOCK_STUDENTS.length;
      const totalTeachers = MOCK_TEACHERS.length;
      const totalCourses = MOCK_COURSES.length;
      const totalTDs = MOCK_TDS.length;
      const activeTDs = MOCK_TDS.filter(
        (td) => td.status === "published",
      ).length;
      const totalSubmissions = MOCK_SUBMISSIONS.length;
      const gradedSubmissions = MOCK_SUBMISSIONS.filter(
        (s) => s.status === "graded",
      ).length;

      // Recent activity
      const recentTDs = MOCK_TDS.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
        .slice(0, 5)
        .map((td) => {
          const course = MOCK_COURSES.find((c) => c.id === td.courseId);
          const teacher = MOCK_TEACHERS.find((t) => t.id === td.teacherId);
          return {
            ...td,
            courseName: course?.name,
            teacherName: teacher
              ? `${teacher.firstName} ${teacher.lastName}`
              : "",
          };
        });

      const recentSubmissions = MOCK_SUBMISSIONS.sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
      )
        .slice(0, 5)
        .map((sub) => {
          const student = MOCK_STUDENTS.find((s) => s.id === sub.studentId);
          const td = MOCK_TDS.find((t) => t.id === sub.tdId);
          return {
            ...sub,
            studentName: student
              ? `${student.firstName} ${student.lastName}`
              : "",
            tdTitle: td?.title,
          };
        });

      return NextResponse.json({
        overview: {
          totalStudents,
          totalTeachers,
          totalCourses,
          totalTDs,
          activeTDs,
          totalSubmissions,
          gradedSubmissions,
          pendingGrading: totalSubmissions - gradedSubmissions,
        },
        recentActivity: {
          recentTDs,
          recentSubmissions,
        },
      });
    }

    if (role === "teacher" && userId) {
      // Teacher dashboard stats
      const teacherCourses = MOCK_COURSES.filter((c) => c.teacherId === userId);
      const teacherTDs = getTDsByTeacher(userId);
      const activeTDs = teacherTDs.filter((td) => td.status === "published");

      // Get all submissions for teacher's TDs
      const teacherSubmissions = MOCK_SUBMISSIONS.filter((sub) =>
        teacherTDs.some((td) => td.id === sub.tdId),
      );
      const pendingGrading = teacherSubmissions.filter(
        (sub) => sub.status === "submitted",
      );

      // Get students enrolled in teacher's courses
      const enrolledStudentIds = new Set(
        teacherCourses.flatMap((c) => c.enrolledStudents),
      );
      const totalStudents = enrolledStudentIds.size;

      const recentSubmissions = teacherSubmissions
        .sort(
          (a, b) =>
            new Date(b.submittedAt).getTime() -
            new Date(a.submittedAt).getTime(),
        )
        .slice(0, 5)
        .map((sub) => {
          const student = MOCK_STUDENTS.find((s) => s.id === sub.studentId);
          const td = MOCK_TDS.find((t) => t.id === sub.tdId);
          return {
            ...sub,
            studentName: student
              ? `${student.firstName} ${student.lastName}`
              : "",
            tdTitle: td?.title,
          };
        });

      return NextResponse.json({
        overview: {
          totalCourses: teacherCourses.length,
          totalStudents,
          totalTDs: teacherTDs.length,
          activeTDs: activeTDs.length,
          totalSubmissions: teacherSubmissions.length,
          pendingGrading: pendingGrading.length,
        },
        recentActivity: {
          recentSubmissions,
          upcomingDeadlines: activeTDs
            .filter((td) => new Date(td.dueDate) > new Date())
            .sort(
              (a, b) =>
                new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
            )
            .slice(0, 3),
        },
      });
    }

    if (role === "student" && userId) {
      // Student dashboard stats
      const studentCourses = MOCK_COURSES.filter((c) =>
        c.enrolledStudents.includes(userId),
      );
      const availableTDs = MOCK_TDS.filter(
        (td) =>
          studentCourses.some((course) => course.id === td.courseId) &&
          td.status === "published",
      );
      const studentSubmissions = getSubmissionsByStudent(userId);
      const studentGrades = getGradesByStudent(userId);

      const submittedTDs = availableTDs.filter((td) =>
        studentSubmissions.some((sub) => sub.tdId === td.id),
      );
      const pendingTDs = availableTDs.filter(
        (td) =>
          !studentSubmissions.some((sub) => sub.tdId === td.id) &&
          new Date(td.dueDate) > new Date(),
      );

      // Calculate average grade
      const totalPoints = studentGrades.reduce(
        (sum, grade) => sum + grade.score,
        0,
      );
      const maxPossiblePoints = studentGrades.reduce(
        (sum, grade) => sum + grade.maxScore,
        0,
      );
      const averageGrade =
        maxPossiblePoints > 0 ? (totalPoints / maxPossiblePoints) * 20 : 0;

      const upcomingDeadlines = pendingTDs
        .sort(
          (a, b) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
        )
        .slice(0, 3)
        .map((td) => {
          const course = MOCK_COURSES.find((c) => c.id === td.courseId);
          return {
            ...td,
            courseName: course?.name,
          };
        });

      return NextResponse.json({
        overview: {
          totalCourses: studentCourses.length,
          availableTDs: availableTDs.length,
          submittedTDs: submittedTDs.length,
          pendingTDs: pendingTDs.length,
          totalGrades: studentGrades.length,
          averageGrade: Math.round(averageGrade * 100) / 100,
        },
        recentActivity: {
          upcomingDeadlines,
          recentGrades: studentGrades
            .sort(
              (a, b) =>
                new Date(b.gradedAt).getTime() - new Date(a.gradedAt).getTime(),
            )
            .slice(0, 3)
            .map((grade) => {
              const course = MOCK_COURSES.find((c) => c.id === grade.courseId);
              const td = MOCK_TDS.find((t) => t.id === grade.tdId);
              return {
                ...grade,
                courseName: course?.name,
                tdTitle: td?.title,
              };
            }),
        },
      });
    }

    return NextResponse.json(
      { error: "Paramètres manquants" },
      { status: 400 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des statistiques" },
      { status: 500 },
    );
  }
}
