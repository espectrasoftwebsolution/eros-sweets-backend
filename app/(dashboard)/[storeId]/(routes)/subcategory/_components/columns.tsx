"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { CellAction } from "./cell-actions";

export type SubCategoryColumns = {
  id: string;
  name: string;
  categoryName: string;
  createdAt: string;
};

const SortableHeader = (title: string, column: any) => (
  <Button
    variant="ghost"
    onClick={() =>
      column.toggleSorting(column.getIsSorted() === "asc" ? "desc" : "asc")
    }
  >
    {title}
    <ArrowUpDown className="ml-2 h-4 w-4" />
  </Button>
);

export const columns: ColumnDef<SubCategoryColumns>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => SortableHeader("Name", column),
  },
  {
    accessorKey: "categoryName",
    header: ({ column }) => SortableHeader("Category", column),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => SortableHeader("Date", column),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
