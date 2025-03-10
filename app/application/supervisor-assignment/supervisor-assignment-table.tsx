"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { UserX } from "lucide-react"

interface Teacher {
  id: number
  name: string
  email: string
  departmentName: string
}

interface Room {
  id: number
  name: string
  capacity: number
  location: string
}

interface Exam {
  id: number
  subject: string
  startDate: string
  endDate: string
  period: string
  academicYear: string
  duration: number
  niveauName: string
  niveauTd: number
  supervisors: Teacher[]
  room: Room | null
}

interface SupervisorAssignmentTableProps {
  exams: Exam[]
  teachers: Teacher[]
  loading: boolean
  onAssignSupervisor: (examId: number, teacher: Teacher) => void
  onReplaceSupervisor: (exam: Exam, teacher: Teacher) => void
}

export default function SupervisorAssignmentTable({
  exams,
  teachers,
  loading,
  onAssignSupervisor,
  onReplaceSupervisor,
}: SupervisorAssignmentTableProps) {
  const [newAssignments, setNewAssignments] = useState<Record<number, number>>({})

  const formatDateTime = (date: string) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date))
  }

  // Function to check if a teacher can supervise an exam (not teaching the subject)
  const canSupervise = (teacher: Teacher, exam: Exam) => {
    // Map subjects to departments (in a real app, this would come from the backend)
    const subjectDepartmentMap: Record<string, string> = {
      Algorithms: "Computer Science",
      "Database Systems": "Computer Science",
      Calculus: "Mathematics",
      "Linear Algebra": "Mathematics",
      "Quantum Physics": "Physics",
    }

    // A teacher cannot supervise an exam if they teach the subject (same department)
    return teacher.departmentName !== subjectDepartmentMap[exam.subject]
  }

  // Function to check if a teacher is available at the exam time
  const isTeacherAvailable = (teacher: Teacher, examToCheck: Exam) => {
    // Check if teacher is already assigned to another exam at the same time
    return !exams.some(
      (exam) =>
        exam.id !== examToCheck.id &&
        exam.supervisors.some((s) => s.id === teacher.id) &&
        // Check for time overlap
        ((new Date(examToCheck.startDate) >= new Date(exam.startDate) &&
          new Date(examToCheck.startDate) < new Date(exam.endDate)) ||
          (new Date(examToCheck.endDate) > new Date(exam.startDate) &&
            new Date(examToCheck.endDate) <= new Date(exam.endDate)) ||
          (new Date(examToCheck.startDate) <= new Date(exam.startDate) &&
            new Date(examToCheck.endDate) >= new Date(exam.endDate))),
    )
  }

  const getEligibleTeachers = (exam: Exam) => {
    return teachers.filter(
      (teacher) =>
        // Not already assigned to this exam
        !exam.supervisors.some((s) => s.id === teacher.id) &&
        // Can supervise this exam
        canSupervise(teacher, exam) &&
        // Is available at this time
        isTeacherAvailable(teacher, exam),
    )
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (exams.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No exams found for the selected period.</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Subject</TableHead>
          <TableHead>Level</TableHead>
          <TableHead>Date & Time</TableHead>
          <TableHead>Room</TableHead>
          <TableHead>Supervisor</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {exams.map((exam) => {
          const eligibleTeachers = getEligibleTeachers(exam)

          return (
            <TableRow key={exam.id}>
              <TableCell className="font-medium">{exam.subject}</TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {exam.niveauName}
                </Badge>
              </TableCell>
              <TableCell>
                {formatDateTime(exam.startDate)}
                <div className="text-xs text-muted-foreground">to {new Date(exam.endDate).toLocaleTimeString()}</div>
              </TableCell>
              <TableCell>{exam.room ? exam.room.name : "Not assigned"}</TableCell>
              <TableCell>
                {exam.supervisors.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    {exam.supervisors.map((supervisor) => (
                      <div key={supervisor.id} className="flex items-center gap-2">
                        <Badge variant="outline" className="text-green-500 border-green-200 bg-green-50">
                          {supervisor.name}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={() => onReplaceSupervisor(exam, supervisor)}
                        >
                          <UserX className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Select
                    value={newAssignments[exam.id]?.toString() || ""}
                    onValueChange={(value) => {
                      setNewAssignments((prev) => ({
                        ...prev,
                        [exam.id]: Number.parseInt(value),
                      }))
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a supervisor" />
                    </SelectTrigger>
                    <SelectContent>
                      {eligibleTeachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id.toString()}>
                          {teacher.name} ({teacher.departmentName})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </TableCell>
              <TableCell>
                {exam.supervisors.length < 2 && (
                  <Button
                    size="sm"
                    disabled={!newAssignments[exam.id]}
                    onClick={() => {
                      if (newAssignments[exam.id]) {
                        const teacher = teachers.find((t) => t.id === newAssignments[exam.id])
                        if (teacher) {
                          onAssignSupervisor(exam.id, teacher)
                          setNewAssignments((prev) => {
                            const updated = { ...prev }
                            delete updated[exam.id]
                            return updated
                          })
                        }
                      }
                    }}
                  >
                    Assign
                  </Button>
                )}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

