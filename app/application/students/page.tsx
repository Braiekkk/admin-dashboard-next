"use client";

import { useState, useEffect } from "react";
import DataList from "@/components/DataList";
import { DeleteConfirmationPopup } from "@/components/popup/DeleteConfirmationPopup";
import { EditStudentPopup } from "@/app/application/students/EditStudentPopup";
import { AddStudentPopup } from "@/app/application/students/AddStudenPopup";
import { Student } from "@/app/interfaces";
import { get } from "http";

/** ✅ Function to retrieve JWT token */
const getAuthToken = () => {
  //token valable 1Day
  return "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQURNSU4iLCJzdWIiOiJhbG91bG91QGdtYWlsLmNvbSIsImlhdCI6MTczOTg5NTcwOSwiZXhwIjoxNzM5OTgyMTA5fQ.BCrHLoP-i898mrhfQeuG8frtVRX85k8m4IY3wSGx0EI"; // Change if using cookies
};

/** ✅ Function to create headers with JWT */
const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getAuthToken()}`, // Attach token
});

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /** ✅ Fetch students from API */
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:8080/admin/student", {
          method: "GET",
          headers: getHeaders(), // ✅ Include JWT token in request
        });

        if (!response.ok) throw new Error("Failed to fetch students");

        const responseData = await response.json();
        const studentsData = responseData.data; // ✅ Extract "data" field from response

        const formattedStudents = studentsData.map((student: any) => ({
          id: student.id,
          name: student.name,
          email: student.email,
          grade: student.niveau.name, // ✅ Extracting "niveau" name as the grade
        }));

        setStudents(formattedStudents);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  /** ✅ Handles student update */
  const handleEditStudent = async (updatedStudent: Student) => {
    try {
      // ✅ Ensure request matches expected API format
      const requestBody = {
        email: updatedStudent.email,
        name: updatedStudent.name,
        niveauName: updatedStudent.grade, // ✅ Ensure grade is sent as niveauName
      };

      const response = await fetch(
        `http://localhost:8080/admin/student/${updatedStudent.id}`,
        {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) throw new Error("Failed to update student");

      const responseData = await response.json();

      // ✅ Extract student data from API response
      const updatedStudentData = {
        id: responseData.data.id,
        name: responseData.data.name,
        email: responseData.data.email,
        grade: responseData.data.niveau.name, // ✅ Convert "niveau" to "grade" for frontend
      };

      // ✅ Update state with the correct structure
      setStudents((prev) =>
        prev.map((student) =>
          student.id === updatedStudent.id ? updatedStudentData : student
        )
      );
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  /** ✅ Handles student deletion */
  const handleDeleteStudent = async (studentToDelete: Student) => {
    try {
      const response = await fetch(
        `http://localhost:8080/admin/student/${studentToDelete.id}`,
        {
          method: "DELETE",
          headers: getHeaders(), // ✅ Include JWT token in request
        }
      );

      if (!response.ok) throw new Error("Failed to delete student");

      setStudents((prev) =>
        prev.filter((student) => student.id !== studentToDelete.id)
      );
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  /** ✅ Handles new student addition */
  const handleAddStudent = async (newStudent: Omit<Student, "id">) => {
    try {
      // ✅ Ensure request matches expected API format
      const requestBody = {
        email: newStudent.email,
        name: newStudent.name,
        password: "student", // ✅ Static password
        niveauName: newStudent.grade, // ✅ Send grade as niveauName
      };

      const response = await fetch("http://localhost:8080/admin/student", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error("Failed to add student");

      const responseData = await response.json();

      // ✅ Extract student data from API response
      const createdStudent: Student = {
        id: responseData.data.id,
        name: responseData.data.name,
        email: responseData.data.email,
        grade: responseData.data.niveau.name, // ✅ Convert "niveau.name" to "grade"
      };

      // ✅ Update state with the correct structure
      setStudents((prev) => [...prev, createdStudent]);
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  if (loading)
    return <p className="text-center text-gray-500">Loading students...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Students</h1>
      <DataList
        data={students}
        headers={["ID", "Name", "Email", "Grade"]} // ✅ Adjusted header for "grade"
        /** ✅ Pass Edit Dialog */
        displayEditDialog={(student) => (
          <EditStudentPopup student={student} onSave={handleEditStudent} />
        )}
        /** ✅ Pass Delete Dialog */
        displayDeleteDialog={(student) => (
          <DeleteConfirmationPopup
            item={student}
            onDelete={handleDeleteStudent}
          />
        )}
        /** ✅ Pass Add Dialog */
        displayAddDialog={() => <AddStudentPopup onAdd={handleAddStudent} />}
      />
    </div>
  );
}
