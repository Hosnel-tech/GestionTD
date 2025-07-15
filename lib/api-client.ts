class ApiClient {
  private baseUrl = "/api";

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<{ data: T; error?: never } | { data?: never; error: string }> {
    try {
      const token = localStorage.getItem("auth_token");

      const config: RequestInit = {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(`${this.baseUrl}${endpoint}`, config);

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.error || "Une erreur est survenue" };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: "Erreur de réseau" };
    }
  }

  // Authentication
  async login(email: string, password: string, role: string) {
    return this.request<{ user: any; token: string; message: string }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password, role }),
      },
    );
  }

  async getProfile() {
    return this.request<{ user: any }>("/auth/me");
  }

  // Dashboard
  async getDashboardStats(role: string, userId?: string) {
    const params = new URLSearchParams({ role });
    if (userId) params.append("userId", userId);

    return this.request<any>(`/dashboard/stats?${params}`);
  }

  // Students
  async getStudents(filters?: { class?: string; level?: string }) {
    const params = new URLSearchParams();
    if (filters?.class) params.append("class", filters.class);
    if (filters?.level) params.append("level", filters.level);

    return this.request<{ students: any[]; total: number }>(
      `/students?${params}`,
    );
  }

  async createStudent(student: any) {
    return this.request<{ student: any; message: string }>("/students", {
      method: "POST",
      body: JSON.stringify(student),
    });
  }

  // Teachers
  async getTeachers(filters?: { department?: string; subject?: string }) {
    const params = new URLSearchParams();
    if (filters?.department) params.append("department", filters.department);
    if (filters?.subject) params.append("subject", filters.subject);

    return this.request<{ teachers: any[]; total: number }>(
      `/teachers?${params}`,
    );
  }

  async createTeacher(teacher: any) {
    return this.request<{ teacher: any; message: string }>("/teachers", {
      method: "POST",
      body: JSON.stringify(teacher),
    });
  }

  // Courses
  async getCourses(filters?: { level?: string; teacherId?: string }) {
    const params = new URLSearchParams();
    if (filters?.level) params.append("level", filters.level);
    if (filters?.teacherId) params.append("teacherId", filters.teacherId);

    return this.request<{ courses: any[]; total: number }>(
      `/courses?${params}`,
    );
  }

  async createCourse(course: any) {
    return this.request<{ course: any; message: string }>("/courses", {
      method: "POST",
      body: JSON.stringify(course),
    });
  }

  // TDs
  async getTDs(filters?: {
    courseId?: string;
    teacherId?: string;
    status?: string;
  }) {
    const params = new URLSearchParams();
    if (filters?.courseId) params.append("courseId", filters.courseId);
    if (filters?.teacherId) params.append("teacherId", filters.teacherId);
    if (filters?.status) params.append("status", filters.status);

    return this.request<{ tds: any[]; total: number }>(`/tds?${params}`);
  }

  async createTD(td: any) {
    return this.request<{ td: any; message: string }>("/tds", {
      method: "POST",
      body: JSON.stringify(td),
    });
  }
}

export const apiClient = new ApiClient();
