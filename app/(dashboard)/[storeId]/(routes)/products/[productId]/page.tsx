import { db } from "@/lib/firebase";
import { Category, Product, SubCategory } from "@/types-db";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { ProductForm } from "./_components/product-form";

const ProductPage = async ({
  params,
}: {
  params: {
    productId: string;
    storeId: string;
  };
}) => {
  const product = (
    await getDoc(
      doc(db, "stores", params.storeId, "products", params.productId)
    )
  ).data() as Product;

  const categoriesData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "categories"))
  ).docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Category[];

  const subcategoriesData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "subcategory"))
  ).docs.map((doc) => ({ id: doc.id, ...doc.data() })) as SubCategory[];

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={product}
          categories={categoriesData}
          subcategories={subcategoriesData}
        />
      </div>
    </div>
  );
};

export default ProductPage;
