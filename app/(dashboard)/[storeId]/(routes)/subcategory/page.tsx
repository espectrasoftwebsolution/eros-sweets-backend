import { db } from "@/lib/firebase";
import { collection, doc, getDocs } from "firebase/firestore";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { SubCategoryClient } from "./_components/client";

const SubCategoryPage = async ({ params }: { params: { storeId: string } }) => {
  const subcategoryCollection = collection(
    doc(db, "stores", params.storeId),
    "subcategory"
  );
  const subcategoryDocs = await getDocs(subcategoryCollection);

  console.log(
    "Raw subcategory documents:",
    subcategoryDocs.docs.map((doc) => doc.data())
  );

  const subcategoriesData = subcategoryDocs.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      name: data.name,
      categoryName: data.categoryLabel || "Unknown",
      createdAt:
        data.createdAt instanceof Timestamp
          ? format(data.createdAt.toDate(), "MMMM do, yyyy")
          : "",
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SubCategoryClient data={subcategoriesData} />
      </div>
    </div>
  );
};

export default SubCategoryPage;
