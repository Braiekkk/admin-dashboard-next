"use client";

import { useState, useEffect } from "react";
import DepartmentDataList from "@/components/LongDataList";
import { DeleteConfirmationPopup } from "@/components/popup/DeleteConfirmationPopup";
import { EditDepartmentPopup } from "@/app/application/departments/EditDepartmentPopup";
import { AddDepartmentPopup } from "@/app/application/departments/AddDepartmentPopup";
import { Department } from "@/app/interfaces";

// Retrieve JWT token
const getAuthToken = () => localStorage.getItem("jwtToken") || "";

// Create headers with JWT
const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getAuthToken()}`,
});

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filtres
  const [filterName, setFilterName] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");

  // Fetch departments from the API
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("http://localhost:8080/admin/department", {
          method: "GET",
          headers: getHeaders(),
        });

        if (!response.ok) throw new Error("Failed to fetch departments");

        const responseData = await response.json();

        if (!responseData.data || !Array.isArray(responseData.data)) {
          throw new Error("Invalid response format");
        }

        const formattedDepartments = responseData.data.map((department: any) => ({
          id: department.id,
          name: department.name,
          teachers: department.teachers || [], // Handle teachers, if any
        }));

        setDepartments(formattedDepartments);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  // Handle department update
  const handleEditDepartment = async (updatedDepartment: Department) => {
    try {
      const requestBody = {
        name: updatedDepartment.name,
      };

      const response = await fetch(
        `http://localhost:8080/admin/department/${updatedDepartment.id}`,
        {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) throw new Error("Failed to update department");

      const responseData = await response.json();
      
      const updatedDept : Department = {
        id: responseData.data.id,
        name: responseData.data.name,
        teachers : responseData.data.teachers
      };

      setDepartments((prev) =>
        prev.map((department) =>
          department.id === updatedDepartment.id ? updatedDept : department
        )
      );
    } catch (error) {
      console.error("Error updating department:", error);
    }
  };

  // Handle department deletion
  const handleDeleteDepartment = async (departmentToDelete: Department) => {
    try {
      const response = await fetch(
        `http://localhost:8080/admin/department/${departmentToDelete.id}`,
        {
          method: "DELETE",
          headers: getHeaders(),
        }
      );

      if (!response.ok) throw new Error("Failed to delete department");

      setDepartments((prev) =>
        prev.filter((dept) => dept.id !== departmentToDelete.id)
      );
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };

  // Handle new department addition
  const handleAddDepartment = async (newDepartment: { name: string }) => {
    try {
      const requestBody = {
        name: newDepartment.name,
      };

      const response = await fetch("http://localhost:8080/admin/department", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error("Failed to add department");

      const responseData = await response.json();
      const createdDepartment = responseData.data;

      setDepartments((prev) => [...prev, createdDepartment]);
    } catch (error) {
      console.error("Error adding department:", error);
    }
  };

  // Appliquer les filtres
  const filteredDepartments = departments.filter((department) => {
    const nameMatch = department.name.toLowerCase().includes(filterName.toLowerCase());
    const departmentMatch = department.name.toLowerCase().includes(filterDepartment.toLowerCase());
    return nameMatch && departmentMatch;
  });

  if (loading)
    return <p className="text-center text-gray-500">Loading departments...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Departments</h1>

      {/* Filtres */}
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          className="p-3 border w-full"
        />
      </div>

      <DepartmentDataList
        data={filteredDepartments}
        headers={["ID", "Name"]}

        // Pass Edit Dialog
        displayEditDialog={(department) => (
          <EditDepartmentPopup department={department} onSave={handleEditDepartment} />
        )}

        // Pass Delete Dialog
        displayDeleteDialog={(department) => (
          <DeleteConfirmationPopup
            item={department}
            onDelete={handleDeleteDepartment}
          />
        )}

        // Pass Add Dialog
        displayAddDialog={() => <AddDepartmentPopup onAdd={handleAddDepartment} />}
      />
    </div>
  );
}
