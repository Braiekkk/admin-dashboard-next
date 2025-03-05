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
import { Pencil } from "lucide-react";
import { Exam } from "@/app/interfaces";

interface EditExamPopupProps {
  exam: Exam;
  onSave: (updatedExam: Exam) => void;
}

export function EditExamPopup({ exam, onSave }: EditExamPopupProps) {
  const [updatedExam, setUpdatedExam] = useState(exam);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
          <Pencil className="h-4 w-4 text-blue-500" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Exam</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(updatedExam);
            setIsOpen(false);
          }}
        >
          <div className="grid gap-4 py-4">
            {/* Subject */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={updatedExam.subject}
                onChange={(e) =>
                  setUpdatedExam({ ...updatedExam, subject: e.target.value })
                }
                className="col-span-3"
                required
              />
            </div>
            {/* Date */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date">Date (YYYY-MM-DD HH:mm)</Label>
              <Input
                id="date"
                value={updatedExam.date.toString()}
                onChange={(e) =>
                  setUpdatedExam({ ...updatedExam, date: e.target.value })
                }
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
                value={updatedExam.duration}
                onChange={(e) =>
                  setUpdatedExam({ ...updatedExam, duration: parseInt(e.target.value, 10) })
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
                value={updatedExam.room}
                onChange={(e) =>
                  setUpdatedExam({ ...updatedExam, room: e.target.value })
                }
                className="col-span-3"
                required
              />
            </div>
            {/* Supervisors */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supervisors">
                Supervisors 
              </Label>
              <Input
                id="supervisors"
                value={updatedExam.supervisors?.map((s: any) => s.id).join(",") || ""}
                onChange={(e) => {
                  const ids = e.target.value.split(",").map((id) => parseInt(id.trim(), 10));
                  // Ici, adaptez la conversion des IDs en objets supervisor si nécessaire.
                  setUpdatedExam({ ...updatedExam, supervisors: ids });
                }}
                className="col-span-3"
              />
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
