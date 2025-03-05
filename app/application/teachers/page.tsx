"use client";

import { useState, useEffect } from "react";
import DataList from "@/components/DataList";
import { DeleteConfirmationPopup } from "@/components/popup/DeleteConfirmationPopup";
import { EditTeacherPopup } from "@/app/application/teachers/EditTeacherPopup";
import { AddTeacherPopup } from "@/app/application/teachers/AddTeacherPopup";
import { Teacher } from "@/app/interfaces";

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

      {/* ✅ Filter input & button */}
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

      {/* ✅ Filter selection popup */}
      {isFilterPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Filter by</h2>
            <div className="space-y-2">
              {["name", "email", "department"].map((type) => (
                <button
                  key={type}
                  className={`block w-52 p-3 text-left text-base font-medium rounded-md ${
                    filterType === type ? "bg-blue-600 text-white" : "bg-gray-200"
                  }`}
                  onClick={() => {
                    setFilterType(type as "name" | "email" | "department");
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
