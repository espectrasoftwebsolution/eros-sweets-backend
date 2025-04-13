import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { CellAction } from "./cell-actions";

export type ProductColumns = {
  id: string;
  name: string;
  description: string;
  price: string;
  qty: number;
  isFeatured: boolean;
  isArchived: boolean;
  isVeg: boolean;
  isActive: boolean;
  category: string;
  subCategory: string;
  images: { url: string }[];
  createdAt: string;
};

export const columns: ColumnDef<ProductColumns>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate" title={row.original.description}>
        {row.original.description}
      </div>
    ),
  },

  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "qty",
    header: "Quantity",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
  },
  {
    accessorKey: "isVeg",
    header: "Veg",
  },
  {
    accessorKey: "isActive",
    header: "Active",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "subCategory",
    header: "Subcategory",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
