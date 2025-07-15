"use client";

import {
  Calendar,
  FileText,
  Home,
  Settings,
  DollarSign,
  BookOpen,
  Clock,
  CheckCircle,
  GraduationCap,
  UserRound,
  Wallet,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface AppSidebarProps {
  userRole: "admin" | "teacher" | "student";
}

export function AppSidebar({ userRole }: AppSidebarProps) {
  const pathname = usePathname();

  const getMenuItems = () => {
    switch (userRole) {
      case "admin":
        return [
          { title: "Dashboard", url: "/admin/dashboard", icon: Home },
          { title: "Gestion TD", url: "/admin/td", icon: BookOpen },
          {
            title: "Personnels",
            url: "/admin/personnels",
            icon: GraduationCap,
          },
          { title: "Apprenants", url: "/admin/students", icon: UserRound },
          { title: "Finances", url: "/admin/finances", icon: DollarSign },
          { title: "Paramètres", url: "/admin/settings", icon: Settings },
        ];
      case "teacher":
        return [
          { title: "Dashboard", url: "/teacher/dashboard", icon: Home },
          { title: "En cours", url: "/teacher/td", icon: BookOpen },
          { title: "En attente", url: "/teacher/pending", icon: Clock },
          { title: "Finance", url: "/teacher/finances", icon: Wallet },
          { title: "Profil", url: "/teacher/profile", icon: Settings },
        ];
      case "student":
        return [{ title: "Dashboard", url: "/student/dashboard", icon: Home }];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">EduTD Manager</h2>
            <p className="text-sm text-muted-foreground capitalize">
              {userRole}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-4 text-center text-sm text-muted-foreground">
          © 2024 EduTD Manager
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
