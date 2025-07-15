import { NextRequest, NextResponse } from "next/server";

const DEMO_USERS = {
  "admin@edutd.com": {
    id: "1",
    email: "admin@edutd.com",
    password: "admin123", // In real app, this would be hashed
    role: "admin",
    name: "Administrateur Principal",
    firstName: "Jean",
    lastName: "Dupont",
  },
  "prof@edutd.com": {
    id: "2",
    email: "prof@edutd.com",
    password: "prof123",
    role: "teacher",
    name: "Marie Martin",
    firstName: "Marie",
    lastName: "Martin",
    subject: "Mathématiques",
    department: "Sciences",
  },
  "eleve@edutd.com": {
    id: "3",
    email: "eleve@edutd.com",
    password: "eleve123",
    role: "student",
    name: "Pierre Dubois",
    firstName: "Pierre",
    lastName: "Dubois",
    studentId: "STU2024001",
    class: "Terminale S",
    level: "Terminale",
  },
};

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json();

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = DEMO_USERS[email as keyof typeof DEMO_USERS];

    if (!user || user.password !== password || user.role !== role) {
      return NextResponse.json(
        { error: "Identifiants invalides" },
        { status: 401 },
      );
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Create a simple JWT-like token (for demo purposes)
    const token = btoa(
      JSON.stringify({
        userId: user.id,
        email: user.email,
        role: user.role,
        exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      }),
    );

    return NextResponse.json({
      user: userWithoutPassword,
      token,
      message: "Connexion réussie",
    });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
