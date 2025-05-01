"use client";

import { useState, useEffect } from "react";
import DataList from "@/components/DataList";
import { DeleteConfirmationPopup } from "@/components/popup/DeleteConfirmationPopup";
import { EditStudentPopup } from "@/app/application/students/EditStudentPopup";
import { AddStudentPopup } from "@/app/application/students/AddStudenPopup";
import { Student } from "@/app/interfaces";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
  const handleAddStudent = async (newStudent: Omit<Student, "id"> & { td: string }) => {
    try {
      const requestBody = {
        email: newStudent.email,
        name: newStudent.name,
        password: "student", // Static password
        niveauName: newStudent.grade, // Send grade as niveauName
        td: newStudent.td, // <-- Add td field
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

      {/* Search input with filter icon button at the end */}
      <div className="relative mb-2">
        <input
          type="text"
          className="p-3 border w-full pr-12"
          placeholder={`Search by ${filterType}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-md bg-pastel-yellow text-black border border-pastel-purple shadow-sm hover:bg-pastel-yellow/80 transition"
          onClick={() => setIsFilterPopupOpen(true)}
          tabIndex={0}
          type="button"
          aria-label="Open filter dialog"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0013 13.414V19a1 1 0 01-1.447.894l-2-1A1 1 0 009 18v-4.586a1 1 0 00-.293-.707L2.293 6.707A1 1 0 012 6V4z" />
          </svg>
        </button>
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

      {/* Filter selection popup using shadcn Dialog, matching Teacher Page style */}
      <Dialog open={isFilterPopupOpen} onOpenChange={setIsFilterPopupOpen}>
        <DialogContent className="bg-white p-0 rounded-2xl shadow-2xl max-w-md">
          <div className="p-8">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl transition"
              onClick={() => setIsFilterPopupOpen(false)}
              aria-label="Close"
              tabIndex={0}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex flex-col items-center mb-6">
              <div className="bg-gray-100 rounded-full p-3 mb-2 shadow">
                <svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0013 13.414V19a1 1 0 01-1.447.894l-2-1A1 1 0 009 18v-4.586a1 1 0 00-.293-.707L2.293 6.707A1 1 0 012 6V4z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">Choose a Filter</h2>
              <p className="text-gray-500 text-sm">Select which field you want to filter students by.</p>
            </div>
            <div className="space-y-4">
              {["name", "email", "grade"].map((type) => (
                <button
                  key={type}
                  className={`flex items-center w-full px-4 py-3 rounded-lg border-2 transition text-lg font-medium shadow-sm
                    ${
                      filterType === type
                        ? "bg-pastel-purple text-gray-900 border-gray-700 scale-105"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100 hover:scale-105"
                    }
                  `}
                  onClick={() => {
                    setFilterType(type);
                    setIsFilterPopupOpen(false);
                  }}
                >
                  <span className="mr-3">
                    {type === "name" && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                    {type === "email" && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m8 0a4 4 0 10-8 0 4 4 0 008 0zm2 4v1a3 3 0 01-3 3H7a3 3 0 01-3-3v-1" />
                      </svg>
                    )}
                    {type === "grade" && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} fill="none" />
                      </svg>
                    )}
                  </span>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                  {filterType === type && (
                    <span className="ml-auto text-xs bg-white text-gray-700 px-2 py-1 rounded shadow border border-gray-200">Selected</span>
                  )}
                </button>
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <div className="h-2 w-24 rounded-full bg-gray-200 opacity-50"></div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
