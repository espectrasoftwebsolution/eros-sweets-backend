import { db } from "@/lib/firebase";
import { collection, doc, getDocs, Timestamp } from "firebase/firestore";
import { format } from "date-fns";

import { CategoryClient } from "./_components/client";
import { Category } from "@/types-db";
import { CategoryColumns } from "./_components/columns";

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
  const categoriesData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "categories"))
  ).docs.map((doc) => doc.data()) as Category[];

  const formattedCategories: CategoryColumns[] = categoriesData.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    label: item.name,
    createdAt:
      item.createdAt instanceof Timestamp
        ? format(item.createdAt.toDate(), "MMMM do, yyyy")
        : "",
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
