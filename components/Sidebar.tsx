"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Grid2x2Check,
  Home,
  Users,
  BookOpen,
  Calendar,
  LogOut,
  User,
  FileText,
  ClipboardCheck,
  ClipboardList, // Icône pour Exam Management
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type React from "react";

type NavItem = {
  icon: React.ElementType;
  label: string;
  href: string;
  color: string;
};

const navItems: NavItem[] = [
  {
    icon: Home,
    label: "Dashboard",
    href: "/application/dashboard",
    color: "bg-pastel-blue",
  },
  {
    icon: Users,
    label: "Students",
    href: "/application/students",
    color: "bg-pastel-yellow",
  },
  {
    icon: Users,
    label: "Teachers",
    href: "/application/teachers",
    color: "bg-pastel-purple",
  },
  {
    icon: Calendar,
    label: "Schedule",
    href: "/application/schedule",
    color: "bg-pastel-paleBlue",
  },
  {
    icon: Grid2x2Check,
    label: "Departments",
    href: "/application/departments",
    color: "bg-pastel-pink",
  },
  {
    icon: FileText,
    label: "Grades",
    href: "/application/niveaux",
    color: "bg-pastel-Blue",
  },
  {
    icon: BookOpen,
    label: "Rooms",
    href: "/application/rooms",
    color: "bg-pastel-yellow",
  },
  {
    icon: ClipboardCheck, // Nouvel élément pour Exam Management
    label: "Exam Management",
    href: "/application/RoomManagment", // Même URL que Rooms puisque ça doit accéder à RoomManagement
    color: "bg-pastel-purple", // Vous pouvez choisir une autre couleur
  },
  {
    icon: ClipboardList, // Nouvelle icône pour Supervisor Assignment
    label: "Supervisor Assignment",
    href: "/application/supervisor-assignment",
    color: "bg-pastel-paleBlue",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    try {
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex h-screen w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex h-16 items-center justify-center border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">EduManage Pro</h1>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => (
          <Link key={item.href + item.label} href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-gray-600",
                pathname === item.href && `${item.color} text-gray-800`
              )}
            >
              <item.icon className="mr-2 h-5 w-5" />
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>
      <div className="border-t border-gray-200 p-4 flex justify-between">
        <Button
          variant="ghost"
          className="justify-start text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          onClick={() => router.push("/application/profile")}
        >
          <User className="mr-2 h-5 w-5" />
          Profile
        </Button>
        <Button
          variant="ghost"
          className="justify-start text-red-500 hover:text-red-600 hover:bg-red-100"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
}