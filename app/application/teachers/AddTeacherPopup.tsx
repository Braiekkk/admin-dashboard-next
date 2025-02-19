"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/** ✅ Retrieve JWT token */
const getAuthToken = () => localStorage.getItem("jwtToken") || "";

/** ✅ Create headers with JWT */
const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getAuthToken()}`,
});

interface Department {
  id: string;
  name: string;
}

interface AddTeacherPopupProps {
  onAdd: (newTeacher: {
    name: string;
    email: string;
    department: string;
  }) => void;
}

export function AddTeacherPopup({ onAdd }: AddTeacherPopupProps) {
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    department: "",
  });

  const [isOpen, setIsOpen] = useState(false);
  const [departmentList, setDepartmentList] = useState<Department[]>([]);

  /** ✅ Fetch "departments" when the dialog opens */
  useEffect(() => {
    if (isOpen) {
      const fetchDepartments = async () => {
        try {
          const response = await fetch("http://localhost:8080/admin/department", {
            method: "GET",
            headers: getHeaders(),
          });

          if (!response.ok) throw new Error("Failed to fetch departments");

          const jsonResponse = await response.json();
          if (!jsonResponse.data || !Array.isArray(jsonResponse.data)) {
            throw new Error("Invalid response format");
          }

          setDepartmentList(jsonResponse.data);
        } catch (error) {
          console.error("Error fetching departments:", error);
          setDepartmentList([]); // Prevent `.map()` errors
        }
      };

      fetchDepartments();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(newTeacher);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-pastel-blue hover:bg-pastel-blue/90 text-gray-800 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Teacher
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Teacher</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* ✅ Name Input */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={newTeacher.name}
              onChange={(e) =>
                setNewTeacher((prev) => ({ ...prev, name: e.target.value }))
              }
              required
              className="col-span-3"
            />
          </div>

          {/* ✅ Email Input */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={newTeacher.email}
              onChange={(e) =>
                setNewTeacher((prev) => ({ ...prev, email: e.target.value }))
              }
              required
              className="col-span-3"
            />
          </div>

          {/* ✅ Department (Dropdown using ShadCN Select) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">
              Department
            </Label>
            <Select
              value={newTeacher.department}
              onValueChange={(value) =>
                setNewTeacher((prev) => ({ ...prev, department: value }))
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a department" />
              </SelectTrigger>
              <SelectContent>
                {departmentList.length === 0 ? (
                  <SelectItem disabled value="null">No departments available</SelectItem>
                ) : (
                  departmentList.map((department) => (
                    <SelectItem key={department.id} value={department.name}>
                      {department.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* ✅ Buttons */}
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Teacher</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
