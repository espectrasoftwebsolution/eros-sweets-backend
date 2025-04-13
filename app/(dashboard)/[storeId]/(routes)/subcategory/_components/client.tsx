"use client";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { SubCategoryColumns, columns } from "./columns";
import ApiList from "@/components/api-list";

interface SubCategoryClientProps {
  data: SubCategoryColumns[];
}

export const SubCategoryClient = ({ data }: SubCategoryClientProps) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Sub-Categories (${data.length})`}
          description="Manage sub-categories for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/subcategory/create`)} // ✅ Fixed path
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API calls for Sub-Category" />
      <Separator />
      <ApiList entityName="subcategory" entityNameId="subcategoryId" />
    </>
  );
};
