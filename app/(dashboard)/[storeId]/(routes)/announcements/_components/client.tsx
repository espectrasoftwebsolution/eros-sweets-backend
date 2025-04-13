"use client";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { AnnouncementColumns, columns } from "./columns";
import ApiList from "@/components/api-list";

interface AnnouncementClientProps {
  data: AnnouncementColumns[];
}

export const AnnouncementClient = ({ data }: AnnouncementClientProps) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Announcements (${data.length})`}
          description="Manage Announcements for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/announcements/create`)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>

      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />

      <Heading title="API" description="API calls for announcements" />
      <Separator />
      <ApiList entityName="announcements" entityNameId="kitchenId" />
    </>
  );
};
