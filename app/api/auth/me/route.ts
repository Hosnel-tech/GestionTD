import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Token manquant" }, { status: 401 });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = JSON.parse(atob(token));

      // Check if token is expired
      if (decoded.exp < Date.now()) {
        return NextResponse.json({ error: "Token expiré" }, { status: 401 });
      }

      // Return user info based on token
      return NextResponse.json({
        user: {
          id: decoded.userId,
          email: decoded.email,
          role: decoded.role,
        },
      });
    } catch (error) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
