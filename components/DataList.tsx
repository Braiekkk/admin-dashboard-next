"use client";

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

interface DataListProps<T> {
  data: T[];
  headers: string[];
  displayEditDialog: (item: T) => JSX.Element;
  displayDeleteDialog: (item: T) => JSX.Element;
  displayAddDialog: () => JSX.Element;
}

const pastelColors = [
  "rgba(227, 247, 255)",
  "rgba(254, 243, 199)",
  "rgba(236, 234, 254)",
  "rgba(253, 226, 243)",
  "rgba(223, 246, 255)",
];
export default function DataList<T extends { id: number }>({
  data,
  headers,
  displayEditDialog,
  displayDeleteDialog,
  displayAddDialog,
}: DataListProps<T>) {
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
              <TableHead className="text-left bg-gray-50 text-gray-500 ">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group transition-colors duration-150"
                style={
                  {
                    "--hover-color": pastelColors[index % pastelColors.length],
                  } as React.CSSProperties
                }
              >
                {Object.values(item).map((value, i) => (
                  <TableCell
                  key={i}
                  className="group-hover:bg-[var(--hover-color)] transition-colors duration-200"
                  >
                  {value !== undefined && value !== null ? value.toString() : 'Valeur non définie'}
                </TableCell>
                
                ))}
                <TableCell className="text-left group-hover:bg-[var(--hover-color)] transition-colors duration-200 space-x-1">
                  {displayEditDialog(item)}
                  {displayDeleteDialog(item)}
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
