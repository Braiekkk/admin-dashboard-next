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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Plus } from "lucide-react";

// Exemple d'enseignants disponibles
const teachers = [
  { id: 1, name: "Mr. John Doe" },
  { id: 2, name: "Ms. Jane Smith" },
  { id: 3, name: "Dr. Emily Clark" },
];

interface AddExamPopupProps {
  onAdd: (newExam: {
    subject: string;
    date: string;
    duration: number;
    room: string;
    supervisors: { id: number; name: string }[]; // Liste des enseignants
  }) => void;
}

export function AddExamPopup({ onAdd }: AddExamPopupProps) {
  const [newExam, setNewExam] = useState({
    subject: "",
    date: "",
    duration: 0,
    room: "",
    supervisors: [] as { id: number; name: string }[], // Liste des enseignants
  });

  const [isOpen, setIsOpen] = useState(false);

  // Fonction de validation du formulaire
  const validateForm = () => {
    return (
      newExam.subject &&
      newExam.date &&
      newExam.duration > 0 &&
      newExam.room &&
      newExam.supervisors.length > 0
    );
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onAdd(newExam);
      setIsOpen(false); // Ferme le popup après l'ajout
    } else {
      alert("Please fill in all fields correctly.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-pastel-blue hover:bg-pastel-blue/90 text-gray-800 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Exam
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Exam</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* Subject */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={newExam.subject}
              onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
              className="col-span-3"
              required
            />
          </div>
          {/* Date */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date">Date (YYYY-MM-DD HH:mm)</Label>
            <Input
              id="date"
              value={newExam.date}
              onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
              className="col-span-3"
              required
            />
          </div>
          {/* Duration */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration">Duration (min)</Label>
            <Input
              id="duration"
              type="number"
              value={newExam.duration}
              onChange={(e) =>
                setNewExam({ ...newExam, duration: parseInt(e.target.value, 10) })
              }
              className="col-span-3"
              required
            />
          </div>
          {/* Room */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="room">Room</Label>
            <Input
              id="room"
              value={newExam.room}
              onChange={(e) => setNewExam({ ...newExam, room: e.target.value })}
              className="col-span-3"
              required
            />
          </div>
          {/* Supervisors (Teachers) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="supervisors">Supervisors (Select Teachers)</Label>
            <select
              id="supervisors"
              value={newExam.supervisors.map((supervisor) => supervisor.id).join(",")}
              onChange={(e) => {
                const selectedIds = e.target.value
                  .split(",")
                  .map((id) => parseInt(id, 10));
                const selectedTeachers = teachers.filter((teacher) =>
                  selectedIds.includes(teacher.id)
                );
                setNewExam({ ...newExam, supervisors: selectedTeachers });
              }}
              className="col-span-3"
              multiple
              required
            >
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!validateForm()}>
              Add Exam
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
