"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Department } from "@/app/interfaces"; // Ensure this imports your interface

interface DepartmentDataListProps {
  data: Department[];
  headers: string[];
  displayEditDialog: (item: Department) => JSX.Element;
  displayDeleteDialog: (item: Department) => JSX.Element;
  displayAddDialog: () => JSX.Element;
}

const pastelColors = [
  "rgba(227, 247, 255, 0.6)", // Light Blue
  "rgba(254, 243, 199, 0.6)", // Soft Yellow
  "rgba(236, 234, 254, 0.6)", // Light Purple
  "rgba(253, 226, 243, 0.6)", // Soft Pink
  "rgba(223, 246, 255, 0.6)", // Pale Blue
];

export default function DepartmentDataList({
  data,
  headers,
  displayEditDialog,
  displayDeleteDialog,
  displayAddDialog,
}: DepartmentDataListProps) {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const toggleExpandRow = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex justify-end">{displayAddDialog()}</div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header, index) => (
                <TableHead key={index} className="text-left bg-gray-50 text-gray-500">
                  {header}
                </TableHead>
              ))}
              <TableHead className="text-left bg-gray-50 text-gray-500">Actions</TableHead>
              <TableHead className="text-left bg-gray-50 text-gray-500">Expand</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((department, index) => {
              const hoverColor = pastelColors[index % pastelColors.length];

              return (
                <>
                  {/* Department Row */}
                  <motion.tr
                    key={department.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="group transition-colors duration-150 hover:bg-[var(--hover-color)]"
                    style={{ "--hover-color": hoverColor } as React.CSSProperties}
                  >
                    <TableCell className="font-semibold">{department.id}</TableCell>
                    <TableCell>{department.name}</TableCell>
                    <TableCell>{department.description}</TableCell>
                    <TableCell className="text-left">{displayEditDialog(department)} {displayDeleteDialog(department)}</TableCell>
                    <TableCell className="text-left">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleExpandRow(department.id)}
                      >
                        {expandedRows.includes(department.id) ? <ChevronUp /> : <ChevronDown />}
                      </Button>
                    </TableCell>
                  </motion.tr>

                  {/* Expanded Teacher Section with Matching Border Color */}
                  {expandedRows.includes(department.id) && department.teachers.length > 0 && (
                    <tr>
                      <TableCell colSpan={5} className="p-4">
                        <div
                          className="ml-6 p-4 rounded-md shadow-sm"
                          style={{
                            borderLeft: `4px solid ${hoverColor}`,
                            borderRadius: "8px",
                            backgroundColor: "rgba(255, 255, 255)",
                          }}
                        >
                          <h3 className="font-semibold text-gray-700">Teachers</h3>
                          <Table className="mt-2 border border-gray-200 rounded-md shadow-sm">
                            <TableHeader>
                              <TableRow style={{ borderColor: hoverColor }}>
                                <TableHead className="text-left w-1/4">Teacher ID</TableHead>
                                <TableHead className="text-left w-1/4">Name</TableHead>
                                <TableHead className="text-left w-1/4">Email</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {department.teachers.map((teacher, teacherIndex) => (
                                <motion.tr
                                  key={teacher.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: teacherIndex * 0.05 }}
                                  className="transition-colors duration-150 hover:bg-[var(--hover-color)]"
                                  style={{
                                    "--hover-color": hoverColor,
                                    borderBottom: `1px solid ${hoverColor}`,
                                  } as React.CSSProperties}
                                >
                                  <TableCell>{teacher.id}</TableCell>
                                  <TableCell>{teacher.name}</TableCell>
                                  <TableCell>{teacher.email}</TableCell>
                                </motion.tr>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </TableCell>
                    </tr>
                  )}
                </>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
