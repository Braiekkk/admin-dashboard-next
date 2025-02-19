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
    // ✅ Ensure request matches expected API format
    const requestBody = {
      email: updatedTeacher.email,
      name: updatedTeacher.name,
      departmentName: updatedTeacher.department, // ✅ Use departmentName instead of department
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

    // ✅ Extract updated teacher data from API response
    const updatedTeacherData = {
      id: responseData.data.id,
      name: responseData.data.name,
      email: responseData.data.email,
      department: responseData.data.departmentName, // ✅ Convert departmentName to department for frontend
    };

    // ✅ Update state with the correct structure
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
      // ✅ Ensure request matches expected API format
      const requestBody = {
        email: newTeacher.email,
        name: newTeacher.name,
        password: "teacher", // ✅ Static password for now
        departmentName: newTeacher.department, // ✅ Ensure department is sent as departmentName
      };
  
      const response = await fetch("http://localhost:8080/admin/teacher", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) throw new Error("Failed to add teacher");
  
      const responseData = await response.json();
  
      // ✅ Extract teacher data from API response
      const createdTeacher: Teacher = {
        id: responseData.data.id,
        name: responseData.data.name,
        email: responseData.data.email,
        department: responseData.data.departmentName, // ✅ Convert departmentName to department for frontend
      };
  
      // ✅ Update state with the correct structure
      setTeachers((prev) => [...prev, createdTeacher]);
    } catch (error) {
      console.error("Error adding teacher:", error);
    }
  };
  

  if (loading)
    return <p className="text-center text-gray-500">Loading teachers...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Teachers</h1>
      <DataList
        data={teachers}
        headers={["ID", "Name", "Email", "Department Name"]}
        /** ✅ Pass Edit Dialog */
        displayEditDialog={(teacher) => (
          <EditTeacherPopup teacher={teacher} onSave={handleEditTeacher} />
        )}
        /** ✅ Pass Delete Dialog */
        displayDeleteDialog={(teacher) => (
          <DeleteConfirmationPopup
            item={teacher}
            onDelete={handleDeleteTeacher}
          />
        )}
        /** ✅ Pass Add Dialog */
        displayAddDialog={() => <AddTeacherPopup onAdd={handleAddTeacher} />}
      />
    </div>
  );
}
