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

interface Niveau {
  id: string;
  name: string;
}

interface AddStudentPopupProps {
  onAdd: (newStudent: {
    name: string;
    email: string;
    grade: string;
  }) => void;
}

export function AddStudentPopup({ onAdd }: AddStudentPopupProps) {
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    grade: "",
  });

  const [isOpen, setIsOpen] = useState(false);
  const [niveauList, setNiveauList] = useState<Niveau[]>([]);

  /** ✅ Fetch "niveau" (grades) when the dialog opens */
  useEffect(() => {
    if (isOpen) {
      const fetchNiveauList = async () => {
        try {
          const response = await fetch("http://localhost:8080/admin/niveau", {
            method: "GET",
            headers: getHeaders(),
          });

          if (!response.ok) throw new Error("Failed to fetch grade levels");

          const jsonResponse = await response.json();
          if (!jsonResponse.data || !Array.isArray(jsonResponse.data)) {
            throw new Error("Invalid response format");
          }

          setNiveauList(jsonResponse.data);
        } catch (error) {
          console.error("Error fetching grade levels:", error);
          setNiveauList([]); // Prevent `.map()` errors
        }
      };

      fetchNiveauList();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(newStudent);
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
          Add Student
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
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
              value={newStudent.name}
              onChange={(e) =>
                setNewStudent((prev) => ({ ...prev, name: e.target.value }))
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
              value={newStudent.email}
              onChange={(e) =>
                setNewStudent((prev) => ({ ...prev, email: e.target.value }))
              }
              required
              className="col-span-3"
            />
          </div>

          {/* ✅ Grade (Dropdown using ShadCN Select) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="grade" className="text-right">
              Grade
            </Label>
            <Select
              value={newStudent.grade}
              onValueChange={(value) =>
                setNewStudent((prev) => ({ ...prev, grade: value }))
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a grade" />
              </SelectTrigger>
              <SelectContent>
                {niveauList.length === 0 ? (
                  <SelectItem disabled value="null">No grades available</SelectItem>
                ) : (
                  niveauList.map((niveau) => (
                    <SelectItem key={niveau.id} value={niveau.name}>
                      {niveau.name}
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
            <Button type="submit">Add Student</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
