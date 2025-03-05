"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Plus } from "lucide-react";

interface AddRoomPopupProps {
  onAdd: (newRoom: { name: string; capacity: number; location: string; isAvailable: boolean }) => Promise<void>;
}

export function AddRoomPopup({ onAdd }: AddRoomPopupProps) {
  const [roomData, setRoomData] = useState({
    name: "",
    capacity: 0,
    location: "",
    isAvailable: true,
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setRoomData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomData.name || !roomData.capacity || !roomData.location) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    try {
      await onAdd(roomData);
      setIsOpen(false);  // Fermer la popup après l'ajout
      //alert("Salle ajoutée avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout de la salle:", error);
      alert("Une erreur est survenue lors de l'ajout de la salle.");
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
          Ajouter une salle
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une salle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name">Nom de la salle</Label>
            <Input
              id="name"
              name="name"
              value={roomData.name}
              onChange={handleChange}
              required
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="capacity">Capacité</Label>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              value={roomData.capacity}
              onChange={handleChange}
              required
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location">Emplacement</Label>
            <Input
              id="location"
              name="location"
              value={roomData.location}
              onChange={handleChange}
              required
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">Ajouter</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
