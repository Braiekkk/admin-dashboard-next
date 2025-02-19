"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { Teacher } from "@/app/interfaces";
import { Department } from "@/app/interfaces";
/** ✅ Retrieve JWT token */
const getAuthToken = () => localStorage.getItem("jwtToken");

/** ✅ Create headers with JWT */
const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getAuthToken()}`,
});

interface EditTeacherPopupProps {
  teacher: Teacher;
  onSave: (updatedTeacher: Teacher) => void;
}

export function EditTeacherPopup({ teacher, onSave }: EditTeacherPopupProps) {
  const [updatedTeacher, setUpdatedTeacher] = useState(teacher);
  const [isOpen, setIsOpen] = useState(false);
  const [departmentList, setDepartmentList] = useState<Department[]>([]);

  /** ✅ Fetch "departments" when the dialog opens */
  useEffect(() => {
    if (isOpen) {
      const fetchDepartments = async () => {
        try {
          const response = await fetch(
            "http://localhost:8080/admin/department",
            {
              method: "GET",
              headers: getHeaders(),
            }
          );

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
      console.log(departmentList);
      
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="bg-white"
          onClick={() => setIsOpen(true)}
        >
          <Pencil className="h-4 w-4 text-blue-500" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Teacher</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(updatedTeacher);
            setIsOpen(false);
          }}
        >
          <div className="grid gap-4 py-4">
            {/* ✅ Name Input */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={updatedTeacher.name}
                onChange={(e) =>
                  setUpdatedTeacher((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="col-span-3"
              />
            </div>

            {/* ✅ Email Input */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={updatedTeacher.email}
                onChange={(e) =>
                  setUpdatedTeacher((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                className="col-span-3"
              />
            </div>

            {/* ✅ Department (Dropdown using ShadCN Select) */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department">Department</Label>
              <Select
                value={updatedTeacher.department}
                onValueChange={(value) =>
                  setUpdatedTeacher((prev) => ({
                    ...prev,
                    department: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a department">
                    {updatedTeacher.department || "Select a department"}{" "}
                    {/* ✅ Show the current grade */}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {departmentList.length === 0 ? (
                    <SelectItem disabled value="null">
                      No Departments available
                    </SelectItem>
                  ) : (
                    departmentList.map((department) => (
                      <SelectItem
                        key={department.id}
                        value={department.name} // ✅ Ensure `value` is set to `niveau.name`
                      >
                        {department.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
