"use client";

import { useState, useEffect } from "react";
import DataList from "@/components/DataList";
import { DeleteConfirmationPopup } from "@/components/popup/DeleteConfirmationPopup";
import { EditStudentPopup } from "@/app/application/students/EditStudentPopup";
import { AddStudentPopup } from "@/app/application/students/AddStudenPopup";
import { Student } from "@/app/interfaces";

/** ✅ Fonction pour récupérer le token JWT */
const getAuthToken = () => localStorage.getItem("jwtToken") || "";

/** ✅ Fonction pour créer les headers avec JWT */
const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getAuthToken()}`,
});

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // État pour le filtrage
  const [filterType, setFilterType] = useState<string>("name"); // Type de filtre par défaut : Nom
  const [searchTerm, setSearchTerm] = useState<string>("");

  // État du popup
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState<boolean>(false);

  /** ✅ Fetch students from API */
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:8080/admin/student", {
          method: "GET",
          headers: getHeaders(),
        });

        if (!response.ok) throw new Error("Failed to fetch students");

        const responseData = await response.json();
        const studentsData = responseData.data;

        const formattedStudents = studentsData.map((student: any) => ({
          id: student.id,
          name: student.name,
          email: student.email,
          grade: student.niveau?.name || "N/A",
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
      const requestBody = {
        email: updatedStudent.email,
        name: updatedStudent.name,
        niveauName: updatedStudent.grade, // Send grade as niveauName
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
      const updatedStudentData = {
        id: responseData.data.id,
        name: responseData.data.name,
        email: responseData.data.email,
        grade: responseData.data.niveau.name, // Convert niveau to grade
      };

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
          headers: getHeaders(),
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
      const requestBody = {
        email: newStudent.email,
        name: newStudent.name,
        password: "student", // Static password
        niveauName: newStudent.grade, // Send grade as niveauName
      };

      const response = await fetch("http://localhost:8080/admin/student", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error("Failed to add student");

      const responseData = await response.json();
      const createdStudent: Student = {
        id: responseData.data.id,
        name: responseData.data.name,
        email: responseData.data.email,
        grade: responseData.data.niveau.name,
  
      };

      setStudents((prev) => [...prev, createdStudent]);
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  /** ✅ Filtrage dynamique */
  const filteredStudents = students.filter((student) => {
    const value = student[filterType as keyof Student].toLowerCase();
    return value.includes(searchTerm.toLowerCase());
  });

  if (loading) return <p className="text-center text-gray-500">Loading students...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Students</h1>

      {/* ✅ Barre de recherche avec sélection du filtre */}
      <div className="space-y-2">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
          onClick={() => setIsFilterPopupOpen(true)}
        >
          Choose a filter
        </button>

        <input
          type="text"
          className="p-3 border w-full"
          placeholder={`Search by ${filterType}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ✅ Liste des étudiants filtrée */}
      <DataList
        data={filteredStudents}
        headers={["ID", "Name", "Email", "Grade"]}
        displayEditDialog={(student) => (
          <EditStudentPopup student={student} onSave={handleEditStudent} />
        )}
        displayDeleteDialog={(student) => (
          <DeleteConfirmationPopup item={student} onDelete={handleDeleteStudent} />
        )}
        displayAddDialog={() => <AddStudentPopup onAdd={handleAddStudent} />}
      />

      {/* ✅ Popup de sélection du type de filtre */}
      {isFilterPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Filter by</h2>
            <div className="space-y-2">
                {["name", "email", "grade"].map((type) => (
                  <button
                    key={type}
                    className={`block w-52 p-3 text-left text-base font-medium rounded-md ${
                      filterType === type ? "bg-blue-600 text-white" : "bg-gray-200"
                    }`}
                    onClick={() => {
                      setFilterType(type);
                      setIsFilterPopupOpen(false);
                    }}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>

          </div>
        </div>
      )}
    </div>
  );
}
