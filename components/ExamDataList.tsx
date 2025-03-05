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
import { Exam } from "@/app/interfaces";

interface ExamDataListProps {
  data: Exam[];
  headers: string[];
  displayEditDialog: (exam: Exam) => JSX.Element;
  displayDeleteDialog: (exam: Exam) => JSX.Element;
  displayAddDialog: () => JSX.Element;
}

const pastelColors = [
  "rgba(227, 247, 255, 0.6)", // Light Blue
  "rgba(254, 243, 199, 0.6)", // Soft Yellow
  "rgba(236, 234, 254, 0.6)", // Light Purple
  "rgba(253, 226, 243, 0.6)", // Soft Pink
  "rgba(223, 246, 255, 0.6)", // Pale Blue
];

export default function ExamDataList({
  data,
  headers,
  displayEditDialog,
  displayDeleteDialog,
  displayAddDialog,
}: ExamDataListProps) {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const toggleExpandRow = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
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
            {data.map((exam, index) => {
              const hoverColor = pastelColors[index % pastelColors.length];
              return (
                <motion.div
                  key={exam.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="group transition-colors duration-150 hover:bg-[var(--hover-color)]"
                  style={{ "--hover-color": hoverColor } as React.CSSProperties}
                >
                  <TableRow>
                    <TableCell className="font-semibold">{exam.id}</TableCell>
                    <TableCell>{exam.subject}</TableCell>
                    <TableCell>{exam.date.toString()}</TableCell>
                    <TableCell>{exam.duration}</TableCell>
                    <TableCell>{exam.room}</TableCell>
                    <TableCell className="text-left">
                      {displayEditDialog(exam)} {displayDeleteDialog(exam)}
                    </TableCell>
                    <TableCell className="text-left">
                      <Button variant="ghost" size="icon" onClick={() => toggleExpandRow(exam.id)}>
                        {expandedRows.includes(exam.id) ? <ChevronUp /> : <ChevronDown />}
                      </Button>
                    </TableCell>
                  </TableRow>
                  {expandedRows.includes(exam.id) && exam.supervisors && exam.supervisors.length > 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="p-4">
                        <div
                          className="ml-6 p-4 rounded-md shadow-sm border-l-4"
                          style={{ borderColor: hoverColor }}
                        >
                          <h3 className="font-semibold text-gray-700">Supervisors</h3>
                          <ul>
                            {exam.supervisors.map((sup: any) => (
                              <li key={sup.id}>{sup.name} (ID: {sup.id})</li>
                            ))}
                          </ul>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </motion.div>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
