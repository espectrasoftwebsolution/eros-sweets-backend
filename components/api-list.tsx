"use client";

import { useOrigin } from "@/hooks/use-origin";
import { useParams, useRouter } from "next/navigation";
import { ApiALert } from "./api-alert";

interface ApiListProps {
  entityName: string;
  entityNameId: string;
}

const ApiList = ({ entityName, entityNameId }: ApiListProps) => {
  const router = useRouter();
  const origin = useOrigin();
  const params = useParams();

  const baseUrl = `${origin}/api/${params.storeId}`;

  return (
    <>
      <ApiALert
        title="GET"
        variant="public"
        description={`${baseUrl}/${entityName}`}
      />
      <ApiALert
        title="GET"
        variant="public"
        description={`${baseUrl}/${entityName}/${entityNameId}`}
      />
      <ApiALert
        title="POST"
        variant="admin"
        description={`${baseUrl}/${entityName}`}
      />
      <ApiALert
        title="PATCH"
        variant="admin"
        description={`${baseUrl}/${entityName}/${entityNameId}`}
      />
      <ApiALert
        title="DELETE"
        variant="admin"
        description={`${baseUrl}/${entityName}/${entityNameId}`}
      />
    </>
  );
};

export default ApiList;
