// components/EditRoomPopup.tsx
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
import { Room } from "@/app/interfaces";

interface EditRoomPopupProps {
  room: Room;
  onSave: (updatedRoom: Room) => void;
}

export function EditRoomPopup({ room, onSave }: EditRoomPopupProps) {
  const [updatedRoom, setUpdatedRoom] = useState(room);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Trigger the onSave function
    onSave(updatedRoom);
    setIsOpen(false); // Close the dialog
  };

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
          <DialogTitle>Edit Room</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name">Room Name</Label>
              <Input
                id="name"
                value={updatedRoom.name}
                onChange={(e) =>
                  setUpdatedRoom((prev) => ({ ...prev, name: e.target.value }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                type="number"
                id="capacity"
                value={updatedRoom.capacity}
                onChange={(e) =>
                  setUpdatedRoom((prev) => ({
                    ...prev,
                    capacity: +e.target.value,
                  }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={updatedRoom.location}
                onChange={(e) =>
                  setUpdatedRoom((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
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
