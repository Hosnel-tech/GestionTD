export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  class: string;
  level: string;
  enrollmentDate: string;
  status: "active" | "inactive";
  grades: Grade[];
}

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  department: string;
  hireDate: string;
  status: "active" | "inactive";
  courses: string[];
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  teacherId: string;
  level: string;
  credits: number;
  schedule: string;
  semester: string;
  enrolledStudents: string[];
}

export interface TD {
  id: string;
  title: string;
  description: string;
  courseId: string;
  teacherId: string;
  dueDate: string;
  createdAt: string;
  status: "draft" | "published" | "archived";
  maxScore: number;
  submissions: Submission[];
}

export interface Submission {
  id: string;
  studentId: string;
  tdId: string;
  submittedAt: string;
  status: "submitted" | "graded" | "late";
  score?: number;
  feedback?: string;
  files: string[];
}

export interface Grade {
  id: string;
  studentId: string;
  courseId: string;
  tdId: string;
  score: number;
  maxScore: number;
  gradedAt: string;
  feedback?: string;
}

export const MOCK_STUDENTS: Student[] = [
  {
    id: "3",
    firstName: "Pierre",
    lastName: "Dubois",
    email: "eleve@edutd.com",
    studentId: "STU2024001",
    class: "Terminale S",
    level: "Terminale",
    enrollmentDate: "2024-09-01",
    status: "active",
    grades: [],
  },
  {
    id: "stu2",
    firstName: "Sophie",
    lastName: "Bernard",
    email: "sophie.bernard@edutd.com",
    studentId: "STU2024002",
    class: "Terminale S",
    level: "Terminale",
    enrollmentDate: "2024-09-01",
    status: "active",
    grades: [],
  },
  {
    id: "stu3",
    firstName: "Lucas",
    lastName: "Moreau",
    email: "lucas.moreau@edutd.com",
    studentId: "STU2024003",
    class: "Première ES",
    level: "Première",
    enrollmentDate: "2024-09-01",
    status: "active",
    grades: [],
  },
  {
    id: "stu4",
    firstName: "Emma",
    lastName: "Leroy",
    email: "emma.leroy@edutd.com",
    studentId: "STU2024004",
    class: "Première ES",
    level: "Première",
    enrollmentDate: "2024-09-01",
    status: "active",
    grades: [],
  },
  {
    id: "stu5",
    firstName: "Thomas",
    lastName: "Roux",
    email: "thomas.roux@edutd.com",
    studentId: "STU2024005",
    class: "Seconde",
    level: "Seconde",
    enrollmentDate: "2024-09-01",
    status: "active",
    grades: [],
  },
];

export const MOCK_TEACHERS: Teacher[] = [
  {
    id: "2",
    firstName: "Marie",
    lastName: "Martin",
    email: "prof@edutd.com",
    subject: "Mathématiques",
    department: "Sciences",
    hireDate: "2020-09-01",
    status: "active",
    courses: ["MATH_TERM", "MATH_PREM"],
  },
  {
    id: "teach2",
    firstName: "Jean",
    lastName: "Durand",
    email: "jean.durand@edutd.com",
    subject: "Physique",
    department: "Sciences",
    hireDate: "2019-09-01",
    status: "active",
    courses: ["PHYS_TERM", "PHYS_PREM"],
  },
  {
    id: "teach3",
    firstName: "Claire",
    lastName: "Lambert",
    email: "claire.lambert@edutd.com",
    subject: "Français",
    department: "Lettres",
    hireDate: "2021-09-01",
    status: "active",
    courses: ["FR_TERM", "FR_PREM"],
  },
  {
    id: "teach4",
    firstName: "Paul",
    lastName: "Rousseau",
    email: "paul.rousseau@edutd.com",
    subject: "Histoire-Géographie",
    department: "Sciences Humaines",
    hireDate: "2018-09-01",
    status: "active",
    courses: ["HIST_TERM", "GEO_PREM"],
  },
];

export const MOCK_COURSES: Course[] = [
  {
    id: "MATH_TERM",
    name: "Mathématiques Terminale S",
    code: "MATH-TS-2024",
    description: "Cours de mathématiques pour la classe de Terminale S",
    teacherId: "2",
    level: "Terminale",
    credits: 6,
    schedule: "Lundi 8h-10h, Mercredi 14h-16h",
    semester: "2024-1",
    enrolledStudents: ["3", "stu2"],
  },
  {
    id: "MATH_PREM",
    name: "Mathématiques Première ES",
    code: "MATH-PES-2024",
    description: "Cours de mathématiques pour la classe de Première ES",
    teacherId: "2",
    level: "Première",
    credits: 4,
    schedule: "Mardi 10h-12h, Jeudi 16h-18h",
    semester: "2024-1",
    enrolledStudents: ["stu3", "stu4"],
  },
  {
    id: "PHYS_TERM",
    name: "Physique Terminale S",
    code: "PHYS-TS-2024",
    description: "Cours de physique pour la classe de Terminale S",
    teacherId: "teach2",
    level: "Terminale",
    credits: 5,
    schedule: "Mardi 8h-10h, Vendredi 14h-16h",
    semester: "2024-1",
    enrolledStudents: ["3", "stu2"],
  },
  {
    id: "FR_TERM",
    name: "Français Terminale",
    code: "FR-T-2024",
    description: "Cours de français pour la classe de Terminale",
    teacherId: "teach3",
    level: "Terminale",
    credits: 4,
    schedule: "Lundi 14h-16h, Mercredi 8h-10h",
    semester: "2024-1",
    enrolledStudents: ["3", "stu2", "stu3"],
  },
];

export const MOCK_TDS: TD[] = [
  {
    id: "td1",
    title: "Dérivées et primitives",
    description:
      "Exercices sur les dérivées et les primitives de fonctions polynomiales",
    courseId: "MATH_TERM",
    teacherId: "2",
    dueDate: "2024-12-20",
    createdAt: "2024-12-01",
    status: "published",
    maxScore: 20,
    submissions: [],
  },
  {
    id: "td2",
    title: "Probabilités conditionnelles",
    description:
      "Étude des probabilités conditionnelles et des événements indépendants",
    courseId: "MATH_TERM",
    teacherId: "2",
    dueDate: "2024-12-25",
    createdAt: "2024-12-05",
    status: "published",
    maxScore: 20,
    submissions: [],
  },
  {
    id: "td3",
    title: "Fonctions exponentielles",
    description: "Exercices sur les fonctions exponentielles et logarithmes",
    courseId: "MATH_PREM",
    teacherId: "2",
    dueDate: "2024-12-22",
    createdAt: "2024-12-03",
    status: "published",
    maxScore: 20,
    submissions: [],
  },
  {
    id: "td4",
    title: "Mécanique newtonienne",
    description: "Application des lois de Newton aux mouvements",
    courseId: "PHYS_TERM",
    teacherId: "teach2",
    dueDate: "2024-12-21",
    createdAt: "2024-12-02",
    status: "published",
    maxScore: 20,
    submissions: [],
  },
];

export const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: "sub1",
    studentId: "3",
    tdId: "td1",
    submittedAt: "2024-12-10T14:30:00Z",
    status: "graded",
    score: 16,
    feedback: "Bon travail, quelques erreurs de calcul mineures",
    files: ["derivees_pierre.pdf"],
  },
  {
    id: "sub2",
    studentId: "stu2",
    tdId: "td1",
    submittedAt: "2024-12-11T09:15:00Z",
    status: "graded",
    score: 18,
    feedback: "Excellent travail, très bien structuré",
    files: ["derivees_sophie.pdf"],
  },
  {
    id: "sub3",
    studentId: "3",
    tdId: "td4",
    submittedAt: "2024-12-12T16:45:00Z",
    status: "submitted",
    files: ["mecanique_pierre.pdf"],
  },
];

export const MOCK_GRADES: Grade[] = [
  {
    id: "grade1",
    studentId: "3",
    courseId: "MATH_TERM",
    tdId: "td1",
    score: 16,
    maxScore: 20,
    gradedAt: "2024-12-11T10:00:00Z",
    feedback: "Bon travail, quelques erreurs de calcul mineures",
  },
  {
    id: "grade2",
    studentId: "stu2",
    courseId: "MATH_TERM",
    tdId: "td1",
    score: 18,
    maxScore: 20,
    gradedAt: "2024-12-11T10:05:00Z",
    feedback: "Excellent travail, très bien structuré",
  },
];

// Helper functions to find related data
export function getStudentsByTeacher(teacherId: string): Student[] {
  const teacherCourses = MOCK_COURSES.filter(
    (course) => course.teacherId === teacherId,
  );
  const studentIds = new Set(
    teacherCourses.flatMap((course) => course.enrolledStudents),
  );
  return MOCK_STUDENTS.filter((student) => studentIds.has(student.id));
}

export function getTDsByTeacher(teacherId: string): TD[] {
  return MOCK_TDS.filter((td) => td.teacherId === teacherId);
}

export function getTDsByStudent(studentId: string): TD[] {
  const studentCourses = MOCK_COURSES.filter((course) =>
    course.enrolledStudents.includes(studentId),
  );
  const courseIds = studentCourses.map((course) => course.id);
  return MOCK_TDS.filter((td) => courseIds.includes(td.courseId));
}

export function getSubmissionsByStudent(studentId: string): Submission[] {
  return MOCK_SUBMISSIONS.filter(
    (submission) => submission.studentId === studentId,
  );
}

export function getGradesByStudent(studentId: string): Grade[] {
  return MOCK_GRADES.filter((grade) => grade.studentId === studentId);
}
