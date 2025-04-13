"use client";

import { useParams, useRouter } from "next/navigation";
import { OrdersColumns } from "./columns";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreVertical, Trash } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { AlertModal } from "@/components/modal/alert-modal";

interface CellActionProps {
  data: OrdersColumns;
}

export const CellAction = ({ data }: CellActionProps) => {
  const router = useRouter();
  const params = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Order id copied to clipboard");
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/${params.storeId}/orders/${data.id}`);

      toast.success("Order Removed");
      location.reload();
      router.push(`/${params.storeId}/orders`);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  const onUpdate = async (data: any) => {
    try {
      setIsLoading(true);

      await axios.patch(`/api/${params.storeId}/orders/${data.id}`, data);
      location.reload();
      router.push(`/${params.storeId}/orders`);
      toast.success("Order Updated");
    } catch (error) {
      toast.error("Something Went Wrong");
    } finally {
      router.refresh();
      setIsLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isLoading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="h-8 w-8 p-0" variant={"ghost"}>
            <span className="sr-only">Open</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="h-4 w-4 mr-2" />
            Copy Id
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              onUpdate({ id: data.id, order_status: "Delivering" })
            }
          >
            <Edit className="h-4 w-4 mr-2" />
            Delivering
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => onUpdate({ id: data.id, order_status: "Delivered" })}
          >
            <Edit className="h-4 w-4 mr-2" />
            Delivered
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => onUpdate({ id: data.id, order_status: "Canceled" })}
          >
            <Edit className="h-4 w-4 mr-2" />
            Cancel
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
