"use client";

import { useState, useEffect } from "react";
import DataList from "@/components/DataList";
import { DeleteConfirmationPopup } from "@/components/popup/DeleteConfirmationPopup";
import { EditTeacherPopup } from "@/app/application/teachers/EditTeacherPopup";
import { AddTeacherPopup } from "@/app/application/teachers/AddTeacherPopup";
import { Teacher } from "@/app/interfaces";
import { Dialog, DialogContent } from "@/components/ui/dialog";

/** ✅ Retrieve JWT token */
const getAuthToken = () => localStorage.getItem("jwtToken") || "";

/** ✅ Create headers with JWT */
const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getAuthToken()}`,
});

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ New states for the filter
  const [filterType, setFilterType] = useState<"name" | "email" | "department">("name");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState<boolean>(false);

  /** ✅ Fetch teachers from API */
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch("http://localhost:8080/admin/teacher", {
          method: "GET",
          headers: getHeaders(),
        });

        if (!response.ok) throw new Error("Failed to fetch teachers");

        const responseData = await response.json();

        if (!responseData.data || !Array.isArray(responseData.data)) {
          throw new Error("Invalid response format");
        }

        // ✅ Format teachers correctly for the frontend
        const formattedTeachers = responseData.data.map((teacher: any) => ({
          id: teacher.id,
          name: teacher.name,
          email: teacher.email,
          department: teacher.departmentName, // ✅ Map departmentName to department
        }));

        setTeachers(formattedTeachers);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

   /** ✅ Handles teacher update */
   const handleEditTeacher = async (updatedTeacher: Teacher) => {
    try {
      const requestBody = {
        email: updatedTeacher.email,
        name: updatedTeacher.name,
        departmentName: updatedTeacher.department,
      };

      const response = await fetch(
        `http://localhost:8080/admin/teacher/${updatedTeacher.id}`,
        {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) throw new Error("Failed to update teacher");

      const responseData = await response.json();

      const updatedTeacherData = {
        id: responseData.data.id,
        name: responseData.data.name,
        email: responseData.data.email,
        department: responseData.data.departmentName,
      };

      setTeachers((prev) =>
        prev.map((teacher) =>
          teacher.id === updatedTeacher.id ? updatedTeacherData : teacher
        )
      );
    } catch (error) {
      console.error("Error updating teacher:", error);
    }
  };

  /** ✅ Handles teacher deletion */
  const handleDeleteTeacher = async (teacherToDelete: Teacher) => {
    try {
      const response = await fetch(
        `http://localhost:8080/admin/teacher/${teacherToDelete.id}`,
        {
          method: "DELETE",
          headers: getHeaders(),
        }
      );

      if (!response.ok) throw new Error("Failed to delete teacher");

      setTeachers((prev) =>
        prev.filter((teacher) => teacher.id !== teacherToDelete.id)
      );
    } catch (error) {
      console.error("Error deleting teacher:", error);
    }
  };

  /** ✅ Handles new teacher addition */
  const handleAddTeacher = async (newTeacher: Omit<Teacher, "id">) => {
    try {
      const requestBody = {
        email: newTeacher.email,
        name: newTeacher.name,
        password: "teacher",
        departmentName: newTeacher.department,
      };

      const response = await fetch("http://localhost:8080/admin/teacher", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error("Failed to add teacher");

      const responseData = await response.json();

      const createdTeacher: Teacher = {
        id: responseData.data.id,
        name: responseData.data.name,
        email: responseData.data.email,
        department: responseData.data.departmentName,
      };

      setTeachers((prev) => [...prev, createdTeacher]);
    } catch (error) {
      console.error("Error adding teacher:", error);
    }
  };

  /** ✅ Handle filtering of teachers */
  const filteredTeachers = teachers.filter((teacher) => {
    return teacher[filterType].toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading)
    return <p className="text-center text-gray-500">Loading teachers...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Teachers</h1>

      {/* Input with filter icon button at the end */}
      <div className="relative mb-2">
        <input
          type="text"
          className="p-3 border w-full pr-12"
          placeholder={`Search by ${filterType}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-md bg-pastel-purple text-black border border-pastel-purple shadow-sm hover:bg-pastel-purple/80 transition"
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

      {/* ✅ List of filtered teachers */}
      <DataList
        data={filteredTeachers}
        headers={["ID", "Name", "Email", "Department Name"]}
        displayEditDialog={(teacher) => (
          <EditTeacherPopup teacher={teacher} onSave={handleEditTeacher} />
        )}
        displayDeleteDialog={(teacher) => (
          <DeleteConfirmationPopup item={teacher} onDelete={handleDeleteTeacher} />
        )}
        displayAddDialog={() => <AddTeacherPopup onAdd={handleAddTeacher} />}
      />

      {/* Overhauled filter selection popup using shadcn Dialog */}
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
              <p className="text-gray-500 text-sm">Select which field you want to filter teachers by.</p>
            </div>
            <div className="space-y-4">
              {["name", "email", "department"].map((type) => (
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
                    setFilterType(type as "name" | "email" | "department");
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
                    {type === "department" && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7V6a1 1 0 011-1h16a1 1 0 011 1v1a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0013 13.414V19a1 1 0 01-1.447.894l-2-1A1 1 0 009 18v-4.586a1 1 0 00-.293-.707L2.293 6.707A1 1 0 012 6V4z" />
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
