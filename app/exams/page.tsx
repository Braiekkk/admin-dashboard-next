"use client"

import { useState } from "react"
import DataList from "../components/DataList"
import type { Exam } from "../interfaces"

const initialExams: Exam[] = [
  { id: 1, subject: "Math", date: "2023-06-15", duration: 120 },
  { id: 2, subject: "Science", date: "2023-06-18", duration: 90 },
  { id: 3, subject: "English", date: "2023-06-20", duration: 60 },
]

export default function Exams() {
  const [exams, setExams] = useState<Exam[]>(initialExams)

  const handleEdit = (exam: Exam) => {
    // Implement edit logic
    console.log("Edit exam:", exam)
  }

  const handleDelete = (exam: Exam) => {
    setExams(exams.filter((e) => e.id !== exam.id))
  }

  const handleAdd = () => {
    // Implement add logic
    console.log("Add new exam")
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Exams</h1>
      <DataList
        data={exams}
        headers={["ID", "Subject", "Date", "Duration (minutes)"]}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />
    </div>
  )
}

