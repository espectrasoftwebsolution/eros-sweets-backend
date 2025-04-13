import { db } from "@/lib/firebase";
import { collection, doc, getDocs, Timestamp } from "firebase/firestore";
import { format } from "date-fns";

import { ProductClient } from "./_components/client";
import { Product } from "@/types-db";
import { ProductColumns } from "./_components/columns";
import { formatter } from "@/lib/utils";

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  // Fetch all products
  const productsData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "products"))
  ).docs.map((doc) => doc.data()) as Product[];

  // Fetch all categories
  const categoriesData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "categories"))
  ).docs.reduce((acc, doc) => {
    acc[doc.id] = doc.data().name; // Store ID -> Name mapping
    return acc;
  }, {} as Record<string, string>);

  // Fetch all subcategories
  const subcategoriesData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "subcategory"))
  ).docs.reduce((acc, doc) => {
    acc[doc.id] = doc.data().name; // Store ID -> Name mapping
    return acc;
  }, {} as Record<string, string>);

  // Format product data
  const formattedProducts: ProductColumns[] = productsData.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: formatter.format(item.price),
    qty: item.qty,
    isArchived: item.isArchived,
    isFeatured: item.isFeatured,
    isVeg: item.isVeg,
    isActive: item.isActive,
    category: categoriesData[item.category] || "Unknown",
    subCategory: subcategoriesData[item.subCategory] || "Unknown",
    images: item.images,
    createdAt:
      item.createdAt instanceof Timestamp
        ? format(item.createdAt.toDate(), "MMMM do, yyyy")
        : "",
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
