"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react"; // Changed icon to trash
import { useState } from "react";
import { Student } from "@/app/interfaces";

interface DeleteProps<T> {
  item: T;
  onDelete: (studentToDelete: T) => void;
}

export function DeleteConfirmationPopup<T extends {id:number, name:string } > ({ item, onDelete }: DeleteProps<T>) {
  const [isOpen, setIsOpen] = useState(false); // ✅ State to control visibility

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="bg-white"
          onClick={() => setIsOpen(true)}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete {item.name}?</p>
        <DialogFooter className="flex justify-between">
          {/* ✅ Cancel Button */}
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          {/* ✅ Delete Button */}
          <Button
            variant="destructive"
            onClick={() => {
              onDelete(item);
              setIsOpen(false); // ✅ Close dialog after deletion
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
