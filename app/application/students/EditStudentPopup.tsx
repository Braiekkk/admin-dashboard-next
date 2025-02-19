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
import { Student } from "@/app/interfaces";
import { Niveau } from "@/app/interfaces";

/** ✅ Function to retrieve JWT token */
const getAuthToken = () => localStorage.getItem("jwtToken");

/** ✅ Function to create headers with JWT */
const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getAuthToken()}`,
});


interface EditStudentPopupProps {
  student: Student;
  onSave: (updatedStudent: Student) => void;
}

export function EditStudentPopup({ student, onSave }: EditStudentPopupProps) {
  const [updatedStudent, setUpdatedStudent] = useState(student);
  const [isOpen, setIsOpen] = useState(false);
  const [niveauList, setNiveauList] = useState<Niveau[]>([]); // ✅ Stores grades (niveau)

  /** ✅ Fetch "niveau" (grades) when the dialog opens */
  useEffect(() => {
    if (isOpen) {
      const fetchNiveauList = async () => {
        
        try {
          const response = await fetch("http://localhost:8080/admin/niveau", {
            method: "GET",
            headers: getHeaders(), // ✅ Include JWT token in request
          });

          if (!response.ok) throw new Error("Failed to fetch grade levels");

          const jsonResponse = await response.json();
          if (!jsonResponse.data || !Array.isArray(jsonResponse.data)) {
            throw new Error("Invalid response format");
          }

          setNiveauList(jsonResponse.data);
        } catch (error) {
          console.error("Error fetching grade levels:", error);
        }
      };
      console.log(niveauList);
      fetchNiveauList();
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
          <DialogTitle>Edit Student</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(updatedStudent);
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
                value={updatedStudent.name}
                onChange={(e) =>
                  setUpdatedStudent((prev) => ({
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
                value={updatedStudent.email}
                onChange={(e) =>
                  setUpdatedStudent((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                className="col-span-3"
              />
            </div>

            {/* ✅ Grade (Dropdown) */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="grade">Grade</Label>
              <Select
                value={updatedStudent.grade} // ✅ Ensure the selected option matches student's grade
                onValueChange={(value) =>
                  setUpdatedStudent((prev) => ({
                    ...prev,
                    grade: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a grade">
                    {updatedStudent.grade || "Select a grade"}{" "}
                    {/* ✅ Show the current grade */}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {niveauList.length === 0 ? (
                    <SelectItem disabled value="null">No grades available</SelectItem>
                  ) : (
                    niveauList.map((niveau) => (
                      <SelectItem
                        key={niveau.id}
                        value={niveau.name} // ✅ Ensure `value` is set to `niveau.name`
                      >
                        {niveau.name}
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
