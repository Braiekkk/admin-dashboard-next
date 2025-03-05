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
import { Niveau } from "@/app/interfaces";

interface AddNiveauPopupProps {
  onAdd: (newNiveau: Niveau) => void;
}

export function AddNiveauPopup({ onAdd }: AddNiveauPopupProps) {
  const [newNiveau, setNewNiveau] = useState({
    id: 0,  // You can change this based on your ID generation strategy
    name: "",
    students: [],
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(newNiveau);
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
          Add Niveau
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Niveau</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={newNiveau.name}
              onChange={(e) =>
                setNewNiveau((prev) => ({ ...prev, name: e.target.value }))
              }
              required
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <Button type="submit">Add Niveau</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
