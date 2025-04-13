import { db } from "@/lib/firebase";
import { SubCategory } from "@/types-db";
import { doc, getDoc } from "firebase/firestore";
import { SubcategoryForm } from "./_components/cuisine-form";

const KitchenPage = async ({
  params,
}: {
  params: {
    subcategoryId: string;
    storeId: string;
  };
}) => {
  const subcategoryDoc = await getDoc(
    doc(db, "stores", params.storeId, "subcategory", params.subcategoryId)
  );

  const subcategory = subcategoryDoc.exists()
    ? (subcategoryDoc.data() as SubCategory)
    : null;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SubcategoryForm initialData={subcategory} />
      </div>
    </div>
  );
};

export default KitchenPage;
