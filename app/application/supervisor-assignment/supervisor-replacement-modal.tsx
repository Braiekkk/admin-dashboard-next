"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import type { Teacher, Assignment } from "@/app/interfaces"

interface SupervisorReplacementModalProps {
  open: boolean
  onClose: () => void
  assignment: Assignment
  Teachers: Teacher[]
  onReplace: (assignmentId: string, newSupervisorId: string) => void
}

export default function SupervisorReplacementModal({
  open,
  onClose,
  assignment,
  Teachers,
  onReplace,
}: SupervisorReplacementModalProps) {
  const [selectedSupervisorId, setSelectedSupervisorId] = useState<string>("")

  const handleReplace = () => {
    if (selectedSupervisorId) {
      onReplace(assignment.id, selectedSupervisorId)
      setSelectedSupervisorId("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Replace Supervisor</DialogTitle>
          <DialogDescription>
            Select a new Teacher to replace the current one. Only eligible Teachers are shown.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Select value={selectedSupervisorId} onValueChange={setSelectedSupervisorId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a new Teacher" />
            </SelectTrigger>
            <SelectContent>
              {Teachers.map((Teacher) => (
                <SelectItem key={Teacher.id} value={Teacher.name}>
                  {Teacher.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {Teachers.length === 0 && (
            <p className="text-sm text-red-500 mt-2">
              No eligible Teachers available. All Teachers either teach this subject or are unavailable.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleReplace} disabled={!selectedSupervisorId || Teachers.length === 0}>
            Replace Supervisor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

