"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, GraduationCap, Users } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    role: "",
  })
  const router = useRouter()

  const handleLogin = () => {
    // Simulation de connexion
    if (credentials.role === "admin") {
      router.push("/admin/dashboard")
    } else if (credentials.role === "teacher") {
      router.push("/teacher/dashboard")
    } else if (credentials.role === "student") {
      router.push("/student/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">EduTD Manager</h1>
          <p className="text-gray-600">Plateforme de gestion des travaux dirigés</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
            <CardDescription>Connectez-vous à votre espace personnel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre.email@exemple.com"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Type de compte</Label>
              <Select
                value={credentials.role}
                onValueChange={(value) => setCredentials({ ...credentials, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Administrateur
                    </div>
                  </SelectItem>
                  <SelectItem value="teacher">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Enseignant
                    </div>
                  </SelectItem>
                  <SelectItem value="student">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Apprenant
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleLogin}
              className="w-full"
              disabled={!credentials.email || !credentials.password || !credentials.role}
            >
              Se connecter
            </Button>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Comptes de démonstration :</p>
          <div className="mt-2 space-y-1">
            <p>
              <strong>Admin:</strong> admin@edutd.com
            </p>
            <p>
              <strong>Enseignant:</strong> prof@edutd.com
            </p>
            <p>
              <strong>Apprenant:</strong> eleve@edutd.com
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
