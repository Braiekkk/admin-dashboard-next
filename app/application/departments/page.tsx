"use client";

import { useState } from "react";
import DepartmentDataList from "@/components/LongDataList";
import { DeleteConfirmationPopup } from "@/components/popup/DeleteConfirmationPopup";
import { EditDepartmentPopup } from "@/app/application/departments/EditDepartmentPopup";
import { AddDepartmentPopup } from "@/app/application/departments/AddDepartmentPopup";
import { Department, Teacher } from "@/app/interfaces";
//todo kalamni ken dho3t ta ntochik chwaya ? 9is ala student page .
/**  Initial static departments data */
const initialDepartments: Department[] = [
  {
    id: 1,
    name: "Computer Science",
    description: "Covers programming, algorithms, and software engineering.",
    teachers: [
      { id: 1, name: "Dr. Alice Johnson", email: "alice@university.edu", department: "Computer Science" },
      { id: 2, name: "Prof. Bob Smith", email: "bob@university.edu", department: "Computer Science" },
      { id: 3, name: "Prof. Bob Smith", email: "bob@university.edu", department: "Computer Science" },
      { id: 4, name: "Prof. Bob Smith", email: "bob@university.edu", department: "Computer Science" },
      { id: 5, name: "Prof. Bob Smith", email: "bob@university.edu", department: "Computer Science" },
      { id: 6, name: "Prof. Bob Smith", email: "bob@university.edu", department: "Computer Science" },
    ],
  },
  {
    id: 2,
    name: "Mathematics",
    description: "Covers algebra, calculus, and statistics.",
    teachers: [
      { id: 3, name: "Dr. Charlie Brown", email: "charlie@university.edu", department: "Mathematics" },
    ],
  },
  {
    id: 3,
    name: "Physics",
    description: "Covers classical mechanics, quantum physics, and relativity.",
    teachers: [],
  },
];

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);

  /** ✅ Handles department update */
  const handleEditDepartment = (updatedDepartment: Department) => {
    setDepartments((prev) =>
      prev.map((dept) =>
        dept.id === updatedDepartment.id ? updatedDepartment : dept
      )
    );
  };

  /** ✅ Handles department deletion */
  const handleDeleteDepartment = (departmentToDelete: Department) => {
    setDepartments((prev) =>
      prev.filter((dept) => dept.id !== departmentToDelete.id)
    );
  };

  /** ✅ Handles new department addition */
  const handleAddDepartment = (newDepartment:  { name:string, description : string}) => {
    setDepartments((prev) => [...prev, { id: prev.length + 1, ...newDepartment , teachers: [] }]);  
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
      <DepartmentDataList
        data={departments}
        headers={["ID", "Name", "Description"]}
        
        /** ✅ Pass Edit Dialog */
        displayEditDialog={(department) => (
          <EditDepartmentPopup department={department} onSave={handleEditDepartment} />
        )}

        /** ✅ Pass Delete Dialog */
        displayDeleteDialog={(department) => (
          <DeleteConfirmationPopup
            item={department}
            onDelete={handleDeleteDepartment}
          />
        )}

        /** ✅ Pass Add Dialog */
        displayAddDialog={() => <AddDepartmentPopup onAdd={handleAddDepartment} />}
      />
    </div>
  );
}
